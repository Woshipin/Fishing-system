<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    protected $table = 'product_images';

    protected $fillable = [
        'product_id',
        'image_path',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * [Definitive Fix] Correctly generates the image URL by handling all possible stored formats.
     *
     * @return string|null
     */
    public function getImageUrlAttribute(): ?string
    {
        $imagePath = $this->image_path;

        if (!$imagePath) {
            return null;
        }

        // 1. If it's already a full URL, return it directly to prevent duplication.
        if (Str::startsWith($imagePath, ['http://', 'https://'])) {
            return $imagePath;
        }

        // 2. If the path incorrectly starts with 'storage/', strip it to prevent '/storage/storage/'.
        if (Str::startsWith($imagePath, 'storage/')) {
            $imagePath = Str::after($imagePath, 'storage/');
        }

        // 3. Generate the final, correct URL from the clean path.
        return Storage::disk('public')->url($imagePath);
    }
}
