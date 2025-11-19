<?php
// Simple PHP development server for the backend API
// This will run the backend API on port 8000

echo "Starting iStart Backend API Server...\n";
echo "API will be available at: http://localhost:8000\n";
echo "Endpoints:\n";
echo "  GET  /api/undefined-keywords.php - Get all undefined keywords\n";
echo "  POST /api/undefined-keywords.php - Add/define keywords\n";
echo "  DELETE /api/undefined-keywords.php?id=X - Delete undefined keyword\n";
echo "\nPress Ctrl+C to stop the server\n";
echo "=====================================\n\n";

// Change to the backend directory
chdir(__DIR__);

// Start the PHP development server
$command = 'php -S localhost:8000 -t .';
passthru($command);
?>
