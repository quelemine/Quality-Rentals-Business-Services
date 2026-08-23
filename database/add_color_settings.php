<?php
// Migration script to add color_settings table
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

include_once '../api/config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Check if table already exists
    $checkQuery = "SHOW TABLES LIKE 'color_settings'";
    $stmt = $db->prepare($checkQuery);
    $stmt->execute();
    $tableExists = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($tableExists) {
        echo json_encode([
            'success' => true,
            'message' => 'Table color_settings already exists'
        ]);
    } else {
        // Create the table
        $createQuery = "CREATE TABLE color_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(50) NOT NULL UNIQUE,
            setting_value VARCHAR(50) NOT NULL,
            description VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $stmt = $db->prepare($createQuery);
        $result = $stmt->execute();
        
        if ($result) {
            // Insert default color settings
            $defaultColors = [
                ['primary', '#D4AF37', 'Primary color (gold)'],
                ['secondary', '#1E3A5F', 'Secondary color (navy)'],
                ['accent', '#F5F5F5', 'Accent color (light gray)'],
                ['text', '#1F2937', 'Text color (dark gray)'],
                ['background', '#FFFFFF', 'Background color (white)'],
                ['success', '#10B981', 'Success color (green)'],
                ['error', '#EF4444', 'Error color (red)'],
                ['warning', '#F59E0B', 'Warning color (orange)']
            ];
            
            $insertQuery = "INSERT INTO color_settings (setting_key, setting_value, description) VALUES (:key, :value, :description)";
            $insertStmt = $db->prepare($insertQuery);
            
            foreach ($defaultColors as $color) {
                $insertStmt->bindParam(':key', $color[0]);
                $insertStmt->bindParam(':value', $color[1]);
                $insertStmt->bindParam(':description', $color[2]);
                $insertStmt->execute();
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Table color_settings created successfully with default colors'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create color_settings table'
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
