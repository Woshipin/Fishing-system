<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder; // 引入 Builder
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
        'is_active' => 'boolean', // 建议为 is_active 添加布尔类型转换
    ];

    /* ---------- 新增：查询作用域 ---------- */

    /**
     * 查询受欢迎的产品（按销量排序）
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePopular(Builder $query): Builder
    {
        return $query
            // 1. 连接 order_items 表，这是计算销量的关键
            ->join('order_items', 'products.id', '=', 'order_items.item_id')
            // 2. 筛选出类型为 'product' 的订单项
            ->where('order_items.item_type', 'product')
            // 3. 选择产品表的所有字段，并计算总销量
            //    使用 selectRaw 避免 SQL 注入，并为计算结果起一个别名 'total_quantity_sold'
            ->selectRaw('products.*, SUM(order_items.quantity) as total_quantity_sold')
            // 4. 按产品 ID 分组，确保每个产品只出现一次
            ->groupBy('products.id')
            // 5. 按总销量降序排序
            ->orderByDesc('total_quantity_sold');
    }


    /* ---------- 关系 ---------- */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function getImageUrlsAttribute()
    {
        // 预加载了 productImages 关系时，这会非常高效
        if (!$this->relationLoaded('productImages')) {
            $this->load('productImages');
        }

        if ($this->productImages->isEmpty()) {
            return []; // 如果没有图片，返回空数组
        }

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
        return $this->hasMany(ProductReview::class);
    }
}
