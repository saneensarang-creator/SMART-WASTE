// ==================== DATABASE MODULE ====================
// SQLite database for storing user login data
// Install: npm install sqlite3 bcryptjs
// Usage: const db = require('./database');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'smartwaste_users.db');

// Create or open database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            is_active INTEGER DEFAULT 1
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table initialized successfully');
        }
    });

    // Create login history table
    db.run(`
        CREATE TABLE IF NOT EXISTS login_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            logout_time DATETIME,
            ip_address TEXT,
            user_agent TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating login_history table:', err);
        } else {
            console.log('Login history table initialized successfully');
        }
    });
}

// ==================== USER FUNCTIONS ====================

// Register new user
function registerUser(email, password) {
    return new Promise((resolve, reject) => {
        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                reject(err);
                return;
            }

            db.run(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            reject(new Error('Email already registered'));
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve({
                            id: this.lastID,
                            email: email,
                            created_at: new Date()
                        });
                    }
                }
            );
        });
    });
}

// Verify user credentials
function verifyUser(email, password) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE email = ? AND is_active = 1',
            [email],
            (err, user) => {
                if (err) {
                    reject(err);
                } else if (!user) {
                    reject(new Error('User not found'));
                } else {
                    // Compare passwords
                    bcrypt.compare(password, user.password, (err, isValid) => {
                        if (err) {
                            reject(err);
                        } else if (!isValid) {
                            reject(new Error('Invalid password'));
                        } else {
                            // Update last login
                            updateLastLogin(user.id);
                            resolve({
                                id: user.id,
                                email: user.email,
                                created_at: user.created_at
                            });
                        }
                    });
                }
            }
        );
    });
}

// Get user by email
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id, email, created_at, last_login FROM users WHERE email = ?',
            [email],
            (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            }
        );
    });
}

// Get user by ID
function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id, email, created_at, last_login FROM users WHERE id = ?',
            [userId],
            (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            }
        );
    });
}

// Update last login time
function updateLastLogin(userId) {
    db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
            if (err) {
                console.error('Error updating last login:', err);
            }
        }
    );
}

// Record login history
function recordLoginHistory(userId, ipAddress, userAgent) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
            [userId, ipAddress, userAgent],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

// Record logout
function recordLogout(historyId) {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE login_history SET logout_time = CURRENT_TIMESTAMP WHERE id = ?',
            [historyId],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    });
}

// Get user login history
function getLoginHistory(userId, limit = 10) {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT ?',
            [userId, limit],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
}

// Delete user account
function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE users SET is_active = 0 WHERE id = ?',
            [userId],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    });
}

// Get all users (admin only)
function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT id, email, created_at, last_login FROM users WHERE is_active = 1',
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
}

// ==================== EXPORTS ====================
module.exports = {
    db,
    registerUser,
    verifyUser,
    getUserByEmail,
    getUserById,
    updateLastLogin,
    recordLoginHistory,
    recordLogout,
    getLoginHistory,
    deleteUser,
    getAllUsers
};
