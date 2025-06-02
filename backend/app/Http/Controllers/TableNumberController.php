<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TableNumber;

class TableNumberController extends Controller
{
    public function index()
    {
        $tablenumbers = TableNumber::all();
        return response()->json($tablenumbers);
    }
}
