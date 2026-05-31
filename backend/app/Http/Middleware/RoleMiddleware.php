<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        if(!$request->user()){
            return response()->json([
                'message' => 'Unauthorized'
            ],401);
        }

        $userRole = $request->user()->role;
        $roleName = is_string($userRole) ? $userRole : ($userRole->name ?? null);

        if($roleName !== $role){
            return response()->json([
                'message' => 'Access denied'
            ],403);
        }

        return $next($request);
    }
}