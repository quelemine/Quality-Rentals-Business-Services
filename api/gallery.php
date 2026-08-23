<?php
// Gallery API Endpoint
// GET /api/gallery - Fetch all gallery items

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT id, title, image_url, tag FROM gallery ORDER BY id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $gallery = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $gallery[] = $row;
    }
    
    echo json_encode($gallery);
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
