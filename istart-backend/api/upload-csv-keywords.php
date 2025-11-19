<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check if file was uploaded
        if (!isset($_FILES['csv_file']) || $_FILES['csv_file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('No file uploaded or upload error');
        }

        $file = $_FILES['csv_file'];
        
        // Validate file type
        $fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($fileType !== 'csv') {
            throw new Exception('Only CSV files are allowed');
        }

        // Open and read CSV file
        $handle = fopen($file['tmp_name'], 'r');
        if ($handle === false) {
            throw new Exception('Failed to open CSV file');
        }

        $successCount = 0;
        $errorCount = 0;
        $errors = [];
        $lineNumber = 0;

        // Skip header row if exists
        $firstLine = fgetcsv($handle);
        
        // Check if first line is a header
        $isHeader = false;
        if ($firstLine) {
            $firstLineStr = strtolower(implode(',', $firstLine));
            if (strpos($firstLineStr, 'keyword') !== false || strpos($firstLineStr, 'answer') !== false) {
                $isHeader = true;
            } else {
                // Process first line as data
                $lineNumber++;
                $result = processCSVLine($firstLine, $conn, $lineNumber);
                if ($result['success']) {
                    $successCount++;
                } else {
                    $errorCount++;
                    $errors[] = $result['error'];
                }
            }
        }

        // Process remaining lines
        while (($data = fgetcsv($handle)) !== false) {
            $lineNumber++;
            
            // Skip empty lines
            if (empty(array_filter($data))) {
                continue;
            }

            $result = processCSVLine($data, $conn, $lineNumber);
            if ($result['success']) {
                $successCount++;
            } else {
                $errorCount++;
                $errors[] = $result['error'];
            }
        }

        fclose($handle);

        echo json_encode([
            'success' => true,
            'message' => "CSV processed successfully",
            'stats' => [
                'total_processed' => $successCount + $errorCount,
                'successful' => $successCount,
                'failed' => $errorCount
            ],
            'errors' => $errors
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

function processCSVLine($data, $conn, $lineNumber) {
    try {
        // Expected CSV format: keyword, answer1, answer2, answer3, answer4
        // Minimum: keyword, answer1
        
        if (count($data) < 2) {
            return [
                'success' => false,
                'error' => "Line $lineNumber: Insufficient data (need at least keyword and one answer)"
            ];
        }

        $keyword = trim($data[0]);
        
        // Validate keyword
        if (empty($keyword)) {
            return [
                'success' => false,
                'error' => "Line $lineNumber: Keyword cannot be empty"
            ];
        }

        // Collect answers (up to 4)
        $answer1 = isset($data[1]) && !empty(trim($data[1])) ? trim($data[1]) : null;
        $answer2 = isset($data[2]) && !empty(trim($data[2])) ? trim($data[2]) : null;
        $answer3 = isset($data[3]) && !empty(trim($data[3])) ? trim($data[3]) : null;
        $answer4 = isset($data[4]) && !empty(trim($data[4])) ? trim($data[4]) : null;

        if ($answer1 === null) {
            return [
                'success' => false,
                'error' => "Line $lineNumber: At least one answer is required"
            ];
        }

        // Check if keyword already exists
        $checkStmt = $conn->prepare("SELECT keyword FROM answer WHERE keyword = ?");
        $checkStmt->bind_param("s", $keyword);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $checkStmt->close();
            return [
                'success' => false,
                'error' => "Line $lineNumber: Keyword '$keyword' already exists"
            ];
        }
        $checkStmt->close();

        // Insert keyword with answers
        $insertStmt = $conn->prepare("
            INSERT INTO answer (keyword, answer1, answer2, answer3, answer4) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $insertStmt->bind_param("sssss", $keyword, $answer1, $answer2, $answer3, $answer4);
        
        if (!$insertStmt->execute()) {
            $insertStmt->close();
            return [
                'success' => false,
                'error' => "Line $lineNumber: Database error - " . $conn->error
            ];
        }
        
        $insertStmt->close();

        return [
            'success' => true,
            'message' => "Line $lineNumber: Added keyword '$keyword'"
        ];

    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => "Line $lineNumber: " . $e->getMessage()
        ];
    }
}
?>