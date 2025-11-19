<?php
// Test defining a keyword
echo "Testing keyword definition...\n";

$data = [
    'action' => 'define_keyword',
    'keyword' => 'test123',
    'answers' => ['This is answer 1', 'This is answer 2', 'This is answer 3', 'This is answer 4']
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

echo "Define keyword result: " . $result . "\n";

// Test searching for the keyword
echo "\nTesting search for 'test123'...\n";
$searchResult = file_get_contents('http://localhost/istart-jaipur-portal/api.php?endpoint=search&q=test123');
echo "Search result: " . $searchResult . "\n";
?>



