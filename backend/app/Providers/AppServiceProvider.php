<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinutes(3,5)->by($request->email . $request->ip());
        });

        
        RateLimiter::for('forgot-password', function (Request $request) {
            return Limit::perMinutes(5, 3)->by($request->email . $request->ip());
        });

        
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinutes(10, 5)
                ->by($request->ip());
        });
    }
}