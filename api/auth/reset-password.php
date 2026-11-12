<?php
// Reset Password API Endpoint
// POST /api/auth/reset-password

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
    
    if (!empty($data->token) && !empty($data->password) && !empty($data->confirmPassword)) {
        try {
            $token = trim((string)$data->token);
            $password = $data->password;
            $confirmPassword = $data->confirmPassword;
            
            // Validate passwords match
            if ($password !== $confirmPassword) {
                http_response_code(400);
                echo json_encode(array("message" => "Passwords do not match."));
                exit();
            }
            
            // Validate password strength (minimum 8 characters)
            if (strlen($password) < 8) {
                http_response_code(400);
                echo json_encode(array("message" => "Password must be at least 8 characters long."));
                exit();
            }
            
            // Check if token exists and is valid
            // Tokens are stored hashed — hash the submitted token before lookup
            $tokenHash = hash('sha256', $token);
            $query = "SELECT * FROM password_reset_tokens WHERE token = :token AND used = FALSE AND expires_at > NOW()";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':token', $tokenHash);
            $stmt->execute();
            $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$tokenData) {
                http_response_code(400);
                echo json_encode(array("message" => "Invalid or expired reset token."));
                exit();
            }
            
            // Hash the new password
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            
            // Update admin password (assuming admin table exists, adjust as needed)
            // Note: You may need to adjust this based on your actual admin table structure
            $updateQuery = "UPDATE admin SET password = :password WHERE email = :email";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':password', $hashedPassword);
            $updateStmt->bindParam(':email', $tokenData['email']);
            $updateResult = $updateStmt->execute();
            
            if ($updateResult) {
                // Mark this token as used AND invalidate any other outstanding
                // tokens for the same email (a password change kills all sessions)
                $markUsedQuery = "UPDATE password_reset_tokens SET used = TRUE WHERE email = :email";
                $markUsedStmt = $db->prepare($markUsedQuery);
                $markUsedStmt->bindParam(':email', $tokenData['email']);
                $markUsedStmt->execute();
                
                http_response_code(200);
                echo json_encode(array(
                    "success" => true,
                    "message" => "Password has been reset successfully. You can now login with your new password."
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Failed to update password."));
            }
            
        } catch (Exception $e) {
            error_log("Reset password error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Server error. Please try again later."
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Token, password, and confirm password are required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
