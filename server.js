// ==================== BACKEND SERVER FOR OTP SERVICE ====================
// Install dependencies: npm install express twilio dotenv cors body-parser sqlite3 bcryptjs
// Run: node server.js

const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Twilio Configuration
// Get your credentials from: https://www.twilio.com/console
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

const client = twilio(accountSid, authToken);

// Store OTPs temporarily (in production use database/Redis)
const otpStore = {};

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==================== API ROUTES ====================

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber || phoneNumber.length < 10) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid phone number' 
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes validity

        // Store OTP
        otpStore[phoneNumber] = { otp, expiryTime };

        // Send SMS via Twilio
        await client.messages.create({
            body: `Your SMART WASTE OTP is: ${otp}. Valid for 5 minutes.`,
            from: twilioPhoneNumber,
            to: phoneNumber
        });

        console.log(`OTP sent to ${phoneNumber}: ${otp}`);

        return res.json({ 
            success: true, 
            message: 'OTP sent successfully',
            phone: phoneNumber.slice(-4).padStart(phoneNumber.length, '*')
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number and OTP required' 
            });
        }

        // Check if OTP exists and is valid
        const storedData = otpStore[phoneNumber];

        if (!storedData) {
            return res.status(400).json({ 
                success: false, 
                message: 'No OTP found for this number' 
            });
        }

        // Check if OTP is expired
        if (Date.now() > storedData.expiryTime) {
            delete otpStore[phoneNumber];
            return res.status(400).json({ 
                success: false, 
                message: 'OTP expired. Request a new one.' 
            });
        }

        // Check if OTP matches
        if (storedData.otp !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Incorrect OTP' 
            });
        }

        // OTP verified successfully
        delete otpStore[phoneNumber];

        return res.json({ 
            success: true, 
            message: 'OTP verified successfully',
            token: Buffer.from(phoneNumber).toString('base64')
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Register User
app.post('/api/register-user', (req, res) => {
    try {
        const { phoneNumber, name, dob, email } = req.body;

        if (!phoneNumber || !name || !dob) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // In production: save to database
        const userData = {
            phoneNumber,
            name,
            dob,
            email: email || 'Not provided',
            registeredAt: new Date()
        };

        console.log('User registered:', userData);

        return res.json({ 
            success: true, 
            message: 'User registered successfully',
            user: userData
        });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server running', timestamp: new Date() });
});

// Collections API (CRUD + scheduling)
const collectionsRouter = require('./routes/collections');
app.use('/api/collections', collectionsRouter);

// Schedules API (server-side JSON store)
const schedulesRouter = require('./routes/schedules');
app.use('/api/schedules', schedulesRouter);

// Request Collection API (receive and track requests)
const requestRouter = require('./routes/request');
app.use('/api/request', requestRouter);

// Storage API (local storage for requests)
const storageRouter = require('./routes/storage');
app.use('/api/storage', storageRouter);

// Serve a simple admin UI for schedules
const path = require('path');
app.get('/admin/schedules', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'schedules.html'));
});

// Authentication API (Sign up, Sign in, User management)
app.use('/api', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`SMART WASTE OTP Server running on http://localhost:${PORT}`);
    console.log('Make sure to set Twilio credentials in .env file');
});
