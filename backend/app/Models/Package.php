<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Package extends Model
{
    protected $fillable = [
        'name', 'category_id', 'description', 'price', 'is_active', 'image',
    ];

     public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function packageReviews()
    {
        return $this->hasMany(PackageReview::class);
    }

    /**
     * [Definitive Fix] Correctly generates the image URL by handling all possible stored formats.
     *
     * @return string|null
     */
    public function getImageUrlAttribute(): ?string
    {
        $imagePath = $this->image;

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
