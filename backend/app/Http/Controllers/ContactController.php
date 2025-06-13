<?php

// app/Http/Controllers/ContactController.php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'user_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:2000',
            ]);

            DB::beginTransaction();

            $contact = Contact::create([
                'user_id' => $validated['user_id'],
                'user_name' => $validated['user_name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
            ]);

            $contact->load('user');

            DB::commit();

            return response()->json([
                'id' => $contact->id,
                'user_id' => $contact->user_id,
                'user_name' => $contact->user_name,
                'email' => $contact->email,
                'subject' => $contact->subject,
                'message' => $contact->message,
                'created_at' => $contact->created_at->toISOString(),
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating contact: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create contact',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

