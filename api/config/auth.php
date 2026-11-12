<?php
// Admin authentication & session helpers
// Include this file in any endpoint that needs session support.
// Call requireAdmin() to enforce authentication on admin-only actions.

// Provides qrs_setting()/qrs_local_config() and CORS headers (already included
// by every endpoint, but require it here so auth.php is self-sufficient).
require_once __DIR__ . '/database.php';

if (session_status() === PHP_SESSION_NONE) {
    // Admin sessions expire after 8 hours of inactivity
    ini_set('session.gc_maxlifetime', '28800');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    ]);
    session_start();
}

function adminIsLoggedIn() {
    return !empty($_SESSION['admin_id']);
}

// Absolute session timeout: 8 hours from login, regardless of activity
define('ADMIN_SESSION_TTL', 28800);

function clientIp() {
    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    // Only trust forwarding headers when the direct peer is a known proxy
    // (e.g. Cloudflare). Configure TRUSTED_PROXIES as a comma-separated IP list
    // via env var or a 'TRUSTED_PROXIES' key in local.php.
    $trusted = array_filter(array_map('trim', explode(',', (string)qrs_setting('TRUSTED_PROXIES', ''))));
    if ($trusted && in_array($remote, $trusted, true)) {
        $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($xff !== '') {
            $ips = array_map('trim', explode(',', $xff));
            return $ips[0];
        }
        $real = trim((string)($_SERVER['HTTP_X_REAL_IP'] ?? ''));
        if ($real !== '') {
            return $real;
        }
    }

    return $remote;
}

// Count honeypot (bot) drops so silent filtering is visible in logs
function honeypotDrop($bucket) {
    $file = sys_get_temp_dir() . '/qrs_hp_' . $bucket . '.count';
    $count = is_file($file) ? (int)@file_get_contents($file) : 0;
    $count++;
    @file_put_contents($file, (string)$count, LOCK_EX);
    error_log("Honeypot drop #{$count} on {$bucket} endpoint.");
}

function requireAdmin() {
    // CSRF mitigation: for state-changing requests, reject cross-origin calls.
    $method = $_SERVER['REQUEST_METHOD'];
    if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin !== '') {
            $originHost = parse_url($origin, PHP_URL_HOST);
            $serverHost = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
            if ($originHost !== $serverHost) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Forbidden origin.']);
                exit();
            }
        }
    }

    // Absolute timeout: reject sessions older than 8 hours
    if (!empty($_SESSION['admin_login_time']) && (time() - (int)$_SESSION['admin_login_time']) > ADMIN_SESSION_TTL) {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Session expired. Please log in again.']);
        exit();
    }

    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required.']);
        exit();
    }
}

// Simple file-based rate limiter. Returns true if the request is allowed.
function rateLimitAllow($bucket, $maxAttempts, $windowSeconds) {
    $dir = sys_get_temp_dir();
    if (!is_dir($dir)) {
        return true; // can't track — don't block legitimate traffic
    }
    $file = $dir . '/qrs_rl_' . $bucket . '_' . md5(clientIp());
    $now = time();
    $data = ['count' => 0, 'reset' => $now + $windowSeconds];

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        $decoded = $raw ? json_decode($raw, true) : null;
        if (is_array($decoded) && isset($decoded['reset'], $decoded['count'])) {
            $data = $decoded;
        }
    }

    if ($now > $data['reset']) {
        $data = ['count' => 0, 'reset' => $now + $windowSeconds];
    }

    $data['count']++;
    @file_put_contents($file, json_encode($data), LOCK_EX);

    return $data['count'] <= $maxAttempts;
}
