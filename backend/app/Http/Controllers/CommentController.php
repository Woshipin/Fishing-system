<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CommentController extends Controller
{
    /**
     * 获取所有评论及其回复
     */
    public function index(): JsonResponse
    {
        try {
            $comments = Comment::with(['user', 'replies.user'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'created_at' => $comment->created_at->toISOString(),
                        'likes' => $comment->likes ?? 0,
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                            'avatar' => $comment->user->avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                            'isAdmin' => $comment->user->is_admin ?? false,
                        ],
                        'replies' => $comment->replies->map(function ($reply) {
                            return [
                                'id' => $reply->id,
                                'content' => $reply->content,
                                'created_at' => $reply->created_at->toISOString(),
                                'likes' => $reply->likes ?? 0,
                                'user' => [
                                    'id' => $reply->user->id,
                                    'name' => $reply->user->name,
                                    'avatar' => $reply->user->avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                                ],
                            ];
                        })->toArray(),
                    ];
                });

            return response()->json($comments);
        } catch (\Exception $e) {
            Log::error('Error fetching comments: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch comments',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 创建新评论
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string|max:2000',
                'user_id' => 'required|integer|exists:users,id',
            ]);

            DB::beginTransaction();

            $comment = Comment::create([
                'content' => $validated['content'],
                'user_id' => $validated['user_id'],
                'likes' => 0,
            ]);

            $comment->load('user');

            DB::commit();

            return response()->json([
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->toISOString(),
                'likes' => $comment->likes,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                    'isAdmin' => $comment->user->is_admin ?? false,
                ],
                'replies' => [],
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating comment: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create comment',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 点赞评论
     */
    public function like(Comment $comment): JsonResponse
    {
        try {
            DB::beginTransaction();

            $comment->increment('likes');

            DB::commit();

            return response()->json([
                'success' => true,
                'likes' => $comment->fresh()->likes,
                'message' => 'Comment liked successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error liking comment: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to like comment',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 创建回复
     */
    public function storeReply(Request $request, Comment $comment): JsonResponse
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string|max:1000',
                'user_id' => 'required|integer|exists:users,id',
            ]);

            DB::beginTransaction();

            $reply = Reply::create([
                'content' => $validated['content'],
                'user_id' => $validated['user_id'],
                'comment_id' => $comment->id,
                'likes' => 0,
            ]);

            $reply->load('user');

            DB::commit();

            return response()->json([
                'id' => $reply->id,
                'content' => $reply->content,
                'created_at' => $reply->created_at->toISOString(),
                'likes' => $reply->likes,
                'user' => [
                    'id' => $reply->user->id,
                    'name' => $reply->user->name,
                    'avatar' => $reply->user->avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                ],
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating reply: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create reply',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 点赞回复
     */
    public function likeReply(Comment $comment, Reply $reply): JsonResponse
    {
        try {
            // 确保回复属于指定的评论
            if ($reply->comment_id !== $comment->id) {
                return response()->json([
                    'error' => 'Reply does not belong to this comment'
                ], 400);
            }

            DB::beginTransaction();

            $reply->increment('likes');

            DB::commit();

            return response()->json([
                'success' => true,
                'likes' => $reply->fresh()->likes,
                'message' => 'Reply liked successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error liking reply: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to like reply',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
