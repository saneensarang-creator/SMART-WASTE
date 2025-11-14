// CO Monitor Speedometer Logic

let monitoringInterval = null;
let currentCOLevel = 0;

// Update speedometer needle and display
function updateSpeedometer(ppm) {
    const needle = document.getElementById('coNeedle');
    const ppmValue = document.getElementById('ppmValue');
    const statusBadge = document.getElementById('statusBadge');
    
    currentCOLevel = Math.max(0, Math.min(400, ppm));
    
    // Update digital display
    ppmValue.textContent = Math.round(currentCOLevel);
    
    // Calculate needle rotation angle
    // Safe zone: 0-35 ppm (-90 to -60 degrees)
    // Warning zone: 35-100 ppm (-60 to -30 degrees)
    // Danger zone: 100-400 ppm (-30 to 0 degrees)
    let angle;
    if (currentCOLevel <= 35) {
        angle = -90 + (currentCOLevel / 35) * 30;
    } else if (currentCOLevel <= 100) {
        angle = -60 + ((currentCOLevel - 35) / 65) * 30;
    } else {
        angle = -30 + ((currentCOLevel - 100) / 300) * 30;
    }
    
    needle.style.transform = `translateX(-3px) rotate(${angle}deg)`;
    
    // Update status badge
    statusBadge.classList.remove('status-safe', 'status-warning', 'status-danger');
    
    if (currentCOLevel <= 35) {
        statusBadge.textContent = '✓ SAFE - Normal Air Quality';
        statusBadge.classList.add('status-safe');
    } else if (currentCOLevel <= 100) {
        statusBadge.textContent = '⚠️ WARNING - CO Detected';
        statusBadge.classList.add('status-warning');
    } else {
        statusBadge.textContent = '🚨 DANGER - High CO Level';
        statusBadge.classList.add('status-danger');
    }
}

// Start realistic CO monitoring simulation
function startMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        return;
    }
    
    // Start with a safe baseline
    currentCOLevel = 15;
    updateSpeedometer(currentCOLevel);
    
    // Simulate realistic CO level fluctuations
    monitoringInterval = setInterval(() => {
        // Random walk with bias toward safe levels
        let change = (Math.random() - 0.4) * 8;
        currentCOLevel += change;
        
        // Keep within bounds and add some "peaks" occasionally
        currentCOLevel = Math.max(0, Math.min(400, currentCOLevel));
        
        // Occasional spike events (5% chance)
        if (Math.random() < 0.05) {
            currentCOLevel = Math.min(400, currentCOLevel + 25);
        }
        
        updateSpeedometer(currentCOLevel);
    }, 1200);
}

// Reset monitor to zero
function resetMonitor() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
    currentCOLevel = 0;
    updateSpeedometer(0);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateSpeedometer(0);
    
    // Update navbar based on login state
    if (typeof updateNavbar === 'function') {
        updateNavbar();
    }
});
