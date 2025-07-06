<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function duration(): BelongsTo
    {
        return $this->belongsTo(Duration::class);
    }

    public function tableNumber(): BelongsTo
    {
        return $this->belongsTo(TableNumber::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ... existing scopes ...

    /**
     * [NEW] Accessor to get the display image URL of the first item in the order.
     *
     * @return string|null
     */
    public function getFirstItemImageUrlAttribute(): ?string
    {
        $this->loadMissing('orderItems');
        $firstItem = $this->orderItems->first();
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
