<?php
// Forgot Password API Endpoint
// POST /api/auth/forgot-password

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once '../config/database.php';
include_once '../config/auth.php';

$database = new Database();
$db = $database->getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Rate limit: max 5 reset requests per 15 minutes per IP
    if (!rateLimitAllow('forgot', 5, 900)) {
        http_response_code(429);
        echo json_encode(array(
            "success" => false,
            "message" => "Too many requests. Please try again later."
        ));
        exit();
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!empty($data->email)) {
        try {
            $email = filter_var(trim((string)$data->email), FILTER_SANITIZE_EMAIL);

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(array("message" => "A valid email address is required."));
                exit();
            }

            // Only proceed if the email belongs to a real admin account
            $checkQuery = "SELECT id FROM admin WHERE email = :email";
            $checkStmt = $db->prepare($checkQuery);
            $checkStmt->bindParam(':email', $email);
            $checkStmt->execute();
            $adminExists = (bool)$checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($adminExists) {
                // Generate secure random token — store only its hash
                $token = bin2hex(random_bytes(32));
                $tokenHash = hash('sha256', $token);

                // Set expiration time (1 hour from now)
                $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

                // Clean up old tokens for this email and expired tokens
                $cleanupQuery = "DELETE FROM password_reset_tokens WHERE email = :email OR expires_at < NOW()";
                $cleanupStmt = $db->prepare($cleanupQuery);
                $cleanupStmt->bindParam(':email', $email);
                $cleanupStmt->execute();

                // Insert new reset token (hashed)
                $insertQuery = "INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (:email, :token, :expires_at)";
                $insertStmt = $db->prepare($insertQuery);
                $insertStmt->bindParam(':email', $email);
                $insertStmt->bindParam(':token', $tokenHash);
                $insertStmt->bindParam(':expires_at', $expiresAt);
                $insertStmt->execute();

                // Build reset link from configured site URL (never trust Host header)
                $siteUrl = rtrim(qrs_setting('APP_URL') ?: 'https://qualityrentalservices.com', '/');
                $resetLink = $siteUrl . "/reset-password?token=" . $token;

                $subject = "Password Reset Request - Quality Rentals";
                $message = "
                <html>
                <head>
                <title>Password Reset</title>
                </head>
                <body>
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password for Quality Rentals admin account.</p>
                <p>Click the link below to reset your password:</p>
                <p><a href='" . htmlspecialchars($resetLink) . "'>" . htmlspecialchars($resetLink) . "</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
                </body>
                </html>";

                $headers = "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                $headers .= "From: no-reply@qualityrentalservices.com" . "\r\n";

                // Suppress warnings — mail() failures must not leak paths or break JSON output
                if (!@mail($email, $subject, $message, $headers)) {
                    error_log("Password reset email failed to send for admin request.");
                }
            }

            // Always return success message (security: don't reveal if email exists)
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "If an account exists with this email, a password reset link has been sent."
            ));

        } catch (Exception $e) {
            error_log("Forgot password error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Server error. Please try again later."
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Email is required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
