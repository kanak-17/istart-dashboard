<?php
// Simple test to check if the API is working
echo "Testing API endpoints...\n\n";

// Test 1: Add undefined keyword
echo "1. Adding undefined keyword 'istart'...\n";
$data = [
    'action' => 'add_undefined',
    'keyword' => 'istart'
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data),
        'timeout' => 10
    ]
];

$context = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/api/undefined-keywords.php', false, $context);

if ($result === false) {
    echo "ERROR: Could not connect to API server!\n";
    echo "Make sure the server is running on port 8000\n";
} else {
    echo "Response: " . $result . "\n";
}

echo "\n2. Getting all undefined keywords...\n";
$result = file_get_contents('http://localhost:8000/api/undefined-keywords.php');
if ($result === false) {
    echo "ERROR: Could not get undefined keywords!\n";
} else {
    echo "Response: " . $result . "\n";
}

echo "\nTest complete!\n";
?>
