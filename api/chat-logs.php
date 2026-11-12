<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';
require_once 'config/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Initialize database connection
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// POST - Create new chat log (public, rate-limited and strictly validated)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Spam protection: max 120 log writes per 10 minutes per IP
    if (!rateLimitAllow('chatlog', 120, 600)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // Honeypot: bots fill the hidden 'hp_check' field — pretend success, store nothing
    if (isset($data['hp_check']) && trim((string)$data['hp_check']) !== '') {
        honeypotDrop('chatlog');
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => 0]);
        exit();
    }

    if (!isset($data['message']) || !isset($data['sender'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Message and sender are required']);
        exit();
    }

    // Whitelist sender values
    $sender = in_array($data['sender'], ['user', 'bot'], true) ? $data['sender'] : 'user';

    // Sanitize + cap all string fields to prevent abuse/storage abuse
    $clean = function ($value, $max = 500) {
        if ($value === null) return null;
        $value = mb_substr(strip_tags((string)$value), 0, $max);
        return $value === '' ? null : $value;
    };

    try {
        $stmt = $pdo->prepare("
            INSERT INTO chat_logs
            (user_name, message, sender, device_type, device_os, browser, browser_version, screen_resolution, viewport_size, language, platform, location_country, location_city, ip_address, session_id)
            VALUES
            (:user_name, :message, :sender, :device_type, :device_os, :browser, :browser_version, :screen_resolution, :viewport_size, :language, :platform, :location_country, :location_city, :ip_address, :session_id)
        ");

        $stmt->execute([
            ':user_name' => $clean($data['user_name'] ?? null, 100),
            ':message' => $clean($data['message'], 2000),
            ':sender' => $sender,
            ':device_type' => $clean($data['device_type'] ?? null, 50),
            ':device_os' => $clean($data['device_os'] ?? null, 100),
            ':browser' => $clean($data['browser'] ?? null, 50),
            ':browser_version' => $clean($data['browser_version'] ?? null, 50),
            ':screen_resolution' => $clean($data['screen_resolution'] ?? null, 20),
            ':viewport_size' => $clean($data['viewport_size'] ?? null, 20),
            ':language' => $clean($data['language'] ?? null, 20),
            ':platform' => $clean($data['platform'] ?? null, 100),
            ':location_country' => $clean($data['location_country'] ?? null, 100),
            ':location_city' => $clean($data['location_city'] ?? null, 100),
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            ':session_id' => $clean($data['session_id'] ?? null, 64)
        ]);

        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        error_log("Chat log insert error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}

// GET - Fetch all chat logs (admin only — contains user PII)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    requireAdmin();
    try {
        $stmt = $pdo->query("
            SELECT * FROM chat_logs
            ORDER BY created_at DESC
            LIMIT 100
        ");
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'logs' => $logs]);
    } catch (PDOException $e) {
        error_log("Chat logs GET error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}
