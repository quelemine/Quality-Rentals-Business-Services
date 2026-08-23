<?php
// Product Search API Endpoint
// GET /api/search-products.php?query=search_term

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = isset($_GET['query']) ? htmlspecialchars(strip_tags($_GET['query'])) : '';
    
    if (empty($query)) {
        http_response_code(400);
        echo json_encode(array("message" => "Search query is required"));
        exit();
    }
    
    try {
        $searchQuery = "%$query%";
        
        $sql = "SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.name LIKE :query 
                OR p.description LIKE :query 
                OR p.price LIKE :query
                ORDER BY p.name ASC";
        
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':query', $searchQuery);
        $stmt->execute();
        
        $products = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $products[] = $row;
        }
        
        echo json_encode(array(
            "success" => true,
            "count" => count($products),
            "products" => $products
        ));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Server error: " . $e->getMessage()
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
