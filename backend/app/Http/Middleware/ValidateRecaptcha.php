<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ValidateRecaptcha
{
    public function handle(Request $request, Closure $next)
    {
        if (app()->environment('testing')) {
            return $next($request);
        }

        $token = $request->input('recaptcha_token');

        if (!$token) {
            return response()->json([
                'message' => 'Token reCAPTCHA tidak ditemukan.'
            ], 422);
        }

        try {
            $response = Http::timeout(5)
                ->withOptions([
                    'curl' => [
                        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                        CURLOPT_SSL_VERIFYPEER => !app()->environment('local'),
                    ]
                ])

                ->asForm()
                ->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret'   => config('recaptcha.secret_key'),
                    'response' => $token,
                    'remoteip' => $request->ip(),
                ]);


            $result = $response->json();

            Log::info('reCAPTCHA verification', [
                'success' => $result['success'] ?? false,
                'score'   => $result['score'] ?? null,
                'action'  => $result['action'] ?? null,
            ]);

            if (!($result['success'] ?? false)) {
                return response()->json([
                    'message' => 'Verifikasi reCAPTCHA gagal.'
                ], 422);
            }

            $threshold = (float) config('recaptcha.score_threshold', 0.5);

            if (($result['score'] ?? 0) < $threshold) {
                return response()->json([
                    'message' => 'Aktivitas mencurigakan terdeteksi. Silakan coba lagi.'
                ], 422);
            }

        } catch (\Exception $e) {
            Log::error('reCAPTCHA error: ' . $e->getMessage());
            return $next($request);
        }

        return $next($request);
    }
}
