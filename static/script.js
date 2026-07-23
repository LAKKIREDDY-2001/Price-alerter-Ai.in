// Dashboard JavaScript - Main app functionality with celebration
let trackers = [];
let currentFilter = 'all';
let currentTracker = null;
let celebrationTracker = null;

// Backend API configuration
const getApiBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.origin;
    }
    if (window.location.hostname.includes('github.io') || window.location.hostname === 'pricealerter.in') {
        return 'https://price-alerter.onrender.com';
    }
    return window.location.origin;
};
const API_BASE_URL = getApiBaseUrl();

// Celebration Configuration
const celebrationColors = [
    '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', 
    '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f0a'
];

document.addEventListener('DOMContentLoaded', () => {
    loadTrackers();
    setupNavigation();
    loadUserData();
    initTilt();
    initCelebration();
});

// ==================== CELEBRATION FUNCTIONS ====================

function initCelebration() {
    // Close modal on outside click
    const modal = document.getElementById('celebration-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCelebration();
            }
        });
    }
}

function showCelebration(tracker) {
    const modal = document.getElementById('celebration-modal');
    const productNameEl = document.getElementById('celeb-product-name');
    const savingsEl = document.getElementById('celeb-savings');
    
    if (modal && tracker) {
        productNameEl.textContent = tracker.productName || 'Product';
        
        const saved = tracker.currentPrice - tracker.targetPrice;
        savingsEl.textContent = `You save ${tracker.currencySymbol || '$'}${Math.abs(saved).toFixed(2)}`;
        
        modal.classList.add('active');
        createConfetti();
        
        // Play sound effect (optional - browsers may block this)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio playback blocked');
        }
    }
}

function closeCelebration() {
    const modal = document.getElementById('celebration-modal');
    if (modal) {
        modal.classList.remove('active');
        // Clear confetti
        const container = document.getElementById('confetti-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.setProperty('--confetti-color', celebrationColors[Math.floor(Math.random() * celebrationColors.length)]);
        container.appendChild(confetti);
    }
}

function buyNowFromCelebration() {
    if (celebrationTracker && celebrationTracker.url) {
        window.open(celebrationTracker.url, '_blank');
    }
}

function checkPriceReached(tracker) {
    return tracker && tracker.currentPrice <= tracker.targetPrice;
}

// ==================== TILT EFFECT ====================

function initTilt() {
    const tiltRoots = document.querySelectorAll('.tilt-root');
    if (!tiltRoots.length) return;
    if (window.matchMedia('(hover: none)').matches) return;

    tiltRoots.forEach((root) => {
        let rect = null;
        const maxTilt = parseFloat(root.dataset.tilt || '8');

        const handleMove = (event) => {
            if (!rect) rect = root.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const tiltX = (0.5 - y) * maxTilt;
            const tiltY = (x - 0.5) * maxTilt;
            root.classList.add('tilt-active');
            root.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
            root.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
        };

        const handleLeave = () => {
            root.classList.remove('tilt-active');
            root.style.setProperty('--tilt-x', '0deg');
            root.style.setProperty('--tilt-y', '0deg');
            rect = null;
        };

        root.addEventListener('mousemove', handleMove);
        root.addEventListener('mouseleave', handleLeave);
    });
}

// ==================== USER & NAVIGATION ====================

async function loadUserData() {
    try {
        const response = await fetch(API_BASE_URL + '/api/user');
        if (response.ok) {
            const user = await response.json();
            if (user.username) {
                document.getElementById('user-greeting').textContent = 'Welcome, ' + user.username;
            }
        }
    } catch (error) {
        console.log('User not logged in');
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            switchView(view);
        });
    });
}

function switchView(viewName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById('view-' + viewName);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Custom feature hooks
    if (viewName === 'ai-predictions') {
        populateAITrackerSelect();
    }
}

// ==================== PRICE TRACKING ====================

async function handleFlow() {
    const urlInput = document.getElementById('urlInput');
    const priceStep = document.getElementById('priceStep');
    const mainBtn = document.getElementById('mainBtn');
    
    if (!urlInput) {
        showToast('error', 'URL input element not found');
        return;
    }
    
    let url = urlInput.value.trim();
    
    if (!url) {
        showToast('error', 'Please enter a URL');
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.toLowerCase().startsWith('test://')) {
        if (url.startsWith('www.')) {
            url = 'https://' + url;
        } else if (url.includes('.')) {
            url = 'https://' + url;
        } else {
            showToast('error', 'Invalid URL format');
            return;
        }
        urlInput.value = url;
    }
    
    if (priceStep.style.display === 'none') {
        setLoadingState(true, 'Fetching price...');
        
        try {
            const response = await fetch(API_BASE_URL + '/get-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                priceStep.style.display = 'block';
                priceStep.innerHTML = '<p><strong>Current Price: ' + (data.currency_symbol || '$') + data.price + '</strong></p>' +
                    '<input type="number" id="targetPrice" class="product-input" style="width: 150px;" placeholder="Set target price" value="' + (data.price * 0.9).toFixed(2) + '">';
                mainBtn.innerHTML = 'Create Tracker';
                setLoadingState(false);
                
                priceStep.dataset.productName = data.productName || 'Product';
                priceStep.dataset.currentPrice = data.price;
                priceStep.dataset.currency = data.currency;
                priceStep.dataset.currencySymbol = data.currency_symbol;
            } else {
                setLoadingState(false);
                showToast('error', data.error || 'Failed to fetch price');
            }
        } catch (error) {
            setLoadingState(false);
            showToast('error', 'Failed to connect to server');
        }
    } else {
        const targetPrice = document.getElementById('targetPrice').value;
        if (!targetPrice) {
            showToast('error', 'Please set a target price');
            return;
        }
        
        const currentPrice = parseFloat(priceStep.dataset.currentPrice || 0);
        const productName = priceStep.dataset.productName || 'Product';
        const currency = priceStep.dataset.currency || 'USD';
        const currencySymbol = priceStep.dataset.currencySymbol || '$';
        
        await createTracker(url, targetPrice, currentPrice, productName, currency, currencySymbol);
    }
}

function setLoadingState(loading, message) {
    const mainBtn = document.getElementById('mainBtn');
    if (!mainBtn) return;
    
    if (loading) {
        mainBtn.disabled = true;
        mainBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> ' + (message || 'Loading...');
    } else {
        mainBtn.disabled = false;
        mainBtn.innerHTML = 'Start AI Tracking';
    }
}

async function createTracker(url, targetPrice, currentPrice, productName, currency, currencySymbol) {
    const urlInput = document.getElementById('urlInput');
    const mainBtn = document.getElementById('mainBtn');
    const priceStep = document.getElementById('priceStep');
    
    setLoadingState(true, 'Creating tracker...');
    
    try {
        const response = await fetch(API_BASE_URL + '/api/trackers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                currentPrice: currentPrice,
                targetPrice: parseFloat(targetPrice),
                currency: currency,
                currencySymbol: currencySymbol,
                productName: productName
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create tracker');
        }
        
        const newTracker = {
            id: Date.now(),
            url: url,
            productName: productName,
            currentPrice: currentPrice,
            targetPrice: parseFloat(targetPrice),
            currency: currency,
            currencySymbol: currencySymbol,
            createdAt: new Date().toISOString()
        };
        
        trackers.push(newTracker);
        localStorage.setItem('trackers', JSON.stringify(trackers));
        
        setLoadingState(false);
        showToast('success', 'Tracker created successfully!');
        
        urlInput.value = '';
        priceStep.style.display = 'none';
        mainBtn.innerHTML = 'Start AI Tracking';
        
        renderTrackers();
        updateStats();
        switchView('my-trackers');
    } catch (error) {
        setLoadingState(false);
        showToast('error', error.message);
    }
}

// ==================== TRACKERS DISPLAY ====================

async function loadTrackers() {
    try {
        const response = await fetch(API_BASE_URL + '/api/trackers');
        if (response.ok) {
            trackers = await response.json();
            localStorage.setItem('trackers', JSON.stringify(trackers));
        } else {
            trackers = JSON.parse(localStorage.getItem('trackers') || '[]');
        }
    } catch (error) {
        console.error('Failed to load trackers from server:', error);
        trackers = JSON.parse(localStorage.getItem('trackers') || '[]');
    }
    renderTrackers();
    updateStats();
}

function renderTrackers() {
    const container = document.getElementById('trackers-list');
    if (trackers.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa fa-rocket"></i></div><h3>No trackers yet!</h3><p>Create your first price alert to start saving money</p><button class="action-btn" onclick="switchView(\'new-alert\')"><span class="btn-text">Create Tracker</span><span class="btn-icon"><i class="fa fa-plus"></i></span></button></div>';
        return;
    }
    
    let filteredTrackers = trackers;
    if (currentFilter !== 'all') {
        filteredTrackers = trackers.filter(t => {
            if (currentFilter === 'active') return t.currentPrice > t.targetPrice;
            if (currentFilter === 'reached') return t.currentPrice <= t.targetPrice;
            return true;
        });
    }
    
    // Function to get company logo based on URL
    function getCompanyLogo(url) {
        if (!url) return '<i class="fa fa-shopping-bag"></i>';
        const urlLower = url.toLowerCase();
        if (urlLower.includes('amazon')) return '<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" class="company-logo" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'<i class=\\\'fa fa-amazon\\\'></i>\'">';
        if (urlLower.includes('flipkart')) return '<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Flipkart_logo.svg" alt="Flipkart" class="company-logo" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'<i class=\\\'fa fa-shopping-cart\\\'></i>\'">';
        if (urlLower.includes('myntra')) return '<img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Myntra_logo.svg" alt="Myntra" class="company-logo" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'<i class=\\\'fa fa-tag\\\'></i>\'">';
        if (urlLower.includes('ajio')) return '<i class="fa fa-shopping-bag"></i>';
        if (urlLower.includes('meesho')) return '<i class="fa fa-mobile"></i>';
        if (urlLower.includes('snapdeal')) return '<i class="fa fa-shopping-cart"></i>';
        if (urlLower.includes('tatacliq') || urlLower.includes('tata')) return '<i class="fa fa-store"></i>';
        if (urlLower.includes('reliance') || urlLower.includes('reliancedigital')) return '<i class="fa fa-laptop"></i>';
        if (urlLower.includes('ebay')) return '<i class="fa fa-shopping-bag"></i>';
        return '<i class="fa fa-shopping-bag"></i>';
    }
    
    container.innerHTML = filteredTrackers.map(tracker => {
        const status = tracker.currentPrice <= tracker.targetPrice ? 'reached' : 'active';
        const statusClass = status === 'reached' ? 'status-reached' : 'status-active';
        const statusText = status === 'reached' ? 'Target Reached!' : 'Active';
        
        return '<div class="tracker-card" data-id="' + tracker.id + '"><div class="tracker-header"><div class="tracker-info"><div class="tracker-logo">' + getCompanyLogo(tracker.url) + '</div><h4 class="tracker-name">' + (tracker.productName || 'Product') + '</h4></div><div class="tracker-checkbox" onclick="event.stopPropagation(); toggleSelect(' + tracker.id + ')"><i class="fa fa-check" style="display: none;"></i></div></div><div class="tracker-url">' + tracker.url + '</div><div class="tracker-prices"><div class="price-info current"><span class="price-label">Current</span><span class="price-amount">' + (tracker.currencySymbol || '$') + tracker.currentPrice + '</span></div><div class="price-info target"><span class="price-label">Target</span><span class="price-amount">' + (tracker.currencySymbol || '$') + tracker.targetPrice + '</span></div><div class="price-status ' + statusClass + '">' + statusText + '</div></div><div class="tracker-actions"><button class="tracker-action" onclick="viewTrends(' + tracker.id + ')"><i class="fa fa-chart-line"></i> Trends</button><button class="tracker-action" onclick="refreshPrice(' + tracker.id + ')"><i class="fa fa-refresh"></i> Refresh</button><button class="tracker-action simulate" style="background: rgba(255, 159, 10, 0.12); color: #e06c00;" onclick="event.stopPropagation(); simulatePriceDrop(' + tracker.id + ')"><i class="fa fa-magic"></i> Drop Demo</button><button class="tracker-action delete" onclick="deleteTracker(' + tracker.id + ')"><i class="fa fa-trash"></i></button></div>';
    }).join('');
    
    updateCounts();
}

function updateStats() {
    document.getElementById('sidebar-active-trackers').textContent = trackers.length;
    document.getElementById('sidebar-deals').textContent = trackers.filter(t => t.currentPrice <= t.targetPrice).length;
    document.getElementById('total-trackers').textContent = trackers.length;
    document.getElementById('active-deals').textContent = trackers.filter(t => t.currentPrice <= t.targetPrice).length;
    
    if (trackers.length > 0) {
        const totalSavings = trackers
            .filter(t => t.currentPrice <= t.targetPrice)
            .reduce((sum, t) => sum + (t.targetPrice - t.currentPrice), 0);
        const avgSavings = trackers.length > 0 ? Math.round((totalSavings / trackers.length) * 10) / 10 : 0;
        document.getElementById('avg-savings').textContent = avgSavings + '%';
    }
}

function updateCounts() {
    document.getElementById('count-all').textContent = trackers.length;
    document.getElementById('count-active').textContent = trackers.filter(t => t.currentPrice > t.targetPrice).length;
    document.getElementById('count-reached').textContent = trackers.filter(t => t.currentPrice <= t.targetPrice).length;
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) tab.classList.add('active');
    });
    renderTrackers();
}

function filterTrackers() {
    const search = document.getElementById('tracker-search').value.toLowerCase();
    const cards = document.querySelectorAll('.tracker-card');
    cards.forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(search) ? 'block' : 'none';
    });
}

function sortTrackers() {
    const sortBy = document.getElementById('sort-trackers').value;
    trackers.sort((a, b) => {
        if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'name') return (a.productName || '').localeCompare(b.productName || '');
        if (sortBy === 'price') return a.currentPrice - b.currentPrice;
        return 0;
    });
    renderTrackers();
}

// ==================== PRICE REFRESH ====================

async function refreshPrice(trackerId) {
    const tracker = trackers.find(t => t.id === trackerId);
    if (!tracker) return;
    
    const card = document.querySelector('.tracker-card[data-id="' + trackerId + '"]');
    const refreshBtn = card?.querySelector('.tracker-action[onclick*="refreshPrice"]');
    
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    }
    
    try {
        const response = await fetch(API_BASE_URL + '/get-price', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: tracker.url })
        });
        
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fa fa-refresh"></i> Refresh';
        }
        
        const data = await response.json();
        
        if (response.ok) {
            const oldPrice = tracker.currentPrice;
            tracker.currentPrice = data.price;
            tracker.productName = data.productName || tracker.productName;
            
            // Sync with backend SQLite database
            try {
                await fetch(API_BASE_URL + '/api/trackers', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: tracker.id,
                        currentPrice: data.price,
                        productName: data.productName
                    })
                });
            } catch (err) {
                console.error('Failed to sync price update to server:', err);
            }
            
            // Check if target just reached
            if (checkPriceReached(tracker) && oldPrice > tracker.targetPrice) {
                celebrationTracker = tracker;
                setTimeout(() => {
                    showCelebration(tracker);
                }, 500);
            }
            
            localStorage.setItem('trackers', JSON.stringify(trackers));
            showToast('success', 'Price updated: ' + (data.currency_symbol || '$') + data.price);
            renderTrackers();
            updateStats();
        } else {
            showToast('error', data.error || 'Failed to refresh price');
        }
    } catch (error) {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fa fa-refresh"></i> Refresh';
        }
        showToast('error', 'Failed to connect to server');
    }
}

async function deleteTracker(trackerId) {
    if (!confirm('Are you sure you want to delete this tracker?')) return;
    try {
        const response = await fetch(API_BASE_URL + '/api/trackers', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: trackerId })
        });
        
        if (response.ok) {
            trackers = trackers.filter(t => t.id !== trackerId);
            localStorage.setItem('trackers', JSON.stringify(trackers));
            renderTrackers();
            updateStats();
            showToast('success', 'Tracker deleted successfully!');
        } else {
            showToast('error', 'Failed to delete tracker from server');
        }
    } catch (error) {
        console.error('Delete tracker error:', error);
        showToast('error', 'An error occurred while deleting');
    }
}

function toggleSelect(trackerId) {
    const checkbox = document.querySelector('.tracker-card[data-id="' + trackerId + '"] .tracker-checkbox');
    checkbox.classList.toggle('checked');
    const icon = checkbox.querySelector('i');
    icon.style.display = checkbox.classList.contains('checked') ? 'block' : 'none';
}

// ==================== PRICE TRENDS ====================

function viewTrends(trackerId) {
    const tracker = trackers.find(t => t.id === trackerId);
    if (!tracker) return;
    currentTracker = tracker;
    switchView('price-trends');
    
    document.querySelector('.product-details h3').textContent = tracker.productName || 'Product';
    document.querySelector('.product-details p').textContent = tracker.url;
    document.getElementById('original-price').textContent = (tracker.currencySymbol || '$') + tracker.currentPrice;
    document.getElementById('current-price').textContent = (tracker.currencySymbol || '$') + tracker.currentPrice;
    
    const savings = tracker.currentPrice - tracker.targetPrice;
    document.getElementById('savings-amount').textContent = (tracker.currencySymbol || '$') + savings.toFixed(2);
    
    generateChart(tracker);
    
    const prediction = tracker.currentPrice <= tracker.targetPrice ? 'Price is at or below your target!' : 'Price may drop further';
    document.getElementById('prediction-text').textContent = prediction;
    document.getElementById('confidence').textContent = '85%';
}

function generateChart(tracker) {
    const chartContainer = document.querySelector('.chart-main');
    const days = 7;
    const data = [];
    let basePrice = tracker.currentPrice;
    
    for (let i = 0; i < days; i++) {
        const variation = (Math.random() - 0.5) * basePrice * 0.1;
        data.push(basePrice + variation);
    }
    data[days - 1] = tracker.currentPrice;
    
    const maxPrice = Math.max(...data);
    chartContainer.innerHTML = '<div class="chart-placeholder"><div class="chart-line">' + 
        data.map(price => '<div class="chart-bar" style="height: ' + ((price / maxPrice) * 150) + 'px;" title="' + price.toFixed(2) + '"></div>').join('') + 
        '</div><div class="chart-labels">' + 
        Array.from({length: days}, (_, i) => { 
            const date = new Date(); 
            date.setDate(date.getDate() - (days - 1 - i)); 
            return '<span>' + date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) + '</span>'; 
        }).join('') + '</div>';
    
    document.getElementById('trend-lowest').textContent = (tracker.currencySymbol || '$') + Math.min(...data).toFixed(2);
    document.getElementById('trend-highest').textContent = (tracker.currencySymbol || '$') + Math.max(...data).toFixed(2);
    document.getElementById('trend-since').textContent = new Date(tracker.createdAt).toLocaleDateString();
    document.getElementById('buy-now-btn').style.display = tracker.currentPrice <= tracker.targetPrice ? 'flex' : 'none';
    document.getElementById('buy-now-btn').onclick = () => window.open(tracker.url, '_blank');
}

function setTimePeriod(period) {
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(period)) btn.classList.add('active');
    });
    if (currentTracker) generateChart(currentTracker);
}

// ==================== TOAST NOTIFICATIONS ====================

function showToast(type, message) {
    if (typeof type === 'string' && typeof message === 'undefined') {
        message = type;
        type = 'success';
    }
    
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon ${type}">
            <i class="fa fa-${type === 'success' ? 'check' : 'times'}"></i>
        </div>
        <div class="toast-content">
            <strong>${type === 'success' ? 'Success!' : 'Error!'}</strong>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast-notification {
                position: fixed;
                top: 24px;
                right: 24px;
                background: #1d1d1f;
                color: white;
                padding: 16px 24px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                gap: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                transform: translateX(120%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 1000;
            }
            .toast-notification.active { transform: translateX(0); }
            .toast-icon {
                width: 44px;
                height: 44px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            .toast-icon.success { background: linear-gradient(135deg, #11998e, #38ef7d); }
            .toast-icon.error { background: linear-gradient(135deg, #cb2d3e, #ef473a); }
            .toast-content { display: flex; flex-direction: column; }
            .toast-content strong { margin-bottom: 2px; }
            .toast-content span { font-size: 0.9rem; opacity: 0.9; }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
}

// ==================== SETTINGS ====================

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify({
        pushNotifications: document.getElementById('push-notifications').checked,
        emailAlerts: document.getElementById('email-alerts').checked,
        darkMode: document.getElementById('dark-mode').checked,
        compactView: document.getElementById('compact-view').checked,
        refreshInterval: document.getElementById('refresh-interval').value,
        autoDelete: document.getElementById('auto-delete').value,
        dropPercentage: document.getElementById('drop-percentage').value
    }));
    showToast('success', 'Settings saved');
}

function saveCurrencyPreference() {
    localStorage.setItem('currency', document.getElementById('currency-select').value);
    showToast('success', 'Currency preference saved');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    saveSettings();
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    if (settings.pushNotifications !== undefined) document.getElementById('push-notifications').checked = settings.pushNotifications;
    if (settings.emailAlerts !== undefined) document.getElementById('email-alerts').checked = settings.emailAlerts;
    if (settings.darkMode !== undefined) document.getElementById('dark-mode').checked = settings.darkMode;
    if (settings.compactView !== undefined) document.getElementById('compact-view').checked = settings.compactView;
    if (settings.refreshInterval !== undefined) document.getElementById('refresh-interval').value = settings.refreshInterval;
    if (settings.autoDelete !== undefined) document.getElementById('auto-delete').value = settings.autoDelete;
    if (settings.dropPercentage !== undefined) document.getElementById('drop-percentage').value = settings.dropPercentage;
    const currency = localStorage.getItem('currency');
    if (currency) document.getElementById('currency-select').value = currency;
}

// ==================== DATA IMPORT/EXPORT ====================

function exportData() {
    const data = JSON.stringify(trackers, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price-tracker-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Data exported');
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                trackers = imported;
                localStorage.setItem('trackers', JSON.stringify(trackers));
                renderTrackers();
                updateStats();
                showToast('success', 'Data imported successfully');
            }
        } catch (error) {
            showToast('error', 'Invalid file format');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (!confirm('Are you sure you want to delete all trackers? This cannot be undone.')) return;
    trackers = [];
    localStorage.setItem('trackers', JSON.stringify(trackers));
    renderTrackers();
    updateStats();
    showToast('success', 'All data cleared');
}

function exportTrackers() { exportData(); }

function deleteSelected() {
    const selected = document.querySelectorAll('.tracker-checkbox.checked');
    if (selected.length === 0) {
        showToast('error', 'No trackers selected');
        return;
    }
    if (!confirm('Delete ' + selected.length + ' tracker(s)?')) return;
    selected.forEach(checkbox => {
        const card = checkbox.closest('.tracker-card');
        const id = parseInt(card.dataset.id);
        trackers = trackers.filter(t => t.id !== id);
    });
    localStorage.setItem('trackers', JSON.stringify(trackers));
    renderTrackers();
    updateStats();
    document.getElementById('bulk-actions').style.display = 'none';
    showToast('success', 'Selected trackers deleted');
}

// ==================== MODALS ====================

function connectTelegram() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'telegram-modal';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fa fa-telegram"></i> Connect Telegram</h3>
                <button class="modal-close" onclick="closeModal('telegram-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-icon telegram-icon">
                    <i class="fa fa-telegram"></i>
                </div>
                <p>Get instant price drop alerts on Telegram!</p>
                <button class="action-btn" onclick="window.open('https://t.me/AI_Price_Alert_Bot', '_blank')">
                    <i class="fa fa-external-link"></i> Open Telegram Bot
                </button>
            </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function connectWhatsApp() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'whatsapp-modal';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fa fa-whatsapp"></i> Connect WhatsApp</h3>
                <button class="modal-close" onclick="closeModal('whatsapp-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-icon whatsapp-icon">
                    <i class="fa fa-whatsapp"></i>
                </div>
                <p>Get price drop alerts on WhatsApp!</p>
                <input type="tel" id="whatsapp-number" class="product-input" placeholder="+1234567890" style="width: 100%; margin-bottom: 12px;">
                <button class="action-btn" onclick="saveWhatsAppNumber()">
                    <i class="fa fa-check"></i> Connect
                </button>
            </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function saveWhatsAppNumber() {
    showToast('success', 'WhatsApp connected!');
    closeModal('whatsapp-modal');
}

// Initialize settings on load
loadSettings();

// ==================== AUTO-REFRESH ALERTER ====================

let autoRefreshInterval = null;
let lastRefreshTime = null;

function startAutoRefresh() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const intervalSeconds = parseInt(settings.refreshInterval || '10');
    const intervalMs = intervalSeconds * 1000;
    
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Start new interval
    autoRefreshInterval = setInterval(() => {
        autoRefreshAllPrices();
    }, intervalMs);
    
    // Update UI to show auto-refresh is active
    updateAutoRefreshUI(intervalSeconds);
    console.log(`Auto-refresh started: every ${intervalSeconds} seconds`);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
    console.log('Auto-refresh stopped');
}

async function autoRefreshAllPrices() {
    if (trackers.length === 0) return;
    
    console.log('Auto-refreshing all prices...');
    lastRefreshTime = new Date();
    
    let updatedCount = 0;
    for (const tracker of trackers) {
        try {
            const response = await fetch(API_BASE_URL + '/get-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: tracker.url })
            });
            
            if (response.ok) {
                const data = await response.json();
                const oldPrice = tracker.currentPrice;
                tracker.currentPrice = data.price;
                tracker.productName = data.productName || tracker.productName;
                
                // Check if target just reached
                if (checkPriceReached(tracker) && oldPrice > tracker.targetPrice) {
                    celebrationTracker = tracker;
                    showCelebration(tracker);
                }
                updatedCount++;
            }
        } catch (error) {
            console.error(`Failed to refresh price for ${tracker.url}:`, error);
        }
    }
    
    // Save updated trackers
    localStorage.setItem('trackers', JSON.stringify(trackers));
    
    // Update UI
    renderTrackers();
    updateStats();
    
    // Show notification
    if (updatedCount > 0) {
        showToast('success', `Auto-refreshed ${updatedCount} tracker(s)`);
    }
}

function updateAutoRefreshUI(intervalSeconds) {
    // Add auto-refresh indicator to the sidebar
    const sidebarStats = document.querySelector('.sidebar-stats');
    if (sidebarStats) {
        let refreshIndicator = document.getElementById('auto-refresh-indicator');
        if (!refreshIndicator) {
            refreshIndicator = document.createElement('div');
            refreshIndicator.id = 'auto-refresh-indicator';
            refreshIndicator.className = 'stat-item';
            refreshIndicator.innerHTML = `
                <span class="stat-value" id="refresh-timer"><i class="fa fa-sync fa-spin"></i></span>
                <span class="stat-label">Auto-refresh</span>
            `;
            sidebarStats.appendChild(refreshIndicator);
        }
    }
    
    // Update refresh timer display
    const refreshTimer = document.getElementById('refresh-timer');
    if (refreshTimer) {
        let secondsRemaining = intervalSeconds;
        refreshTimer.innerHTML = `<i class="fa fa-sync fa-spin"></i> ${formatTime(secondsRemaining)}`;
        
        // Update timer every second
        if (window.refreshTimerInterval) {
            clearInterval(window.refreshTimerInterval);
        }
        window.refreshTimerInterval = setInterval(() => {
            secondsRemaining--;
            if (secondsRemaining <= 0) {
                secondsRemaining = intervalSeconds;
            }
            const timerEl = document.getElementById('refresh-timer');
            if (timerEl) {
                timerEl.innerHTML = `<i class="fa fa-sync fa-spin"></i> ${formatTime(secondsRemaining)}`;
            }
        }, 1000);
    }
}

function formatTime(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Add manual refresh button to the UI
function addManualRefreshButton() {
    const mainBtn = document.getElementById('mainBtn');
    if (mainBtn) {
        let refreshAllBtn = document.getElementById('refresh-all-btn');
        if (!refreshAllBtn) {
            refreshAllBtn = document.createElement('button');
            refreshAllBtn.id = 'refresh-all-btn';
            refreshAllBtn.className = 'action-btn secondary';
            refreshAllBtn.style.marginLeft = '10px';
            refreshAllBtn.innerHTML = '<i class="fa fa-refresh"></i> Refresh All';
            refreshAllBtn.onclick = () => {
                refreshAllBtn.disabled = true;
                refreshAllBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Refreshing...';
                autoRefreshAllPrices().then(() => {
                    refreshAllBtn.disabled = false;
                    refreshAllBtn.innerHTML = '<i class="fa fa-refresh"></i> Refresh All';
                });
            };
            // Insert after main button
            mainBtn.parentNode.insertBefore(refreshAllBtn, mainBtn.nextSibling);
        }
    }
}

// Start auto-refresh on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTrackers();
    setupNavigation();
    loadUserData();
    initTilt();
    initCelebration();
    startAutoRefresh();
    addManualRefreshButton();
    handleUrlParams();
});

async function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get('url');
    const targetPrice = urlParams.get('target_price');
    
    if (url) {
        // Go to new alert tab
        switchView('new-alert');
        
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.value = url;
            
            // Trigger price fetch
            setLoadingState(true, 'Fetching price from landing page...');
            try {
                const response = await fetch(API_BASE_URL + '/get-price', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    const priceStep = document.getElementById('priceStep');
                    const mainBtn = document.getElementById('mainBtn');
                    
                    if (priceStep && mainBtn) {
                        priceStep.style.display = 'block';
                        // Use provided target price if available, otherwise suggest 10% discount
                        const defaultTargetPrice = targetPrice ? targetPrice : (data.price * 0.9).toFixed(2);
                        
                        priceStep.innerHTML = '<p><strong>Current Price: ' + (data.currency_symbol || '$') + data.price + '</strong></p>' +
                            '<input type="number" id="targetPrice" class="product-input" style="width: 150px;" placeholder="Set target price" value="' + defaultTargetPrice + '">';
                        
                        mainBtn.innerHTML = 'Create Tracker';
                        
                        priceStep.dataset.productName = data.productName || 'Product';
                        priceStep.dataset.currentPrice = data.price;
                        priceStep.dataset.currency = data.currency;
                        priceStep.dataset.currencySymbol = data.currency_symbol;
                        
                        // Highlight targetPrice field to draw attention
                        const targetPriceInput = document.getElementById('targetPrice');
                        if (targetPriceInput) {
                            targetPriceInput.focus();
                            targetPriceInput.classList.add('pulse-highlight');
                            setTimeout(() => targetPriceInput.classList.remove('pulse-highlight'), 3000);
                        }
                    }
                } else {
                    showToast('error', data.error || 'Failed to fetch price');
                }
            } catch (error) {
                showToast('error', 'Failed to connect to server');
            } finally {
                setLoadingState(false);
            }
        }
    }
}

// Stop auto-refresh when leaving the page
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});

// ==================== NEW SETTINGS FUNCTIONS ====================

function toggleAutoRefresh() {
    const enabled = document.getElementById('auto-refresh-enabled').checked;
    if (enabled) {
        startAutoRefresh();
        showToast('success', 'Auto-refresh enabled');
    } else {
        stopAutoRefresh();
        showToast('success', 'Auto-refresh disabled');
    }
}

function restartAutoRefresh() {
    if (document.getElementById('auto-refresh-enabled')?.checked) {
        startAutoRefresh();
    }
}

function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showToast('error', 'This browser does not support desktop notifications');
        return;
    }
    
    if (Notification.permission === 'granted') {
        showToast('success', 'Desktop notifications already enabled');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('success', 'Desktop notifications enabled');
                new Notification('AI Price Alert', {
                    body: 'Notifications enabled successfully!',
                    icon: '🔔'
                });
            } else {
                showToast('error', 'Desktop notifications denied');
            }
        });
    }
}

function showApiKey() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'api-modal';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fa fa-key"></i> API Access</h3>
                <button class="modal-close" onclick="closeModal('api-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <p>Use this API key for custom integrations:</p>
                <div class="api-key-display">
                    <code id="api-key">AI_PRICE_ALERT_API_KEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}</code>
                    <button class="btn-secondary" onclick="copyApiKey()">
                        <i class="fa fa-copy"></i> Copy
                    </button>
                </div>
                <p class="api-docs-link">
                    <a href="#" target="_blank">View API Documentation</a>
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function copyApiKey() {
    const apiKey = document.getElementById('api-key').textContent;
    navigator.clipboard.writeText(apiKey).then(() => {
        showToast('success', 'API key copied to clipboard');
    }).catch(() => {
        showToast('error', 'Failed to copy API key');
    });
}

function showFeedbackModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'feedback-modal';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3><i class="fa fa-comment"></i> Send Feedback</h3>
                <button class="modal-close" onclick="closeModal('feedback-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <p>We'd love to hear your thoughts!</p>
                <div class="form-group">
                    <label>Feedback Type</label>
                    <select id="feedback-type" class="product-input">
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="improvement">Improvement Idea</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Your Feedback</label>
                    <textarea id="feedback-message" class="product-input" rows="5" placeholder="Tell us what you think..."></textarea>
                </div>
                <button class="action-btn" onclick="submitFeedback()">
                    <i class="fa fa-paper-plane"></i> Submit Feedback
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function submitFeedback() {
    const type = document.getElementById('feedback-type').value;
    const message = document.getElementById('feedback-message').value;
    
    if (!message.trim()) {
        showToast('error', 'Please enter your feedback');
        return;
    }
    
    // In a real app, this would send to a backend
    console.log('Feedback submitted:', { type, message });
    
    showToast('success', 'Thank you for your feedback!');
    closeModal('feedback-modal');
}

async function runProductComparison() {
    const urlA = document.getElementById('compare-url-a').value.trim();
    const urlB = document.getElementById('compare-url-b').value.trim();
    const compareBtn = document.getElementById('compare-btn');
    const resultDiv = document.getElementById('comparison-result');
    
    if (!urlA || !urlB) {
        showToast('error', 'Please enter links for both products A and B.');
        return;
    }
    
    // Update button to loading state
    compareBtn.disabled = true;
    compareBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Analyzing and Comparing...';
    resultDiv.style.display = 'none';
    
    try {
        const [resA, resB] = await Promise.all([
            fetch('/get-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlA })
            }),
            fetch('/get-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlB })
            })
        ]);
        
        if (!resA.ok || !resB.ok) {
            const errA = !resA.ok ? await resA.json() : null;
            const errB = !resB.ok ? await resB.json() : null;
            const errorMsgA = errA ? errA.error : 'OK';
            const errorMsgB = errB ? errB.error : 'OK';
            
            resultDiv.innerHTML = `
                <div class="comparison-error-card" style="text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.7); border-radius: 16px; border: 1px solid rgba(255, 95, 86, 0.2); box-shadow: var(--shadow-sm); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); margin-top: 32px;">
                    <i class="fa fa-exclamation-triangle" style="font-size: 48px; color: var(--accent-orange); margin-bottom: 16px;"></i>
                    <h3 style="color: var(--text-primary); font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Could Not Retrieve Comparison Details</h3>
                    <p style="color: var(--text-secondary); margin: 0 0 24px; font-size: 14px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                        We encountered an issue scraping one or both product pages. Please make sure the links are valid store URLs.<br>
                        <span style="font-family: monospace; font-size: 12px; color: var(--danger); background: rgba(255, 95, 86, 0.1); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">
                            A: ${errorMsgA} | B: ${errorMsgB}
                        </span>
                    </p>
                </div>
            `;
            resultDiv.style.display = 'block';
            showToast('error', 'Failed to compile comparison data.');
            return;
        }
        
        const dataA = await resA.json();
        const dataB = await resB.json();
        
        // Calculate dynamic value scores
        // Lower price is better, more features is better
        const priceA = parseFloat(dataA.price) || 0;
        const priceB = parseFloat(dataB.price) || 0;
        
        // Standard normalized value calculation
        let ratingA = 4.0 + (dataA.features.length * 0.1) + (priceA < priceB ? 0.4 : 0);
        let ratingB = 4.0 + (dataB.features.length * 0.1) + (priceB < priceA ? 0.4 : 0);
        
        // Clamp between 1.0 and 5.0
        ratingA = Math.min(5.0, Math.max(1.0, ratingA)).toFixed(1);
        ratingB = Math.min(5.0, Math.max(1.0, ratingB)).toFixed(1);
        
        const winner = parseFloat(ratingA) >= parseFloat(ratingB) ? 'A' : 'B';
        const betterPrice = priceA < priceB ? 'Product A' : 'Product B';
        const discountText = priceA < priceB 
            ? `${betterPrice} is cheaper by ${dataA.currency_symbol || '$'}${(priceB - priceA).toFixed(2)}` 
            : `${betterPrice} is cheaper by ${dataB.currency_symbol || '$'}${(priceA - priceB).toFixed(2)}`;
            
        const isBWinner = winner === 'B';
        
        // Render comparative data card
        resultDiv.innerHTML = `
            <div class="comparison-table-card">
                <div class="comparison-header-row">
                    <div class="comparison-col">
                        <span class="verdict-badge ${!isBWinner ? 'winner' : 'runnerup'}">
                            ${!isBWinner ? '<i class="fa fa-trophy"></i> Best Pick' : 'Runner Up'}
                        </span>
                        <h3>${dataA.productName}</h3>
                        <span class="comparison-store-badge"><i class="fa fa-shopping-bag"></i> ${dataA.site || 'Store'}</span>
                        <div class="comparison-price">${dataA.currency_symbol || '$'}${dataA.price}</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">⭐ Rating: <strong>${ratingA} / 5.0</strong></div>
                    </div>
                    <div class="comparison-col">
                        <span class="verdict-badge ${isBWinner ? 'winner' : 'runnerup'}">
                            ${isBWinner ? '<i class="fa fa-trophy"></i> Best Pick' : 'Runner Up'}
                        </span>
                        <h3>${dataB.productName}</h3>
                        <span class="comparison-store-badge"><i class="fa fa-shopping-bag"></i> ${dataB.site || 'Store'}</span>
                        <div class="comparison-price">${dataB.currency_symbol || '$'}${dataB.price}</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">⭐ Rating: <strong>${ratingB} / 5.0</strong></div>
                    </div>
                </div>
                
                <div class="comparison-row">
                    <h4>Overview & Description</h4>
                    <div class="comparison-row-data">
                        <div class="comparison-desc-text">${dataA.description || 'No overview available for this product.'}</div>
                        <div class="comparison-desc-text">${dataB.description || 'No overview available for this product.'}</div>
                    </div>
                </div>
                
                <div class="comparison-row">
                    <h4>Attributes & Key Features</h4>
                    <div class="comparison-row-data">
                        <ul class="comparison-feature-list">
                            ${dataA.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        <ul class="comparison-feature-list">
                            ${dataB.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="verdict-box">
                    <i class="fa fa-lightbulb-o"></i>
                    <div>
                        <h4>Smart Shopping Verdict</h4>
                        <p>Based on our analysis, <strong>Product ${winner} (${winner === 'A' ? dataA.productName : dataB.productName})</strong> offers the best value rating of <strong>${winner === 'A' ? ratingA : ratingB} / 5.0</strong>. ${discountText}. We recommend choosing Product ${winner} for a better overall value ratio.</p>
                    </div>
                </div>
            </div>
        `;
        
        resultDiv.style.display = 'block';
        showToast('success', 'Comparison complete!');
        
    } catch (err) {
        console.error('Comparison error:', err);
        showToast('error', 'An error occurred while compiling comparison data.');
    } finally {
        compareBtn.disabled = false;
        compareBtn.innerHTML = '<i class="fa fa-balance-scale"></i> Compare Products';
    }
}

async function simulatePriceDrop(trackerId) {
    const tracker = trackers.find(t => t.id == trackerId);
    if (!tracker) return;
    
    // Simulate drop below target
    const oldPrice = tracker.currentPrice;
    tracker.currentPrice = Math.round(tracker.targetPrice * 0.9);
    
    showToast('success', `Simulating price drop for ${tracker.productName || 'Product'}!`);
    
    // Trigger celebration modal
    showCelebration(tracker);
    
    // Render and update counts
    renderTrackers();
    updateStats();
}

function populateAITrackerSelect() {
    const select = document.getElementById('ai-tracker-select');
    if (!select) return;
    
    // Clear existing options, keep default
    select.innerHTML = '<option value="">-- Choose a product to analyze --</option>';
    
    // If no active trackers, populate with high-quality demo products
    const displayList = trackers.length > 0 ? trackers : [
        { id: 'demo1', productName: 'iPhone 15 Pro Max (256GB, Titanium)', currentPrice: 134900, targetPrice: 120000, currencySymbol: '₹' },
        { id: 'demo2', productName: 'Sony WH-1000XM5 Wireless Headphones', currentPrice: 29990, targetPrice: 24999, currencySymbol: '₹' },
        { id: 'demo3', productName: 'Nike Air Max Men Sneakers', currentPrice: 8995, targetPrice: 7500, currencySymbol: '₹' }
    ];
    
    displayList.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = `${t.productName || 'Product'} (${t.currencySymbol || '₹'}${t.currentPrice})`;
        select.appendChild(option);
    });
    
    // If there are no trackers, add a helpful note
    let demoNote = document.getElementById('ai-demo-note');
    if (trackers.length === 0) {
        if (!demoNote) {
            demoNote = document.createElement('div');
            demoNote.id = 'ai-demo-note';
            demoNote.style.marginTop = '12px';
            demoNote.style.fontSize = '13px';
            demoNote.style.color = 'var(--accent-orange-dark)';
            demoNote.innerHTML = '<i class="fa fa-info-circle"></i> Showing popular demo products because you do not have any active trackers yet. <a href="#" onclick="switchView(\'new-alert\')" style="text-decoration: underline; color: inherit; font-weight:600;">Add a tracker now</a>';
            select.parentNode.appendChild(demoNote);
        }
    } else {
        if (demoNote) {
            demoNote.remove();
        }
    }
}

function runAIPrediction() {
    const select = document.getElementById('ai-tracker-select');
    const resultDiv = document.getElementById('ai-prediction-result');
    const emptyDiv = document.getElementById('ai-prediction-empty');
    
    if (!select || !select.value) {
        if (resultDiv) resultDiv.style.display = 'none';
        if (emptyDiv) emptyDiv.style.display = 'block';
        return;
    }
    
    const trackerId = select.value;
    
    // Fallback list of demo trackers
    const displayList = trackers.length > 0 ? trackers : [
        { id: 'demo1', productName: 'iPhone 15 Pro Max (256GB, Titanium)', currentPrice: 134900, targetPrice: 120000, currencySymbol: '₹' },
        { id: 'demo2', productName: 'Sony WH-1000XM5 Wireless Headphones', currentPrice: 29990, targetPrice: 24999, currencySymbol: '₹' },
        { id: 'demo3', productName: 'Nike Air Max Men Sneakers', currentPrice: 8995, targetPrice: 7500, currencySymbol: '₹' }
    ];
    
    const tracker = displayList.find(t => t.id == trackerId);
    if (!tracker) return;
    
    const currentPrice = parseFloat(tracker.currentPrice) || 1000;
    const trackerSeed = typeof tracker.id === 'string' ? tracker.id.charCodeAt(tracker.id.length - 1) : tracker.id;
    const dropProb = Math.floor(55 + (trackerSeed % 35)); 
    const targetVal = (currentPrice * 0.92).toFixed(0);
    
    const probEl = document.getElementById('pred-probability');
    const recEl = document.getElementById('pred-recommendation');
    const targetEl = document.getElementById('pred-target-val');
    const suggEl = document.getElementById('pred-suggestion-text');
    
    if (probEl) {
        probEl.textContent = `${dropProb}%`;
        if (dropProb > 75) {
            probEl.style.color = "var(--success)";
        } else {
            probEl.style.color = "var(--accent-orange)";
        }
    }
    
    if (recEl) {
        if (dropProb > 75) {
            recEl.textContent = "Wait 2-3 Days";
            recEl.style.color = "var(--accent-orange)";
        } else {
            recEl.textContent = "Buy Now (Stable Price)";
            recEl.style.color = "var(--success)";
        }
    }
    
    const formattedTarget = (tracker.currencySymbol || '₹') + parseFloat(targetVal).toLocaleString();
    if (targetEl) {
        targetEl.textContent = formattedTarget;
    }
    
    if (suggEl) {
        if (dropProb > 75) {
            suggEl.innerHTML = ` Wait. Our algorithms project a cyclic price drop to <strong id="pred-target-val">${formattedTarget}</strong> on or before next week.`;
        } else {
            suggEl.innerHTML = ` Buy Now. Prices are stable and unlikely to fall further below <strong id="pred-target-val">${formattedTarget}</strong> in the near future.`;
        }
    }
    
    if (emptyDiv) emptyDiv.style.display = 'none';
    if (resultDiv) resultDiv.style.display = 'block';
}

function fillComparisonDemo(type) {
    const urlA = document.getElementById('compare-url-a');
    const urlB = document.getElementById('compare-url-b');
    
    if (type === 'sneakers') {
        urlA.value = "https://www.amazon.in/dp/B0D97ZXR5J/";
        urlB.value = "https://www.flipkart.com/marc-loire-sneakers/p/itmB0D97ZXR5J";
    } else if (type === 'tshirt') {
        urlA.value = "https://www.flipkart.com/u-s-polo-assn-printed-men-crew-neck-brown-t-shirt/p/itm526cc5c165ebf";
        urlB.value = "https://www.amazon.in/dp/TSHHN6WTCHHUYNPV";
    }
    
    showToast('info', 'Demo URLs loaded! Starting comparison...');
    runProductComparison();
}

