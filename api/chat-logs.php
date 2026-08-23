<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/database.php';

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

// POST - Create new chat log
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['message']) || !isset($data['sender'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Message and sender are required']);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO chat_logs 
            (user_name, message, sender, device_type, device_os, browser, location_country, location_city, ip_address, session_id)
            VALUES 
            (:user_name, :message, :sender, :device_type, :device_os, :browser, :location_country, :location_city, :ip_address, :session_id)
        ");
        
        $stmt->execute([
            ':user_name' => $data['user_name'] ?? null,
            ':message' => $data['message'],
            ':sender' => $data['sender'],
            ':device_type' => $data['device_type'] ?? null,
            ':device_os' => $data['device_os'] ?? null,
            ':browser' => $data['browser'] ?? null,
            ':location_country' => $data['location_country'] ?? null,
            ':location_city' => $data['location_city'] ?? null,
            ':ip_address' => $data['ip_address'] ?? $_SERVER['REMOTE_ADDR'] ?? null,
            ':session_id' => $data['session_id'] ?? null
        ]);
        
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// GET - Fetch all chat logs (for admin)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT * FROM chat_logs 
            ORDER BY created_at DESC 
            LIMIT 100
        ");
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'logs' => $logs]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
