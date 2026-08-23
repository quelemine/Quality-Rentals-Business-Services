<?php
// Login API Endpoint
// POST /api/auth/login

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    
    if (!empty($data->username) && !empty($data->password)) {
        try {
            $username = $data->username;
            $password = $data->password;
            
            // Get admin from database by username
            $query = "SELECT id, username, email, password FROM admin WHERE username = :username";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$admin) {
                http_response_code(401);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Invalid username or password."
                ));
                exit();
            }
            
            // Verify password
            if (!password_verify($password, $admin['password'])) {
                http_response_code(401);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Invalid username or password."
                ));
                exit();
            }
            
            // Login successful
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
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Server error: " . $e->getMessage()
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
