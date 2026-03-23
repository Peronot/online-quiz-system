<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRoleMiddleware
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->role) {
            return $this->forbiddenResponse();
        }

        $roleName = strtolower((string) $user->role->name);
        $allowed = array_map(static fn (string $role): string => strtolower($role), $roles);

        if (!in_array($roleName, $allowed, true)) {
            return $this->forbiddenResponse();
        }

        return $next($request);
    }

    private function forbiddenResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Forbidden. Insufficient role permissions.',
        ], 403);
    }
}
