<?php
// Test script to demonstrate the API functionality
echo "=== iStart Backend API Test ===\n\n";

// Test 1: Add an undefined keyword
echo "1. Testing: Add undefined keyword 'test123'\n";
$data = [
    'action' => 'add_undefined',
    'keyword' => 'test123'
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/api/undefined-keywords.php', false, $context);
echo "Response: " . $result . "\n\n";

// Test 2: Get all undefined keywords
echo "2. Testing: Get all undefined keywords\n";
$result = file_get_contents('http://localhost:8000/api/undefined-keywords.php');
echo "Response: " . $result . "\n\n";

// Test 3: Define the keyword
echo "3. Testing: Define keyword 'test123' with answers\n";
$data = [
    'action' => 'define_keyword',
    'keywordId' => 1, // Assuming the keyword has ID 1
    'answers' => ['This is answer 1', 'This is answer 2', 'This is answer 3', 'This is answer 4']
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/api/undefined-keywords.php', false, $context);
echo "Response: " . $result . "\n\n";

echo "=== Test Complete ===\n";
echo "Check your database to see the results!\n";
?>
