// ==================== REQUEST COLLECTION BACKEND ====================
// Handles incoming collection requests with validation, processing, and confirmation
// Persists to data/requests.json

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/requests.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load requests from file
let requests = [];
let nextRequestId = 1000; // Start from 1000 for request IDs

function loadRequests() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            requests = data.requests || [];
            nextRequestId = (data.nextRequestId || 1000) + 1;
        }
    } catch (err) {
        console.error('Error loading requests:', err);
        requests = [];
        nextRequestId = 1000;
    }
}

// Save requests to file
function saveRequests() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({
            requests,
            nextRequestId,
            lastUpdated: new Date().toISOString()
        }, null, 2));
    } catch (err) {
        console.error('Error saving requests:', err);
    }
}

// Load on startup
loadRequests();

// ==================== HELPER FUNCTIONS ====================

// Validate phone number (basic validation)
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate email (if provided)
function isValidEmail(email) {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate confirmation number
function generateConfirmationNumber() {
    return 'REQ-' + Date.now().toString().slice(-6);
}

// ==================== ROUTES ====================

// POST /api/request - Submit new collection request
router.post('/', (req, res) => {
    const { address, city, postalCode, contactName, contactPhone, type, notes, email } = req.body;
    
    // Validation
    const errors = {};
    
    if (!address || address.trim().length < 5) {
        errors.address = 'Valid address is required (min 5 characters)';
    }
    if (!city || city.trim().length < 2) {
        errors.city = 'Valid city is required';
    }
    if (!contactName || contactName.trim().length < 2) {
        errors.contactName = 'Valid contact name is required';
    }
    if (!contactPhone) {
        errors.contactPhone = 'Contact phone is required';
    } else if (!isValidPhone(contactPhone)) {
        errors.contactPhone = 'Invalid phone number format';
    }
    if (!type || !['recycling', 'organic', 'hazardous', 'general'].includes(type)) {
        errors.type = 'Valid collection type is required';
    }
    if (email && !isValidEmail(email)) {
        errors.email = 'Invalid email format';
    }
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
    
    // Create request
    const confirmationNumber = generateConfirmationNumber();
    const newRequest = {
        requestId: nextRequestId++,
        confirmationNumber,
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode?.trim() || '',
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        email: email?.trim() || '',
        type,
        notes: notes?.trim() || '',
        status: 'received', // received → assigned → in-progress → completed
        priority: 'normal',
        createdAt: new Date().toISOString(),
        scheduledAt: null,
        completedAt: null,
        assignedTo: null,
        internalNotes: ''
    };
    
    requests.push(newRequest);
    saveRequests();
    
    // Return confirmation with details
    return res.status(201).json({
        success: true,
        message: 'Collection request received successfully',
        confirmationNumber,
        requestId: newRequest.requestId,
        data: {
            requestId: newRequest.requestId,
            confirmationNumber,
            contactName: newRequest.contactName,
            address: newRequest.address,
            city: newRequest.city,
            type: newRequest.type,
            status: newRequest.status,
            createdAt: newRequest.createdAt,
            estimatedArrival: 'Within 48 hours'
        }
    });
});

// GET /api/request - List all requests (admin only)
router.get('/', (req, res) => {
    const { status, type, city, sortBy } = req.query;
    
    let filtered = [...requests];
    
    if (status) {
        filtered = filtered.filter(r => r.status === status);
    }
    if (type) {
        filtered = filtered.filter(r => r.type === type);
    }
    if (city) {
        filtered = filtered.filter(r => r.city.toLowerCase().includes(city.toLowerCase()));
    }
    
    // Sort by date (newest first) by default
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
});

// GET /api/request/:confirmationNumber - Track request by confirmation number
router.get('/:confirmationNumber', (req, res) => {
    const request = requests.find(r => r.confirmationNumber === req.params.confirmationNumber);
    
    if (!request) {
        return res.status(404).json({
            success: false,
            message: 'Request not found. Please check your confirmation number.'
        });
    }
    
    // Return public info only
    return res.json({
        success: true,
        data: {
            confirmationNumber: request.confirmationNumber,
            requestId: request.requestId,
            type: request.type,
            address: request.address,
            city: request.city,
            status: request.status,
            createdAt: request.createdAt,
            scheduledAt: request.scheduledAt,
            completedAt: request.completedAt
        }
    });
});

// PUT /api/request/:requestId - Update request status (admin only)
router.put('/:requestId', (req, res) => {
    const request = requests.find(r => r.requestId === parseInt(req.params.requestId));
    
    if (!request) {
        return res.status(404).json({
            success: false,
            message: 'Request not found'
        });
    }
    
    const { status, assignedTo, internalNotes, scheduledAt, priority } = req.body;
    
    // Update allowed fields
    if (status) {
        if (!['received', 'assigned', 'in-progress', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        request.status = status;
        if (status === 'completed') {
            request.completedAt = new Date().toISOString();
        }
    }
    if (assignedTo) request.assignedTo = assignedTo;
    if (internalNotes) request.internalNotes = internalNotes;
    if (scheduledAt) request.scheduledAt = scheduledAt;
    if (priority) request.priority = priority;
    
    saveRequests();
    
    return res.json({
        success: true,
        message: 'Request updated successfully',
        data: request
    });
});

// DELETE /api/request/:requestId - Cancel request (admin only)
router.delete('/:requestId', (req, res) => {
    const index = requests.findIndex(r => r.requestId === parseInt(req.params.requestId));
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Request not found'
        });
    }
    
    const deleted = requests.splice(index, 1)[0];
    saveRequests();
    
    return res.json({
        success: true,
        message: 'Request cancelled',
        data: deleted
    });
});

// GET /api/request/stats/summary - Get request statistics
router.get('/stats/summary', (req, res) => {
    const stats = {
        total: requests.length,
        byStatus: {
            received: requests.filter(r => r.status === 'received').length,
            assigned: requests.filter(r => r.status === 'assigned').length,
            inProgress: requests.filter(r => r.status === 'in-progress').length,
            completed: requests.filter(r => r.status === 'completed').length,
            cancelled: requests.filter(r => r.status === 'cancelled').length
        },
        byType: {
            recycling: requests.filter(r => r.type === 'recycling').length,
            organic: requests.filter(r => r.type === 'organic').length,
            hazardous: requests.filter(r => r.type === 'hazardous').length,
            general: requests.filter(r => r.type === 'general').length
        }
    };
    
    return res.json({
        success: true,
        data: stats
    });
});

module.exports = router;
