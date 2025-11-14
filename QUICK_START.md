# Quick Start Guide - User Database Setup

## What's New?

A complete user authentication database system has been added to your SMART WASTE application with:
- SQLite database for storing user credentials
- Password hashing with bcryptjs
- Login history tracking
- Session management

## Files Created/Modified

### New Files:
1. **`database.js`** - Database module with user functions
2. **`routes/auth.js`** - Authentication API endpoints
3. **`setup-database.js`** - Database initialization script
4. **`DATABASE_SETUP.md`** - Detailed documentation

### Modified Files:
1. **`package.json`** - Added sqlite3 and bcryptjs dependencies
2. **`server.js`** - Integrated auth routes
3. **`script.js`** - Updated with API_URL configuration

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- sqlite3 (database)
- bcryptjs (password hashing)

### Step 2: Initialize Database
```bash
node setup-database.js
```

This creates:
- `smartwaste_users.db` (database file)
- `users` table (stores email, password, timestamps)
- `login_history` table (tracks logins)

### Step 3: Start Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:5000`

## Available Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/sign-up` | Create new account |
| POST | `/api/sign-in` | Login with email/password |
| GET | `/api/user/:userId` | Get user profile |
| GET | `/api/login-history/:userId` | View login history |
| POST | `/api/logout` | End session |
| DELETE | `/api/account/:userId` | Delete account |
| GET | `/api/users/all` | List all users (admin) |

## Frontend Integration

Your frontend is already configured! When users:

1. **Sign Up**: POST to `/api/sign-up` with email and password
   - Returns user ID for future reference
   
2. **Sign In**: POST to `/api/sign-in` with email and password
   - Returns user ID and session ID
   - Automatically tracked in login history

3. **Logout**: Can be triggered from navbar
   - Records logout time
   - Clears localStorage

## Database Location

The database file is created in your project root:
```
c:\Users\hp\Desktop\waste\smartwaste_users.db
```

## Testing Sign Up/Login

1. Open your website in browser
2. Click "Login" in navigation
3. Switch to "Sign Up" tab
4. Enter:
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
5. Click "Sign Up"
6. You should see success message
7. Login button becomes "Logout"

## Security Features

✓ Passwords hashed and salted
✓ Email uniqueness enforced
✓ Login attempts tracked with IP address
✓ Soft delete (users not truly deleted)
✓ Input validation
✓ CORS protection
✓ Error handling

## Troubleshooting

### Port 5000 already in use?
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database file not found?
```bash
node setup-database.js
```

### Dependencies error?
```bash
npm cache clean --force
npm install
```

## Production Checklist

Before deploying:
- [ ] Remove `DATABASE_SETUP.md` reference from deployment
- [ ] Back up `smartwaste_users.db` regularly
- [ ] Add `.gitignore` entry: `smartwaste_users.db`
- [ ] Use environment variables for sensitive data
- [ ] Consider PostgreSQL/MySQL for production
- [ ] Implement rate limiting for login attempts
- [ ] Add email verification for sign-ups
- [ ] Use HTTPS only
- [ ] Add JWT tokens for better security

## Next Steps

1. Test the login/signup functionality
2. Review `DATABASE_SETUP.md` for detailed API documentation
3. Customize user fields as needed
4. Deploy to production with security measures

## Support

For issues or questions:
- Check `DATABASE_SETUP.md` for detailed docs
- Review auth endpoints in `routes/auth.js`
- Check database schema in `database.js`

