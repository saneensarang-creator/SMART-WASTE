// Admin Dashboard Control Logic

// Load admin stats on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAdminStats();
    checkSystemHealth();
});

// Load and display admin statistics
function loadAdminStats() {
    try {
        // Users stats
        const users = JSON.parse(localStorage.getItem('smartwaste_users')) || [];
        document.getElementById('statsUsers').textContent = users.length;
        document.getElementById('totalUsers').textContent = users.length;

        // Collections stats
        const collections = JSON.parse(localStorage.getItem('smartwaste_collections')) || [];
        document.getElementById('statsCollections').textContent = collections.length;
        document.getElementById('totalCollections').textContent = collections.length;

        // Schedules stats
        const schedules = JSON.parse(localStorage.getItem('smartwaste_schedules')) || [];
        document.getElementById('statsSchedules').textContent = schedules.length;

        // Exports stats
        const exports = JSON.parse(localStorage.getItem('smartwaste_exports')) || [];
        document.getElementById('statsExports').textContent = exports.length;
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

// Search specific user
function searchUser() {
    const email = document.getElementById('userSearch').value.trim();
    if (!email) {
        alert('Please enter an email to search');
        return;
    }

    try {
        const users = JSON.parse(localStorage.getItem('smartwaste_users')) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        const container = document.getElementById('userListContainer');
        const listDiv = document.getElementById('usersList');

        if (user) {
            container.style.display = 'block';
            listDiv.innerHTML = `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${user.email}</div>
                        <div class="list-item-desc">ID: ${user.id}</div>
                        <div class="list-item-desc">Created: ${new Date(user.createdAt).toLocaleString()}</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-small btn-danger" onclick="deleteUser('${user.id}')">Delete User</button>
                    </div>
                </div>
            `;
        } else {
            container.style.display = 'block';
            listDiv.innerHTML = '<p style="color:#666;">User not found</p>';
        }
    } catch (error) {
        alert('Error searching user: ' + error.message);
    }
}

// List all users
function listAllUsers() {
    try {
        const users = JSON.parse(localStorage.getItem('smartwaste_users')) || [];
        const container = document.getElementById('userListContainer');
        const listDiv = document.getElementById('usersList');

        if (users.length === 0) {
            container.style.display = 'block';
            listDiv.innerHTML = '<p style="color:#666;">No users registered yet</p>';
            return;
        }

        let html = '';
        users.forEach(user => {
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${user.email}</div>
                        <div class="list-item-desc">ID: ${user.id}</div>
                        <div class="list-item-desc">Created: ${new Date(user.createdAt).toLocaleString()}</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-small btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
                    </div>
                </div>
            `;
        });

        container.style.display = 'block';
        listDiv.innerHTML = html;
    } catch (error) {
        alert('Error loading users: ' + error.message);
    }
}

// Delete user
function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) {
        return;
    }

    try {
        const users = JSON.parse(localStorage.getItem('smartwaste_users')) || [];
        const filtered = users.filter(u => u.id !== userId);
        localStorage.setItem('smartwaste_users', JSON.stringify(filtered));
        alert('User deleted successfully');
        listAllUsers();
        loadAdminStats();
    } catch (error) {
        alert('Error deleting user: ' + error.message);
    }
}

// List collections
function listCollections() {
    try {
        const collections = JSON.parse(localStorage.getItem('smartwaste_collections')) || [];
        const filterType = document.getElementById('collectionFilter').value;
        
        let filtered = collections;
        if (filterType) {
            filtered = collections.filter(c => c.type === filterType);
        }

        const container = document.getElementById('collectionListContainer');
        const listDiv = document.getElementById('collectionsList');

        if (filtered.length === 0) {
            container.style.display = 'block';
            listDiv.innerHTML = '<p style="color:#666;">No collections found</p>';
            return;
        }

        let html = '';
        filtered.forEach(collection => {
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${collection.city} - ${collection.type}</div>
                        <div class="list-item-desc">Contact: ${collection.contactName} (${collection.contactPhone})</div>
                        <div class="list-item-desc">Address: ${collection.address}</div>
                        <div class="list-item-desc">Submitted: ${new Date(collection.timestamp).toLocaleString()}</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-small btn-danger" onclick="deleteCollection('${collection.id}')">Delete</button>
                    </div>
                </div>
            `;
        });

        container.style.display = 'block';
        listDiv.innerHTML = html;
    } catch (error) {
        alert('Error loading collections: ' + error.message);
    }
}

// Delete collection
function deleteCollection(collectionId) {
    if (!confirm('Delete this collection request?')) return;

    try {
        const collections = JSON.parse(localStorage.getItem('smartwaste_collections')) || [];
        const filtered = collections.filter(c => c.id !== collectionId);
        localStorage.setItem('smartwaste_collections', JSON.stringify(filtered));
        alert('Collection deleted');
        listCollections();
        loadAdminStats();
    } catch (error) {
        alert('Error deleting collection: ' + error.message);
    }
}

// Clear archived collections
function clearOldCollections() {
    if (!confirm('Clear all archived collections? This cannot be undone.')) return;

    try {
        const collections = JSON.parse(localStorage.getItem('smartwaste_collections')) || [];
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const filtered = collections.filter(c => new Date(c.timestamp).getTime() > thirtyDaysAgo);
        localStorage.setItem('smartwaste_collections', JSON.stringify(filtered));
        alert(`Removed ${collections.length - filtered.length} archived collections`);
        loadAdminStats();
    } catch (error) {
        alert('Error clearing archives: ' + error.message);
    }
}

// View schedules
function viewSchedules() {
    try {
        const schedules = JSON.parse(localStorage.getItem('smartwaste_schedules')) || [];
        const cityFilter = document.getElementById('scheduleCity').value.trim().toLowerCase();

        let filtered = schedules;
        if (cityFilter) {
            filtered = schedules.filter(s => s.city.toLowerCase().includes(cityFilter));
        }

        const container = document.getElementById('scheduleListContainer');
        const listDiv = document.getElementById('schedulesList');

        if (filtered.length === 0) {
            container.style.display = 'block';
            listDiv.innerHTML = '<p style="color:#666;">No schedules found</p>';
            return;
        }

        let html = '';
        filtered.forEach(schedule => {
            html += `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${schedule.city} - ${schedule.date}</div>
                        <div class="list-item-desc">Type: ${schedule.type}</div>
                        <div class="list-item-desc">Status: <span class="status-badge status-active">${schedule.status || 'Pending'}</span></div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-small btn-danger" onclick="deleteSchedule('${schedule.id}')">Delete</button>
                    </div>
                </div>
            `;
        });

        container.style.display = 'block';
        listDiv.innerHTML = html;
    } catch (error) {
        alert('Error loading schedules: ' + error.message);
    }
}

// Delete schedule
function deleteSchedule(scheduleId) {
    if (!confirm('Delete this schedule?')) return;

    try {
        const schedules = JSON.parse(localStorage.getItem('smartwaste_schedules')) || [];
        const filtered = schedules.filter(s => s.id !== scheduleId);
        localStorage.setItem('smartwaste_schedules', JSON.stringify(filtered));
        alert('Schedule deleted');
        viewSchedules();
        loadAdminStats();
    } catch (error) {
        alert('Error deleting schedule: ' + error.message);
    }
}

// Export schedules data
function exportScheduleData() {
    try {
        const schedules = JSON.parse(localStorage.getItem('smartwaste_schedules')) || [];
        const data = JSON.stringify(schedules, null, 2);
        downloadFile(data, 'schedules-export.json');
        alert('Schedules exported successfully');
    } catch (error) {
        alert('Error exporting schedules: ' + error.message);
    }
}

// Update site settings
function updateSiteSettings() {
    try {
        const siteName = document.getElementById('siteName').value || 'SMART WASTE';
        const siteStatus = document.getElementById('siteStatus').value;

        const settings = {
            siteName,
            siteStatus,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('admin_settings', JSON.stringify(settings));
        alert('Site settings updated successfully');
    } catch (error) {
        alert('Error updating settings: ' + error.message);
    }
}

// Reset settings
function resetSettings() {
    if (!confirm('Reset all settings to default?')) return;

    try {
        localStorage.removeItem('admin_settings');
        document.getElementById('siteName').value = 'SMART WASTE';
        document.getElementById('siteStatus').value = 'active';
        alert('Settings reset to default');
    } catch (error) {
        alert('Error resetting settings: ' + error.message);
    }
}

// Export all data
function exportAllData() {
    try {
        const allData = {
            users: JSON.parse(localStorage.getItem('smartwaste_users')) || [],
            collections: JSON.parse(localStorage.getItem('smartwaste_collections')) || [],
            schedules: JSON.parse(localStorage.getItem('smartwaste_schedules')) || [],
            exports: JSON.parse(localStorage.getItem('smartwaste_exports')) || [],
            timestamp: new Date().toISOString()
        };

        const data = JSON.stringify(allData, null, 2);
        downloadFile(data, 'smart-waste-backup-' + Date.now() + '.json');
        alert('Full backup exported successfully');
    } catch (error) {
        alert('Error exporting data: ' + error.message);
    }
}

// Backup database
function backupDatabase() {
    try {
        const backup = {
            collections: JSON.parse(localStorage.getItem('smartwaste_collections')) || [],
            schedules: JSON.parse(localStorage.getItem('smartwaste_schedules')) || [],
            users: JSON.parse(localStorage.getItem('smartwaste_users')) || [],
            backupDate: new Date().toISOString()
        };

        const data = JSON.stringify(backup, null, 2);
        downloadFile(data, 'database-backup-' + Date.now() + '.json');
        alert('Database backed up successfully');
    } catch (error) {
        alert('Error backing up database: ' + error.message);
    }
}

// Clear all data
function clearAllData() {
    if (!confirm('⚠️ WARNING: This will permanently delete ALL data in the database. This cannot be undone. Are you absolutely sure?')) {
        return;
    }

    if (!confirm('This is your last chance. Click OK to PERMANENTLY DELETE all data.')) {
        return;
    }

    try {
        localStorage.removeItem('smartwaste_collections');
        localStorage.removeItem('smartwaste_schedules');
        localStorage.removeItem('smartwaste_users');
        localStorage.removeItem('smartwaste_exports');
        localStorage.removeItem('smartwaste_login_history');
        alert('All database cleared successfully');
        loadAdminStats();
    } catch (error) {
        alert('Error clearing database: ' + error.message);
    }
}

// Check system health
function checkSystemHealth() {
    try {
        const users = JSON.parse(localStorage.getItem('smartwaste_users')) || [];
        const storageUsed = new Blob(Object.values(localStorage)).size;
        const storageTotal = 5 * 1024 * 1024; // 5MB typical limit
        const storagePercent = ((storageUsed / storageTotal) * 100).toFixed(2);

        document.getElementById('storageUsage').textContent = `${storagePercent}% (${(storageUsed / 1024).toFixed(2)} KB)`;
        document.getElementById('systemUsers').textContent = users.length;
        document.getElementById('dbSize').textContent = `${(storageUsed / 1024).toFixed(2)} KB`;
    } catch (error) {
        console.error('Error checking system health:', error);
    }
}

// Helper function to download file
function downloadFile(data, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
