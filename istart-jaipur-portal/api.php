<?php

header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");

require_once "database.php"; // contains $conn

$endpoint = $_GET['endpoint'] ?? '';
$q = $_GET['q'] ?? '';

// Function to send undefined keyword to admin dashboard
function sendUndefinedKeywordToAdmin($keyword) {
    $adminApiUrl = 'http://localhost:8000/api/undefined-keywords.php';
    
    $data = [
        'action' => 'add_undefined',
        'keyword' => $keyword
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data),
            'timeout' => 5
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents($adminApiUrl, false, $context);
    
    // Log the result for debugging
    error_log("Sent undefined keyword '$keyword' to admin. Result: " . $result);
    
    return $result !== false;
}

if ($endpoint === "search") {
    if (empty($q)) {
        echo json_encode(["success" => false, "message" => "No query provided"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM answer WHERE keyword LIKE ?");
    $search = "%" . $q . "%";
    $stmt->bind_param("s", $search);
    $stmt->execute();
    $result = $stmt->get_result();

    $results = [];
    while ($row = $result->fetch_assoc()) {
        $answers = [];
        for ($i = 1; $i <= 4; $i++) {
            if (!empty($row["answer$i"])) {
                $answers[] = $row["answer$i"];
            }
        }
        $results[] = [
            "keyword" => $row["keyword"],
            "answers" => $answers
        ];
    }

    // If no results found, send the keyword to admin dashboard as undefined
    if (empty($results)) {
        sendUndefinedKeywordToAdmin($q);
        echo json_encode([
            "success" => false, 
            "message" => "No results found for this keyword. It has been forwarded to admin for review.",
            "results" => []
        ]);
    } else {
        echo json_encode(["success" => true, "results" => $results]);
    }
    exit;
}

if ($endpoint === "all") {
    $sql = "SELECT * FROM answer";
    $result = $conn->query($sql);

    $keywords = [];
    while ($row = $result->fetch_assoc()) {
        $answers = [];
        for ($i = 1; $i <= 4; $i++) {
            if (!empty($row["answer$i"])) {
                $answers[] = $row["answer$i"];
            }
        }
        $keywords[] = [
            "term" => $row["keyword"],
            "answers" => $answers
        ];
    }

    echo json_encode(["success" => true, "data" => ["keywords" => $keywords]]);
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid endpoint"]);
exit;

?>