<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    // 添加产品到购物车
    public function addProductToCart(Request $request)
    {
        try {
            // 1. 验证请求数据
            $validatedData = $request->validate([
                'user_id'     => 'required|integer|exists:users,id',
                'product_id'  => 'required|integer|exists:products,id',
                'name'        => 'required|string|max:255',
                'category_id' => 'nullable|integer|exists:categories,id',
                'quantity'    => 'required|integer|min:1',
                'price'       => 'required|numeric|min:0',
                'image'       => 'nullable|string|max:500',
            ]);

            $userId = $validatedData['user_id'];

            // 2. 检查购物车中是否已存在该产品
            $existingCartItem = Cart::where('user_id', $userId)
                ->where('product_id', $validatedData['product_id'])
                ->first();

            if ($existingCartItem) {
                // 3a. 如果存在，更新数量
                $existingCartItem->quantity += $validatedData['quantity'];
                // 如果之前没有category_id，也一并更新
                if (isset($validatedData['category_id']) && is_null($existingCartItem->category_id)) {
                    $existingCartItem->category_id = $validatedData['category_id'];
                }
                $existingCartItem->save();

                $cartItem = $existingCartItem;
                $message  = 'Product quantity updated in cart successfully';
            } else {
                // 3b. 如果不存在，创建新的购物车项目
                $slug = Str::slug($validatedData['name'] . '-' . time());
                if (Cart::where('slug', $slug)->exists()) {
                    $slug .= '-' . Str::random(4); // 附加随机字符串确保 slug 唯一
                }

                // 合并验证过的数据和额外生成的数据来创建新记录
                $cartData = array_merge(
                    $validatedData,
                    [
                        'slug'       => $slug,
                        'package_id' => null, // 假设产品没有 package
                        'features'   => null,
                    ]
                );

                $cartItem = Cart::create($cartData);
                $message = 'Product added to cart successfully';
            }

            // 4. 返回成功的响应
            return response()->json([
                'success'    => true,
                'message'    => $message,
                'cartItem'   => $cartItem,
                'cart_count' => Cart::where('user_id', $userId)->sum('quantity'),
            ], 200);

        } catch (ValidationException $e) {
            // 处理验证失败
            Log::error('Cart Add Validation Error:', ['errors' => $e->errors(), 'request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // 处理其他所有异常
            Log::error('Cart Add General Error: ' . $e->getMessage(), ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while adding the product to the cart.',
                'error'   => $e->getMessage(), // 在开发环境中可以返回具体错误信息
            ], 500);
        }
    }

    // 添加包到购物车
    public function addPackageToCart(Request $request)
    {
        try {
            // 1. 验证请求数据
            $validatedData = $request->validate([
                'user_id'     => 'required|integer|exists:users,id',
                'package_id'  => 'required|integer|exists:packages,id',
                'name'        => 'required|string|max:255',
                'slug'        => 'nullable|string|max:255',
                'category_id' => 'nullable|integer|exists:categories,id',
                'quantity'    => 'required|integer|min:1',
                'price'       => 'required|numeric|min:0',
                'image'       => 'nullable|string|max:500',
                'features'    => 'nullable|array',
                'features.*'  => 'string|max:255',
            ]);

            $userId = $validatedData['user_id'];

            // 2. 检查购物车中是否已存在该套餐
            $existingCartItem = Cart::where('user_id', $userId)
                ->where('package_id', $validatedData['package_id'])
                ->first();

            if ($existingCartItem) {
                // 3a. 如果存在，更新数量和可能变更的信息
                $existingCartItem->quantity += $validatedData['quantity'];
                $existingCartItem->price = $validatedData['price']; // 价格可能变动，最好更新

                if (isset($validatedData['category_id'])) {
                    $existingCartItem->category_id = $validatedData['category_id'];
                }
                if (isset($validatedData['features'])) {
                    $existingCartItem->features = $validatedData['features'];
                }
                if (isset($validatedData['image'])) {
                    $existingCartItem->image = $validatedData['image'];
                }

                $existingCartItem->save();
                $cartItem = $existingCartItem;
                $message  = 'Package quantity updated in cart successfully';
            } else {
                // 3b. 如果不存在，创建新的购物车项目
                $slug = $validatedData['slug'] ?? Str::slug($validatedData['name'] . '-package-' . time());
                if (Cart::where('slug', $slug)->exists()) {
                    $slug .= '-' . Str::random(4); // 确保 slug 唯一
                }

                // 合并数据并创建
                $cartData = array_merge($validatedData, [
                    'slug'       => $slug,
                    'product_id' => null, // 明确为套餐时 product_id 为 null
                ]);

                $cartItem = Cart::create($cartData);
                $message = 'Package added to cart successfully';
            }

            // 4. 返回成功的响应
            return response()->json([
                'success'    => true,
                'message'    => $message,
                'cartItem'   => $cartItem,
                'cart_count' => Cart::where('user_id', $userId)->sum('quantity'),
            ], 200);

        } catch (ValidationException $e) {
            // 处理验证失败
            Log::error('Package Cart Add Validation Error:', ['errors' => $e->errors(), 'request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // 处理其他所有异常
            Log::error('Package Cart Add General Error: ' . $e->getMessage(), ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to add package to cart.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // 获取购物车项目
    public function getCartItems(Request $request)
    {
        try {
            // Retrieve the user ID from the request or session
            $userId = $request->input('user_id');

            // Validate the user ID
            if (! $userId) {
                return response()->json([
                    'error'   => 'User ID not provided',
                    'message' => 'You need to provide a user ID to view cart items.',
                ], 400);
            }

            // Fetch cart items for the user with necessary relationships
            $cartItems = Cart::with(['product', 'package', 'category'])
                ->where('user_id', $userId)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'productCart' => [],
                    'packageCart' => [],
                ]);
            }

            // Separate products and packages
            $productCart = $cartItems->filter(function ($item) {
                return ! is_null($item->product_id);
            })->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'name'     => $item->name,
                    'price'    => (float) $item->price,
                    'quantity' => $item->quantity,
                    'image'    => $item->image, // Use the image field directly from the carts table
                    'slug'     => $item->slug,
                    'category' => $item->category,
                    'product'  => $item->product,
                ];
            })->values();

            $packageCart = $cartItems->filter(function ($item) {
                return ! is_null($item->package_id);
            })->map(function ($item) {
                // Ensure features is treated as an array and not decoded if already an array
                $features = is_string($item->features) ? json_decode($item->features, true) : $item->features;

                return [
                    'id'       => $item->id,
                    'name'     => $item->name,
                    'price'    => (float) $item->price,
                    'quantity' => $item->quantity,
                    'image'    => $item->image, // Use the image field directly from the carts table
                    'features' => $features,
                    'slug'     => $item->slug,
                    'package'  => $item->package,
                ];
            })->values();

            return response()->json([
                'productCart' => $productCart,
                'packageCart' => $packageCart,
            ]);

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error fetching cart items: ' . $e->getMessage());

            return response()->json([
                'error'   => 'Failed to fetch cart items',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // 删除购物车项目
    public function removeCartItem(Request $request, $id)
    {
        try {
            // 从请求中获取 user_id
            $userId = $request->input('user_id');

            // 验证 user_id 是否提供
            if (! $userId) {
                return response()->json([
                    'error'      => 'User ID not provided',
                    'message'    => 'You need to provide a user ID to remove cart items.',
                    'error_code' => 'USER_ID_REQUIRED',
                ], 400);
            }

            \Log::info("Attempting to remove cart item with ID: {$id} for user: {$userId}");

            // 查找购物车项目
            $cartItem = Cart::where('user_id', $userId)
                ->where('id', $id)
                ->first();

            if (! $cartItem) {
                \Log::warning("Cart item not found - ID: {$id}, User: {$userId}");

                // 检查该ID是否存在（不考虑用户）
                $existsAnywhere = Cart::where('id', $id)->exists();

                if ($existsAnywhere) {
                    return response()->json([
                        'message'    => 'You do not have permission to remove this cart item',
                        'error_code' => 'PERMISSION_DENIED',
                    ], 403);
                } else {
                    return response()->json([
                        'message'    => 'Cart item not found',
                        'error_code' => 'ITEM_NOT_FOUND',
                    ], 404);
                }
            }

            // 删除项目
            $cartItem->delete();

            \Log::info("Successfully removed cart item with ID: {$id} for user: {$userId}");

            return response()->json([
                'message' => 'Cart item removed successfully',
                'item_id' => $id,
                'user_id' => $userId,
            ], 200); // 明确指定状态码

        } catch (\Exception $e) {
            \Log::error('Error removing cart item: ' . $e->getMessage(), [
                'cart_id' => $id,
                'user_id' => $request->input('user_id'),
                'trace'   => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message'    => 'An error occurred while removing the cart item',
                'error'      => 'Server error',
                'error_code' => 'SERVER_ERROR',
            ], 500);
        }
    }

    /**
     * [NEW] Update the quantity of an item in the cart.
     */
    public function updateCartItem(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'user_id'  => 'required|integer|exists:users,id',
                'quantity' => 'required|integer|min:1',
            ]);

            $cartItem = Cart::where('id', $id)
                ->where('user_id', $validatedData['user_id'])
                ->firstOrFail();

            $cartItem->quantity = $validatedData['quantity'];
            $cartItem->save();

            return response()->json([
                'success'  => true,
                'message'  => 'Cart item updated successfully.',
                'cartItem' => $cartItem,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found or you do not have permission to update it.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error updating cart item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred.',
            ], 500);
        }
    }
}
