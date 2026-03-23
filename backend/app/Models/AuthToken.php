<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuthToken extends Model
{
    public $timestamps = false;

    protected $table = 'auth_tokens';

    protected $fillable = [
        'user_id',
        'token_hash',
        'issued_at',
        'expires_at',
        'revoked_at',
        'user_agent',
        'ip_address',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
            'expires_at' => 'datetime',
            'revoked_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
