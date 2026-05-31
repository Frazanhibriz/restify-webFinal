<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\resetPassword;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role_id' => 2, 
            'hotel_id' => null
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role_id' => $user->role_id,
                'role' => $user->role->name ?? 'user',
                'hotel_id' => $user->hotel_id,
                'profile_picture' => $user->profile_picture,
                'profile_picture_url' => $user->profile_picture
                    ? asset('storage/' . $user->profile_picture)
                    : null,
            ],
            'token' => $token
        ], 201);
    }


    
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $user = User::with('role')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token
        ]);
    }


    
    public function profile(Request $request)
    {
        $user = $request->user()->load('role');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? null,

                'role_id' => $user->role_id,
                'role_name' => $user->role->name ?? null,
                'role' => $user->role->name ?? null,

                'hotel_id' => $user->hotel_id,

                'profile_picture' => $user->profile_picture,
                'profile_picture_url' => $user->profile_picture
                    ? asset('storage/' . $user->profile_picture)
                    : null,

                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }


    
    public function uploadProfile(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = auth()->user();

        
        if ($user->profile_picture) {

            $oldPath = public_path('storage/' . $user->profile_picture);

            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        
        $path = $request->file('profile_picture')
            ->store('profiles', 'public');

        
        $user->update([
            'profile_picture' => $path
        ]);

        return response()->json([
            'message' => 'Foto profile berhasil diupload',
            'profile_picture' => $path,
            'image_url' => asset('storage/' . $path)
        ]);
    }


    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak ditemukan'
            ], 404);
        }

        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        return response()->json([
            'message' => 'Token reset password berhasil dibuat',
            'token' => $token
        ]);
    }

    
    public function resetPassword(resetPassword $request)
    {
        $data = $request->validated();

        $reset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$reset) {
            return response()->json([
                'message' => 'Token reset tidak ditemukan'
            ], 404);
        }

        if (!Hash::check($request->token, $reset->token)) {
            return response()->json([
                'message' => 'Token tidak valid'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Password berhasil direset'
        ]);
    }

    
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user->load('role')
        ]);
    }
}