<?php

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../controllers/UndefinedKeywordController.php';

$controller = new UndefinedKeywordController($conn);

$method = $_SERVER['REQUEST_METHOD'];
$request = json_decode(file_get_contents('php://input'), true);


// Log the request for debugging
error_log("API Request: " . $method . " - " . json_encode($request));

try {
    switch ($method) {
        case 'GET':
            echo $controller->getUndefinedKeywords();
            break;
            
        case 'POST':
            if (isset($request['action'])) {
                switch ($request['action']) {
                    case 'add_undefined':
                        if (isset($request['keyword'])) {
                            echo $controller->addUndefinedKeyword($request['keyword']);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Keyword is required']);
                        }
                        break;
                        
                    case 'define_keyword':
                        if (isset($request['answers'])) {
                            echo $controller->defineKeyword($request['keywordId'] ?? null, $request['answers'], $request['keyword'] ?? null);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Answers are required']);
                        }
                        break;
                        
                    default:
                        echo json_encode(['success' => false, 'message' => 'Invalid action']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Action is required']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                echo $controller->deleteUndefinedKeyword($_GET['id']);
            } else {
                echo json_encode(['success' => false, 'message' => 'ID is required']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

?>
