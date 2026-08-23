<?php
// Quote Requests API Endpoint
// POST /api/quote-requests - Submit a new quote request with items

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');

include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if (
        !empty($data->first_name) &&
        !empty($data->last_name) &&
        !empty($data->email) &&
        !empty($data->phone) &&
        !empty($data->event_date) &&
        !empty($data->items) &&
        is_array($data->items)
    ) {
        try {
            // Start transaction
            $db->beginTransaction();
            
            // Insert quote request
            $query = "INSERT INTO quote_requests 
                      (first_name, last_name, email, phone, event_date, duration_days, delivery_type, delivery_address, special_notes, status) 
                      VALUES 
                      (:first_name, :last_name, :email, :phone, :event_date, :duration_days, :delivery_type, :delivery_address, :special_notes, 'Pending')";
            
            $stmt = $db->prepare($query);
            
            // Clean and bind data
            $first_name = htmlspecialchars(strip_tags($data->first_name));
            $last_name = htmlspecialchars(strip_tags($data->last_name));
            $email = htmlspecialchars(strip_tags($data->email));
            $phone = htmlspecialchars(strip_tags($data->phone));
            $event_date = htmlspecialchars(strip_tags($data->event_date));
            $duration_days = !empty($data->duration_days) ? (int)$data->duration_days : 1;
            $delivery_type = !empty($data->delivery_type) ? htmlspecialchars(strip_tags($data->delivery_type)) : 'Self Pickup';
            $delivery_address = !empty($data->delivery_address) ? htmlspecialchars(strip_tags($data->delivery_address)) : null;
            $special_notes = !empty($data->special_notes) ? htmlspecialchars(strip_tags($data->special_notes)) : null;
            
            $stmt->bindParam(':first_name', $first_name);
            $stmt->bindParam(':last_name', $last_name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':event_date', $event_date);
            $stmt->bindParam(':duration_days', $duration_days);
            $stmt->bindParam(':delivery_type', $delivery_type);
            $stmt->bindParam(':delivery_address', $delivery_address);
            $stmt->bindParam(':special_notes', $special_notes);
            
            if ($stmt->execute()) {
                $quote_request_id = $db->lastInsertId();
                
                // Insert quote items
                $item_query = "INSERT INTO quote_items (quote_request_id, product_id, quantity) VALUES (:quote_request_id, :product_id, :quantity)";
                $item_stmt = $db->prepare($item_query);
                
                foreach ($data->items as $item) {
                    $product_id = (int)$item->product_id;
                    $quantity = (int)$item->quantity;
                    
                    $item_stmt->bindParam(':quote_request_id', $quote_request_id);
                    $item_stmt->bindParam(':product_id', $product_id);
                    $item_stmt->bindParam(':quantity', $quantity);
                    $item_stmt->execute();
                }
                
                // Commit transaction
                $db->commit();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Quote request submitted successfully.",
                    "quote_request_id" => $quote_request_id
                ));
            } else {
                $db->rollBack();
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create quote request."));
            }
        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(array("message" => "Server error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Incomplete data. Please provide all required fields."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
