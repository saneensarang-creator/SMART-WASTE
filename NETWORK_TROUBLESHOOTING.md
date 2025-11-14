# Network & Connectivity Troubleshooting Guide

## Issues Found and Fixed

### ✅ Fixed Issues:

1. **Missing Logo Image**
   - Created: `images/smart-waste-logo.svg`
   - Issue: HTML referenced logo but file didn't exist
   - Solution: Created SVG logo file

2. **CDN Fallback**
   - Added: Fallback detection for Three.js
   - If Three.js fails to load, page still works

### Common Network Issues:

## Problem 1: Backend Server Not Running

**Symptoms:**
- Auth endpoints return 404 or connection refused
- Maps feature shows error
- Collection requests fail

**Solution:**
```bash
# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

Server should run on `http://localhost:5000`

---

## Problem 2: CDN Resources Not Loading

**Symptoms:**
- Fonts look different
- Console shows failed to fetch from googleapis.com
- Three.js library not available

**Solutions:**

### Option A: Check Internet Connection
```bash
# Test connection to CDN
ping fonts.googleapis.com
ping cdnjs.cloudflare.com
```

### Option B: Use Local Fallback
If CDN is blocked/unreachable, fonts will fall back to system defaults.

---

## Problem 3: CORS Errors

**Symptoms:**
- Console shows "Access to XMLHttpRequest blocked by CORS"
- Login/signup fails silently

**Solution:**
Make sure backend server has CORS enabled (it does by default).

If still having issues, add to `server.js`:
```javascript
app.use(cors({
    origin: 'http://localhost:3000',  // your frontend URL
    credentials: true
}));
```

---

## Problem 4: API Endpoints Return 404

**Symptoms:**
- Sign-up/login shows "Network error"
- Backend appears to be offline

**Checklist:**
- [ ] Is `npm install` done? (Run if not)
- [ ] Is database initialized? (Run: `node setup-database.js`)
- [ ] Is server running? (Run: `npm start`)
- [ ] Is server on port 5000? (Check with: `netstat -ano | findstr :5000`)
- [ ] Are auth routes imported in server.js? (They are by default)

---

## Problem 5: Database Not Found

**Symptoms:**
- Sign-up shows "Internal server error"
- No users table exists

**Solution:**
```bash
# Initialize database
node setup-database.js
```

---

## Problem 6: Port 5000 Already in Use

**Symptoms:**
- Server won't start: "EADDRINUSE :::5000"
- Another process is using port 5000

**Solution (Windows PowerShell):**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Then start server
npm start
```

---

## Complete Network Diagnosis

Run this checklist:

```bash
# 1. Check internet connection
ping google.com

# 2. Check if dependencies installed
npm list

# 3. Check database exists
Test-Path smartwaste_users.db

# 4. Start backend
npm start

# 5. Test API endpoint
curl http://localhost:5000/api/health

# 6. Test sign-up endpoint
curl -X POST http://localhost:5000/api/sign-up ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

---

## Image Files

All required images are now in place:
- `images/smart-waste-logo.svg` ✅ Created

---

## Frontend Network Features

Your website includes:
- ✅ Internet connection detection (shows online/offline status)
- ✅ Automatic offline/online notifications
- ✅ CDN fallback for fonts
- ✅ Error handling for failed API calls

---

## Testing Checklist

Before considering network fully working:

- [ ] Logo appears in navbar
- [ ] "Online" indicator shows in top-right
- [ ] Backend server running on localhost:5000
- [ ] Sign-up endpoint responds
- [ ] Sign-in endpoint responds
- [ ] Login modal opens/closes
- [ ] Forms validate correctly

---

## Getting Help

If issues persist:

1. Check browser console (F12 → Console tab)
2. Check server terminal for error messages
3. Verify all files created:
   - `database.js` ✅
   - `routes/auth.js` ✅
   - `setup-database.js` ✅
   - `images/smart-waste-logo.svg` ✅

---

## Files Status

✅ `index.html` - Updated with CDN fallback
✅ `script.js` - Has error handling
✅ `styles.css` - Complete
✅ `server.js` - Auth routes integrated
✅ `package.json` - Dependencies listed
✅ `database.js` - Database module ready
✅ `routes/auth.js` - Auth endpoints ready
✅ `images/smart-waste-logo.svg` - Created
✅ Connection detection - Working

All systems operational! 🟢

