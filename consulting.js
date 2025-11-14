// ==================== CONSULTING CHAT FUNCTIONALITY ====================

// Store messages in localStorage
const STORAGE_KEYS = {
    PUBLIC_MESSAGES: 'consulting_public_messages',
    PRIVATE_MESSAGES: 'consulting_private_messages',
    CURRENT_USER: 'current_user'
};

// Initialize consulting on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAllMessages();
    attachEventListeners();
    updateUserInfo();
});

// Get current user info
function getCurrentUser() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (!user) {
        const randomId = Math.random().toString(36).substr(2, 9);
        const defaultUser = {
            id: randomId,
            name: `User_${randomId.substr(0, 5)}`
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
        return defaultUser;
    }
    return user;
}

// Switch between chat modes
function switchChatMode(mode) {
    // Hide all chat sections
    document.getElementById('publicChat').classList.remove('active');
    document.getElementById('privateChat').classList.remove('active');
    
    // Hide all buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected chat and button
    if (mode === 'public') {
        document.getElementById('publicChat').classList.add('active');
        document.querySelectorAll('.mode-btn')[0].classList.add('active');
    } else {
        document.getElementById('privateChat').classList.add('active');
        document.querySelectorAll('.mode-btn')[1].classList.add('active');
    }
}

// Load all messages from storage
function loadAllMessages() {
    loadPublicMessages();
    loadPrivateMessages();
}

// Load public messages
function loadPublicMessages() {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.PUBLIC_MESSAGES)) || [];
    const chatBody = document.getElementById('publicChatBody');
    
    if (messages.length === 0) {
        chatBody.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    chatBody.innerHTML = messages.map(msg => createMessageHTML(msg)).join('');
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Load private messages
function loadPrivateMessages() {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIVATE_MESSAGES)) || [];
    const chatBody = document.getElementById('privateChatBody');
    const adminInfoSection = chatBody.querySelector('.admin-info');
    
    if (messages.length === 0) {
        chatBody.innerHTML = `
            <div class="admin-info">
                <h3>👨‍💼 Admin Support</h3>
                <p style="margin: 0;">Our admin team is here to help with your specific concerns</p>
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">🔒</div>
                <p>Your private messages with admin appear here</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="admin-info">
            <h3>👨‍💼 Admin Support</h3>
            <p style="margin: 0;">Our admin team is here to help with your specific concerns</p>
        </div>
    `;
    html += messages.map(msg => createMessageHTML(msg)).join('');
    
    chatBody.innerHTML = html;
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Create message HTML
function createMessageHTML(message) {
    const currentUser = getCurrentUser();
    const isOwn = message.userId === currentUser.id;
    const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="message ${isOwn ? 'own' : 'other'}">
            <div>
                <div class="message-sender">${isOwn ? 'You' : message.senderName} • ${timestamp}</div>
                <div class="message-content">${escapeHtml(message.text)}</div>
            </div>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Send public message
function sendPublicMessage() {
    const input = document.getElementById('publicMessageInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('Please enter a message');
        return;
    }
    
    const currentUser = getCurrentUser();
    const message = {
        id: Date.now(),
        userId: currentUser.id,
        senderName: currentUser.name,
        text: text,
        timestamp: new Date().toISOString()
    };
    
    // Store message
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.PUBLIC_MESSAGES)) || [];
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.PUBLIC_MESSAGES, JSON.stringify(messages));
    
    // Clear input and reload messages
    input.value = '';
    loadPublicMessages();
}

// Send private message to admin
function sendPrivateMessage() {
    const input = document.getElementById('privateMessageInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('Please enter a message');
        return;
    }
    
    const currentUser = getCurrentUser();
    const message = {
        id: Date.now(),
        userId: currentUser.id,
        senderName: currentUser.name,
        text: text,
        timestamp: new Date().toISOString(),
        isToAdmin: true
    };
    
    // Store message
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIVATE_MESSAGES)) || [];
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.PRIVATE_MESSAGES, JSON.stringify(messages));
    
    // Clear input and reload messages
    input.value = '';
    loadPrivateMessages();
}

// Attach event listeners for Enter key
function attachEventListeners() {
    const publicInput = document.getElementById('publicMessageInput');
    const privateInput = document.getElementById('privateMessageInput');
    
    if (publicInput) {
        publicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendPublicMessage();
            }
        });
    }
    
    if (privateInput) {
        privateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendPrivateMessage();
            }
        });
    }
}

// Update user info in page
function updateUserInfo() {
    const currentUser = getCurrentUser();
    const userList = document.getElementById('onlineUsersList');
    
    // Update first user item to show current user
    const firstUserItem = userList.querySelector('.user-item');
    if (firstUserItem) {
        firstUserItem.querySelector('.name').textContent = `${currentUser.name} (You)`;
    }
}

// Auto-refresh messages every 2 seconds
setInterval(() => {
    loadAllMessages();
}, 2000);
