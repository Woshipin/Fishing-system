<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;

class ProductController extends Controller
{
    public function show()
    {
        // 获取所有产品，带关联的分类和图片
        $products = Product::with(['category', 'images'])->get();

        // 获取所有分类
        $categories = Category::all();

        // 返回组合数据
        return response()->json([
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
