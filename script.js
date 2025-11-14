// ==================== APPLICATION CONFIGURATION ====================
// Uses local JSON database (collectionDB) for all data persistence
// Optional: Set USE_BACKEND_API to true to use backend server (http://localhost:5000)
// Set to false to use only local database (works offline, no backend required)

const USE_BACKEND_API = false;  // Toggle between backend API (true) and local database (false)
const API_URL = 'http://localhost:5000/api';

// ==================== INTERNET CONNECTION DETECTION ====================

const connectionStatus = document.getElementById('connectionStatus');
const connectionText = document.getElementById('connectionText');

// Check initial connection status (safe if UI removed)
function checkConnection() {
    if (navigator.onLine) {
        setOnlineStatus();
    } else {
        setOfflineStatus();
    }
}

// Set online status (no-op if elements are not present)
function setOnlineStatus() {
    if (connectionStatus) {
        connectionStatus.classList.remove('offline');
        connectionStatus.classList.add('online');
    }
    if (connectionText) connectionText.textContent = '🟢 Online';
    console.log('Internet connection: ONLINE');
}

// Set offline status (no-op if elements are not present)
function setOfflineStatus() {
    if (connectionStatus) {
        connectionStatus.classList.remove('online');
        connectionStatus.classList.add('offline');
    }
    if (connectionText) connectionText.textContent = '🔴 Offline';
    console.log('Internet connection: OFFLINE');
}

// Listen for online event
window.addEventListener('online', () => {
    setOnlineStatus();
    showNotification('✓ Back online!', 'success');
});

// Listen for offline event
window.addEventListener('offline', () => {
    setOfflineStatus();
    showNotification('✗ You are offline. Some features may not work.', 'error');
});

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 130px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        background-color: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        font-weight: 600;
        z-index: 1001;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check connection on page load
document.addEventListener('DOMContentLoaded', checkConnection);

// ==================== AUTH SYSTEM ====================
const authModal = document.getElementById('authModal');

// Open auth modal
function openLoginModal(e) {
    e.preventDefault();
    authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close auth modal
function closeAuthModal() {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetAuthForms();
}

// Switch between Sign In and Sign Up tabs
function switchTab(tabId, event) {
    event.preventDefault();
    
    // Hide all tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
}

// Switch between User and Admin signup types
function switchSignupType(type, event) {
    event.preventDefault();
    
    // Update button states
    document.querySelectorAll('.signup-type-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'white';
        btn.style.color = '#333';
        btn.style.borderColor = '#ddd';
    });
    
    event.target.classList.add('active');
    event.target.style.background = '#1abc9c';
    event.target.style.color = 'white';
    event.target.style.borderColor = '#1abc9c';
    
    // Show/hide forms based on type
    if (type === 'user') {
        document.getElementById('userSignupForm').style.display = 'block';
        document.getElementById('adminSignupForm').style.display = 'none';
    } else {
        document.getElementById('userSignupForm').style.display = 'none';
        document.getElementById('adminSignupForm').style.display = 'block';
    }
}

// Reset all auth forms
function resetAuthForms() {
    document.getElementById('signInForm').reset();
    document.getElementById('signUpForm').reset();
    document.getElementById('adminSignUpFormModal').reset();
    document.getElementById('signInTab').classList.add('active');
    document.getElementById('signUpTab').classList.remove('active');
}

// Handle Sign In
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value.trim();
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    try {
        // Use local JSON database for authentication
        const user = userDB.verifyUser(email, password);
        
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: email,
            loggedInAt: new Date().toISOString()
        }));
        
        alert('✓ Signed in successfully!');
        closeAuthModal();
        // Update nav to show user is logged in
        updateNavbarForLoggedIn(email);
    } catch (error) {
        console.error('Sign in error:', error);
        alert('Sign in failed: ' + error.message);
    }
});

// Handle Sign Up
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();
    const confirmPassword = document.getElementById('signUpConfirmPassword').value.trim();
    
    // Validation
    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        // Use local JSON database for registration
        const user = userDB.registerUser(email, password);
        
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: email,
            registeredAt: new Date().toISOString()
        }));
        
        alert('✓ Account created successfully! Welcome to SMART WASTE!');
        closeAuthModal();
        // Update nav to show user is logged in
        updateNavbarForLoggedIn(email);
    } catch (error) {
        console.error('Sign up error:', error);
        alert('Sign up failed: ' + error.message);
    }
});

// Handle Admin Sign Up from modal - wrap in timeout to ensure form exists
setTimeout(() => {
    const adminSignUpForm = document.getElementById('adminSignUpFormModal');
    if (adminSignUpForm) {
        adminSignUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('adminSignUpEmailModal').value.trim();
            const password = document.getElementById('adminSignUpPasswordModal').value.trim();
            const confirmPassword = document.getElementById('adminSignUpConfirmPasswordModal').value.trim();
            
            // Validation
            if (!email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                // Use local JSON database for admin registration
                const user = userDB.register(email, password);
                
                // Save user info to localStorage
                localStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    email: email,
                    registeredAt: new Date().toISOString()
                }));
                
                // Set admin authentication flag
                sessionStorage.setItem('adminAuthenticated', 'true');
                
                alert('✓ Admin account created successfully!');
                closeAuthModal();
                // Redirect to admin dashboard
                window.location.href = 'admin.html';
            } catch (error) {
                console.error('Admin sign up error:', error);
                alert('Admin sign up failed: ' + error.message);
            }
        });
    }
}, 100);

// Update navbar when user logs in
function updateNavbarForLoggedIn(email) {
    const loginBtn = document.getElementById('loginBtn');
    const profileContainer = document.getElementById('profileContainer');
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    const profileEmail = document.getElementById('profileEmail');
    const profileMember = document.getElementById('profileMember');
    const btnLogout = document.getElementById('btnLogout');
    const btnProfile = document.getElementById('btnProfile');
    const btnSettings = document.getElementById('btnSettings');

    // Hide the login link and show profile container
    if (loginBtn) loginBtn.style.display = 'none';
    if (profileContainer) profileContainer.style.display = 'block';

    // Populate profile details from stored user
    try {
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        const user = userDB.getUserById(userData.id) || userDB.getUserByEmail(email) || {};
        if (profileEmail) profileEmail.textContent = user.email || email || 'User';
        if (profileMember) profileMember.textContent = user.createdAt ? 'Member since: ' + new Date(user.createdAt).toLocaleDateString() : '';
    } catch (err) {
        console.warn('Unable to populate profile details', err);
    }

    // Toggle menu
    profileToggle && profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!profileMenu) return;
        profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (profileMenu && !profileMenu.contains(e.target) && e.target !== profileToggle) {
            profileMenu.style.display = 'none';
        }
    });

    // Logout handler
    if (btnLogout) {
        btnLogout.onclick = (e) => {
            e.preventDefault();
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            if (userData && userData.id) userDB.recordLogout(userData.id);
            localStorage.removeItem('user');
            // revert UI
            if (loginBtn) { loginBtn.style.display = 'inline-block'; loginBtn.textContent = 'Login'; loginBtn.onclick = openLoginModal; }
            if (profileContainer) profileContainer.style.display = 'none';
            if (profileMenu) profileMenu.style.display = 'none';
            alert('Logged out successfully');
        };
    }

    // Profile and Settings buttons (simple navigation placeholders)
    if (btnProfile) btnProfile.onclick = (e) => { e.preventDefault(); window.location.href = 'profile.html'; };
    if (btnSettings) btnSettings.onclick = (e) => { e.preventDefault(); window.location.href = 'settings.html'; };
 }

// Admin button before login (always visible)
document.addEventListener('DOMContentLoaded', () => {
    const adminBtnBefore = document.getElementById('adminBtnBefore');
    if (adminBtnBefore) {
        adminBtnBefore.onclick = (e) => { e.preventDefault(); window.location.href = 'admin.html'; };
    }
});

// Theme and site settings handling
function setTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (err) {
        console.warn('Failed to save theme', err);
    }
    applyTheme();
}

function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    const existing = document.getElementById('site-theme-styles');
    if (existing) existing.remove();

    if (theme === 'dark') {
        const css = `
        body.dark-mode { background:#0f1720; color:#e6eef9; }
        body.dark-mode .navbar { background: #071127; }
        body.dark-mode .page, body.dark-mode .profile-page { background: transparent; }
        body.dark-mode .profile-card, body.dark-mode .collection-item, body.dark-mode .service-card { background: #071127; box-shadow: 0 6px 18px rgba(0,0,0,0.6); color: #d9e6ff; }
        body.dark-mode .btn { background: #0b2a3a; color: #d9e6ff; border: 1px solid rgba(255,255,255,0.06); }
        body.dark-mode a.nav-link { color: #cfe8ff; }
        `;
        const s = document.createElement('style');
        s.id = 'site-theme-styles';
        s.appendChild(document.createTextNode(css));
        document.head.appendChild(s);
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Ensure theme applied on page load
document.addEventListener('DOMContentLoaded', applyTheme);// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateNavbarForLoggedIn(userData.email);
    }
});

// Close modal when clicking outside
authModal?.addEventListener('click', function(e) {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// ==================== EXISTING CODE ====================
// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);

    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== COLLECTIONS FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', () => {
    // Hook Collections form and load existing
    const collectionForm = document.getElementById('collectionForm');
    const refreshBtn = document.getElementById('refreshCollections');
    if (collectionForm) {
        collectionForm.addEventListener('submit', submitCollectionForm);
        refreshBtn?.addEventListener('click', loadCollections);
        // Load on page load
        loadCollections();
    }
});

// Submit collection form - supports both backend API and local database
function submitCollectionForm(e) {
    e.preventDefault();
    const payload = {
        address: document.getElementById('c_address').value.trim(),
        city: document.getElementById('c_city').value.trim(),
        postalCode: document.getElementById('c_postal').value.trim(),
        contactName: document.getElementById('c_contactName').value.trim(),
        contactPhone: document.getElementById('c_contactPhone').value.trim(),
        type: document.getElementById('c_type').value,
        notes: document.getElementById('c_notes').value.trim()
    };

    // Basic validation
    if (!payload.address || !payload.city || !payload.contactName || !payload.contactPhone || !payload.type) {
        alert('Please fill all required fields');
        return;
    }

    if (USE_BACKEND_API) {
        submitCollectionToBackend(payload);
    } else {
        submitCollectionToLocal(payload);
    }
}

// Submit to backend API
async function submitCollectionToBackend(payload) {
    try {
        const res = await fetch(`${API_URL}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
            alert(`✓ Request submitted!\n\nRequest ID: ${data.data.id}\n\nPlease save this number to track your request.`);
            document.getElementById('collectionForm').reset();
            loadCollections();
        } else {
            alert('Failed to submit: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        console.error('Error submitting to backend', err);
        alert('Backend error: ' + err.message);
    }
}

// Submit to local database
function submitCollectionToLocal(payload) {
    try {
        const result = collectionDB.createCollection(payload);
        
        alert(`✓ Request submitted!\n\nConfirmation #: ${result.confirmationNumber}\nRequest ID: ${result.id}\n\nPlease save this number to track your request.`);
        document.getElementById('collectionForm').reset();
        loadCollections();
    } catch (err) {
        console.error('Error submitting to local database', err);
        alert('Error: ' + err.message);
    }
}

// Load collections - supports both backend API and local database
function loadCollections() {
    const listEl = document.getElementById('collectionsList');
    if (!listEl) return;
    
    if (USE_BACKEND_API) {
        loadCollectionsFromBackend();
    } else {
        loadCollectionsFromLocal();
    }
}

// Load from backend API
async function loadCollectionsFromBackend() {
    const listEl = document.getElementById('collectionsList');
    listEl.innerHTML = '<p style="padding:1rem;color:#888;">Loading...</p>';
    
    try {
        const res = await fetch(`${API_URL}/collections`);
        const data = await res.json();
        
        if (res.ok && data.success) {
            renderCollections(data.data || []);
        } else {
            listEl.innerHTML = '<p style="padding:1rem;color:#c0392b;">Unable to load collections</p>';
        }
    } catch (err) {
        console.error('Error loading collections from backend', err);
        listEl.innerHTML = '<p style="padding:1rem;color:#c0392b;">Backend error. Server running?</p>';
    }
}

// Load from local database
function loadCollectionsFromLocal() {
    const listEl = document.getElementById('collectionsList');
    try {
        const collections = collectionDB.getAllCollections();
        renderCollections(collections);
    } catch (err) {
        console.error('Error loading collections from local database', err);
        listEl.innerHTML = '<p style="padding:1rem;color:#c0392b;">Error loading collections</p>';
    }
}

function renderCollections(items) {
    const listEl = document.getElementById('collectionsList');
    if (!listEl) return;
    if (!items.length) {
        listEl.innerHTML = '<p style="padding:1rem;color:#888;">No requests yet.</p>';
        return;
    }
    listEl.innerHTML = items.map(item => `
        <div class="collection-item" data-id="${item.id}">
            <div class="collection-meta">
                <strong>${item.type.toUpperCase()}</strong> — ${item.address}, ${item.city} ${item.postalCode || ''}<br>
                <span>📞 ${item.contactName} (${item.contactPhone})</span><br>
                <small>Status: <strong>${item.status}</strong> • Created: ${new Date(item.createdAt).toLocaleDateString()}</small>
                ${ (item.scheduledDate || item.scheduledAt) ? `<br><small>🗓️ Scheduled: <strong>${new Date(item.scheduledDate || item.scheduledAt).toLocaleString()}</strong></small>` : '' }
            </div>
            <div class="collection-actions">
                <button class="btn" onclick="scheduleCollection('${item.id}')">Schedule</button>
                <button class="btn" onclick="deleteCollection('${item.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteCollection(id) {
    if (!confirm('Delete this collection request?')) return;
    
    if (USE_BACKEND_API) {
        deleteCollectionFromBackend(id);
    } else {
        deleteCollectionFromLocal(id);
    }
}

async function deleteCollectionFromBackend(id) {
    try {
        const res = await fetch(`${API_URL}/collections/${id}`, { method: 'DELETE' });
        const data = await res.json();
        
        if (res.ok && data.success) {
            alert('Collection request deleted');
            loadCollections();
        } else {
            alert('Failed to delete: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        console.error('Delete error', err);
        alert('Backend error: ' + err.message);
    }
}

function deleteCollectionFromLocal(id) {
    try {
        collectionDB.deleteCollection(id);
        alert('Collection request deleted');
        loadCollections();
    } catch (err) {
        console.error('Delete error', err);
        alert('Error: ' + err.message);
    }
}

function scheduleCollection(id) {
    const datetime = prompt('Enter scheduled date (YYYY-MM-DD HH:MM):', new Date().toISOString().slice(0, 16));
    if (!datetime) return;
    
    if (USE_BACKEND_API) {
        scheduleCollectionOnBackend(id, datetime);
    } else {
        scheduleCollectionOnLocal(id, datetime);
    }
}

async function scheduleCollectionOnBackend(id, datetime) {
    try {
        const res = await fetch(`${API_URL}/collections/${id}/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduledAt: datetime })
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
            alert('Collection scheduled!');
            loadCollections();
        } else {
            alert('Failed to schedule: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        console.error('Schedule error', err);
        alert('Backend error: ' + err.message);
    }
}

function scheduleCollectionOnLocal(id, datetime) {
    try {
        collectionDB.scheduleCollection(id, datetime);
        alert('Collection scheduled!');
        loadCollections();
    } catch (err) {
        console.error('Schedule error', err);
        alert('Error: ' + err.message);
    }
}

// Save request to local storage backend

// Export local schedules as JSON file
function exportLocalSchedules() {
    try {
        const schedules = collectionDB.getAllSchedules();
        if (!schedules || !schedules.length) {
            alert('No local schedules to export');
            return;
        }

        const dataStr = JSON.stringify({ exportedAt: new Date().toISOString(), schedules }, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `local_schedules_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showNotification('Local schedules exported', 'success');
    } catch (err) {
        console.error('Export schedules error', err);
        alert('Failed to export schedules: ' + (err.message || err));
    }
}

// Sync local schedules to server (POST to /api/schedules). Marks local entries as synced when successful.
async function syncLocalSchedulesToServer() {
    if (!navigator.onLine) {
        alert('You are offline. Connect to the internet to sync.');
        return;
    }

    const schedules = collectionDB.getAllSchedules();
    if (!schedules || !schedules.length) {
        alert('No local schedules to sync');
        return;
    }

    const toSync = schedules.filter(s => !s.serverId && !s.syncedAt);
    if (!toSync.length) {
        alert('All local schedules are already synced');
        return;
    }

    let successes = 0;
    let failures = 0;

    for (const s of toSync) {
        try {
            const payload = {
                collectionId: s.collectionId,
                scheduledAt: s.scheduledAt || s.scheduledDate || s.scheduledAt,
                meta: {
                    confirmationNumber: s.confirmationNumber || null,
                    contactName: s.contactName || null,
                    address: s.address || null
                }
            };

            const res = await fetch(`${API_URL}/schedules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success && data.data && data.data.id) {
                // mark local schedule as synced
                try {
                    collectionDB.updateSchedule(s.id, { serverId: data.data.id, syncedAt: new Date().toISOString() });
                } catch (err) {
                    console.warn('Failed to mark schedule synced locally', err);
                }
                successes++;
            } else {
                console.warn('Server rejected schedule', data);
                failures++;
            }
        } catch (err) {
            console.error('Sync error for schedule', s, err);
            failures++;
        }
    }

    showNotification(`Sync complete: ${successes} succeeded, ${failures} failed`, failures ? 'error' : 'success');
    loadCollections();
}

// Wire up export/sync buttons on page load
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportSchedulesBtn');
    const syncBtn = document.getElementById('syncSchedulesBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportLocalSchedules);
    if (syncBtn) syncBtn.addEventListener('click', syncLocalSchedulesToServer);
        const exportDbBtn = document.getElementById('exportDbBtn');
        const importDbBtn = document.getElementById('importDbBtn');
        const importFileInput = document.getElementById('importFileInput');
        if (exportDbBtn) exportDbBtn.addEventListener('click', exportLocalDatabase);
        if (importDbBtn && importFileInput) importDbBtn.addEventListener('click', () => importFileInput.click());
        if (importFileInput) importFileInput.addEventListener('change', handleImportFile);
});

// Export the full local database (collections + schedules) and save a copy to localStorage exports
function exportLocalDatabase() {
    try {
        const data = collectionDB.exportData();
        const schedules = collectionDB.getAllSchedules();
        const payload = {
            exportedAt: new Date().toISOString(),
            collections: data.collections,
            statistics: data.statistics,
            schedules
        };

        // Save a copy to localStorage exports
        const exportsKey = 'smartwaste_exports';
        const raw = localStorage.getItem(exportsKey) || '[]';
        const arr = JSON.parse(raw);
        arr.push({ id: 'EXP_' + Date.now(), savedAt: new Date().toISOString(), payload });
        localStorage.setItem(exportsKey, JSON.stringify(arr));

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartwaste_localdb_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showNotification('Local database exported', 'success');
    } catch (err) {
        console.error('Export DB error', err);
        alert('Failed to export local database: ' + (err.message || err));
    }
}

// Handle import file input change
function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
        try {
            const obj = JSON.parse(reader.result);
            if (obj.collections && Array.isArray(obj.collections)) {
                collectionDB.importData({ collections: obj.collections });
            }
            if (obj.schedules && Array.isArray(obj.schedules)) {
                collectionDB.importSchedules(obj.schedules);
            }
            showNotification('Import completed', 'success');
            loadCollections();
        } catch (err) {
            console.error('Import error', err);
            alert('Failed to import file: ' + (err.message || err));
        }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = null;
}


// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Location Finder Database - Mock facilities data
const facilitiesDatabase = {
    'new york': [
        { name: 'NYC Central Recycling Hub', address: '123 Green Street, Manhattan', distance: '2.5 km', type: 'Recycling Center' },
        { name: 'East Side Waste Management', address: '456 Eco Avenue, Queens', distance: '5.2 km', type: 'Collection Point' },
        { name: 'Brooklyn Composting Facility', address: '789 Organic Lane, Brooklyn', distance: '3.8 km', type: 'Composting Center' }
    ],
    'los angeles': [
        { name: 'LA Eco Recycling', address: '321 Sustainability Blvd, Downtown LA', distance: '1.9 km', type: 'Recycling Center' },
        { name: 'West Coast Waste Solutions', address: '654 Green Park, Santa Monica', distance: '8.5 km', type: 'Waste Management' },
        { name: 'Valley Composting Station', address: '987 Organic Way, San Fernando Valley', distance: '12.3 km', type: 'Composting Center' }
    ],
    'chicago': [
        { name: 'Chicago Waste Hub', address: '111 Lake Shore Drive', distance: '3.1 km', type: 'Recycling Center' },
        { name: 'Illinois Recycling Center', address: '222 River Road, Chicago', distance: '6.7 km', type: 'Collection Point' },
        { name: 'Midwest Composting', address: '333 Green Field, Oak Park', distance: '9.4 km', type: 'Composting Center' }
    ],
    'default': [
        { name: 'National Recycling Center', address: 'Main Street, Your City', distance: '4.0 km', type: 'Recycling Center' },
        { name: 'Local Waste Management', address: 'Eco Boulevard, Your City', distance: '6.5 km', type: 'Waste Management' },
        { name: 'Community Composting Hub', address: 'Green Lane, Your City', distance: '5.2 km', type: 'Composting Center' }
    ]
};

// Find Nearest Location Function
function findNearestLocation() {
    const locationInput = document.getElementById('locationInput').value.toLowerCase().trim();
    const resultsBox = document.getElementById('locationResults');
    const facilitiesList = document.getElementById('facilitiesList');

    if (!locationInput) {
        alert('Please enter a city or ZIP code');
        return;
    }

    // Get facilities for the entered location
    let facilities = facilitiesDatabase[locationInput] || facilitiesDatabase['default'];

    // Generate HTML for facilities
    facilitiesList.innerHTML = facilities.map(facility => `
        <div class="facility-card">
            <h4>${facility.name}</h4>
            <p><strong>Type:</strong> ${facility.type}</p>
            <p><strong>Address:</strong> ${facility.address}</p>
            <div class="distance">📍 ${facility.distance} away</div>
        </div>
    `).join('');

    resultsBox.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        resultsBox.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Allow Enter key in location input
document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                findNearestLocation();
            }
        });
    }
});

// (Carbon calculator removed)

// Contact Form Handling
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Validate
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Show success message
    alert(`Thank you ${name}! Your message has been sent. We'll get back to you soon at ${email}`);
    
    // Reset form
    this.reset();
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and other elements
document.querySelectorAll('.service-card, .stat, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
    
    lastScroll = currentScroll;
});

// Initialize tooltips for stats
document.querySelectorAll('.stat').forEach(stat => {
    stat.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    stat.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
    }
});

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== ADMIN AUTHENTICATION ====================

// Check admin authentication on Admin button click
function checkAdminAuth(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
        // User already logged in, go to admin dashboard
        window.location.href = 'admin.html';
    } else {
        // Redirect to admin signup page
        window.location.href = 'admin-signup.html';
    }
}

// Close admin auth modal
function closeAdminAuthModal() {
    const adminAuthModal = document.getElementById('adminAuthModal');
    if (adminAuthModal) {
        adminAuthModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetAdminAuthForms();
    }
}

// Reset admin auth forms
function resetAdminAuthForms() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminSignupForm = document.getElementById('adminSignupForm');
    if (adminLoginForm) adminLoginForm.reset();
    if (adminSignupForm) adminSignupForm.reset();
}

// Switch between admin login and signup tabs
function switchAdminAuthTab(tabId, event) {
    event.preventDefault();
    const tabs = document.querySelectorAll('.admin-auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Admin Login Handler
document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('adminLoginEmail').value.trim();
            const password = document.getElementById('adminLoginPassword').value;
            
            try {
                const userData = userDB.login(email, password);
                if (userData) {
                    localStorage.setItem('user', JSON.stringify(userData));
                    sessionStorage.setItem('adminAuthenticated', 'true');
                    closeAdminAuthModal();
                    // Redirect to admin dashboard
                    window.location.href = 'admin.html';
                } else {
                    alert('Invalid email or password');
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }
    
    // Admin Signup Handler
    const adminSignupForm = document.getElementById('adminSignupForm');
    if (adminSignupForm) {
        adminSignupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('adminSignupEmail').value.trim();
            const password = document.getElementById('adminSignupPassword').value;
            const confirmPassword = document.getElementById('adminSignupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const userData = userDB.register(email, password);
                localStorage.setItem('user', JSON.stringify(userData));
                sessionStorage.setItem('adminAuthenticated', 'true');
                closeAdminAuthModal();
                // Redirect to admin dashboard
                window.location.href = 'admin.html';
            } catch (error) {
                alert('Sign up failed: ' + error.message);
            }
        });
    }
});

// (Print/report functionality removed)

// (Map offline fallback removed)

