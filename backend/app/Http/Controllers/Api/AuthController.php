<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\StudentAccessRequest;
use App\Models\AuthToken;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Throwable;
use Illuminate\Database\QueryException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $requestedRole = strtolower((string) ($validated['role'] ?? 'teacher'));

            if ($requestedRole !== 'teacher') {
                return response()->json([
                    'message' => 'Public registration allows teacher accounts only.',
                ], 403);
            }

            $roleId = Role::query()
                ->firstOrCreate(['name' => $requestedRole])
                ->id;

            if (!$roleId) {
                return response()->json([
                    'message' => 'Selected role not found.',
                ], 500);
            }

            $payload = [
                'role_id' => $roleId,
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'password_hash' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'is_active' => true,
            ];

            // Keep compatibility with both schema variants:
            // some databases have `name/password`, others use `full_name/password_hash`.
            if (Schema::hasColumn('users', 'name')) {
                $payload['name'] = $validated['full_name'];
            }

            if (Schema::hasColumn('users', 'password')) {
                $payload['password'] = Hash::make($validated['password']);
            }

            $user = User::query()->create($payload);

            $user->load('role');

            return response()->json([
                'message' => 'Registration successful.',
                'user' => $user,
            ], 201);
        } catch (Throwable $exception) {
            report($exception);

            if ($exception instanceof QueryException) {
                $message = strtolower($exception->getMessage());
                if (str_contains($message, 'could not find driver')) {
                    return response()->json([
                        'message' => 'Database driver missing (pdo_mysql). Enable MySQL PDO extension in PHP.',
                    ], 500);
                }
                if (str_contains($message, '2002') || str_contains($message, 'while connecting')) {
                    return response()->json([
                        'message' => 'Cannot connect to MySQL. Check DB_HOST/DB_PORT and ensure MySQL server is running.',
                    ], 500);
                }
            }

            return response()->json([
                'message' => 'Registration failed due to server error.',
            ], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $user = User::query()
                ->with('role')
                ->where('email', $validated['email'])
                ->first();

            if (!$user || !Hash::check($validated['password'], $user->password_hash)) {
                return response()->json([
                    'message' => 'Invalid credentials.',
                ], 422);
            }

            if ($user->role?->name === 'student') {
                return response()->json([
                    'message' => 'Student accounts must use the student access link flow.',
                ], 403);
            }

            if (!$user->is_active) {
                return response()->json([
                    'message' => 'Your account is inactive.',
                ], 403);
            }

            $now = now();
            $expiresAt = $now->copy()->addDays(7);
            $plainToken = Str::random(80);

            AuthToken::query()->create([
                'user_id' => $user->id,
                'token_hash' => hash('sha256', $plainToken),
                'issued_at' => $now,
                'expires_at' => $expiresAt,
                'user_agent' => Str::limit((string) $request->userAgent(), 255, ''),
                'ip_address' => (string) $request->ip(),
                'created_at' => $now,
            ]);

            $user->last_login_at = $now;
            $user->save();

            return response()->json([
                'message' => 'Login successful.',
                'token' => $plainToken,
                'token_type' => 'Bearer',
                'expires_at' => $expiresAt->toDateTimeString(),
                'user' => $user,
            ]);
        } catch (Throwable $exception) {
            report($exception);

            if ($exception instanceof QueryException) {
                $message = strtolower($exception->getMessage());
                if (str_contains($message, 'could not find driver')) {
                    return response()->json([
                        'message' => 'Database driver missing (pdo_mysql). Enable MySQL PDO extension in PHP.',
                    ], 500);
                }
                if (str_contains($message, '2002') || str_contains($message, 'while connecting')) {
                    return response()->json([
                        'message' => 'Cannot connect to MySQL. Check DB_HOST/DB_PORT and ensure MySQL server is running.',
                    ], 500);
                }
            }

            return response()->json([
                'message' => 'Login failed due to server error.',
            ], 500);
        }
    }

    public function studentAccess(StudentAccessRequest $request): JsonResponse
    {
        $validated = $request->validated();

        return response()->json([
            'message' => 'Student access granted.',
            'student' => [
                'student_id' => $validated['student_id'],
                'student_name' => $validated['student_name'],
                'role' => 'student',
            ],
            'access_token' => Str::random(64),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var AuthToken|null $token */
        $token = $request->attributes->get('auth_token');

        if ($token && !$token->revoked_at) {
            $token->revoked_at = now();
            $token->save();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $user->load('role');

        return response()->json([
            'user' => $user,
        ]);
    }
}
