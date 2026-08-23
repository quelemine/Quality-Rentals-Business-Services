<?php
// Color Settings API Endpoint
// GET /api/color-settings - Fetch all color settings
// POST /api/color-settings - Update color settings

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT setting_key, setting_value, description FROM color_settings ORDER BY setting_key";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $colors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Convert to key-value object
        $colorSettings = [];
        foreach ($colors as $color) {
            $colorSettings[$color['setting_key']] = [
                'value' => $color['setting_value'],
                'description' => $color['description']
            ];
        }
        
        echo json_encode(array(
            "success" => true,
            "colors" => $colorSettings
        ));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Server error: " . $e->getMessage()
        ));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    
    if (!empty($data->colors)) {
        try {
            foreach ($data->colors as $key => $value) {
                $query = "UPDATE color_settings SET setting_value = :value WHERE setting_key = :key";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':value', $value);
                $stmt->bindParam(':key', $key);
                $stmt->execute();
            }
            
            echo json_encode(array(
                "success" => true,
                "message" => "Color settings updated successfully."
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
        echo json_encode(array("message" => "Color settings are required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
