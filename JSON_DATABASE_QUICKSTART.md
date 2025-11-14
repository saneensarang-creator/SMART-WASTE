# Local JSON Database - Quick Start

## ⚡ What You Have Now

A **complete login system** that works entirely in your browser using JSON stored in localStorage:
- ✅ No backend server needed
- ✅ No database installation
- ✅ No npm install required
- ✅ Just open HTML and it works!

## 🚀 Quick Test

### 1. Open Your Website
Open `index.html` in your browser

### 2. Click "Login" Button
Click the Login button in the navigation

### 3. Sign Up Test
- Click "Sign Up" tab
- Email: `test@example.com`
- Password: `test123456`
- Confirm: `test123456`
- Click "Sign Up"

### 4. Success!
- See "✓ Account created successfully!"
- Login button changes to "Logout"
- User data saved in browser

### 5. Test Login
- Click "Logout"
- Click "Login"
- Click "Sign In" tab
- Enter your email and password
- Click "Sign In"
- Success!

## 📊 View Your Data

Open browser console (F12) and type:

```javascript
// See all users
console.table(userDB.getAllUsers());

// See login history
console.table(JSON.parse(localStorage.getItem('smartwaste_login_history')));

// See statistics
console.log(userDB.getStats());

// Export all data
console.log(JSON.stringify(userDB.exportDatabase(), null, 2));
```

## 📁 Files Created

```
waste/
├── local-database.js           ← NEW: JSON database module
├── index.html                  ← UPDATED: includes local-database.js
├── script.js                   ← UPDATED: uses JSON database
├── LOCAL_DATABASE_GUIDE.md     ← NEW: Full documentation
└── JSON_DATABASE_QUICKSTART.md ← NEW: This file
```

## 🎯 How It Works

1. **User signs up** → Data stored in localStorage as JSON
2. **Passwords hashed** → Encoded before storage
3. **Login recorded** → Tracked in history
4. **Logout recorded** → Timestamp captured
5. **All local** → No server calls, no internet needed

## 💾 Data Storage

Your data is stored in two localStorage keys:

### `smartwaste_users`
```json
{
  "id": "unique_id",
  "email": "user@example.com",
  "password": "hashed_password",
  "createdAt": "2025-11-13T12:00:00Z",
  "lastLogin": "2025-11-13T15:30:00Z",
  "isActive": true
}
```

### `smartwaste_login_history`
```json
{
  "id": "record_id",
  "userId": "user_id",
  "action": "login",
  "timestamp": "2025-11-13T15:30:00Z",
  "userAgent": "Browser info",
  "ipAddress": "localhost"
}
```

## 🔍 Debug Commands

```javascript
// Create a test user
userDB.registerUser('admin@test.com', 'admin123456');

// List all registered users
userDB.getAllUsers();

// Get specific user
userDB.getUserByEmail('test@example.com');

// Get login history for a user
const user = userDB.getUserByEmail('test@example.com');
userDB.getLoginHistory(user.id);

// Get database size and stats
userDB.getStats();

// Clear everything (warning!)
userDB.clearDatabase();
```

## 🗑️ Clear Data

If you want to reset everything:

```javascript
// In browser console
userDB.clearDatabase();

// Or manually clear localStorage
localStorage.clear();
```

Then reload the page to start fresh.

## 📥 Backup Your Data

```javascript
// In browser console - Save this output
const backup = userDB.exportDatabase();
const json = JSON.stringify(backup, null, 2);
console.log(json);

// Copy the output and save to a file named "backup.json"
```

## 📤 Restore From Backup

If you have a backup.json file:

```javascript
// In browser console
const backupData = {
  "users": [...your data...],
  "history": [...your history...]
};
userDB.importDatabase(backupData);

// Refresh page
location.reload();
```

## 🐛 Troubleshooting

### Sign up shows "Email already registered"
- Email already in database
- Use different email: `test2@example.com`
- Or clear data: `userDB.clearDatabase()`

### "User not found" error
- Email spelling wrong
- Make sure you registered first
- Check case sensitivity

### Data disappeared
- Browser may have cleared localStorage
- Try incognito/private mode was closed
- Check storage quota in DevTools

### Login button always shows "Login"
- Data was cleared
- Sign up again with new email
- Check localStorage in DevTools

## 📱 Browser Storage

Find your data in DevTools:
1. Press F12
2. Go to "Application" tab
3. Click "Local Storage"
4. Find your website domain
5. Look for `smartwaste_users` and `smartwaste_login_history`

## ✨ Features Available

- ✅ Sign up with email and password
- ✅ Sign in with credentials
- ✅ Auto logout when password incorrect
- ✅ Track login history with timestamp
- ✅ Show "Online"/"Offline" status
- ✅ Export/import data
- ✅ View database statistics
- ✅ Works offline completely

## ⚠️ Important Notes

**This is for testing/demo purposes:**
- Passwords are Base64 encoded (not production-secure)
- Data stored in browser (not on server)
- Data lost if browser storage cleared
- Not suitable for sensitive data
- Perfect for prototyping!

## 🔄 Next Steps

### When Ready for Production:
1. Set up a backend server (Node.js)
2. Use proper password hashing (bcryptjs)
3. Store data in database (SQLite/PostgreSQL)
4. Use HTTPS only
5. Implement rate limiting
6. Add email verification

See `DATABASE_SETUP.md` for production setup.

## 📖 Full Documentation

For complete documentation, see:
- **LOCAL_DATABASE_GUIDE.md** - Full API reference
- **DATABASE_SETUP.md** - Backend setup (optional)

## 🎉 You're Ready!

Your authentication system is now:
- ✅ Fully functional
- ✅ No installation needed
- ✅ Works offline
- ✅ Easy to debug
- ✅ Perfect for testing

**Start signing up users now!**

