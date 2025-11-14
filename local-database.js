// ==================== LOCAL JSON DATABASE FOR LOGIN ====================
// This module manages user data using JSON stored in localStorage
// No backend server required - works entirely in the browser

class LocalUserDatabase {
    constructor() {
        this.storageKey = 'smartwaste_users';
        this.historyKey = 'smartwaste_login_history';
        this.initializeDatabase();
    }

    // Initialize database if it doesn't exist
    initializeDatabase() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.historyKey)) {
            localStorage.setItem(this.historyKey, JSON.stringify([]));
        }
    }

    // Get all users
    getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (error) {
            console.error('Error reading users:', error);
            return [];
        }
    }

    // Get user by email
    getUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email);
    }

    // Get user by ID
    getUserById(userId) {
        const users = this.getAllUsers();
        return users.find(user => user.id === userId);
    }

    // Hash password (simple hash - for demo only)
    hashPassword(password) {
        return btoa(password); // Base64 encoding (not secure for production)
    }

    // Verify password
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Generate user ID
    generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Register new user
    registerUser(email, password) {
        try {
            // Check if email already exists
            if (this.getUserByEmail(email)) {
                throw new Error('Email already registered');
            }

            const users = this.getAllUsers();
            const newUser = {
                id: this.generateUserId(),
                email: email,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            };

            users.push(newUser);
            localStorage.setItem(this.storageKey, JSON.stringify(users));

            // Record login history
            this.recordLoginHistory(newUser.id, 'registration');

            return {
                id: newUser.id,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
        } catch (error) {
            throw error;
        }
    }

    // Verify user login
    verifyUser(email, password) {
        try {
            const user = this.getUserByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }

            if (!user.isActive) {
                throw new Error('Account is inactive');
            }

            if (!this.verifyPassword(password, user.password)) {
                throw new Error('Invalid password');
            }

            // Update last login
            this.updateLastLogin(user.id);

            // Record login history
            this.recordLoginHistory(user.id, 'login');

            return {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt
            };
        } catch (error) {
            throw error;
        }
    }

    // Update last login time
    updateLastLogin(userId) {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.id === userId);

            if (user) {
                user.lastLogin = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(users));
            }
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    // Record login history
    recordLoginHistory(userId, action = 'login') {
        try {
            const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

            const record = {
                id: Math.random().toString(36).substr(2, 9),
                userId: userId,
                action: action, // 'login', 'logout', 'registration'
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                ipAddress: 'localhost' // Can't get real IP from browser
            };

            history.push(record);
            localStorage.setItem(this.historyKey, JSON.stringify(history));

            return record.id;
        } catch (error) {
            console.error('Error recording login history:', error);
        }
    }

    // Record logout
    recordLogout(userId) {
        try {
            this.recordLoginHistory(userId, 'logout');
        } catch (error) {
            console.error('Error recording logout:', error);
        }
    }

    // Get login history for user
    getLoginHistory(userId, limit = 10) {
        try {
            const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
            return history
                .filter(record => record.userId === userId)
                .slice(-limit)
                .reverse();
        } catch (error) {
            console.error('Error getting login history:', error);
            return [];
        }
    }

    // Delete user (soft delete)
    deleteUser(userId) {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.id === userId);

            if (user) {
                user.isActive = false;
                localStorage.setItem(this.storageKey, JSON.stringify(users));
                return true;
            }

            throw new Error('User not found');
        } catch (error) {
            throw error;
        }
    }

    // Export database as JSON
    exportDatabase() {
        return {
            users: this.getAllUsers(),
            history: JSON.parse(localStorage.getItem(this.historyKey)) || [],
            exportedAt: new Date().toISOString()
        };
    }

    // Import database from JSON
    importDatabase(data) {
        try {
            if (data.users && Array.isArray(data.users)) {
                localStorage.setItem(this.storageKey, JSON.stringify(data.users));
            }
            if (data.history && Array.isArray(data.history)) {
                localStorage.setItem(this.historyKey, JSON.stringify(data.history));
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Clear database (warning: destructive)
    clearDatabase() {
        if (confirm('Are you sure? This will delete all users and history.')) {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.historyKey);
            this.initializeDatabase();
            return true;
        }
        return false;
    }

    // Get database statistics
    getStats() {
        const users = this.getAllUsers();
        const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];

        return {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            inactiveUsers: users.filter(u => !u.isActive).length,
            totalLogins: history.filter(h => h.action === 'login').length,
            totalRegistrations: history.filter(h => h.action === 'registration').length,
            totalLogouts: history.filter(h => h.action === 'logout').length,
            storageUsed: new Blob([localStorage.getItem(this.storageKey)]).size + 
                        new Blob([localStorage.getItem(this.historyKey)]).size
        };
    }
}

// Create global instance
const userDB = new LocalUserDatabase();
