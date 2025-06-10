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

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
