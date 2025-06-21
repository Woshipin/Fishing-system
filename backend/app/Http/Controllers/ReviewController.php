<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Package;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function ProductReview(Request $request, Product $product)
    {
        try {
            // 1. 验证请求数据，包括从 React 发送的 user_id
            $validatedData = $request->validate([
                'user_id' => 'required|integer|exists:users,id', // 验证 user_id 存在于 users 表
                'rating'  => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
            ]);

            $userId = $validatedData['user_id'];

            // 2. 检查用户是否已经评论过此产品
            // 注意: 这里我们使用 ProductReview 模型
            $existingReview = ProductReview::where('user_id', $userId)
                ->where('product_id', $product->id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this product.'
                ], 409); // 409 Conflict
            }

            // 3. 创建评论
            // 使用我们新定义的 'productReviews' 关系来创建
            $review = $product->productReviews()->create([
                'user_id' => $userId,
                'rating'  => $validatedData['rating'],
                'comment' => $validatedData['comment'] ?? null,
            ]);

            // 4. 返回成功响应, 同时加载新评论的所属用户信息
            return response()->json([
                'success' => true,
                'message' => 'Thank you for your review!',
                'review'  => $review->load('user')
            ], 201); // 201 Created

        } catch (ValidationException $e) {
            // 处理验证失败
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // 处理其它所有异常
            \Log::error('Review submission error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function PackageReview(Request $request, Package $package)
    {
        try {
            // 注意：您的前端使用的是 user_id，所以我们在这里验证它。
            // 在生产环境中，强烈建议使用 $request->user()->id 来确保安全。
            $validatedData = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'rating'  => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
            ]);

            $userId = $validatedData['user_id'];

            // 检查用户是否已经评论过
            $existingReview = $package->packageReviews()->where('user_id', $userId)->first();

            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this package.'
                ], 409); // 409 Conflict
            }

            // 创建评论
            $review = $package->packageReviews()->create([
                'user_id' => $userId,
                'rating'  => $validatedData['rating'],
                'comment' => $validatedData['comment'] ?? null,
            ]);

            // 返回成功响应，并加载用户信息
            return response()->json([
                'success' => true,
                'message' => 'Thank you for your review!',
                'review'  => $review->load('user')
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Package review submission error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'An unexpected error occurred.'], 500);
        }
    }
}
