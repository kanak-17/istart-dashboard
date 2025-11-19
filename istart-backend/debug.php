<?php
// Debug script to test database connection and API
echo "=== Debug Script ===\n";

// Test database connection
$host = "localhost";
$user = "root";
$pass = "";
$db = "istart_keyword";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo "Database connection failed: " . $conn->connect_error . "\n";
    exit;
} else {
    echo "Database connection successful!\n";
}

// Test if undefined_keywords table exists
$result = $conn->query("SHOW TABLES LIKE 'undefined_keywords'");
if ($result->num_rows > 0) {
    echo "undefined_keywords table exists!\n";
} else {
    echo "undefined_keywords table does NOT exist!\n";
    echo "Creating table...\n";
    
    $sql = "CREATE TABLE IF NOT EXISTS undefined_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL UNIQUE,
        frequency INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === TRUE) {
        echo "Table created successfully!\n";
    } else {
        echo "Error creating table: " . $conn->error . "\n";
    }
}

// Test if answer table exists
$result = $conn->query("SHOW TABLES LIKE 'answer'");
if ($result->num_rows > 0) {
    echo "answer table exists!\n";
} else {
    echo "answer table does NOT exist!\n";
}

$conn->close();
echo "=== Debug Complete ===\n";
?>
