<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    // 允许批量赋值的字段
    protected $fillable = [
        'name', 'slug', 'category_id', 'description', 'price', 'stock', 'is_active',
    ];

    // 将 images 字段转换为数组
    protected $casts = [
        'images' => 'array',
    ];

    // 定义与 Category 模型的关联关系
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getImageUrlsAttribute()
    {
        return $this->images->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => Storage::disk('public')->url($image->image_path),
                'path' => $image->image_path,
            ];
        });
    }


}
