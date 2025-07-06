<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        'image', // This is a snapshot of the image path at the time of order creation
    ];

    protected $casts = [
        'item_price' => 'decimal:2',
        'quantity' => 'integer',
        'features' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function item()
    {
        return $this->morphTo();
    }

    public function getTotalPriceAttribute()
    {
        return $this->item_price * $this->quantity;
    }

    /**
     * [Definitive Final Version] This accessor robustly handles image URL generation
     * by prioritizing the live relationship and safely falling back to the stored snapshot.
     * This correctly handles inconsistent data between old and new orders.
     *
     * @return string
     */
    public function getDisplayImageUrlAttribute(): string
    {
        // 1. Prioritize the live relationship to get the most current image.
        if ($this->item) {
            if ($this->item_type === 'product' && !empty($this->item->first_image_url)) {
                return $this->item->first_image_url;
            }
            if ($this->item_type === 'package' && !empty($this->item->image_url)) {
                return $this->item->image_url;
            }
        }

        // 2. Fallback to the snapshot 'image' field stored at the time of the order.
        // This handles cases where the original item was deleted or the relationship fails.
        $snapshotImage = $this->image;
        if ($snapshotImage) {
            // If the snapshot is already a full URL, return it directly.
            if (Str::startsWith($snapshotImage, ['http://', 'https://'])) {
                return $snapshotImage;
            }
            // If the snapshot path incorrectly starts with 'storage/', strip it to prevent duplication.
            if (Str::startsWith($snapshotImage, 'storage/')) {
                $snapshotImage = Str::after($snapshotImage, 'storage/');
            }
            // Generate the final URL from the clean, relative path.
            return Storage::disk('public')->url($snapshotImage);
        }

        // 3. If all else fails, return a placeholder.
        return 'https://via.placeholder.com/150/E2E8F0/8D99AE?text=No+Image';
    }
}
