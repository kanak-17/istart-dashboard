<?php

// Database migration script for undefined keywords table
// Run this script to create the necessary table

$host = "localhost";
$user = "root";
$pass = "";
$db = "istart_keyword";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create undefined_keywords table
$sql = "CREATE TABLE IF NOT EXISTS undefined_keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL UNIQUE,
    frequency INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'undefined_keywords' created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Create index for better performance
$indexSql = "CREATE INDEX IF NOT EXISTS idx_keyword ON undefined_keywords(keyword)";
if ($conn->query($indexSql) === TRUE) {
    echo "Index created successfully\n";
} else {
    echo "Error creating index: " . $conn->error . "\n";
}

$conn->close();

echo "Migration completed successfully!\n";

?>
