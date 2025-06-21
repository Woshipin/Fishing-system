<?php
namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PackageController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::orderBy('name', 'asc')->get();

            // ✅ 核心修正 1: 使用 withAvg 和 withCount 高效获取每个套餐的评分数据
            $packages = Package::with('category')
                ->withAvg('packageReviews', 'rating') // 计算平均分
                ->withCount('packageReviews')      // 计算评论数
                ->get()
                ->map(function ($package) {
                    $categoryName = $package->category ? $package->category->name : 'Uncategorized';

                    // ✅ 如果 package_reviews_avg_rating 存在，则使用它，否则为 0
                    $averageRating = $package->package_reviews_avg_rating ? round($package->package_reviews_avg_rating, 1) : 0;

                    return [
                        'id'          => $package->id,
                        'title'       => $package->name,
                        'description' => $package->description,
                        'category'    => $categoryName,
                        'price'       => number_format($package->price, 2),
                        'imageUrl'    => $this->getImageUrl($package->image),
                        // ✅ 使用真实的平均分
                        'rating'      => $averageRating,
                    ];
                });

            return response()->json([
                'categories' => $categories,
                'packages'   => $packages
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching packages list: ' . $e->getMessage());
            return response()->json([
                'error'   => '获取套餐数据时发生后端错误。',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function detail($id)
    {
        try {
            $package = Package::with([
                'category',
                // ✅ 这是最关键的修改
                'products' => function ($query) {
                    // 在加载产品的同时，为每个产品预加载其图片、分类，并计算其平均分
                    $query->with(['productImages', 'category'])
                          ->withAvg('productReviews', 'rating'); // 为每个产品计算其评论的平均分
                },
                'packageReviews.user'
            ])
            ->withAvg('packageReviews', 'rating')
            ->withCount('packageReviews')
            ->find($id);

            if (!$package) {
                return response()->json(['error' => 'Package not found'], 404);
            }

            // ... 图片处理逻辑保持不变 ...
            $packageImages = [];
            if ($package->image) $packageImages[] = $this->getImageUrl($package->image);
            if (empty($packageImages)) $packageImages[] = asset('api/placeholder/800/600');

            $averageRating = $package->package_reviews_avg_rating ? round($package->package_reviews_avg_rating, 1) : 0;

            $packageData = $package->toArray();

            // 手动覆盖或添加字段
            $packageData['title'] = $package->name;
            $packageData['imageUrls'] = $packageImages;
            $packageData['inStock'] = (bool) $package->is_active;
            $packageData['rating'] = $averageRating;
            $packageData['originalPrice'] = (float) $package->price + 100;
            $packageData['features'] = ['Professional Guide', '4 Hours Duration', 'All Equipment Included', 'Refreshments Provided'];
            $packageData['products'] = $this->formatProducts($package->products); // 调用改进后的 formatProducts
            $packageData['category'] = $package->category ? $package->category->name : 'Uncategorized';
            $packageData['category_id'] = $package->category ? $package->category->id : null;

            return response()->json($packageData);

        } catch (\Exception $e) {
            Log::error('Error fetching package detail for ID ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch package details', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Format products for the response
     */
    private function formatProducts($products)
    {
        return $products->map(function ($product) {
            // 获取图片 URL (逻辑保持不变)
            $images = [];
            if ($product->productImages && $product->productImages->count() > 0) {
                $images = $product->productImages->pluck('image_path')->map(fn($path) => $this->getImageUrl($path))->filter()->values()->all();
            }
            if (empty($images) && !empty($product->image)) {
                $imageUrl = $this->getImageUrl($product->image);
                if ($imageUrl) $images[] = $imageUrl;
            }
            if (empty($images)) {
                $images[] = asset('api/placeholder/400/320');
            }

            // ✅ 使用 Laravel 在预加载时计算好的平均分
            // 字段名是 "relation_name_avg_column_name"
            $averageRating = $product->product_reviews_avg_rating ? round($product->product_reviews_avg_rating, 1) : 0;

            return [
                'id'          => $product->id,
                'name'        => $product->name,
                'description' => $product->description ?? '',
                'price'       => (float) $product->price,
                'stock'       => (int) $product->stock,
                'is_active'   => (bool) $product->is_active,
                'category'    => $product->category ? $product->category->name : 'Uncategorized',
                'rating'      => $averageRating, // ✅ 使用真实的平均分
                'imageUrls'   => $images,
            ];
        })->all();
    }

    /**
     * Get proper image URL
     */
    private function getImageUrl($imagePath)
    {
        if (! $imagePath) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($imagePath, 'http://') || str_starts_with($imagePath, 'https://')) {
            return $imagePath;
        }

        // If it starts with 'storage/', remove it as Storage::url() adds it
        if (str_starts_with($imagePath, 'storage/')) {
            $imagePath = substr($imagePath, 8);
        }

        // Use Storage facade to get proper URL
        try {
            if (Storage::disk('public')->exists($imagePath)) {
                return Storage::disk('public')->url($imagePath);
            }
        } catch (\Exception $e) {
            // Log error but don't break the response
            \Log::warning('Failed to generate image URL: ' . $e->getMessage());
        }

        // Fallback: construct URL manually
        return asset('storage/' . $imagePath);
    }
}
