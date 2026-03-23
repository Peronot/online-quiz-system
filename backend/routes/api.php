<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/student/access', [AuthController::class, 'studentAccess']);

Route::middleware('auth.token')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:admin')->group(function (): void {
        Route::get('/admin/dashboard/summary', [DashboardController::class, 'adminSummary']);

        Route::get('/admin/users', [UserManagementController::class, 'index']);
        Route::get('/admin/users/roles/summary', [UserManagementController::class, 'rolesSummary']);
        Route::post('/admin/users', [UserManagementController::class, 'store']);
        Route::put('/admin/users/{userId}', [UserManagementController::class, 'update'])->whereNumber('userId');
        Route::patch('/admin/users/{userId}/status', [UserManagementController::class, 'updateStatus'])->whereNumber('userId');
        Route::delete('/admin/users/{userId}', [UserManagementController::class, 'destroy'])->whereNumber('userId');
    });

    Route::middleware('role:teacher,instructor')->group(function (): void {
        Route::get('/teacher/dashboard/summary', [DashboardController::class, 'teacherSummary']);
    });
});
