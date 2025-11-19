<?php
// Check database structure and fix issues
echo "=== Database Structure Check ===\n";

$host = "localhost";
$user = "root";
$pass = "";
$db = "istart_keyword";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo "Database connection failed: " . $conn->connect_error . "\n";
    exit;
}

// Check answer table structure
echo "1. Checking answer table structure:\n";
$result = $conn->query("DESCRIBE answer");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "   " . $row['Field'] . " - " . $row['Type'] . "\n";
    }
} else {
    echo "   Error: " . $conn->error . "\n";
}

// Check if answer table has id column
echo "\n2. Checking if answer table has id column:\n";
$result = $conn->query("SHOW COLUMNS FROM answer LIKE 'id'");
if ($result->num_rows > 0) {
    echo "   answer table HAS id column\n";
} else {
    echo "   answer table does NOT have id column\n";
    echo "   Adding id column...\n";
    
    $sql = "ALTER TABLE answer ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST";
    if ($conn->query($sql) === TRUE) {
        echo "   id column added successfully!\n";
    } else {
        echo "   Error adding id column: " . $conn->error . "\n";
    }
}

// Check sample data in answer table
echo "\n3. Sample data in answer table:\n";
$result = $conn->query("SELECT * FROM answer LIMIT 3");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "   " . json_encode($row) . "\n";
    }
} else {
    echo "   No data in answer table\n";
}

// Check undefined_keywords table
echo "\n4. Sample data in undefined_keywords table:\n";
$result = $conn->query("SELECT * FROM undefined_keywords LIMIT 3");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "   " . json_encode($row) . "\n";
    }
} else {
    echo "   No data in undefined_keywords table\n";
}

$conn->close();
echo "\n=== Check Complete ===\n";
?>



