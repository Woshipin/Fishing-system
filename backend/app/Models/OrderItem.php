<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'item_type',
        'item_id',
        'item_name',
        'item_price',
        'quantity',
        'features',
        'image',
    ];

    protected $casts = [
        'item_price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Get the actual product or package model
    public function item()
    {
        if ($this->item_type === 'product') {
            return $this->belongsTo(Product::class, 'item_id');
        } else {
            return $this->belongsTo(Package::class, 'item_id');
        }
    }

    // Helper method to get total price for this item
    public function getTotalPriceAttribute()
    {
        return $this->item_price * $this->quantity;
    }
}
