<?php

namespace App\Http\Controllers;

use App\Models\Duration;
use Illuminate\Http\Request;

class DurationController extends Controller
{
    public function index()
    {
        $durations = Duration::all();
        return response()->json($durations);
    }
}
