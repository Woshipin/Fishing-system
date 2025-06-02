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
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'name' => 'required|string',
            'slug' => ['nullable', 'string', Rule::unique('carts', 'slug')],
            'category_id' => 'nullable|exists:categories,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string', // 图片 URL
        ]);

        // 检查是否已存在相同产品，如果存在则更新数量
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCartItem) {
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();
            $cartItem = $existingCartItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'package_id' => null, // 产品购物车项目，package_id 为 null
                'name' => $request->name,
                'slug' => $request->slug,
                'image' => $request->image,
                'category_id' => $request->category_id,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'features' => null, // 产品没有 features
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully',
            'cartItem' => $cartItem
        ]);
    }

    // 添加包到购物车
    public function addPackageToCart(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'name' => 'required|string',
            'slug' => ['nullable', 'string', Rule::unique('carts', 'slug')],
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'features' => 'nullable|array', // 包的特性数组
            'features.*' => 'string',
        ]);

        // 检查是否已存在相同包，如果存在则更新数量
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('package_id', $request->package_id)
            ->first();

        if ($existingCartItem) {
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();
            $cartItem = $existingCartItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => Auth::id(),
                'product_id' => null, // 包购物车项目，product_id 为 null
                'package_id' => $request->package_id,
                'name' => $request->name,
                'slug' => $request->slug,
                'image' => null, // 包通常没有图片
                'category_id' => null, // 包可能不属于任何类别
                'quantity' => $request->quantity,
                'price' => $request->price,
                'features' => json_encode($request->features), // 存储为 JSON
            ]);
        }

        return response()->json([
            'message' => 'Package added to cart successfully',
            'cartItem' => $cartItem
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
            return !is_null($item->product_id);
        })->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'quantity' => $item->quantity,
                'image' => $item->image,
                'slug' => $item->slug,
                'category' => $item->category,
                'product' => $item->product,
            ];
        })->values();

        $packageCart = $cartItems->filter(function ($item) {
            return !is_null($item->package_id);
        })->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'quantity' => $item->quantity,
                'features' => $item->features ? json_decode($item->features) : [],
                'slug' => $item->slug,
                'package' => $item->package,
            ];
        })->values();

        return response()->json([
            'productCart' => $productCart,
            'packageCart' => $packageCart
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
            'message' => 'Cart item updated successfully',
            'cartItem' => $cartItem
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
            'message' => 'Cart item removed successfully'
        ]);
    }

    // 清空购物车
    public function clearCart()
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }
}
