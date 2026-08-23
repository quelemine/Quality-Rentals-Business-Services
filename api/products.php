<?php
// Products API Endpoint
// GET /api/products - Fetch all products with optional category filter
// GET /api/products?id=X - Fetch single product by ID

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if requesting single product
    if (isset($_GET['id'])) {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Product not found."));
        }
    } 
    // Check if filtering by category
    elseif (isset($_GET['category_id'])) {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.category_id = :category_id 
                  ORDER BY p.id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':category_id', $_GET['category_id']);
        $stmt->execute();
        
        $products = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $products[] = $row;
        }
        
        echo json_encode($products);
    } 
    // Fetch all products
    else {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  ORDER BY p.id";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $products = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $products[] = $row;
        }
        
        echo json_encode($products);
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
