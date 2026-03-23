<?php

namespace App\Http\Middleware;

use App\Models\AuthToken;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthTokenMiddleware
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $plainToken = $request->bearerToken();

        if (!$plainToken) {
            return $this->unauthorizedResponse();
        }

        $hashedToken = hash('sha256', $plainToken);

        $token = AuthToken::query()
            ->with('user.role')
            ->where('token_hash', $hashedToken)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$token || !$token->user || !$token->user->is_active) {
            return $this->unauthorizedResponse();
        }

        $request->setUserResolver(fn () => $token->user);
        $request->attributes->set('auth_token', $token);

        return $next($request);
    }

    private function unauthorizedResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Unauthenticated.',
        ], 401);
    }
}
