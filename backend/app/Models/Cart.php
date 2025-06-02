<?php

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
        'features' => 'array',
        'price' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

