<?php
namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Support\Facades\Storage;

class PackageController extends Controller
{
    public function index()
    {
        try {
            $packages = Package::with('category')->get()->map(function ($package) {
                return [
                    'id'          => $package->id,
                    'title'       => $package->name,
                    'description' => $package->description,
                    'category'    => $package->category ? $package->category->slug : 'uncategorized',
                    'price'       => number_format($package->price, 2),
                    'imageUrl'    => $this->getImageUrl($package->image),
                    'rating'      => $package->rating ?? 4.5,
                ];
            });

            return response()->json($packages);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Failed to fetch packages',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function detail($id)
    {
        try {
            $package = Package::with([
                'category',
                'products' => function ($query) {
                    $query->with(['productImages', 'category']);
                },
            ])->find($id);

            if (! $package) {
                return response()->json([
                    'error'   => 'Package not found',
                    'message' => 'The requested package does not exist.',
                ], 404);
            }

            // Prepare package images
            $packageImages = [];
            if ($package->image) {
                $packageImages[] = $this->getImageUrl($package->image);
            }
            // If no images, add placeholder
            if (empty($packageImages)) {
                $packageImages[] = asset('api/placeholder/800/600');
            }

            $packageData = [
                'id'            => $package->id,
                'title'         => $package->name,
                'description'   => $package->description,
                'category'      => $package->category ? $package->category->name : 'Uncategorized',
                'category_id'   => $package->category ? $package->category->id : null, // Include category_id
                'price'         => (float) $package->price,
                'originalPrice' => (float) $package->price + 100, // Adjust based on business logic
                'rating'        => $package->rating ?? 4.5,
                'imageUrls'     => $packageImages,
                'inStock'       => (bool) $package->is_active,
                'features'      => [
                    'Professional Guide',
                    '4 Hours Duration',
                    'All Equipment Included',
                    'Refreshments Provided',
                ],
                'products'      => $this->formatProducts($package->products),
            ];

            return response()->json($packageData);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Failed to fetch package details',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Format products for the response
     */
    private function formatProducts($products)
    {
        return $products->map(function ($product) {
            // Get multiple image URLs
            $images = [];

            // Check if productImages relationship exists and has images
            if ($product->productImages && $product->productImages->count() > 0) {
                $images = $product->productImages
                    ->pluck('image_path')
                    ->map(fn($path) => $this->getImageUrl($path))
                    ->filter() // Remove null values
                    ->values()
                    ->all();
            }

            // Fallback: check for single image field
            if (empty($images) && ! empty($product->image)) {
                $imageUrl = $this->getImageUrl($product->image);
                if ($imageUrl) {
                    $images[] = $imageUrl;
                }
            }

            // Fallback: add placeholder if no images
            if (empty($images)) {
                $images[] = asset('api/placeholder/400/320');
            }

            return [
                'id'          => $product->id,
                'name'        => $product->name,
                'description' => $product->description ?? '',
                'price'       => (float) $product->price,
                'stock'       => (int) $product->stock,
                'is_active'   => (bool) $product->is_active,
                'category'    => $product->category ? $product->category->name : 'Uncategorized',
                'rating'      => $product->rating ?? 4.0,
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
