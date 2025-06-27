<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fishing_cms;

class FishingCMSController extends Controller
{
    public function getCMSData()
    {
        $cms = Fishing_cms::first(); // 假设只有一条 CMS 数据记录

        return response()->json([
            'cms' => $cms,
        ]);
    }
}
