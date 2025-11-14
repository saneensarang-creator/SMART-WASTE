#!/usr/bin/env node

// ==================== DATABASE SETUP SCRIPT ====================
// This script initializes the database with tables for user authentication
// Run: node setup-database.js

const db = require('./database');

console.log('✓ Database initialized successfully!');
console.log('');
console.log('Tables created:');
console.log('  - users (for storing user accounts)');
console.log('  - login_history (for tracking login/logout activity)');
console.log('');
console.log('Database location: smartwaste_users.db');
console.log('');

// Close database connection after setup
setTimeout(() => {
    db.db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('✓ Setup complete!');
            console.log('');
            console.log('Next steps:');
            console.log('  1. Run: npm install');
            console.log('  2. Run: node server.js (or npm start)');
            console.log('  3. Frontend can now use the authentication endpoints');
            console.log('');
            process.exit(0);
        }
    });
}, 1000);
