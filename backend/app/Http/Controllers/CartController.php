<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // 添加产品到购物车
    public function addProductToCart(Request $request)
    {
        try {
            // 1. 首先记录原始请求数据
            \Log::info('=== RAW REQUEST DATA ===');
            \Log::info('Request all(): ', $request->all());
            \Log::info('Request input category_id: ' . $request->input('category_id'));
            \Log::info('Request category_id type: ' . gettype($request->input('category_id')));
            \Log::info('Request has category_id: ' . ($request->has('category_id') ? 'YES' : 'NO'));
            \Log::info('Request filled category_id: ' . ($request->filled('category_id') ? 'YES' : 'NO'));

            // 2. 检查categories表中是否存在该记录
            $categoryExists = \DB::table('categories')->where('id', $request->input('category_id'))->exists();
            \Log::info('Category exists in DB: ' . ($categoryExists ? 'YES' : 'NO'));

            // 3. 验证请求数据
            $validatedData = $request->validate([
                'user_id'     => 'required|integer|exists:users,id',
                'product_id'  => 'required|integer|exists:products,id',
                'name'        => 'required|string|max:255',
                'slug'        => 'nullable|string|max:255',
                'category_id' => 'nullable|integer|exists:categories,id',
                'quantity'    => 'required|integer|min:1',
                'price'       => 'required|numeric|min:0',
                'image'       => 'nullable|string|max:500',
            ]);

            // 4. 记录验证后的数据
            \Log::info('=== VALIDATED DATA ===');
            \Log::info('Validated data: ', $validatedData);
            \Log::info('Validated category_id: ' . ($validatedData['category_id'] ?? 'NULL'));
            \Log::info('Validated category_id type: ' . gettype($validatedData['category_id'] ?? null));

            $userId = $validatedData['user_id'];

            // 检查购物车中是否已存在该产品
            $existingCartItem = Cart::where('user_id', $userId)
                ->where('product_id', $validatedData['product_id'])
                ->first();

            if ($existingCartItem) {
                // 如果存在，也要更新category_id（以防之前没有）
                $existingCartItem->quantity += $validatedData['quantity'];
                if (isset($validatedData['category_id']) && ! is_null($validatedData['category_id'])) {
                    $existingCartItem->category_id = $validatedData['category_id'];
                }
                $existingCartItem->save();
                $cartItem = $existingCartItem;
                $message  = 'Product quantity updated in cart successfully';
            } else {
                // 处理 slug
                $slug = $validatedData['slug'] ?? null;
                if (empty($slug)) {
                    $slug = \Str::slug($validatedData['name'] . '-' . $userId . '-' . time());
                } else {
                    $slugExists = Cart::where('slug', $slug)->exists();
                    if ($slugExists) {
                        $slug = $slug . '-' . time() . '-' . $userId;
                    }
                }

                // 5. 准备创建数据 - 特别处理category_id
                $cartData = [
                    'user_id'    => $userId,
                    'product_id' => $validatedData['product_id'],
                    'package_id' => null,
                    'name'       => $validatedData['name'],
                    'slug'       => $slug,
                    'image'      => $validatedData['image'] ?? null,
                    'quantity'   => $validatedData['quantity'],
                    'price'      => $validatedData['price'],
                    'features'   => null,
                ];

                // 明确处理 category_id
                if (array_key_exists('category_id', $validatedData) && ! is_null($validatedData['category_id'])) {
                    $cartData['category_id'] = (int) $validatedData['category_id'];
                } else {
                    $cartData['category_id'] = null;
                }

                \Log::info('=== CART DATA TO CREATE ===');
                \Log::info('Cart data: ', $cartData);
                \Log::info('Cart data category_id: ' . ($cartData['category_id'] ?? 'NULL'));
                \Log::info('Cart data category_id type: ' . gettype($cartData['category_id'] ?? null));

                // 6. 启用查询日志
                \DB::enableQueryLog();

                // 创建购物车项目
                $cartItem = Cart::create($cartData);

                // 7. 记录SQL查询
                $queries = \DB::getQueryLog();
                \Log::info('=== SQL QUERIES ===');
                foreach ($queries as $query) {
                    \Log::info('SQL: ' . $query['query']);
                    \Log::info('Bindings: ', $query['bindings']);
                }

                // 8. 记录创建后的数据
                \Log::info('=== CREATED CART ITEM ===');
                \Log::info('Created cart item: ', $cartItem->toArray());
                \Log::info('Created cart item category_id: ' . $cartItem->category_id);

                // 9. 再次从数据库查询确认
                $freshCartItem = Cart::find($cartItem->id);
                \Log::info('=== FRESH FROM DB ===');
                \Log::info('Fresh cart item: ', $freshCartItem->toArray());

                $message = 'Product added to cart successfully';
            }

            return response()->json([
                'success'    => true,
                'message'    => $message,
                'cartItem'   => $cartItem,
                'cart_count' => Cart::where('user_id', $userId)->sum('quantity'),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('=== VALIDATION ERROR ===');
            \Log::error('Validation errors: ', $e->errors());
            \Log::error('Original request: ', $request->all());

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('=== GENERAL ERROR ===');
            \Log::error('Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            \Log::error('Request data: ', $request->all());

            return response()->json([
                'success' => false,
                'message' => 'Failed to add product to cart',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // 添加包到购物车
    public function addPackageToCart(Request $request)
    {
        try {
            // 验证请求数据
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

            // 从验证后的数据中获取用户ID
            $userId = $validatedData['user_id'];

            // 日志记录用于调试
            \Log::info('Adding package to cart for user ID: ' . $userId);
            \Log::info('Package ID: ' . $validatedData['package_id']);
            \Log::info('Category ID: ' . ($validatedData['category_id'] ?? 'null'));
            \Log::info('Validated data: ', $validatedData);

            // 检查购物车中是否已存在该套餐
            $existingCartItem = Cart::where('user_id', $userId)
                ->where('package_id', $validatedData['package_id'])
                ->first();

            if ($existingCartItem) {
                // 如果存在，增加数量并更新其他信息
                $existingCartItem->quantity += $validatedData['quantity'];

                // 更新其他可能变更的信息
                if (isset($validatedData['category_id']) && ! is_null($validatedData['category_id'])) {
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
                // 如果不存在，创建新的购物车项目

                // 处理 slug - 如果没有提供或为空，则生成一个
                $slug = $validatedData['slug'] ?? null;
                if (empty($slug)) {
                    $slug = \Str::slug($validatedData['name'] . '-package-' . $userId . '-' . time());
                } else {
                    // 确保slug唯一性
                    $slugExists = Cart::where('slug', $slug)->exists();
                    if ($slugExists) {
                        $slug = $slug . '-' . time() . '-' . $userId;
                    }
                }

                // 准备创建数据
                $cartData = [
                    'user_id'     => $userId,
                    'product_id'  => null, // 套餐不需要product_id
                    'package_id'  => $validatedData['package_id'],
                    'name'        => $validatedData['name'],
                    'slug'        => $slug,
                    'image'       => $validatedData['image'] ?? null,
                    'category_id' => $validatedData['category_id'] ?? null,
                    'quantity'    => $validatedData['quantity'],
                    'price'       => $validatedData['price'],
                    'features'    => $validatedData['features'] ?? null,
                ];

                // 记录即将插入的数据
                \Log::info('Creating package cart item with data: ', $cartData);

                // 创建新的购物车项目
                $cartItem = Cart::create($cartData);
                $message  = 'Package added to cart successfully';

                // 记录创建后的数据
                \Log::info('Created package cart item: ', $cartItem->toArray());
            }

            // 返回成功响应
            return response()->json([
                'success'    => true,
                'message'    => $message,
                'cartItem'   => $cartItem,
                'cart_count' => Cart::where('user_id', $userId)->sum('quantity'),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // 验证错误 - 记录详细错误信息
            \Log::error('Package cart validation failed: ', $e->errors());
            \Log::error('Request data: ', $request->all());

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // 其他错误
            \Log::error('Package cart addition error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            \Log::error('Request data: ', $request->all());

            return response()->json([
                'success' => false,
                'message' => 'Failed to add package to cart',
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

    // 清空购物车
    public function clearCart()
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Cart cleared successfully',
        ]);
    }
}
