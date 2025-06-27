<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fishing_cms extends Model
{
    use HasFactory;

    /**
     * 关键：明确指定数据表名，防止 Laravel 自动寻找错误的复数表名。
     */
    protected $table = 'fishing_cms';

    // ... $fillable 和 $casts 数组 ...
    // (您之前提供的这部分是正确的，保持不变)
    protected $fillable = [
        'home_title',
        'home_description',
        'about_us_title',
        'about_us_description',
        'phone_number',
        'email',
        'address',
        'opening_days_text',
        'closing_day_text',
        'open_time',
        'close_time',
        'special_holidays_text',
    ];

    protected $casts = [
        'open_time'  => 'datetime:H:i',
        'close_time' => 'datetime:H:i',
    ];
}
