<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name', 'category_id', 'description', 'price', 'is_active', 'image',
    ];

     public function category()
    {
        // [第二步] 明确指定外键 'category_id'，确保 Eloquent 不会猜错
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
