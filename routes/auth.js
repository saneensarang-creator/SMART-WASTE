// ==================== AUTHENTICATION ROUTES ====================
// User registration and login endpoints
// Usage: const authRoutes = require('./routes/auth');
//        app.use('/api', authRoutes);

const express = require('express');
const router = express.Router();
const db = require('../database');

// Helper function to get client IP
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           req.connection.socket?.remoteAddress ||
           'Unknown';
}

// ==================== SIGN UP ENDPOINT ====================
router.post('/sign-up', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Register user
        const user = await db.registerUser(email, password);

        // Record login history for new registration
        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'];
        await db.recordLoginHistory(user.id, ipAddress, userAgent);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Sign up error:', error);
        
        if (error.message.includes('already registered')) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed: ' + error.message
        });
    }
});

// ==================== SIGN IN ENDPOINT ====================
router.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Verify user
        const user = await db.verifyUser(email, password);

        // Record login history
        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'];
        const historyId = await db.recordLoginHistory(user.id, ipAddress, userAgent);

        res.status(200).json({
            success: true,
            message: 'Signed in successfully',
            user: {
                id: user.id,
                email: user.email
            },
            sessionId: historyId
        });

    } catch (error) {
        console.error('Sign in error:', error);
        
        res.status(401).json({
            success: false,
            message: error.message || 'Sign in failed'
        });
    }
});

// ==================== GET USER ENDPOINT ====================
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await db.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
});

// ==================== LOGIN HISTORY ENDPOINT ====================
router.get('/login-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = req.query.limit || 10;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const history = await db.getLoginHistory(userId, limit);

        res.status(200).json({
            success: true,
            history: history
        });

    } catch (error) {
        console.error('Get login history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch login history'
        });
    }
});

// ==================== LOGOUT ENDPOINT ====================
router.post('/logout', async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        await db.recordLogout(sessionId);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

// ==================== DELETE ACCOUNT ENDPOINT ====================
router.delete('/account/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        await db.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
});

// ==================== GET ALL USERS (ADMIN) ====================
router.get('/users/all', async (req, res) => {
    try {
        // In production, add authentication middleware to check if user is admin
        const users = await db.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

module.exports = router;
