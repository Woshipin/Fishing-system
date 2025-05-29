<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    // 关联产品
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // 添加访问器来获取完整的图片URL
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return Storage::disk('public')->url($this->image_path);
        }

        return null;
    }
}
