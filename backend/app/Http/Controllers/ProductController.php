<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        try {
            // ✅ CHANGED: Added withAvg and withCount for efficiency
            $products = Product::with(['category', 'productImages'])
                ->withAvg('productReviews', 'rating') // Calculates average rating
                ->withCount('productReviews')        // Counts total reviews
                ->orderBy('is_active', 'desc')
                ->orderBy('name', 'asc')
                ->get();

            $categories = Category::orderBy('name', 'asc')->get();

            $products->each(function ($product) {
                // ... (image processing code remains the same) ...
                $product->image_urls = $product->productImages
                    ->sortBy('sort_order')
                    ->pluck('image_path')
                    ->map(function ($path) {
                        return Storage::disk('public')->exists($path)
                            ? Storage::disk('public')->url($path)
                            : asset('images/placeholder.jpg');
                    })
                    ->values()
                    ->all();
                if (empty($product->image_urls) && $product->image) {
                     $product->image_urls = [Storage::disk('public')->exists($product->image) ? Storage::disk('public')->url($product->image) : asset('images/placeholder.jpg')];
                }
                if (empty($product->image_urls)) {
                    $product->image_urls = [asset('images/placeholder.jpg')];
                }

                // ➕ ADDED: Use the calculated average rating. Round it for display.
                // The result from withAvg is available as `product_reviews_avg_rating`
                $product->rating = $product->product_reviews_avg_rating ? round($product->product_reviews_avg_rating) : 0;

                $product->formatted_price = number_format($product->price, 2);
                $product->status_text = $product->is_active ? 'Active' : 'Inactive';
                $product->makeHidden(['productImages']);
            });

            return response()->json([
                'success' => true,
                'products' => $products,
                'categories' => $categories,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch products'], 500);
        }
    }

    public function detail($id)
    {
        try {
            // ✅ CHANGED: Eager load reviews with user data, and calculate average rating and count.
            $product = Product::with([
                    'category',
                    'productImages',
                    'productReviews.user' // Eager load reviews AND the 'user' for each review
                ])
                ->withAvg('productReviews', 'rating') // Calculates average rating
                ->withCount('productReviews')        // Counts total reviews
                ->find($id);

            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Product not found'], 404);
            }

            // ... (image processing code remains the same) ...
            $product->image_urls = $product->productImages
                ->sortBy('sort_order')
                ->pluck('image_path')
                ->map(function ($path) {
                    return Storage::disk('public')->exists($path)
                        ? Storage::disk('public')->url($path)
                        : asset('images/placeholder.jpg');
                })
                ->values()
                ->all();
            if (empty($product->image_urls) && $product->image) {
                 $product->image_urls = [Storage::disk('public')->exists($product->image) ? Storage::disk('public')->url($product->image) : asset('images/placeholder.jpg')];
            }
            if (empty($product->image_urls)) {
                $product->image_urls = [asset('images/placeholder.jpg')];
            }

            // Note: The raw review data (product_reviews) and calculated values
            // (product_reviews_avg_rating, product_reviews_count) are now
            // automatically part of the $product object. The frontend will handle them.

            return response()->json([
                'success' => true,
                'product' => $product
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching product detail for ID ' . $id . ': ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch product details'], 500);
        }
    }
    public function search(Request $request)
    {
        try {
            $query = Product::with(['category', 'productImages']);

            // 按名称搜索
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('description', 'LIKE', "%{$searchTerm}%");
                });
            }

            // 按分类过滤
            if ($request->has('category') && $request->category !== 'all') {
                $query->whereHas('category', function ($q) use ($request) {
                    $q->where('name', $request->category);
                });
            }

            // 按价格范围过滤
            if ($request->has('price_min')) {
                $query->where('price', '>=', $request->price_min);
            }
            if ($request->has('price_max')) {
                $query->where('price', '<=', $request->price_max);
            }

            // 按状态过滤
            if ($request->has('active')) {
                $query->where('is_active', $request->boolean('active'));
            }

            // 排序
            $sortBy = $request->get('sort', 'name');
            $sortDirection = $request->get('direction', 'asc');

            switch ($sortBy) {
                case 'price':
                    $query->orderBy('price', $sortDirection);
                    break;
                case 'created_at':
                    $query->orderBy('created_at', $sortDirection);
                    break;
                case 'category':
                    $query->join('categories', 'products.category_id', '=', 'categories.id')
                          ->orderBy('categories.name', $sortDirection)
                          ->select('products.*');
                    break;
                default:
                    $query->orderBy('name', $sortDirection);
            }

            $products = $query->get();

            // 处理图片 URLs
            $products->each(function ($product) {
                $product->image_urls = $product->productImages
                    ->sortBy('sort_order')
                    ->pluck('image_path')
                    ->map(function ($path) {
                        return Storage::disk('public')->url($path);
                    })
                    ->values()
                    ->all();

                if (empty($product->image_urls) && $product->image) {
                    $product->image_urls = [Storage::disk('public')->url($product->image)];
                }

                if (empty($product->image_urls)) {
                    $product->image_urls = [asset('images/placeholder.jpg')];
                }

                $product->formatted_price = number_format($product->price, 2);
                $product->makeHidden(['productImages']);
            });

            return response()->json([
                'success' => true,
                'products' => $products,
                'count' => $products->count()
            ]);

        } catch (\Exception $e) {
            \Log::error('Error searching products: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => app()->environment('local') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
