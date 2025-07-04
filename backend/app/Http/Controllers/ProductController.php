<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function products_popular()
    {
        try {
            // 1. 从 order_items 表中获取销量最高的前 8 个产品 ID
            $topProductIds = OrderItem::where('item_type', 'product')
                ->select('item_id', DB::raw('SUM(quantity) as total_quantity'))
                ->groupBy('item_id')
                ->orderByDesc('total_quantity')
                ->take(8)
                ->pluck('item_id');

            if ($topProductIds->isEmpty()) {
                return response()->json(['success' => true, 'data' => []]);
            }

            // 2. 获取这些热门产品的详细信息
            $products = Product::whereIn('id', $topProductIds)
                ->with(['category', 'productImages', 'productReviews'])
                ->where('is_active', true)
                ->get();

            // 3. 按销量顺序对产品进行排序
            $popularProducts = $products->sortBy(function ($product) use ($topProductIds) {
                return array_search($product->id, $topProductIds->toArray());
            });

            // 4. 格式化产品数据以供前端使用
            $popularProducts->each(function ($product) {
                // 格式化图片 URL
                $product->imageUrls = $product->productImages
                    ->sortBy('sort_order')
                    ->pluck('image_path')
                    ->map(function ($path) {
                        return Storage::disk('public')->exists($path)
                            ? Storage::disk('public')->url($path)
                            : asset('images/placeholder.jpg');
                    })
                    ->values()
                    ->all();
                if (empty($product->imageUrls) && $product->image) {
                     $product->imageUrls = [Storage::disk('public')->exists($product->image) ? Storage::disk('public')->url($product->image) : asset('images/placeholder.jpg')];
                }
                if (empty($product->imageUrls)) {
                    $product->imageUrls = [asset('images/placeholder.jpg')];
                }

                // 设置前端期望的字段
                $product->title = $product->name; // 将 'name' 复制到 'title'
                $product->categoryName = $product->category->name ?? 'Uncategorized';
                $product->rating = $product->productReviews->avg('rating') ? round($product->productReviews->avg('rating'), 1) : 0;
                $product->inStock = $product->is_active;

                // 移除不需要的加载关系，保持响应干净
                $product->makeHidden(['productImages', 'category', 'productReviews', 'image', 'name']);
            });

            return response()->json([
                'success' => true,
                // 使用 values() 重置数组键，确保返回的是一个 JSON 数组
                'data' => $popularProducts->values(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching popular products: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch popular products'], 500);
        }
    }
}
