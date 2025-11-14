# Local JSON Database for Login - Complete Guide

## Overview

A **client-side only** user authentication system using JSON stored in browser's localStorage. No backend server or database installation required!

## ✅ Features

- ✓ **No Server Needed** - Works entirely in the browser
- ✓ **No Database** - Uses browser localStorage
- ✓ **JSON Format** - Easy to backup and export
- ✓ **Password Hashing** - Base64 encoding (for demo)
- ✓ **Login History** - Track every login/logout
- ✓ **User Management** - Create, read, delete users
- ✓ **Data Export** - Export all data as JSON
- ✓ **Data Import** - Import from JSON backup

## How It Works

### Data Storage
User data is stored in browser's localStorage in JSON format:

```json
{
  "smartwaste_users": [
    {
      "id": "abc123def",
      "email": "user@example.com",
      "password": "base64_encoded_password",
      "createdAt": "2025-11-13T12:00:00Z",
      "lastLogin": "2025-11-13T15:30:00Z",
      "isActive": true
    }
  ],
  "smartwaste_login_history": [
    {
      "id": "xyz789",
      "userId": "abc123def",
      "action": "login",
      "timestamp": "2025-11-13T15:30:00Z",
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "localhost"
    }
  ]
}
```

### Authentication Flow

1. **User fills sign-up form** with email and password
2. **local-database.js** validates input and stores user
3. **Password is hashed** before storage
4. **Login history recorded** automatically
5. **User data saved** to localStorage
6. **Navigation updated** to show logout button

## Setup Instructions

### 1. Include the Database File
The `local-database.js` file is already included in `index.html`:
```html
<script src="local-database.js"></script>
<script src="script.js"></script>
```

### 2. No Installation Needed!
- No npm install
- No backend server
- No database setup
- Just open the HTML in a browser

## Using the Database

### From Browser Console

```javascript
// Register a new user
userDB.registerUser('user@example.com', 'password123');

// Login user
userDB.verifyUser('user@example.com', 'password123');

// Get all users
userDB.getAllUsers();

// Get login history
userDB.getLoginHistory('user_id');

// Get database stats
userDB.getStats();

// Export database as JSON
const backup = userDB.exportDatabase();
console.log(JSON.stringify(backup, null, 2));
```

### Available Methods

#### Registration
```javascript
userDB.registerUser(email, password)
// Returns: { id, email, createdAt }
// Throws: Error if email already exists
```

#### Login
```javascript
userDB.verifyUser(email, password)
// Returns: { id, email, createdAt }
// Throws: Error if invalid credentials
```

#### Get User Data
```javascript
userDB.getUserById(userId)
userDB.getUserByEmail(email)
userDB.getAllUsers()
```

#### Login History
```javascript
userDB.getLoginHistory(userId, limit = 10)
// Returns array of login records
```

#### Account Management
```javascript
userDB.deleteUser(userId)          // Soft delete
userDB.updateLastLogin(userId)     // Update timestamp
userDB.recordLoginHistory(userId, action)
userDB.recordLogout(userId)
```

#### Database Management
```javascript
userDB.exportDatabase()            // Export as JSON
userDB.importDatabase(data)        // Import from JSON
userDB.getStats()                  // Get usage stats
userDB.clearDatabase()             // Clear all data
```

## Testing the Authentication

### Step 1: Open Website
Open your `index.html` in a browser

### Step 2: Click Login
Click the "Login" button in the navigation bar

### Step 3: Sign Up
- Switch to "Sign Up" tab
- Enter: `test@example.com`
- Password: `password123`
- Confirm: `password123`
- Click "Sign Up"

### Step 4: See It Work
- You'll see success message
- Login button becomes "Logout"
- Try logging out and back in
- Check browser console for database state

## Viewing Stored Data

### In Browser Console (F12)
```javascript
// View all users
console.table(userDB.getAllUsers());

// View login history
console.table(JSON.parse(localStorage.getItem('smartwaste_login_history')));

// View storage statistics
console.log(userDB.getStats());
```

### In Browser DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Find your domain
5. Look for `smartwaste_users` and `smartwaste_login_history` keys

## Data Backup & Restore

### Export Database
```javascript
// In browser console
const backup = userDB.exportDatabase();
const json = JSON.stringify(backup, null, 2);
console.log(json);
// Copy and save to a file
```

### Import Database
```javascript
// In browser console
const backupData = {
  "users": [...],
  "history": [...],
  "exportedAt": "2025-11-13T12:00:00Z"
};
userDB.importDatabase(backupData);
```

## Storage Limits

- **localStorage limit**: ~5-10MB per domain (varies by browser)
- **Current data size**: Very small (check with `userDB.getStats()`)
- **Supports**: Hundreds of users with history

## Security Notes

⚠️ **Important**: This is a **DEMO implementation**

- Passwords are Base64 encoded (not cryptographically secure)
- Data is stored in browser (vulnerable if device compromised)
- Not suitable for sensitive production systems
- For production, always use a backend server with proper encryption

### For Production:
- Use proper password hashing (bcrypt)
- Encrypt data at rest
- Use HTTPS only
- Implement rate limiting
- Add email verification
- Use JWT tokens

## Troubleshooting

### "Email already registered"
- The email is already in the database
- Use a different email or clear localStorage

### "User not found"
- Check email spelling
- Make sure user was registered first

### Data not persisting
- Check browser localStorage is enabled
- Try a different browser (privacy mode disables storage)
- Check storage quota hasn't been exceeded

### Clear All Data
```javascript
// In browser console
userDB.clearDatabase();
// Or manually:
localStorage.clear();
```

## Test Accounts

Pre-populated test accounts (if you add them):
```javascript
userDB.registerUser('demo@test.com', 'demo123');
userDB.registerUser('admin@test.com', 'admin123');
```

## Browser Compatibility

✓ Chrome 5+
✓ Firefox 3.5+
✓ Safari 4+
✓ Edge 12+
✓ IE 8+
✓ Mobile browsers

## Advantages

✅ No server setup needed
✅ Fast (no network calls)
✅ Works offline
✅ Easy debugging
✅ Perfect for demos/testing
✅ No licensing costs
✅ Data always under your control

## Limitations

❌ Data lost when browser storage cleared
❌ Not suitable for production
❌ Limited security
❌ Data not synced across devices
❌ Can't share data between users easily

## Next Steps

1. **Test the system** - Sign up and log in
2. **View the data** - Use browser console
3. **Export backup** - Save your data
4. **Check history** - See login tracking
5. **Plan migration** - Move to backend when ready

## File Structure

```
waste/
├── local-database.js       ← JSON database module
├── index.html              ← Includes local-database.js
├── script.js               ← Uses userDB object
└── styles.css
```

## API Endpoints (for reference only)

The following methods are available but don't make network calls:

- `userDB.registerUser(email, password)` - Local only
- `userDB.verifyUser(email, password)` - Local only  
- `userDB.getLoginHistory(userId)` - Local only
- `userDB.exportDatabase()` - Local only

All operations are **100% client-side**!

---

## Summary

Your SMART WASTE application now has a **complete, working authentication system** that requires:
- ✅ No backend server
- ✅ No database installation
- ✅ No npm modules
- ✅ No external dependencies

Just open the website and start signing up users! 🎉

