<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CartController extends Controller
{
    // 添加产品到购物车
    public function addProductToCart(Request $request)
    {
        try {
            // 验证请求数据
            $request->validate([
                'user_id'     => 'required|integer|exists:users,id', // 验证用户ID存在
                'product_id'  => 'required|exists:products,id',
                'name'        => 'required|string',
                'slug'        => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
                'quantity'    => 'required|integer|min:1',
                'price'       => 'required|numeric|min:0',
                'image'       => 'nullable|string',
            ]);

            // 从请求中获取用户ID
            $userId = $request->user_id;

            // 日志记录用于调试
            \Log::info('Adding to cart for user ID: ' . $userId);
            \Log::info('Product ID: ' . $request->product_id);

            // 检查购物车中是否已存在该产品
            $existingCartItem = Cart::where('user_id', $userId)
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingCartItem) {
                // 如果存在，增加数量
                $existingCartItem->quantity += $request->quantity;
                $existingCartItem->save();
                $cartItem = $existingCartItem;
                $message  = 'Product quantity updated in cart successfully';
            } else {
                // 如果不存在，创建新的购物车项目

                // 处理 slug - 如果没有提供或为空，则生成一个
                $slug = $request->slug;
                if (empty($slug)) {
                    $slug = \Str::slug($request->name . '-' . $userId . '-' . time());
                } else {
                    // 确保slug唯一性
                    $slugExists = Cart::where('slug', $slug)->exists();
                    if ($slugExists) {
                        $slug = $slug . '-' . time() . '-' . $userId;
                    }
                }

                // 创建新的购物车项目
                $cartItem = Cart::create([
                    'user_id'     => $userId,
                    'product_id'  => $request->product_id,
                    'package_id'  => null,
                    'name'        => $request->name,
                    'slug'        => $slug,
                    'image'       => $request->image,
                    'category_id' => $request->category_id ?: null,
                    'quantity'    => $request->quantity,
                    'price'       => $request->price,
                    'features'    => null,
                ]);
                $message = 'Product added to cart successfully';
            }

            // 返回成功响应
            return response()->json([
                'success'    => true,
                'message'    => $message,
                'cartItem'   => $cartItem,
                'cart_count' => Cart::where('user_id', $userId)->sum('quantity'),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // 验证错误
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // 其他错误
            \Log::error('Cart addition error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product to cart: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Alternative approach - if you want to keep using Auth::id()
    // public function addProductToCartWithAuth(Request $request)
    // {
    //     // First check if user is authenticated
    //     if (! Auth::check()) {
    //         return response()->json([
    //             'message' => 'User not authenticated',
    //         ], 401);
    //     }

    //     $request->validate([
    //         'product_id'  => 'required|exists:products,id',
    //         'name'        => 'required|string',
    //         'slug'        => ['nullable', 'string'],
    //         'category_id' => 'nullable|exists:categories,id',
    //         'quantity'    => 'required|integer|min:1',
    //         'price'       => 'required|numeric|min:0',
    //         'image'       => 'nullable|string',
    //     ]);

    //     $userId = Auth::id();

    //     // Debug: Log the user ID
    //     \Log::info('Adding to cart for user ID: ' . $userId);

    //     // Check if product already exists in cart
    //     $existingCartItem = Cart::where('user_id', $userId)
    //         ->where('product_id', $request->product_id)
    //         ->first();

    //     if ($existingCartItem) {
    //         $existingCartItem->quantity += $request->quantity;
    //         $existingCartItem->save();
    //         $cartItem = $existingCartItem;
    //         $message  = 'Product quantity updated in cart successfully';
    //     } else {
    //         // Generate unique slug if not provided
    //         $slug = $request->slug;
    //         if (! $slug) {
    //             $slug = \Str::slug($request->name . '-' . $userId . '-' . time());
    //         } else {
    //             // Ensure slug is unique
    //             $existingSlug = Cart::where('slug', $slug)->first();
    //             if ($existingSlug) {
    //                 $slug = $slug . '-' . time();
    //             }
    //         }

    //         $cartItem = Cart::create([
    //             'user_id'     => $userId,
    //             'product_id'  => $request->product_id,
    //             'package_id'  => null,
    //             'name'        => $request->name,
    //             'slug'        => $slug,
    //             'image'       => $request->image,
    //             'category_id' => $request->category_id,
    //             'quantity'    => $request->quantity,
    //             'price'       => $request->price,
    //             'features'    => null,
    //         ]);
    //         $message = 'Product added to cart successfully';
    //     }

    //     return response()->json([
    //         'message'  => $message,
    //         'cartItem' => $cartItem,
    //     ]);
    // }

    // 添加包到购物车
    public function addPackageToCart(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'name'       => 'required|string',
            'slug'       => ['nullable', 'string', Rule::unique('carts')->where(fn($q) => $q->where('user_id', Auth::id()))],
            'quantity'   => 'required|integer|min:1',
            'price'      => 'required|numeric|min:0',
            'features'   => 'nullable|array',
            'features.*' => 'string',
            'image'      => 'nullable|string', // ✅ 新增
        ]);

        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('package_id', $request->package_id)
            ->first();

        if ($existingCartItem) {
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();
            $cartItem = $existingCartItem;
        } else {
            $cartItem = Cart::create([
                'user_id'     => Auth::id(),
                'product_id'  => null,
                'package_id'  => $request->package_id,
                'name'        => $request->name,
                'slug'        => $request->slug,
                'image'       => $request->image, // ✅ 使用传入图片
                'category_id' => null,
                'quantity'    => $request->quantity,
                'price'       => $request->price,
                'features'    => $request->features, // ✅ 不需要 json_encode
            ]);
        }

        return response()->json([
            'message'  => 'Package added to cart successfully',
            'cartItem' => $cartItem,
        ]);
    }

    // 获取购物车项目
    public function getCartItems()
    {
        $cartItems = Cart::with(['product', 'package', 'category'])
            ->where('user_id', Auth::id())
            ->get();

        // 分离产品和包
        $productCart = $cartItems->filter(function ($item) {
            return ! is_null($item->product_id);
        })->map(function ($item) {
            return [
                'id'       => $item->id,
                'name'     => $item->name,
                'price'    => (float) $item->price,
                'quantity' => $item->quantity,
                'image'    => $item->image,
                'slug'     => $item->slug,
                'category' => $item->category,
                'product'  => $item->product,
            ];
        })->values();

        $packageCart = $cartItems->filter(function ($item) {
            return ! is_null($item->package_id);
        })->map(function ($item) {
            return [
                'id'       => $item->id,
                'name'     => $item->name,
                'price'    => (float) $item->price,
                'quantity' => $item->quantity,
                'features' => $item->features ? json_decode($item->features) : [],
                'slug'     => $item->slug,
                'package'  => $item->package,
            ];
        })->values();

        return response()->json([
            'productCart' => $productCart,
            'packageCart' => $packageCart,
        ]);
    }

    // 更新购物车项目数量
    public function updateCartItem(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'message'  => 'Cart item updated successfully',
            'cartItem' => $cartItem,
        ]);
    }

    // 删除购物车项目
    public function removeCartItem($id)
    {
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json([
            'message' => 'Cart item removed successfully',
        ]);
    }

    // 清空购物车
    public function clearCart()
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Cart cleared successfully',
        ]);
    }
}
