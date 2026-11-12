<?php
// Login API Endpoint
// POST /api/auth/login

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once '../config/database.php';
include_once '../config/auth.php';

$database = new Database();
$db = $database->getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Rate limit: max 10 attempts per 15 minutes per IP
    if (!rateLimitAllow('login', 10, 900)) {
        http_response_code(429);
        echo json_encode(array(
            "success" => false,
            "message" => "Too many login attempts. Please try again later."
        ));
        exit();
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!empty($data->username) && !empty($data->password)) {
        try {
            $username = trim((string)$data->username);
            $password = (string)$data->password;

            // Get admin from database by username
            $query = "SELECT id, username, email, password FROM admin WHERE username = :username";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$admin || !password_verify($password, $admin['password'])) {
                http_response_code(401);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Invalid username or password."
                ));
                exit();
            }

            // Login successful — establish server-side session
            session_regenerate_id(true);
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_login_time'] = time();
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['admin_email'] = $admin['email'];

            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Login successful.",
                "admin" => array(
                    "id" => $admin['id'],
                    "username" => $admin['username'],
                    "email" => $admin['email']
                )
            ));

        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Server error. Please try again later."
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Username and password are required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
