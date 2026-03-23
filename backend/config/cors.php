<?php

$allowedOrigins = array_filter(array_map(
    'trim',
    explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173'))
));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => $allowedOrigins,
    'allowed_origins_patterns' => [
        '#^http://localhost(:\d+)?$#',
        '#^http://127\.0\.0\.1(:\d+)?$#',
    ],
    'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 3600,
    'supports_credentials' => false,
];
