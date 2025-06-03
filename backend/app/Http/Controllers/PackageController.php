<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('category')->get()->map(function ($package) {
            return [
                'id' => $package->id,
                'title' => $package->name,
                'description' => $package->description,
                'category' => $package->category->slug, // Assuming the category model has a slug field
                'price' => number_format($package->price, 2),
                'imageUrl' => $package->image ? env('BASE_IMAGE_URL') . $package->image : '/api/placeholder/400/320',
                'rating' => $package->rating ?? 4.5, // Default rating
            ];
        });

        return response()->json($packages);
    }
}
