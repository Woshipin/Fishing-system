<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    use HasFactory;

    // 关键: 指定自定义的表名
    protected $table = 'product_reviews';

    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'comment',
    ];

    // 关系：一个评论属于一个用户
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 关系：一个评论属于一个产品
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
