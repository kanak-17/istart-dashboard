# iStart Chatbot Integration

This project connects the istart-jaipur-portal (keyword chatbot) with the istart admin dashboard to handle undefined keywords.

## Project Structure

- `istart/` - React admin dashboard frontend
- `istart-jaipur-portal/` - PHP chatbot portal
- `istart-backend/` - PHP backend API for admin dashboard

## Setup Instructions

### 1. Database Setup
1. Start XAMPP/WAMP server
2. Create database `istart_keyword` in phpMyAdmin
3. Run the migration script:
   ```bash
   php istart-backend/setup.php
   ```

### 2. Frontend Setup
1. Install dependencies for React app:
   ```bash
   cd istart
   npm install
   npm start
   ```

2. Install dependencies for portal:
   ```bash
   cd istart-jaipur-portal
   npm install
   npm start
   ```

### 3. Backend Setup
1. Place `istart-backend` folder in your web server root (htdocs for XAMPP)
2. Ensure PHP is enabled and MySQL is running

## How It Works

1. **User searches for keyword** in istart-jaipur-portal
2. **If keyword not found** in database, it's automatically sent to admin dashboard
3. **Admin sees undefined keyword** in the "User Keywords" section
4. **Admin adds response** using the "Add Keywords" form
5. **Keyword is moved** from undefined to defined keywords table
6. **Next time user searches** the same keyword, they get the response

## API Endpoints

### Backend API (`istart-backend/api/undefined-keywords.php`)

- `GET` - Get all undefined keywords
- `POST` with action `add_undefined` - Add undefined keyword
- `POST` with action `define_keyword` - Move keyword to defined table
- `DELETE` with id parameter - Delete undefined keyword

### Portal API (`istart-jaipur-portal/api.php`)

- `GET ?endpoint=search&q=keyword` - Search for keyword
- `GET ?endpoint=all` - Get all keywords

## Database Tables

### `answer` table (existing)
- `keyword` - The search term
- `answer1`, `answer2`, `answer3`, `answer4` - Response options

### `undefined_keywords` table (new)
- `id` - Primary key
- `keyword` - The undefined keyword
- `frequency` - How many times it was searched
- `created_at` - When first searched
- `updated_at` - Last search time

## Testing the Integration

1. Start all services (React apps, web server)
2. Search for a non-existent keyword in the portal
3. Check admin dashboard "User Keywords" section
4. Add a response for the undefined keyword
5. Search for the same keyword again - should now return the response
