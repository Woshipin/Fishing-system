<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AboutPageContent;
use App\Models\TeamMember;
use App\Models\Milestone;

class AboutPageController extends Controller
{
    public function getAboutPageData()
    {
        $about = AboutPageContent::first(); // 只取一条记录
        $team = TeamMember::orderBy('order')->get();
        $milestones = Milestone::orderBy('order')->get();

        return response()->json([
            'about' => $about,
            'team_members' => $team,
            'milestones' => $milestones,
        ]);
    }
}
