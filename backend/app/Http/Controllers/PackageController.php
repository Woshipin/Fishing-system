<?php
namespace App\Http\Controllers;

use App\Models\Package;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('category')->get()->map(function ($package) {
            return [
                'id'          => $package->id,
                'title'       => $package->name,
                'description' => $package->description,
                'category'    => $package->category->slug, // Assuming the category model has a slug field
                'price'       => number_format($package->price, 2),
                'imageUrl'    => $package->image ? env('BASE_IMAGE_URL') . $package->image : '/api/placeholder/400/320',
                'rating'      => $package->rating ?? 4.5, // Default rating
            ];
        });

        return response()->json($packages);
    }

    public function detail($id)
    {
        $package = Package::with([
            'category',
            'products.images',
            'products.category',
        ])->findOrFail($id);

        $packageData = [
            'id'            => $package->id,
            'title'         => $package->name,
            'description'   => $package->description,
            'category'      => $package->category->name,
            'price'         => $package->price,
            'originalPrice' => $package->price + 100, // 可根据实际调整
            'rating'        => $package->rating ?? 4.5,
            'imageUrls'     => $package->image
                ? [asset('storage/' . $package->image)]
                : [asset('api/placeholder/800/600')],
            'inStock'       => $package->is_active,
            'features'      => [
                'Professional Guide',
                '4 Hours Duration',
                'All Equipment Included',
                'Refreshments Provided',
            ],
            'products'      => $package->products->map(function ($product) {
                $images = $product->images ?? collect(); // 确保是集合

                return [
                    'id'          => $product->id,
                    'name'        => $product->name,
                    'description' => $product->description,
                    'price'       => $product->price,
                    'stock'       => $product->stock,
                    'is_active'   => $product->is_active,
                    'category'    => $product->category ? $product->category->name : null,
                    'rating'      => 4, // 可换成实际逻辑
                    'imageUrls'   => $images->isNotEmpty()
                        ? $images->pluck('image_path')->map(fn($path) => asset('storage/' . $path))->toArray()
                        : [asset('api/placeholder/400/320')],
                ];
            }),
        ];

        return response()->json($packageData);
    }


}
