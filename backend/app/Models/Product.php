<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'category_id', 'description',
        'price', 'stock', 'is_active',
        // 如果需要单图字段，留 image
        'image',
    ];

    /** 这里依旧把列 images 映射成数组（如需保留） */
    protected $casts = [
        'images' => 'array',
    ];

    /* ---------- 关系 ---------- */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /** ✅ 改名以避开列冲突 */
    public function productImages()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    /** 方便前端直接获取 URL 数组 */
    public function getImageUrlsAttribute()
    {
        return $this->productImages
            ->pluck('image_path')
            ->map(fn ($p) => Storage::disk('public')->url($p))
            ->all();
    }

    public function packages()
    {
        return $this->belongsToMany(Package::class);
    }

    public function productReviews()
    {
        // 确保关联到正确的模型 ProductReview
        return $this->hasMany(ProductReview::class);
    }
}
