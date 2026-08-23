<?php
// Change Password API Endpoint (for authenticated admins)
// POST /api/auth/change-password

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
    
    if (!empty($data->currentPassword) && !empty($data->newPassword) && !empty($data->confirmPassword)) {
        try {
            $currentPassword = $data->currentPassword;
            $newPassword = $data->newPassword;
            $confirmPassword = $data->confirmPassword;
            $email = $data->email;
            $newUsername = isset($data->newUsername) && !empty($data->newUsername) ? $data->newUsername : null;
            
            // Validate passwords match
            if ($newPassword !== $confirmPassword) {
                http_response_code(400);
                echo json_encode(array("message" => "New passwords do not match."));
                exit();
            }
            
            // Validate password strength (minimum 8 characters)
            if (strlen($newPassword) < 8) {
                http_response_code(400);
                echo json_encode(array("message" => "New password must be at least 8 characters long."));
                exit();
            }
            
            // Check if new password is same as current
            if ($currentPassword === $newPassword) {
                http_response_code(400);
                echo json_encode(array("message" => "New password must be different from current password."));
                exit();
            }
            
            // Get current admin from database
            $query = "SELECT id, username, password FROM admin WHERE email = :email";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$admin) {
                http_response_code(404);
                echo json_encode(array("message" => "Admin account not found."));
                exit();
            }
            
            // Verify current password
            if (!password_verify($currentPassword, $admin['password'])) {
                http_response_code(401);
                echo json_encode(array("message" => "Current password is incorrect."));
                exit();
            }
            
            // Check if new username is already taken (if changing username)
            if ($newUsername && $newUsername !== $admin['username']) {
                $checkQuery = "SELECT id FROM admin WHERE username = :username AND id != :id";
                $checkStmt = $db->prepare($checkQuery);
                $checkStmt->bindParam(':username', $newUsername);
                $checkStmt->bindParam(':id', $admin['id']);
                $checkStmt->execute();
                if ($checkStmt->fetch(PDO::FETCH_ASSOC)) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Username already taken."));
                    exit();
                }
            }
            
            // Hash the new password
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            
            // Update admin password and optionally username
            if ($newUsername) {
                $updateQuery = "UPDATE admin SET password = :password, username = :username WHERE email = :email";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindParam(':password', $hashedPassword);
                $updateStmt->bindParam(':username', $newUsername);
                $updateStmt->bindParam(':email', $email);
            } else {
                $updateQuery = "UPDATE admin SET password = :password WHERE email = :email";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindParam(':password', $hashedPassword);
                $updateStmt->bindParam(':email', $email);
            }
            
            $updateResult = $updateStmt->execute();
            
            if ($updateResult) {
                http_response_code(200);
                $message = $newUsername 
                    ? "Password and username have been changed successfully."
                    : "Password has been changed successfully.";
                echo json_encode(array(
                    "success" => true,
                    "message" => $message
                ));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Failed to update password."));
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Server error: " . $e->getMessage()
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Current password, new password, and confirm password are required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
