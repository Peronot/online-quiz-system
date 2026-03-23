<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function adminSummary(Request $request): JsonResponse
    {
        $totalUsers = $this->safeCount('users');
        $totalTeachers = $this->countUsersByRoles(['teacher', 'instructor']);
        $totalStudents = $this->countUsersByRoles(['student']);
        $totalQuizzes = $this->safeCount('quizzes');
        $totalRooms = $this->safeCount('rooms');
        $activeSessions = $this->countActiveSessions();
        $suspicious = $this->countSuspiciousActivities();
        $reportsSummary = $this->countReportsSummary();
        $activeUsers = $this->countActiveUsers();
        $publishedQuizzes = $this->countPublishedQuizzes();
        $activeRooms = $this->countActiveRooms();
        $totalAttempts = $this->safeCount('attempts');

        $metrics = [
            'total_users' => $totalUsers,
            'total_teachers' => $totalTeachers,
            'total_students' => $totalStudents,
            'total_quizzes' => $totalQuizzes,
            'total_rooms' => $totalRooms,
            'active_sessions' => $activeSessions,
            'suspicious_activities' => $suspicious,
            'reports_summary' => $reportsSummary,
        ];

        $reports = $this->reportsMeta();

        $progress = [
            'total_users' => $this->toPercent($activeUsers, $totalUsers),
            'total_teachers' => $this->toPercent($totalTeachers, $totalUsers),
            'total_students' => $this->toPercent($totalStudents, $totalUsers),
            'total_quizzes' => $this->toPercent($publishedQuizzes, $totalQuizzes),
            'total_rooms' => $this->toPercent($activeRooms, $totalRooms),
            'active_sessions' => $this->toPercent($activeSessions, $totalRooms),
            'suspicious_activities' => $this->toPercent($suspicious, $totalAttempts),
            'reports_summary' => $this->clampPercent((float) ($reports['average_score'] ?? 0)),
        ];

        return response()->json([
            'metrics' => $metrics,
            'progress' => $progress,
            'recent_activity' => $this->adminRecentActivity(),
            'recent_notifications' => $this->adminRecentNotifications(),
            'reports' => $reports,
        ]);
    }

    public function teacherSummary(Request $request): JsonResponse
    {
        $teacherId = (int) $request->user()->id;
        $totalQuizzes = $this->teacherTotalQuizzes($teacherId);
        $activeQuizzes = $this->teacherActiveQuizzes($teacherId);
        $totalStudents = $this->teacherTotalStudents($teacherId);
        $totalRooms = $this->teacherTotalRooms($teacherId);
        $activeRooms = $this->teacherActiveRooms($teacherId);
        $submittedAttempts = $this->teacherSubmittedAttempts($teacherId);
        $allAttempts = $this->teacherAllAttempts($teacherId);

        $metrics = [
            'total_quizzes' => $totalQuizzes,
            'active_quizzes' => $activeQuizzes,
            'total_students' => $totalStudents,
            'total_rooms' => $totalRooms,
        ];

        $progress = [
            'total_quizzes' => $this->toPercent($activeQuizzes, $totalQuizzes),
            'active_quizzes' => $this->toPercent($activeQuizzes, $totalQuizzes),
            'total_students' => $this->toPercent($submittedAttempts, $allAttempts),
            'total_rooms' => $this->toPercent($activeRooms, $totalRooms),
        ];

        return response()->json([
            'metrics' => $metrics,
            'progress' => $progress,
            'recent_quiz_results' => $this->teacherRecentQuizResults($teacherId),
            'recent_student_attempts' => $this->teacherRecentAttempts($teacherId),
            'announcements' => $this->teacherAnnouncements($teacherId),
        ]);
    }

    private function safeCount(string $table): int
    {
        if (!Schema::hasTable($table)) {
            return 0;
        }

        return (int) DB::table($table)->count();
    }

    private function countUsersByRoles(array $roles): int
    {
        if (!Schema::hasTable('users') || !Schema::hasTable('roles')) {
            return 0;
        }

        return (int) DB::table('users')
            ->join('roles', 'roles.id', '=', 'users.role_id')
            ->whereIn(DB::raw('LOWER(roles.name)'), array_map('strtolower', $roles))
            ->count();
    }

    private function countActiveUsers(): int
    {
        if (!Schema::hasTable('users')) {
            return 0;
        }

        return (int) DB::table('users')
            ->where('is_active', 1)
            ->count();
    }

    private function countPublishedQuizzes(): int
    {
        if (!Schema::hasTable('quizzes')) {
            return 0;
        }

        return (int) DB::table('quizzes')
            ->where('status', 'published')
            ->count();
    }

    private function countActiveRooms(): int
    {
        if (!Schema::hasTable('rooms')) {
            return 0;
        }

        return (int) DB::table('rooms')
            ->where('is_active', 1)
            ->count();
    }

    private function countActiveSessions(): int
    {
        if (!Schema::hasTable('quiz_sessions')) {
            return 0;
        }

        return (int) DB::table('quiz_sessions')
            ->where('is_active', 1)
            ->count();
    }

    private function countSuspiciousActivities(): int
    {
        $total = 0;

        if (Schema::hasTable('proctor_events')) {
            $total += (int) DB::table('proctor_events')
                ->whereIn('severity', ['warning', 'high'])
                ->count();
        }

        if (Schema::hasTable('cheating_logs')) {
            $total += (int) DB::table('cheating_logs')
                ->whereIn('severity', ['medium', 'high', 'critical'])
                ->count();
        }

        return $total;
    }

    private function countReportsSummary(): int
    {
        $quizResults = Schema::hasTable('quiz_results') ? (int) DB::table('quiz_results')->count() : 0;
        $analytics = Schema::hasTable('quiz_analytics') ? (int) DB::table('quiz_analytics')->count() : 0;

        return $quizResults + $analytics;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function adminRecentActivity(): array
    {
        if (Schema::hasTable('audit_trails') && Schema::hasTable('users')) {
            return DB::table('audit_trails')
                ->leftJoin('users', 'users.id', '=', 'audit_trails.user_id')
                ->select([
                    'audit_trails.id',
                    'audit_trails.action',
                    'audit_trails.entity_type',
                    'audit_trails.created_at',
                    'users.full_name as actor',
                ])
                ->orderByDesc('audit_trails.created_at')
                ->limit(8)
                ->get()
                ->map(static fn ($row): array => [
                    'id' => (int) $row->id,
                    'title' => (string) ($row->action ?? 'Activity'),
                    'meta' => trim(((string) ($row->actor ?? 'System')).' • '.((string) ($row->entity_type ?? 'general'))),
                    'time' => (string) $row->created_at,
                ])
                ->all();
        }

        if (Schema::hasTable('system_logs')) {
            return DB::table('system_logs')
                ->select(['id', 'action', 'created_at'])
                ->orderByDesc('created_at')
                ->limit(8)
                ->get()
                ->map(static fn ($row): array => [
                    'id' => (int) $row->id,
                    'title' => (string) ($row->action ?? 'System activity'),
                    'meta' => 'System',
                    'time' => (string) $row->created_at,
                ])
                ->all();
        }

        return [];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function adminRecentNotifications(): array
    {
        if (!Schema::hasTable('notifications')) {
            return [];
        }

        return DB::table('notifications')
            ->select(['id', 'title', 'message', 'type', 'created_at'])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) $row->id,
                'title' => (string) $row->title,
                'message' => (string) $row->message,
                'type' => (string) ($row->type ?? 'info'),
                'time' => (string) $row->created_at,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function reportsMeta(): array
    {
        $averageScore = 0.0;

        if (Schema::hasTable('quiz_results')) {
            $averageScore = (float) (DB::table('quiz_results')->avg('total_score') ?? 0);
        }

        return [
            'average_score' => round($averageScore, 2),
            'total_reports' => $this->countReportsSummary(),
        ];
    }

    private function teacherTotalQuizzes(int $teacherId): int
    {
        if (!Schema::hasTable('quizzes')) {
            return 0;
        }

        return (int) DB::table('quizzes')
            ->where('instructor_id', $teacherId)
            ->count();
    }

    private function teacherActiveQuizzes(int $teacherId): int
    {
        if (!Schema::hasTable('quizzes')) {
            return 0;
        }

        return (int) DB::table('quizzes')
            ->where('instructor_id', $teacherId)
            ->where('status', 'published')
            ->count();
    }

    private function teacherTotalRooms(int $teacherId): int
    {
        if (!Schema::hasTable('rooms')) {
            return 0;
        }

        return (int) DB::table('rooms')
            ->where('instructor_id', $teacherId)
            ->count();
    }

    private function teacherActiveRooms(int $teacherId): int
    {
        if (!Schema::hasTable('rooms')) {
            return 0;
        }

        return (int) DB::table('rooms')
            ->where('instructor_id', $teacherId)
            ->where('is_active', 1)
            ->count();
    }

    private function teacherAllAttempts(int $teacherId): int
    {
        if (!Schema::hasTable('attempts') || !Schema::hasTable('quizzes')) {
            return 0;
        }

        return (int) DB::table('attempts')
            ->join('quizzes', 'quizzes.id', '=', 'attempts.quiz_id')
            ->where('quizzes.instructor_id', $teacherId)
            ->count();
    }

    private function teacherSubmittedAttempts(int $teacherId): int
    {
        if (!Schema::hasTable('attempts') || !Schema::hasTable('quizzes')) {
            return 0;
        }

        return (int) DB::table('attempts')
            ->join('quizzes', 'quizzes.id', '=', 'attempts.quiz_id')
            ->where('quizzes.instructor_id', $teacherId)
            ->where('attempts.status', 'submitted')
            ->count();
    }

    private function teacherTotalStudents(int $teacherId): int
    {
        if (!Schema::hasTable('rooms') || !Schema::hasTable('room_members')) {
            return 0;
        }

        return (int) DB::table('room_members')
            ->join('rooms', 'rooms.id', '=', 'room_members.room_id')
            ->where('rooms.instructor_id', $teacherId)
            ->distinct('room_members.student_id')
            ->count('room_members.student_id');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teacherRecentQuizResults(int $teacherId): array
    {
        if (!Schema::hasTable('quiz_results') || !Schema::hasTable('attempts') || !Schema::hasTable('quizzes')) {
            return [];
        }

        return DB::table('quiz_results')
            ->join('attempts', 'attempts.id', '=', 'quiz_results.attempt_id')
            ->join('quizzes', 'quizzes.id', '=', 'attempts.quiz_id')
            ->where('quizzes.instructor_id', $teacherId)
            ->select([
                'quiz_results.id',
                'quiz_results.total_score',
                'quizzes.title as quiz_title',
                'quiz_results.created_at',
            ])
            ->orderByDesc('quiz_results.created_at')
            ->limit(8)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) $row->id,
                'title' => (string) ($row->quiz_title ?? 'Quiz'),
                'score' => (float) ($row->total_score ?? 0),
                'time' => (string) $row->created_at,
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teacherRecentAttempts(int $teacherId): array
    {
        if (!Schema::hasTable('attempts') || !Schema::hasTable('quizzes')) {
            return [];
        }

        $hasUsers = Schema::hasTable('users');

        $query = DB::table('attempts')
            ->join('quizzes', 'quizzes.id', '=', 'attempts.quiz_id')
            ->where('quizzes.instructor_id', $teacherId)
            ->select([
                'attempts.id',
                'attempts.status',
                'attempts.risk_level',
                'attempts.created_at',
                'quizzes.title as quiz_title',
                'attempts.student_id',
            ])
            ->orderByDesc('attempts.created_at')
            ->limit(8);

        $rows = $query->get();

        $userMap = [];
        if ($hasUsers) {
            $studentIds = $rows->pluck('student_id')->filter()->unique()->values()->all();
            if (!empty($studentIds)) {
                $userMap = DB::table('users')
                    ->whereIn('id', $studentIds)
                    ->pluck('full_name', 'id')
                    ->toArray();
            }
        }

        return $rows
            ->map(static function ($row) use ($userMap): array {
                $studentName = $userMap[$row->student_id] ?? ('Student #'.(string) $row->student_id);

                return [
                    'id' => (int) $row->id,
                    'student' => (string) $studentName,
                    'quiz' => (string) ($row->quiz_title ?? 'Quiz'),
                    'status' => (string) ($row->status ?? 'in_progress'),
                    'risk_level' => (string) ($row->risk_level ?? 'low'),
                    'time' => (string) $row->created_at,
                ];
            })
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teacherAnnouncements(int $teacherId): array
    {
        if (!Schema::hasTable('notifications')) {
            return [];
        }

        return DB::table('notifications')
            ->select(['id', 'title', 'message', 'type', 'created_at'])
            ->where(function ($query) use ($teacherId): void {
                $query->where('user_id', $teacherId)
                    ->orWhereNull('user_id');
            })
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) $row->id,
                'title' => (string) $row->title,
                'message' => (string) $row->message,
                'type' => (string) ($row->type ?? 'info'),
                'time' => (string) $row->created_at,
            ])
            ->all();
    }

    private function toPercent(int|float $part, int|float $whole): int
    {
        if ($whole <= 0) {
            return 0;
        }

        return $this->clampPercent(($part / $whole) * 100);
    }

    private function clampPercent(float $value): int
    {
        return (int) max(0, min(100, round($value)));
    }
}
