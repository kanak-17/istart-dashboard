<?php
// Setup script to initialize the database
echo "Setting up iStart Backend Database...\n";

// Run the migration
include 'migrations/create_undefined_keywords_table.php';

echo "\nSetup completed successfully!\n";
echo "You can now:\n";
echo "1. Start your web server (XAMPP/WAMP)\n";
echo "2. Access the admin dashboard at: http://localhost/istart\n";
echo "3. Test the chatbot at: http://localhost/istart-jaipur-portal\n";
echo "4. Backend API is available at: http://localhost/istart-backend/api/\n";
?>
