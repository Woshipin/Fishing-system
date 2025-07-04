<?php
// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Registration attempt:', $request->all());

        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            Log::error('Registration validation failed:', $validator->errors()->toArray());
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('authToken')->plainTextToken;

            Log::info('User registered successfully:', ['user_id' => $user->id, 'email' => $user->email]);

            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'message' => 'Registration successful'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Registration failed',
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        Log::info('Login attempt:', ['email' => $request->email]);

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Login validation failed:', $validator->errors()->toArray());
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            try {
                $user = Auth::user();
                $token = $user->createToken('authToken')->plainTextToken;

                Log::info('User logged in successfully:', ['user_id' => $user->id, 'email' => $user->email]);

                return response()->json([
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                    'message' => 'Login successful'
                ], 200);

            } catch (\Exception $e) {
                Log::error('Login token creation error: ' . $e->getMessage());
                return response()->json([
                    'error' => 'Login failed',
                    'message' => 'Internal Server Error'
                ], 500);
            }
        } else {
            Log::warning('Login failed - invalid credentials:', ['email' => $request->email]);
            return response()->json([
                'error' => 'Invalid credentials',
                'message' => 'Invalid email or password'
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                Log::info('User logging out:', ['user_id' => $user->id]);
                $user->tokens()->delete();
                Log::info('User logged out successfully:', ['user_id' => $user->id]);

                return response()->json([
                    'message' => 'Successfully logged out'
                ], 200);
            } else {
                Log::warning('Logout attempt without valid user');
                return response()->json([
                    'message' => 'No user to logout'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Logout failed',
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $request->user_id,
            'password' => 'sometimes|nullable|string|min:6|confirmed',
        ]);

        $user = User::findOrFail($validatedData['user_id']);

        $dataToUpdate = [];
        if (isset($validatedData['name'])) {
            $dataToUpdate['name'] = $validatedData['name'];
        }
        if (isset($validatedData['email'])) {
            $dataToUpdate['email'] = $validatedData['email'];
        }
        if (!empty($validatedData['password'])) {
            $dataToUpdate['password'] = Hash::make($validatedData['password']);
        }

        if (empty($dataToUpdate)) {
            return response()->json([
                'message' => 'No data provided for update.',
                'user' => $user
            ], 200);
        }

        $user->update($dataToUpdate);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh() // Return the updated user model
        ], 200);
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                Log::info('User profile requested:', ['user_id' => $user->id]);
                return response()->json([
                    'user' => $user,
                    'message' => 'User profile retrieved successfully'
                ], 200);
            } else {
                return response()->json([
                    'error' => 'User not found',
                    'message' => 'Invalid token'
                ], 401);
            }
        } catch (\Exception $e) {
            Log::error('Get user error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to get user',
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
}
