<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;

use Illuminate\Http\Exceptions\ThrottleRequestsException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {

        
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'recaptcha' => \App\Http\Middleware\ValidateRecaptcha::class,
        ]);

    })

    ->withExceptions(function (Exceptions $exceptions): void {

        
        $exceptions->render(function (
            ThrottleRequestsException $e,
            $request
        ) {

            return response()->json([

                'message' => 'Terlalu banyak percobaan.',

                
                'retry_after_seconds' =>
                    (int) ($e->getHeaders()['Retry-After'] ?? 0),

                
                'retry_after_minutes' =>
                    ceil(((int) ($e->getHeaders()['Retry-After'] ?? 0)) / 60),

            ], 429);

        });

    })->create();