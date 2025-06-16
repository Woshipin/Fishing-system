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
        'table_number_id',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function duration()
    {
        return $this->belongsTo(Duration::class);
    }

    public function tableNumber()
    {
        return $this->belongsTo(TableNumber::class);
    }

    public function isActive()
    {
        return $this->status === 'active' && now() < $this->end_time;
    }

    public function isCompleted()
    {
        return $this->status === 'completed' || now() >= $this->end_time;
    }
}
