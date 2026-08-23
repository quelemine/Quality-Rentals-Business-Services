<?php
// Categories API Endpoint
// GET /api/categories - Fetch all categories
// GET /api/categories?id=X - Fetch single category
// POST /api/categories - Create new category
// PUT /api/categories - Update existing category
// DELETE /api/categories?id=X - Delete category

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
    // Check if requesting single category
    if (isset($_GET['id'])) {
        $query = "SELECT id, name, slug, icon_name FROM categories WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $_GET['id']);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Category not found."));
        }
    } 
    // Fetch all categories
    else {
        $query = "SELECT id, name, slug, icon_name FROM categories ORDER BY id";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $categories = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $categories[] = $row;
        }
        
        echo json_encode($categories);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new category
    $data = json_decode(file_get_contents('php://input'), true);
    
    $query = "INSERT INTO categories (name, slug, icon_name) 
              VALUES (:name, :slug, :icon_name)";
    
    $stmt = $db->prepare($query);
    
    // Generate slug from name if not provided
    $slug = isset($data['slug']) ? $data['slug'] : strtolower(str_replace(' ', '-', $data['name']));
    
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':icon_name', $data['icon_name']);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Category created successfully.", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create category."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update existing category
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Category ID is required."));
        exit();
    }
    
    $query = "UPDATE categories SET 
              name = :name,
              slug = :slug,
              icon_name = :icon_name
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    // Generate slug from name if not provided
    $slug = isset($data['slug']) ? $data['slug'] : strtolower(str_replace(' ', '-', $data['name']));
    
    $stmt->bindParam(':id', $data['id']);
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':icon_name', $data['icon_name']);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Category updated successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update category."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete category
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Category ID is required."));
        exit();
    }
    
    // First, update products in this category to have no category (or delete them)
    // For now, we'll set their category_id to NULL
    $updateProducts = "UPDATE products SET category_id = NULL WHERE category_id = :id";
    $updateStmt = $db->prepare($updateProducts);
    $updateStmt->bindParam(':id', $_GET['id']);
    $updateStmt->execute();
    
    // Then delete the category
    $query = "DELETE FROM categories WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $_GET['id']);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Category deleted successfully."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete category."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
