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
