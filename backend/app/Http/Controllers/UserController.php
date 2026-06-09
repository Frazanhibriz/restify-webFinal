<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);

        $users = User::with([
            'role',
            'hotel'
        ])
        ->latest()
        ->paginate($perPage);

        return response()->json($users);
    }


    
    public function show($id)
    {
        $user = User::with([
            'role',
            'hotel'
        ])->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ],404);
        }

        return response()->json($user);
    }


    
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        
        if ($data['role_id'] == 1) {
            return response()->json([
                'message' => 'Tidak dapat membuat admin baru'
            ],403);
        }

        $data['password'] = Hash::make(
            $data['password']
        );

        $user = User::create($data);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data' => $user->load([
                'role',
                'hotel'
            ])
        ],201);
    }


    
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ],404);
        }

        $validated = $request->validated();

        
        if ($user->role_id == 1) {

            return response()->json([
                'message' => 'Role admin tidak dapat diubah'
            ],403);
        }


        
        if (
            isset($validated['role_id']) &&
            $validated['role_id'] == 1
        ) {

            return response()->json([
                'message' => 'Tidak dapat mengubah user menjadi admin'
            ],403);
        }


        
        if (
            isset($validated['role_id']) &&
            $validated['role_id'] == 3 &&
            empty($validated['hotel_id']) &&
            !$user->hotel_id
        ) {

            return response()->json([
                'message' => 'Receptionist wajib memiliki hotel_id'
            ],400);
        }


        
        if (
            isset($validated['password'])
        ) {

            $validated['password'] =
                Hash::make(
                    $validated['password']
                );
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User berhasil diupdate',
            'data' => $user->fresh()->load([
                'role',
                'hotel'
            ])
        ]);
    }


    
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {

            return response()->json([
                'message' => 'User tidak ditemukan'
            ],404);
        }


        
        if ($user->role_id == 1) {

            return response()->json([
                'message' => 'Admin tidak dapat dihapus'
            ],403);
        }


        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus'
        ]);
    }
}