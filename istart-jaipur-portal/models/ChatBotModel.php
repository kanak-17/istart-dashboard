<?php
class ChatbotModel {
    private $conn;
    private $table_name = "istart_responses";
    private $sessions_table = "chat_sessions";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get answer for a keyword based on attempt number
    public function getAnswer($keyword, $attempt_number = 1) {
        $query = "SELECT answer_text FROM " . $this->table_name . " 
                  WHERE LOWER(keyword) = LOWER(:keyword) 
                  AND answer_number = :attempt_number";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":keyword", $keyword);
        $stmt->bindParam(":attempt_number", $attempt_number);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['answer_text'] : null;
    }

    // Get all available keywords
    public function getAllKeywords() {
        $query = "SELECT DISTINCT keyword FROM " . $this->table_name . " ORDER BY keyword";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $keywords = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $keywords[] = $row['keyword'];
        }
        return $keywords;
    }

    // Check if keyword exists
    public function keywordExists($keyword) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " 
                  WHERE LOWER(keyword) = LOWER(:keyword)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":keyword", $keyword);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['count'] > 0;
    }

    // Get maximum answer number for a keyword
    public function getMaxAnswerNumber($keyword) {
        $query = "SELECT MAX(answer_number) as max_num FROM " . $this->table_name . " 
                  WHERE LOWER(keyword) = LOWER(:keyword)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":keyword", $keyword);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['max_num'] ? (int)$row['max_num'] : 1;
    }

    // Save chat session for analytics
    public function saveChatSession($session_id, $user_query, $bot_response, $attempt_number, $user_satisfied = null) {
        $query = "INSERT INTO " . $this->sessions_table . " 
                  (session_id, user_query, bot_response, attempt_number, user_satisfied, created_at) 
                  VALUES (:session_id, :user_query, :bot_response, :attempt_number, :user_satisfied, NOW())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":session_id", $session_id);
        $stmt->bindParam(":user_query", $user_query);
        $stmt->bindParam(":bot_response", $bot_response);
        $stmt->bindParam(":attempt_number", $attempt_number);
        $stmt->bindParam(":user_satisfied", $user_satisfied);
        
        return $stmt->execute();
    }

    // Update satisfaction status
    public function updateSatisfaction($session_id, $user_query, $user_satisfied) {
        $query = "UPDATE " . $this->sessions_table . " 
                  SET user_satisfied = :user_satisfied 
                  WHERE session_id = :session_id AND user_query = :user_query 
                  ORDER BY created_at DESC LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":session_id", $session_id);
        $stmt->bindParam(":user_query", $user_query);
        $stmt->bindParam(":user_satisfied", $user_satisfied);
        
        return $stmt->execute();
    }
}
