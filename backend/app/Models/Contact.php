<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'email',
        'subject',
        'message'
    ];

    // If you have a User model and want to define a relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
