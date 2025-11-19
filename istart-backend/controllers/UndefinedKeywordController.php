<?php

require_once '../config/database.php';

class UndefinedKeywordController {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    // Get all undefined keywords
    public function getUndefinedKeywords() {
        $sql = "SELECT * FROM undefined_keywords ORDER BY created_at DESC";
        $result = $this->conn->query($sql);
        
        $keywords = [];
        while ($row = $result->fetch_assoc()) {
            $keywords[] = $row;
        }
        
        return json_encode([
            'success' => true,
            'data' => $keywords
        ]);
    }
    
    // Add undefined keyword
    public function addUndefinedKeyword($keyword) {
        $keyword = trim($keyword);
        
        // Check if keyword already exists
        $checkSql = "SELECT id FROM undefined_keywords WHERE keyword = ?";
        $stmt = $this->conn->prepare($checkSql);
        $stmt->bind_param("s", $keyword);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Update frequency
            $updateSql = "UPDATE undefined_keywords SET frequency = frequency + 1, updated_at = NOW() WHERE keyword = ?";
            $updateStmt = $this->conn->prepare($updateSql);
            $updateStmt->bind_param("s", $keyword);
            $updateStmt->execute();
            
            return json_encode([
                'success' => true,
                'message' => 'Keyword frequency updated'
            ]);
        } else {
            // Insert new keyword
            $insertSql = "INSERT INTO undefined_keywords (keyword, frequency, created_at, updated_at) VALUES (?, 1, NOW(), NOW())";
            $insertStmt = $this->conn->prepare($insertSql);
            $insertStmt->bind_param("s", $keyword);
            
            if ($insertStmt->execute()) {
                return json_encode([
                    'success' => true,
                    'message' => 'Undefined keyword added successfully'
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to add undefined keyword'
                ]);
            }
        }
    }
    
    // Move keyword from undefined to defined (add to main keywords table)
    public function defineKeyword($keywordId, $answers, $manualKeyword = null) {
        $keyword = null;
        
        if ($keywordId) {
            // Get the undefined keyword
            $getSql = "SELECT keyword FROM undefined_keywords WHERE id = ?";
            $getStmt = $this->conn->prepare($getSql);
            $getStmt->bind_param("i", $keywordId);
            $getStmt->execute();
            $result = $getStmt->get_result();
            
            if ($result->num_rows === 0) {
                return json_encode([
                    'success' => false,
                    'message' => 'Undefined keyword not found'
                ]);
            }
            
            $keywordData = $result->fetch_assoc();
            $keyword = $keywordData['keyword'];
        } elseif ($manualKeyword) {
            // Handle manually entered keyword
            $keyword = trim($manualKeyword);
        } else {
            return json_encode([
                'success' => false,
                'message' => 'Either keyword ID or manual keyword is required'
            ]);
        }
        
        // Check if keyword already exists in answer table
        $checkSql = "SELECT keyword FROM answer WHERE keyword = ?";
        $checkStmt = $this->conn->prepare($checkSql);
        $checkStmt->bind_param("s", $keyword);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            return json_encode([
                'success' => false,
                'message' => 'Keyword already exists in database'
            ]);
        }
        
        // Insert into main answer table
        $insertSql = "INSERT INTO answer (keyword, answer1, answer2, answer3, answer4) VALUES (?, ?, ?, ?, ?)";
        $insertStmt = $this->conn->prepare($insertSql);
        
        $answer1 = $answers[0] ?? '';
        $answer2 = $answers[1] ?? '';
        $answer3 = $answers[2] ?? '';
        $answer4 = $answers[3] ?? '';
        
        $insertStmt->bind_param("sssss", $keyword, $answer1, $answer2, $answer3, $answer4);
        
        if ($insertStmt->execute()) {
            // Remove from undefined keywords if it was an undefined keyword
            if ($keywordId) {
                $deleteSql = "DELETE FROM undefined_keywords WHERE id = ?";
                $deleteStmt = $this->conn->prepare($deleteSql);
                $deleteStmt->bind_param("i", $keywordId);
                $deleteStmt->execute();
            }
            
            return json_encode([
                'success' => true,
                'message' => 'Keyword defined successfully'
            ]);
        } else {
            return json_encode([
                'success' => false,
                'message' => 'Failed to define keyword'
            ]);
        }
    }
    
    // Delete undefined keyword
    public function deleteUndefinedKeyword($keywordId) {
        $sql = "DELETE FROM undefined_keywords WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $keywordId);
        
        if ($stmt->execute()) {
            return json_encode([
                'success' => true,
                'message' => 'Undefined keyword deleted successfully'
            ]);
        } else {
            return json_encode([
                'success' => false,
                'message' => 'Failed to delete undefined keyword'
            ]);
        }
    }
}

?>
