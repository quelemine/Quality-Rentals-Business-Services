<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once './config/database.php';
include_once './config/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET - fetch all contact messages for admin (contains customer PII)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    requireAdmin();
    try {
        $query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'messages' => $messages,
            'total' => count($messages)
        ]);
    } catch (Exception $e) {
        error_log("Contact messages GET error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error.']);
    }
}

// POST - submit a new contact message
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Spam protection: max 30 messages per 10 minutes per IP
    // (raised for shared/carrier-grade NAT; honeypot + validation do the real filtering)
    if (!rateLimitAllow('contact', 30, 600)) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'));

    // Honeypot: bots fill the hidden 'hp_check' field — pretend success, store nothing
    if (isset($data->hp_check) && trim((string)$data->hp_check) !== '') {
        honeypotDrop('contact');
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
        exit();
    }

    if (empty($data->name) || empty($data->email) || empty($data->subject) || empty($data->message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, email, subject, and message are required.']);
        exit();
    }

    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'A valid email address is required.']);
        exit();
    }

    try {
        $query = "INSERT INTO contact_messages (name, email, phone, subject, message, status)
                  VALUES (:name, :email, :phone, :subject, :message, 'Unread')";
        $stmt = $db->prepare($query);

        $name    = htmlspecialchars(strip_tags($data->name));
        $email   = htmlspecialchars(strip_tags($data->email));
        $phone   = !empty($data->phone)   ? htmlspecialchars(strip_tags($data->phone))   : null;
        $subject = htmlspecialchars(strip_tags($data->subject));
        $message = htmlspecialchars(strip_tags($data->message));

        $stmt->bindParam(':name',    $name);
        $stmt->bindParam(':email',   $email);
        $stmt->bindParam(':phone',   $phone);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
        } else {
            http_response_code(503);
            echo json_encode(['success' => false, 'message' => 'Unable to save message.']);
        }
    } catch (Exception $e) {
        error_log("Contact message POST error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    }
}

// PUT - update message status (Unread → Read, etc.) — admin only
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'));

    if (empty($data->id) || empty($data->status)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID and status are required.']);
        exit();
    }

    try {
        $query = "UPDATE contact_messages SET status = :status WHERE id = :id";
        $stmt  = $db->prepare($query);
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id',     $data->id);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Status updated.']);
    } catch (Exception $e) {
        error_log("Contact status update error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error.']);
    }
}

// DELETE - delete a message — admin only
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    requireAdmin();
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message ID is required.']);
        exit();
    }

    try {
        $query = "DELETE FROM contact_messages WHERE id = :id";
        $stmt  = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Message deleted.']);
    } catch (Exception $e) {
        error_log("Contact delete error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error.']);
    }
}

else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>
