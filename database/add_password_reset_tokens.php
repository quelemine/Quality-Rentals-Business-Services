<?php
// Migration script to add password_reset_tokens table
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

include_once '../api/config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Check if table already exists
    $checkQuery = "SHOW TABLES LIKE 'password_reset_tokens'";
    $stmt = $db->prepare($checkQuery);
    $stmt->execute();
    $tableExists = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($tableExists) {
        echo json_encode([
            'success' => true,
            'message' => 'Table password_reset_tokens already exists'
        ]);
    } else {
        // Create the table
        $createQuery = "CREATE TABLE password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_token (token),
            INDEX idx_email (email)
        )";
        
        $stmt = $db->prepare($createQuery);
        $result = $stmt->execute();
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Table password_reset_tokens created successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create password_reset_tokens table'
            ]);
        }
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
