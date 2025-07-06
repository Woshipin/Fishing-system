<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'category_id', 'description',
        'price', 'stock', 'is_active',
        'image',
    ];

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean',
    ];

    // ... 您已有的 scopePopular 和其他关系 ...

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages()
    {
        // 按 sort_order 排序，确保第一张图是可预测的
        return $this->hasMany(ProductImage::class, 'product_id')->orderBy('sort_order');
    }

    public function packages()
    {
        return $this->belongsToMany(Package::class);
    }

    public function productReviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * [新增] 获取产品第一张图片的URL
     *
     * @return string|null
     */
    public function getFirstImageUrlAttribute(): ?string
    {
        // 确保关联已加载
        $this->loadMissing('productImages');

        $firstImage = $this->productImages->first();

        return $firstImage ? $firstImage->image_url : null;
    }

    // 您原来的 getImageUrlsAttribute 保持不变，用于需要所有图片的场景
    public function getImageUrlsAttribute()
    {
        if ($this->productImages->isEmpty()) {
            return [];
        }
        return $this->productImages->pluck('image_url')->all();
    }
}
