<?php
// Database Configuration
// MySQL PDO Connection for Quality Rental Services

// Load the gitignored local.php once (or the file named by QRS_LOCAL_CONFIG,
// which may live OUTSIDE public_html). Environment variables always win over
// values stored in the file.
function qrs_local_config() {
    static $cfg = null;
    if ($cfg === null) {
        $cfg = [];
        $file = getenv('QRS_LOCAL_CONFIG') ?: __DIR__ . '/local.php';
        if (is_file($file)) {
            $local = require $file;
            if (is_array($local)) {
                $cfg = $local;
            }
        }
    }
    return $cfg;
}

// Read a setting: env var first, then local.php key of the same name.
function qrs_setting($key, $default = null) {
    $env = getenv($key);
    if ($env !== false && $env !== '') {
        return $env;
    }
    $local = qrs_local_config();
    return $local[$key] ?? $default;
}

// Allowed browser origins for CORS. Same-origin requests don't use CORS at all —
// this only governs cross-origin callers. Configure via APP_URL and/or
// CORS_ORIGINS (env vars or keys in local.php).
function qrs_allowed_origins() {
    $origins = ['http://localhost:3000', 'http://localhost', 'http://127.0.0.1:3000',
                'https://suerental.com', 'https://www.suerental.com'];

    $corsEnv = qrs_setting('CORS_ORIGINS');
    if ($corsEnv) {
        foreach (explode(',', $corsEnv) as $o) {
            $o = trim($o);
            if ($o !== '') $origins[] = $o;
        }
    }

    $appUrl = qrs_setting('APP_URL');
    if ($appUrl) {
        $scheme = parse_url($appUrl, PHP_URL_SCHEME) ?: 'https';
        $host = parse_url($appUrl, PHP_URL_HOST);
        $port = parse_url($appUrl, PHP_URL_PORT);
        if ($host) {
            $origins[] = $scheme . '://' . $host . ($port ? ':' . $port : '');
        }
    }

    return array_unique($origins);
}

// Endpoints set a wildcard ACAO header before including this file — remove it
// and only re-issue CORS headers for explicitly allowed origins.
header_remove('Access-Control-Allow-Origin');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, qrs_allowed_origins(), true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
        // Credentials: env vars (DB_HOST/DB_NAME/DB_USER/DB_PASSWORD) win,
        // then local.php keys 'host'/'name'/'user'/'password', then safe
        // localhost defaults with NO real credentials.
        $local = qrs_local_config();

        // local.php uses lowercase keys for DB credentials and the same names
        // as the env vars (APP_URL, CORS_ORIGINS, TRUSTED_PROXIES) for settings.
        $this->host     = getenv('DB_HOST')     ?: ($local['host']     ?? 'localhost');
        $this->db_name  = getenv('DB_NAME')     ?: ($local['name']     ?? 'quality_rentals');
        $this->username = getenv('DB_USER')     ?: ($local['user']     ?? 'root');
        $envPass = getenv('DB_PASSWORD');
        $this->password = ($envPass !== false) ? $envPass : ($local['password'] ?? '');
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
            // Log details server-side only — never leak DB info to clients
            error_log("Database connection error: " . $exception->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(array("success" => false, "message" => "Service temporarily unavailable."));
            exit();
        }

        return $this->conn;
    }
}
?>
