<?php
// Products API Endpoint
// GET /api/products - Fetch all products with optional category filter
// GET /api/products?id=X - Fetch single product by ID
// POST /api/products - Create new product
// PUT /api/products - Update existing product
// DELETE /api/products?id=X - Delete product

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new product
    $data = json_decode(file_get_contents('php://input'), true);
    
    $query = "INSERT INTO products (category_id, name, slug, description, image_url, price, price_currency, is_available, stock_quantity) 
              VALUES (:category_id, :name, :slug, :description, :image_url, :price, :price_currency, :is_available, :stock_quantity)";
    
    $stmt = $db->prepare($query);
    
    // Generate slug from name if not provided
    $slug = isset($data['slug']) ? $data['slug'] : strtolower(str_replace(' ', '-', $data['name']));
    
    $price_currency = isset($data['price_currency']) ? $data['price_currency'] : 'USD';
    
    $stmt->bindParam(':category_id', $data['category_id']);
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':image_url', $data['image_url']);
    $stmt->bindParam(':price', $data['price']);
    $stmt->bindParam(':price_currency', $price_currency);
    $stmt->bindParam(':is_available', $data['is_available']);
    $stmt->bindParam(':stock_quantity', $data['stock_quantity']);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Product created successfully.", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create product."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update existing product
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Product ID is required."));
        exit();
    }
    
    $query = "UPDATE products SET 
              category_id = :category_id,
              name = :name,
              slug = :slug,
              description = :description,
              image_url = :image_url,
              price = :price,
              price_currency = :price_currency,
              is_available = :is_available,
              stock_quantity = :stock_quantity
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    // Generate slug from name if not provided
    $slug = isset($data['slug']) ? $data['slug'] : strtolower(str_replace(' ', '-', $data['name']));
    
    $price_currency = isset($data['price_currency']) ? $data['price_currency'] : 'USD';
    
    $stmt->bindParam(':id', $data['id']);
    $stmt->bindParam(':category_id', $data['category_id']);
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':image_url', $data['image_url']);
    $stmt->bindParam(':price', $data['price']);
    $stmt->bindParam(':price_currency', $price_currency);
    $stmt->bindParam(':is_available', $data['is_available']);
    $stmt->bindParam(':stock_quantity', $data['stock_quantity']);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Product updated successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update product."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete product
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Product ID is required."));
        exit();
    }
    
    $query = "DELETE FROM products WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $_GET['id']);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Product deleted successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete product."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
