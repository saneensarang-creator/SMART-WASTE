// ==================== LOCAL STORAGE BACKEND FOR COLLECTION REQUESTS ====================
// Handles persistent local storage of collection requests to filesystem
// Provides API endpoints for storing and retrieving requests

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const STORAGE_DIR = path.join(__dirname, '../data/requests');
const REQUESTS_DB = path.join(STORAGE_DIR, 'requests.json');
const ARCHIVE_DIR = path.join(STORAGE_DIR, 'archive');

// Ensure directories exist
function ensureDirectories() {
    if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    if (!fs.existsSync(ARCHIVE_DIR)) {
        fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }
}

ensureDirectories();

// ==================== DATABASE OPERATIONS ====================

// Load all stored requests
function loadStoredRequests() {
    try {
        if (fs.existsSync(REQUESTS_DB)) {
            const data = JSON.parse(fs.readFileSync(REQUESTS_DB, 'utf-8'));
            return data || [];
        }
    } catch (err) {
        console.error('Error loading stored requests:', err);
    }
    return [];
}

// Save requests to local storage
function saveRequestsToStorage(requests) {
    try {
        fs.writeFileSync(REQUESTS_DB, JSON.stringify(requests, null, 2));
        return true;
    } catch (err) {
        console.error('Error saving requests to storage:', err);
        return false;
    }
}

// Archive completed/old requests
function archiveRequest(request) {
    try {
        const archiveFile = path.join(ARCHIVE_DIR, `archive-${new Date().getFullYear()}.json`);
        let archived = [];
        
        if (fs.existsSync(archiveFile)) {
            archived = JSON.parse(fs.readFileSync(archiveFile, 'utf-8'));
        }
        
        archived.push({
            ...request,
            archivedAt: new Date().toISOString()
        });
        
        fs.writeFileSync(archiveFile, JSON.stringify(archived, null, 2));
        return true;
    } catch (err) {
        console.error('Error archiving request:', err);
        return false;
    }
}

// Get file size and storage info
function getStorageInfo() {
    try {
        let totalSize = 0;
        
        if (fs.existsSync(REQUESTS_DB)) {
            const stats = fs.statSync(REQUESTS_DB);
            totalSize += stats.size;
        }
        
        const files = fs.readdirSync(ARCHIVE_DIR);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(ARCHIVE_DIR, file);
                const stats = fs.statSync(filePath);
                totalSize += stats.size;
            }
        });
        
        return {
            mainStorageFile: REQUESTS_DB,
            archiveDirectory: ARCHIVE_DIR,
            totalSizeBytes: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            archiveCount: files.length
        };
    } catch (err) {
        console.error('Error getting storage info:', err);
        return null;
    }
}

// ==================== ROUTES ====================

// POST /api/storage/save - Save a collection request locally
router.post('/save', (req, res) => {
    const { confirmationNumber, requestId, address, city, postalCode, contactName, contactPhone, type, notes, email } = req.body;
    
    // Validation
    if (!confirmationNumber || !requestId || !address || !city || !contactName || !contactPhone) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    try {
        let requests = loadStoredRequests();
        
        // Check if request already exists
        const existingIndex = requests.findIndex(r => r.confirmationNumber === confirmationNumber);
        
        const storedRequest = {
            confirmationNumber,
            requestId,
            address,
            city,
            postalCode: postalCode || '',
            contactName,
            contactPhone,
            type,
            notes: notes || '',
            email: email || '',
            storedAt: new Date().toISOString(),
            status: 'pending',
            metadata: {
                device: req.headers['user-agent'] || 'unknown',
                ipAddress: req.ip || 'unknown'
            }
        };
        
        if (existingIndex >= 0) {
            // Update existing request
            requests[existingIndex] = { ...requests[existingIndex], ...storedRequest };
        } else {
            // Add new request
            requests.push(storedRequest);
        }
        
        saveRequestsToStorage(requests);
        
        return res.json({
            success: true,
            message: 'Request saved to local storage',
            confirmationNumber,
            totalStoredRequests: requests.length
        });
    } catch (err) {
        console.error('Error saving request:', err);
        return res.status(500).json({
            success: false,
            message: 'Error saving request to storage',
            error: err.message
        });
    }
});

// GET /api/storage/all - Get all stored requests
router.get('/all', (req, res) => {
    try {
        const requests = loadStoredRequests();
        
        return res.json({
            success: true,
            count: requests.length,
            data: requests,
            storageInfo: getStorageInfo()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving stored requests',
            error: err.message
        });
    }
});

// GET /api/storage/find/:confirmationNumber - Find request by confirmation number
router.get('/find/:confirmationNumber', (req, res) => {
    try {
        const requests = loadStoredRequests();
        const request = requests.find(r => r.confirmationNumber === req.params.confirmationNumber);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found in local storage'
            });
        }
        
        return res.json({
            success: true,
            data: request
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving request',
            error: err.message
        });
    }
});

// PUT /api/storage/update/:confirmationNumber - Update stored request
router.put('/update/:confirmationNumber', (req, res) => {
    try {
        let requests = loadStoredRequests();
        const index = requests.findIndex(r => r.confirmationNumber === req.params.confirmationNumber);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        // Update fields
        requests[index] = {
            ...requests[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        saveRequestsToStorage(requests);
        
        return res.json({
            success: true,
            message: 'Request updated',
            data: requests[index]
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating request',
            error: err.message
        });
    }
});

// DELETE /api/storage/delete/:confirmationNumber - Delete request from storage
router.delete('/delete/:confirmationNumber', (req, res) => {
    try {
        let requests = loadStoredRequests();
        const index = requests.findIndex(r => r.confirmationNumber === req.params.confirmationNumber);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        const deleted = requests.splice(index, 1)[0];
        saveRequestsToStorage(requests);
        
        return res.json({
            success: true,
            message: 'Request deleted from storage',
            data: deleted
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting request',
            error: err.message
        });
    }
});

// POST /api/storage/archive/:confirmationNumber - Archive a request
router.post('/archive/:confirmationNumber', (req, res) => {
    try {
        let requests = loadStoredRequests();
        const index = requests.findIndex(r => r.confirmationNumber === req.params.confirmationNumber);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
        
        const request = requests[index];
        archiveRequest(request);
        
        requests.splice(index, 1);
        saveRequestsToStorage(requests);
        
        return res.json({
            success: true,
            message: 'Request archived',
            data: request
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error archiving request',
            error: err.message
        });
    }
});

// GET /api/storage/stats - Get storage statistics
router.get('/stats', (req, res) => {
    try {
        const requests = loadStoredRequests();
        const storageInfo = getStorageInfo();
        
        const stats = {
            totalRequests: requests.length,
            byType: {
                recycling: requests.filter(r => r.type === 'recycling').length,
                organic: requests.filter(r => r.type === 'organic').length,
                hazardous: requests.filter(r => r.type === 'hazardous').length,
                general: requests.filter(r => r.type === 'general').length
            },
            byStatus: {
                pending: requests.filter(r => r.status === 'pending').length,
                processing: requests.filter(r => r.status === 'processing').length,
                completed: requests.filter(r => r.status === 'completed').length
            },
            storage: storageInfo
        };
        
        return res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving statistics',
            error: err.message
        });
    }
});

// POST /api/storage/export - Export all requests as JSON
router.post('/export', (req, res) => {
    try {
        const requests = loadStoredRequests();
        const exportDate = new Date().toISOString().slice(0, 10);
        const filename = `requests-export-${exportDate}.json`;
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(JSON.stringify(requests, null, 2));
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error exporting requests',
            error: err.message
        });
    }
});

module.exports = router;
