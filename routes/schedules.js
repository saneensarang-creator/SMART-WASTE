const express = require('express');
const router = express.Router();
const scheduleStore = require('../data/schedule-store');

// Ensure store exists
scheduleStore.ensureDataFile();

// GET /api/schedules - list schedules
router.get('/', (req, res) => {
  try {
    const { collectionId, date } = req.query;
    const list = scheduleStore.getAllSchedules({ collectionId, date });
    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    console.error('GET /schedules error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/schedules - add schedule entry
router.post('/', (req, res) => {
  try {
    const { collectionId, scheduledAt, meta } = req.body;
    if (!collectionId || !scheduledAt) return res.status(400).json({ success: false, message: 'collectionId and scheduledAt are required' });
    const entry = scheduleStore.addSchedule(collectionId, scheduledAt, meta || {});
    return res.status(201).json({ success: true, message: 'Schedule added', data: entry });
  } catch (err) {
    console.error('POST /schedules error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/schedules/:id - delete schedule
router.delete('/:id', (req, res) => {
  try {
    const removed = scheduleStore.deleteSchedule(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: 'Schedule not found' });
    return res.json({ success: true, message: 'Schedule deleted', data: removed });
  } catch (err) {
    console.error('DELETE /schedules/:id error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
