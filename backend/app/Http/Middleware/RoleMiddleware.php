<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        if(!$request->user()){
            Log::warning('RoleMiddleware: Unauthenticated request to ' . $request->path());
            return response()->json([
                'message' => 'Unauthorized'
            ],401);
        }

        $user = $request->user();
        
        // Load the role relation directly via DB if not already loaded
        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }
        
        $userRole = $user->getRelationValue('role');
        $roleName = is_string($userRole) ? $userRole : ($userRole?->name ?? null);

        Log::info('RoleMiddleware check', [
            'user_id'    => $user->id,
            'user_email' => $user->email,
            'user_role'  => $roleName,
            'required'   => $role,
            'path'       => $request->path(),
        ]);

        if($roleName !== $role){
            Log::warning('RoleMiddleware: Access denied', [
                'user_id'    => $user->id,
                'user_email' => $user->email,
                'user_role'  => $roleName,
                'required'   => $role,
            ]);
            return response()->json([
                'message' => 'Access denied',
                'your_role' => $roleName,
                'required_role' => $role,
            ],403);
        }

        return $next($request);
    }
}