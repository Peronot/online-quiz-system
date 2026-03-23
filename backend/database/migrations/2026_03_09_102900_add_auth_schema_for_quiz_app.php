<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table): void {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });
        }

        Schema::table('users', function (Blueprint $table): void {
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->unsignedBigInteger('role_id')->nullable()->after('id');
                $table->index('role_id');
            }

            if (!Schema::hasColumn('users', 'full_name')) {
                $table->string('full_name')->nullable()->after('role_id');
            }

            if (!Schema::hasColumn('users', 'password_hash')) {
                $table->string('password_hash')->nullable()->after('email');
            }

            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 50)->nullable()->after('password_hash');
            }

            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('phone');
            }

            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('is_active');
            }
        });

        if (!Schema::hasTable('auth_tokens')) {
            Schema::create('auth_tokens', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('token_hash', 64)->unique();
                $table->timestamp('issued_at');
                $table->timestamp('expires_at');
                $table->timestamp('revoked_at')->nullable();
                $table->string('user_agent', 255)->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->timestamp('created_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('auth_tokens');
        Schema::dropIfExists('roles');
    }
};

