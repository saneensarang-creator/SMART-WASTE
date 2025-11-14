// ==================== LOCAL JSON DATABASE FOR COLLECTIONS ====================
// Manages waste collection requests using JSON stored in localStorage
// Works entirely client-side with no backend server required

class LocalCollectionDatabase {
    constructor() {
        this.storageKey = 'smartwaste_collections';
        this.schedulesKey = 'smartwaste_schedules';
        this.initializeDatabase();
        this.initializeSchedules();
    }

    // Initialize database if it doesn't exist
    initializeDatabase() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Generate unique ID
    generateId() {
        return 'COLL_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Generate confirmation number
    generateConfirmationNumber() {
        return 'SW' + Date.now().toString().slice(-8);
    }

    // Get all collections
    getAllCollections() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (error) {
            console.error('Error reading collections:', error);
            return [];
        }
    }

    // Get collection by ID
    getCollectionById(collectionId) {
        const collections = this.getAllCollections();
        return collections.find(c => c.id === collectionId);
    }

    // Get collections by status
    getCollectionsByStatus(status) {
        const collections = this.getAllCollections();
        return collections.filter(c => c.status === status);
    }

    // Get collections by type
    getCollectionsByType(type) {
        const collections = this.getAllCollections();
        return collections.filter(c => c.type === type);
    }

    // Create new collection request
    createCollection(data) {
        try {
            // Validation
            if (!data.address || !data.city || !data.contactName || !data.contactPhone || !data.type) {
                throw new Error('Missing required fields');
            }

            if (!this.isValidPhone(data.contactPhone)) {
                throw new Error('Invalid phone number');
            }

            const collections = this.getAllCollections();
            const newCollection = {
                id: this.generateId(),
                confirmationNumber: this.generateConfirmationNumber(),
                address: data.address.trim(),
                city: data.city.trim(),
                postalCode: data.postalCode?.trim() || '',
                contactName: data.contactName.trim(),
                contactPhone: data.contactPhone.trim(),
                type: data.type,
                notes: data.notes?.trim() || '',
                status: 'pending',
                requestedDate: new Date().toISOString(),
                scheduledDate: null,
                completedDate: null,
                priority: data.priority || 'normal',
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            collections.push(newCollection);
            localStorage.setItem(this.storageKey, JSON.stringify(collections));

            return {
                id: newCollection.id,
                confirmationNumber: newCollection.confirmationNumber,
                status: 'pending',
                createdAt: newCollection.metadata.createdAt
            };
        } catch (error) {
            throw error;
        }
    }

    // Update collection status
    updateCollectionStatus(collectionId, newStatus) {
        try {
            const validStatuses = ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'];
            
            if (!validStatuses.includes(newStatus)) {
                throw new Error('Invalid status');
            }

            const collections = this.getAllCollections();
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) {
                throw new Error('Collection not found');
            }

            collection.status = newStatus;
            if (newStatus === 'completed') {
                collection.completedDate = new Date().toISOString();
            }
            if (newStatus === 'scheduled' && !collection.scheduledDate) {
                collection.scheduledDate = new Date().toISOString();
            }
            collection.metadata.updatedAt = new Date().toISOString();

            localStorage.setItem(this.storageKey, JSON.stringify(collections));
            return collection;
        } catch (error) {
            throw error;
        }
    }

    // Schedule collection
    scheduleCollection(collectionId, scheduledDate) {
        try {
            const collections = this.getAllCollections();
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) {
                throw new Error('Collection not found');
            }

            collection.scheduledDate = scheduledDate;
            collection.status = 'scheduled';
            collection.metadata.updatedAt = new Date().toISOString();

            localStorage.setItem(this.storageKey, JSON.stringify(collections));
            // Mirror schedule in local schedules DB for easier lookup
            try {
                this.addSchedule(collectionId, scheduledDate, {
                    confirmationNumber: collection.confirmationNumber || null,
                    contactName: collection.contactName || null,
                    address: collection.address || null
                });
            } catch (err) {
                console.warn('Failed to mirror schedule locally:', err.message || err);
            }
            return collection;
        } catch (error) {
            throw error;
        }
    }

    // Cancel collection
    cancelCollection(collectionId, reason = '') {
        try {
            const collections = this.getAllCollections();
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) {
                throw new Error('Collection not found');
            }

            collection.status = 'cancelled';
            collection.cancelReason = reason;
            collection.metadata.updatedAt = new Date().toISOString();

            localStorage.setItem(this.storageKey, JSON.stringify(collections));
            return collection;
        } catch (error) {
            throw error;
        }
    }

    // Delete collection
    deleteCollection(collectionId) {
        try {
            let collections = this.getAllCollections();
            const initialLength = collections.length;
            collections = collections.filter(c => c.id !== collectionId);

            if (collections.length === initialLength) {
                throw new Error('Collection not found');
            }

            localStorage.setItem(this.storageKey, JSON.stringify(collections));
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Search collections
    searchCollections(query) {
        try {
            const collections = this.getAllCollections();
            const searchTerm = query.toLowerCase();

            return collections.filter(c =>
                c.confirmationNumber.toLowerCase().includes(searchTerm) ||
                c.address.toLowerCase().includes(searchTerm) ||
                c.city.toLowerCase().includes(searchTerm) ||
                c.contactName.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    // Get statistics
    getStatistics() {
        try {
            const collections = this.getAllCollections();
            const byStatus = {};
            const byType = {};

            collections.forEach(c => {
                byStatus[c.status] = (byStatus[c.status] || 0) + 1;
                byType[c.type] = (byType[c.type] || 0) + 1;
            });

            return {
                totalCollections: collections.length,
                byStatus: byStatus,
                byType: byType,
                pending: (byStatus.pending || 0),
                scheduled: (byStatus.scheduled || 0),
                inProgress: (byStatus['in-progress'] || 0),
                completed: (byStatus.completed || 0),
                cancelled: (byStatus.cancelled || 0)
            };
        } catch (error) {
            console.error('Stats error:', error);
            return {};
        }
    }

    // Initialize schedules storage
    initializeSchedules() {
        if (!localStorage.getItem(this.schedulesKey)) {
            localStorage.setItem(this.schedulesKey, JSON.stringify([]));
        }
    }

    // Add a schedule entry to local schedules DB (mirrors server schedule entries)
    addSchedule(collectionId, scheduledAt, meta = {}) {
        try {
            const raw = localStorage.getItem(this.schedulesKey) || '[]';
            const schedules = JSON.parse(raw);
            const entry = Object.assign({
                id: 'SCH_' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                collectionId,
                scheduledAt,
                createdAt: new Date().toISOString()
            }, meta || {});
            schedules.push(entry);
            localStorage.setItem(this.schedulesKey, JSON.stringify(schedules));
            return entry;
        } catch (err) {
            console.error('addSchedule error', err);
            throw err;
        }
    }

    // Get local schedules
    getAllSchedules() {
        try {
            return JSON.parse(localStorage.getItem(this.schedulesKey)) || [];
        } catch (err) {
            console.error('Error reading schedules:', err);
            return [];
        }
    }

    // Update a schedule entry by id (merge changes)
    updateSchedule(scheduleId, changes = {}) {
        try {
            const raw = localStorage.getItem(this.schedulesKey) || '[]';
            const schedules = JSON.parse(raw);
            const idx = schedules.findIndex(s => String(s.id) === String(scheduleId));
            if (idx === -1) throw new Error('Schedule not found');
            const updated = Object.assign({}, schedules[idx], changes);
            updated.updatedAt = new Date().toISOString();
            schedules[idx] = updated;
            localStorage.setItem(this.schedulesKey, JSON.stringify(schedules));
            return updated;
        } catch (err) {
            console.error('updateSchedule error', err);
            throw err;
        }
    }

    // Export data as JSON
    exportData() {
        return {
            collections: this.getAllCollections(),
            statistics: this.getStatistics(),
            exportedAt: new Date().toISOString()
        };
    }

    // Import schedules from a JSON array (merges into local schedules)
    importSchedules(data) {
        try {
            if (!Array.isArray(data)) throw new Error('schedules must be an array');
            const raw = localStorage.getItem(this.schedulesKey) || '[]';
            const schedules = JSON.parse(raw);
            // Normalize incoming entries and avoid duplicate ids
            const existingIds = new Set(schedules.map(s => String(s.id)));
            data.forEach(item => {
                const id = item.id || ('SCH_' + Math.random().toString(36).substr(2, 8).toUpperCase());
                if (existingIds.has(String(id))) return; // skip duplicate
                const entry = Object.assign({
                    id,
                    collectionId: item.collectionId || item.collectionId,
                    scheduledAt: item.scheduledAt || item.scheduledDate || null,
                    createdAt: item.createdAt || new Date().toISOString(),
                    confirmationNumber: item.confirmationNumber || null,
                    contactName: item.contactName || null,
                    address: item.address || null
                }, item.meta || {});
                schedules.push(entry);
            });
            localStorage.setItem(this.schedulesKey, JSON.stringify(schedules));
            return true;
        } catch (err) {
            console.error('importSchedules error', err);
            throw err;
        }
    }

    // Import data from JSON
    importData(data) {
        try {
            if (data.collections && Array.isArray(data.collections)) {
                localStorage.setItem(this.storageKey, JSON.stringify(data.collections));
                return true;
            }
            throw new Error('Invalid data format');
        } catch (error) {
            throw error;
        }
    }

    // Clear all data
    clearDatabase() {
        if (confirm('Are you sure? This will delete all collection requests.')) {
            localStorage.removeItem(this.storageKey);
            this.initializeDatabase();
            return true;
        }
        return false;
    }

    // Validation helpers
    isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }
}

// Create global instance
const collectionDB = new LocalCollectionDatabase();
