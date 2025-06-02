<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'package_id',
        'name',
        'slug',
        'image',
        'category_id',
        'quantity',
        'price',
        'features',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array', // 自动处理 JSON 转换
    ];

    // 关联用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 关联产品 (可能为 null)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // 关联包 (可能为 null)
    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    // 关联类别 (可能为 null)
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // 访问器：获取总价
    public function getTotalAttribute()
    {
        return $this->price * $this->quantity;
    }

    // 访问器：判断是否为产品
    public function getIsProductAttribute()
    {
        return !is_null($this->product_id);
    }

    // 访问器：判断是否为包
    public function getIsPackageAttribute()
    {
        return !is_null($this->package_id);
    }

    // Scope：只获取产品购物车项目
    public function scopeProducts($query)
    {
        return $query->whereNotNull('product_id');
    }

    // Scope：只获取包购物车项目
    public function scopePackages($query)
    {
        return $query->whereNotNull('package_id');
    }

    // Scope：按用户筛选
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
