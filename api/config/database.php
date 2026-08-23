<?php
// Database Configuration
// MySQL PDO Connection for Quality Rental Services

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $env = getenv('APP_ENV') ?: 'development';
        
        // In production, require environment variables
        if ($env === 'production') {
            $this->host = getenv('DB_HOST');
            $this->db_name = getenv('DB_NAME');
            $this->username = getenv('DB_USER');
            $this->password = getenv('DB_PASSWORD');
            
            if (!$this->host || !$this->db_name || !$this->username) {
                die('Error: Required database environment variables (DB_HOST, DB_NAME, DB_USER) are not set in production mode.');
            }
        } else {
            // Development mode with safe defaults
            $this->host = getenv('DB_HOST') ?: 'localhost';
            $this->db_name = getenv('DB_NAME') ?: 'quality_rentals';
            $this->username = getenv('DB_USER') ?: 'root';
            $this->password = getenv('DB_PASSWORD') ?: '';
        }
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            if (getenv('APP_ENV') === 'production') {
                die('Database connection failed. Please check your configuration.');
            } else {
                echo "Connection error: " . $exception->getMessage();
            }
        }
        
        return $this->conn;
    }
}
?>
