// ==================== COLLECTIONS API ROUTER ====================
// CRUD operations for waste collection requests
// Uses centralized data store at data/collection-store.js

const express = require('express');
const router = express.Router();
const store = require('../data/collection-store');
let scheduleStore;
try {
    scheduleStore = require('../data/schedule-store');
    scheduleStore.ensureDataFile();
} catch (e) {
    // Optional schedule store - continue without crashing
    scheduleStore = null;
}

// Ensure data file exists
store.ensureDataFile();

// ==================== ROUTES ====================

// GET /api/collections - List all collections (with optional filters)
router.get('/', (req, res) => {
    try {
        const filters = { city: req.query.city, type: req.query.type, status: req.query.status };
        const list = store.getAllCollections(filters);
        return res.json({ success: true, count: list.length, data: list });
    } catch (err) {
        console.error('GET /collections error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/collections/:id - Get single collection
router.get('/:id', (req, res) => {
    try {
        const collection = store.getCollectionById(req.params.id);
        if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
        return res.json({ success: true, data: collection });
    } catch (err) {
        console.error('GET /collections/:id error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/collections - Create new collection request
router.post('/', (req, res) => {
    try {
        const { address, city, postalCode, contactName, contactPhone, type, notes } = req.body;
        const errors = {};
        if (!address) errors.address = 'Address is required';
        if (!city) errors.city = 'City is required';
        if (!contactName) errors.contactName = 'Contact name is required';
        if (!contactPhone) errors.contactPhone = 'Contact phone is required';
        if (!type) errors.type = 'Type is required';
        if (Object.keys(errors).length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });

        const payload = { address, city, postalCode: postalCode || '', contactName, contactPhone, type, notes: notes || '' };
        const created = store.createCollection(payload);
        return res.status(201).json({ success: true, message: 'Collection request created', data: created });
    } catch (err) {
        console.error('POST /collections error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/collections/:id - Update collection
router.put('/:id', (req, res) => {
    try {
        const updated = store.updateCollection(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Collection not found' });
        return res.json({ success: true, message: 'Collection updated', data: updated });
    } catch (err) {
        console.error('PUT /collections/:id error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/collections/:id - Delete collection
router.delete('/:id', (req, res) => {
    try {
        const deleted = store.deleteCollection(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Collection not found' });
        return res.json({ success: true, message: 'Collection deleted', data: deleted });
    } catch (err) {
        console.error('DELETE /collections/:id error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/collections/:id/schedule - Schedule collection
router.post('/:id/schedule', (req, res) => {
    try {
        const { scheduledAt } = req.body;
        if (!scheduledAt) return res.status(400).json({ success: false, message: 'Scheduled date/time is required' });
        const scheduled = store.scheduleCollection(req.params.id, scheduledAt);
        if (!scheduled) return res.status(404).json({ success: false, message: 'Collection not found' });
        // Record in separate schedules store if available
        try {
            if (scheduleStore) {
                const collectionIdForSchedule = scheduled.id || req.params.id;
                scheduleStore.addSchedule(collectionIdForSchedule, scheduled.scheduledAt || scheduledAt, {
                    confirmationNumber: scheduled.confirmationNumber || null,
                    contactName: scheduled.contactName || null,
                    address: scheduled.address || null
                });
            }
        } catch (err) {
            console.warn('Unable to write to schedule store:', err.message || err);
        }
        return res.json({ success: true, message: 'Collection scheduled', data: scheduled });
    } catch (err) {
        console.error('POST /collections/:id/schedule error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/collections/:id/status - Update collection status
router.put('/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ') });
        const updated = store.updateCollection(req.params.id, { status });
        if (!updated) return res.status(404).json({ success: false, message: 'Collection not found' });
        return res.json({ success: true, message: 'Status updated', data: updated });
    } catch (err) {
        console.error('PUT /collections/:id/status error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/collections/status/:status - Get collections by status
router.get('/status/:status', (req, res) => {
    try {
        const list = store.getCollectionsByStatus(req.params.status);
        return res.json({ success: true, status: req.params.status, count: list.length, data: list });
    } catch (err) {
        console.error('GET /collections/status error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/collections/type/:type - Get collections by waste type
router.get('/type/:type', (req, res) => {
    try {
        const list = store.getCollectionsByType(req.params.type);
        return res.json({ success: true, type: req.params.type, count: list.length, data: list });
    } catch (err) {
        console.error('GET /collections/type error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/collections/stats/overview - Get collection statistics
router.get('/stats/overview', (req, res) => {
    try {
        const stats = store.getStatsOverview();
        return res.json({ success: true, data: stats });
    } catch (err) {
        console.error('GET /collections/stats error', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
