<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserSelectedDuration;

class UserDurationController extends Controller
{
    public function getActiveSessions()
    {
        $activeSessions = UserSelectedDuration::with(['user', 'duration', 'tableNumber'])
            ->where('status', 'active')
            ->get();

        return response()->json($activeSessions);
    }

    public function getCompletedSessions()
    {
        $completedSessions = UserSelectedDuration::with(['user', 'duration', 'tableNumber'])
            ->where('status', 'completed')
            ->get();

        return response()->json($completedSessions);
    }

    public function updateSessionStatus(Request $request, $id)
    {
        $session = UserSelectedDuration::findOrFail($id);
        $session->status = $request->status;
        $session->save();

        return response()->json($session);
    }
}
