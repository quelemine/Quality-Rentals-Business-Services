<?php
// Categories API Endpoint
// GET /api/categories - Fetch all categories

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT id, name, slug, icon_name FROM categories ORDER BY id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $categories = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $categories[] = $row;
    }
    
    echo json_encode($categories);
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
