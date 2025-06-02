<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('category')
            ->where('is_active', true)
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'title' => $package->name,
                    'description' => $package->description,
                    'category' => $package->category->slug, // 假设分类模型有slug字段
                    'price' => number_format($package->price, 2),
                    'imageUrl' => $package->image_url ?? '/api/placeholder/400/320',
                    'rating' => $package->rating ?? 4.5, // 默认评分
                ];
            });

        return response()->json($packages);
    }
}
