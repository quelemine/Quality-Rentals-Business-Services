<?php
// Quote Requests API Endpoint
// POST /api/quote-requests - Submit a new quote request with items

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get posted data
    $raw_input = file_get_contents("php://input");
    error_log("Quote Request Raw Input: " . $raw_input);
    $data = json_decode($raw_input);
    error_log("Quote Request Decoded Data: " . print_r($data, true));
    
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
        error_log("Quote Request Validation Passed");
        try {
            // Start transaction
            $db->beginTransaction();
            
            // Insert quote request
            $query = "INSERT INTO quote_requests 
                      (first_name, last_name, email, phone, event_date, duration_days, delivery_type, delivery_address, special_notes, status, contact_method) 
                      VALUES 
                      (:first_name, :last_name, :email, :phone, :event_date, :duration_days, :delivery_type, :delivery_address, :special_notes, 'Pending', :contact_method)";
            
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
            $contact_method = !empty($data->contact_method) ? htmlspecialchars(strip_tags($data->contact_method)) : 'email';
            
            $stmt->bindParam(':first_name', $first_name);
            $stmt->bindParam(':last_name', $last_name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':event_date', $event_date);
            $stmt->bindParam(':duration_days', $duration_days);
            $stmt->bindParam(':delivery_type', $delivery_type);
            $stmt->bindParam(':delivery_address', $delivery_address);
            $stmt->bindParam(':special_notes', $special_notes);
            $stmt->bindParam(':contact_method', $contact_method);
            
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
                
                // Send notification based on contact method
                if ($contact_method === 'whatsapp') {
                    sendWhatsAppNotification($first_name, $last_name, $email, $phone, $event_date, $duration_days, $delivery_type, $delivery_address, $special_notes, $data->items);
                } else {
                    sendEmailNotification($first_name, $last_name, $email, $phone, $event_date, $duration_days, $delivery_type, $delivery_address, $special_notes, $data->items);
                }
                
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

// Email notification function
function sendEmailNotification($firstName, $lastName, $email, $phone, $eventDate, $durationDays, $deliveryType, $deliveryAddress, $specialNotes, $items) {
    $to = "paye.susanna@yahoo.com";
    $subject = "New Quote Request - $firstName $lastName";
    
    $message = "
    <html>
    <head>
    <title>New Quote Request</title>
    </head>
    <body>
    <h2>New Quote Request Received</h2>
    <p><strong>Customer:</strong> $firstName $lastName</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Event Date:</strong> $eventDate</p>
    <p><strong>Duration:</strong> $durationDays day(s)</p>
    <p><strong>Delivery Type:</strong> $deliveryType</p>";
    
    if ($deliveryAddress) {
        $message .= "<p><strong>Delivery Address:</strong> $deliveryAddress</p>";
    }
    
    if ($specialNotes) {
        $message .= "<p><strong>Special Notes:</strong> $specialNotes</p>";
    }
    
    $message .= "<h3>Requested Items:</h3><ul>";
    foreach ($items as $item) {
        $message .= "<li>Product ID: {$item->product_id} - Quantity: {$item->quantity}</li>";
    }
    $message .= "</ul></body></html>";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: no-reply@qualityrentalservices.com" . "\r\n";
    
    mail($to, $subject, $message, $headers);
}

// WhatsApp notification function
function sendWhatsAppNotification($firstName, $lastName, $email, $phone, $eventDate, $durationDays, $deliveryType, $deliveryAddress, $specialNotes, $items) {
    $whatsappNumber = "14013011958"; // (401) 301-1958 without formatting
    
    $message = "*New Quote Request*\n\n";
    $message .= "*Customer:* $firstName $lastName\n";
    $message .= "*Email:* $email\n";
    $message .= "*Phone:* $phone\n";
    $message .= "*Event Date:* $eventDate\n";
    $message .= "*Duration:* $durationDays day(s)\n";
    $message .= "*Delivery Type:* $deliveryType\n";
    
    if ($deliveryAddress) {
        $message .= "*Delivery Address:* $deliveryAddress\n";
    }
    
    if ($specialNotes) {
        $message .= "*Special Notes:* $specialNotes\n";
    }
    
    $message .= "\n*Requested Items:*\n";
    foreach ($items as $item) {
        $message .= "- Product ID: {$item->product_id} - Quantity: {$item->quantity}\n";
    }
    
    $encodedMessage = urlencode($message);
    $whatsappUrl = "https://wa.me/$whatsappNumber?text=$encodedMessage";
    
    // Use cURL to send the WhatsApp message
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $whatsappUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_exec($ch);
    curl_close($ch);
}
?>
