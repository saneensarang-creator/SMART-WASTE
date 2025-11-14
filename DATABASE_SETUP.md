# Database Setup Guide for SMART WASTE

## Overview
This guide explains how to set up and use the user authentication database for the SMART WASTE application.

## Prerequisites
- Node.js (v14 or higher)
- npm

## Installation

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `sqlite3` - SQLite database
- `bcryptjs` - Password hashing
- `express` - Web server
- `cors` - Cross-origin requests
- `body-parser` - Request parsing
- `twilio` - SMS service (optional)

### 2. Initialize Database
```bash
node setup-database.js
```

This creates:
- `smartwaste_users.db` - SQLite database file
- `users` table - Stores user credentials
- `login_history` table - Tracks login/logout activity

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,              -- hashed with bcryptjs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active INTEGER DEFAULT 1          -- soft delete
)
```

### Login History Table
```sql
CREATE TABLE login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## API Endpoints

### 1. Sign Up (Register)
**POST** `/api/sign-up`

Request:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "success": true,
    "message": "Account created successfully",
    "user": {
        "id": 1,
        "email": "user@example.com"
    }
}
```

### 2. Sign In (Login)
**POST** `/api/sign-in`

Request:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "success": true,
    "message": "Signed in successfully",
    "user": {
        "id": 1,
        "email": "user@example.com"
    },
    "sessionId": 5
}
```

### 3. Get User Profile
**GET** `/api/user/:userId`

Response:
```json
{
    "success": true,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "created_at": "2025-11-13T10:30:00Z",
        "last_login": "2025-11-13T15:45:00Z"
    }
}
```

### 4. Get Login History
**GET** `/api/login-history/:userId?limit=10`

Response:
```json
{
    "success": true,
    "history": [
        {
            "id": 5,
            "user_id": 1,
            "login_time": "2025-11-13T15:45:00Z",
            "logout_time": "2025-11-13T16:00:00Z",
            "ip_address": "192.168.1.1",
            "user_agent": "Mozilla/5.0..."
        }
    ]
}
```

### 5. Logout
**POST** `/api/logout`

Request:
```json
{
    "sessionId": 5
}
```

Response:
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### 6. Delete Account
**DELETE** `/api/account/:userId`

Response:
```json
{
    "success": true,
    "message": "Account deleted successfully"
}
```

### 7. Get All Users (Admin)
**GET** `/api/users/all`

Response:
```json
{
    "success": true,
    "count": 5,
    "users": [
        {
            "id": 1,
            "email": "user@example.com",
            "created_at": "2025-11-13T10:30:00Z",
            "last_login": "2025-11-13T15:45:00Z"
        }
    ]
}
```

## Running the Server

### Development (with auto-restart)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server will run on `http://localhost:5000`

## Frontend Integration

Update your `script.js` to use the API endpoints. The auth functions are already set up to call these endpoints:

```javascript
// Sign up
const response = await fetch('http://localhost:5000/api/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

// Sign in
const response = await fetch('http://localhost:5000/api/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
```

## Security Features

- ✓ Passwords hashed with bcryptjs (salted with 10 rounds)
- ✓ Email uniqueness constraint
- ✓ Login history tracking with IP and user agent
- ✓ Soft delete for users (is_active flag)
- ✓ Input validation
- ✓ CORS protection
- ✓ Error handling and logging

## Database File Location

- **File**: `smartwaste_users.db`
- **Location**: Project root directory
- **Size**: Grows as users register

## Backing Up Data

```bash
# Create a backup
cp smartwaste_users.db smartwaste_users.db.backup

# View database
sqlite3 smartwaste_users.db

# Example queries
# List all users
SELECT email, created_at, last_login FROM users;

# View login history
SELECT * FROM login_history WHERE user_id = 1;
```

## Troubleshooting

### Database file not found
- Run `node setup-database.js` to create the database

### Password not working
- Passwords are hashed and cannot be plaintext compared
- Always use the `/api/sign-in` endpoint for verification

### Email already registered error
- Use a different email for testing
- Or delete the database and run setup again

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## Notes

- Never commit `smartwaste_users.db` to version control (add to `.gitignore`)
- For production, consider migrating to PostgreSQL or MySQL
- Implement rate limiting for login attempts
- Consider adding email verification
- Use HTTPS in production
- Store JWT tokens or session tokens for persistent auth

