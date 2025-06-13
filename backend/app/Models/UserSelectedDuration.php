<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSelectedDuration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'duration_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function duration()
    {
        return $this->belongsTo(Duration::class);
    }
}
