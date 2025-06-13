<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserSelectedDuration;

class UserDurationController extends Controller
{
    public function index()
    {
        $userDurations = UserSelectedDuration::with(['user', 'duration'])->get();

        return response()->json($userDurations);
    }
}
