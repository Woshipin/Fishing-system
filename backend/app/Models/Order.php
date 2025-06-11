<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'duration_id',
        'table_number_id',
        'total',
        'subtotal',
        'status',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function duration()
    {
        return $this->belongsTo(Duration::class);
    }

    public function tableNumber()
    {
        return $this->belongsTo(TableNumber::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Add a scope to filter orders by product
    public function scopeWithProduct($query, $productId)
    {
        return $query->whereHas('orderItems', function($q) use ($productId) {
            $q->where('item_type', 'product')->where('item_id', $productId);
        });
    }

    // Add a scope to filter orders by package
    public function scopeWithPackage($query, $packageId)
    {
        return $query->whereHas('orderItems', function($q) use ($packageId) {
            $q->where('item_type', 'package')->where('item_id', $packageId);
        });
    }

    // Helper method to get order type
    public function getOrderTypeAttribute()
    {
        $hasProducts = $this->orderItems->where('item_type', 'product')->count() > 0;
        return $hasProducts ? 'product' : 'package';
    }

    // Helper method to calculate tax
    public function getTaxAttribute()
    {
        return $this->total - $this->subtotal;
    }
}
