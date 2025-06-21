<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'user_id',
        'rating',
        'comment',
    ];

    /**
     * 获取此评论所属的用户。
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 获取此评论所属的套餐。
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
