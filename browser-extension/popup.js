// Popup JavaScript for AI Price Tracker Extension

// State Management
const state = {
    isLoggedIn: false,
    user: null,
    trackers: [],
    currentView: 'list',
    currentTab: null,
    productData: null
};

// API Configuration
const API_BASE = 'https://aipricealert.com';

// Affiliate Configuration
// Replace these with your actual affiliate program IDs
const AFFILIATE_LINKS = {
    amazon: {
        baseUrl: 'https://www.amazon.in',
        affiliateId: 'YOUR_AMAZON_AFFILIATE_ID',
        joinUrl: 'https://affiliate-program.amazon.in/'
    },
    flipkart: {
        baseUrl: 'https://www.flipkart.com',
        affiliateId: 'YOUR_FLIPKART_AFFILIATE_ID',
        joinUrl: 'https://affiliate.flipkart.com/'
    },
    myntra: {
        baseUrl: 'https://www.myntra.com',
        affiliateId: 'YOUR_MYNTRA_AFFILIATE_ID',
        joinUrl: 'https://www.myntra.com/affiliate'
    }
};

// DOM Elements
const elements = {
    notLoggedIn: document.getElementById('not-logged-in'),
    trackerList: document.getElementById('tracker-list'),
    addTracker: document.getElementById('add-tracker'),
    settingsView: document.getElementById('settings-view'),
    trackersContainer: document.getElementById('trackers-container'),
    noTrackers: document.getElementById('no-trackers'),
    activeCount: document.getElementById('active-count'),
    dealsCount: document.getElementById('deals-count'),
    savingsPercent: document.getElementById('savings-percent'),
    toast: document.getElementById('toast'),
    currentProduct: document.getElementById('current-product')
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    loadSettings();
    await loadTrackers();
    setupEventListeners();
    checkLoginStatus();
    
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0]) {
            state.currentTab = tabs[0];
            await checkIfOnShoppingSite(tabs[0]);
        }
    });
}

function loadSettings() {
    chrome.storage.sync.get(['darkMode', 'pushNotifications', 'soundAlerts'], (result) => {
        document.getElementById('dark-mode').checked = result.darkMode || false;
        document.getElementById('push-notifications').checked = result.pushNotifications !== false;
        document.getElementById('sound-alerts').checked = result.soundAlerts || false;
        
        if (result.darkMode) {
            document.body.classList.add('dark-mode');
        }
    });
}

async function loadTrackers() {
    try {
        const response = await fetch(`${API_BASE}/api/trackers`);
        if (response.ok) {
            state.trackers = await response.json();
            renderTrackers();
        } else {
            // Fallback to local storage
            chrome.storage.local.get(['trackers'], (result) => {
                state.trackers = result.trackers || [];
                renderTrackers();
            });
        }
    } catch (error) {
        // Use local storage on API failure
        chrome.storage.local.get(['trackers'], (result) => {
            state.trackers = result.trackers || [];
            renderTrackers();
        });
    }
}

async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/user`);
        if (response.ok) {
            state.isLoggedIn = true;
            state.user = await response.json();
            showLoggedInState();
        } else {
            showLoggedOutState();
        }
    } catch (error) {
        showLoggedOutState();
    }
}

function showLoggedInState() {
    elements.notLoggedIn.classList.add('hidden');
    document.getElementById('sign-out-btn').classList.remove('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-email').textContent = state.user?.email || state.user?.username || 'User';
}

function showLoggedOutState() {
    state.isLoggedIn = false;
    state.user = null;
    elements.notLoggedIn.classList.remove('hidden');
    document.getElementById('sign-out-btn').classList.add('hidden');
    document.getElementById('user-info').classList.add('hidden');
}

function renderTrackers() {
    const activeTrackers = state.trackers.filter(t => t.currentPrice > t.targetPrice);
    const reachedTrackers = state.trackers.filter(t => t.currentPrice <= t.targetPrice);
    
    elements.activeCount.textContent = activeTrackers.length;
    elements.dealsCount.textContent = reachedTrackers.length;
    elements.savingsPercent.textContent = state.trackers.length > 0 ? '10%' : '0%';
    
    if (state.trackers.length === 0) {
        elements.trackersContainer.innerHTML = '';
        elements.noTrackers.classList.remove('hidden');
        return;
    }
    
    elements.noTrackers.classList.add('hidden');
    elements.trackersContainer.innerHTML = state.trackers.map(tracker => {
        const status = tracker.currentPrice <= tracker.targetPrice ? 'reached' : 'active';
        const statusText = status === 'reached' ? 'Target Reached!' : 'Active';
        
        return `
            <div class="tracker-item" data-id="${tracker.id}">
                <div class="tracker-header">
                    <span class="tracker-name">${tracker.productName || 'Product'}</span>
                    <span class="tracker-status ${status}">${statusText}</span>
                </div>
                <div class="tracker-prices">
                    <div class="tracker-price">
                        <span class="price-label">Current</span>
                        <span class="price-value current">${tracker.currencySymbol || '₹'}${tracker.currentPrice}</span>
                    </div>
                    <div class="tracker-price target">
                        <span class="price-label">Target</span>
                        <span class="price-value target">${tracker.currencySymbol || '₹'}${tracker.targetPrice}</span>
                    </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.tracker-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            viewTrackerDetails(id);
        });
    });
}

function setupEventListeners() {
    // Navigation
    document.getElementById('settings-btn').addEventListener('click', () => switchView('settings'));
    document.getElementById('settings-back-btn').addEventListener('click', () => switchView('list'));
    document.getElementById('back-btn').addEventListener('click', () => switchView('list'));
    document.getElementById('add-first-btn').addEventListener('click', () => switchView('add'));
    
    // Auth
    document.getElementById('sign-in-btn').addEventListener('click', () => {
        chrome.tabs.create({ url: `${API_BASE}/login` });
    });
    document.getElementById('sign-out-btn').addEventListener('click', signOut);
    
    // Form
    document.getElementById('add-tracker-form').addEventListener('submit', handleAddTracker);
    
    // Quick targets
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const percent = parseInt(btn.dataset.percent);
            const currentPrice = parseFloat(document.getElementById('current-price').value) || 0;
            if (currentPrice > 0) {
                const targetPrice = (currentPrice * (100 - percent) / 100).toFixed(2);
                document.getElementById('target-price').value = targetPrice;
            }
        });
    });
    
    // Settings toggles
    document.getElementById('dark-mode').addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        chrome.storage.sync.set({ darkMode: e.target.checked });
    });
    
    document.getElementById('push-notifications').addEventListener('change', (e) => {
        chrome.storage.sync.set({ pushNotifications: e.target.checked });
        if (e.target.checked) {
            requestNotificationPermission();
        }
    });
    
    document.getElementById('sound-alerts').addEventListener('change', (e) => {
        chrome.storage.sync.set({ soundAlerts: e.target.checked });
    });
    
    // Affiliate link handlers
    document.getElementById('affiliate-amazon').addEventListener('click', (e) => {
        e.preventDefault();
        handleAffiliateClick('amazon');
    });
    
    document.getElementById('affiliate-flipkart').addEventListener('click', (e) => {
        e.preventDefault();
        handleAffiliateClick('flipkart');
    });
    
    document.getElementById('affiliate-myntra').addEventListener('click', (e) => {
        e.preventDefault();
        handleAffiliateClick('myntra');
    });
}

/**
 * Handle affiliate link clicks
 */
function handleAffiliateClick(platform) {
    const affiliate = AFFILIATE_LINKS[platform];
    
    if (!affiliate || affiliate.affiliateId === `YOUR_${platform.toUpperCase()}_AFFILIATE_ID`) {
        // No affiliate ID configured - open the platform's affiliate program page
        chrome.tabs.create({ url: affiliate.joinUrl });
        showToast('info', `Visit ${platform.charAt(0).toUpperCase() + platform.slice(1)}'s affiliate program`);
    } else {
        // Open the platform with affiliate tracking
        const url = `${affiliate.baseUrl}?tag=${affiliate.affiliateId}`;
        chrome.tabs.create({ url: url });
        trackAffiliateClick(platform);
    }
}

/**
 * Track affiliate link clicks for analytics
 */
function trackAffiliateClick(platform) {
    // Log to console for debugging
    console.log(`Affiliate click tracked: ${platform}`);
    
    // Send to analytics if configured
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
            'event_category': 'affiliate',
            'event_label': platform
        });
    }
    
    // Store in local storage for stats
    chrome.storage.local.get(['affiliateStats'], (result) => {
        const stats = result.affiliateStats || {};
        stats[platform] = (stats[platform] || 0) + 1;
        chrome.storage.local.set({ affiliateStats: stats });
    });
}

function switchView(viewName) {
    state.currentView = viewName;
    
    // Hide all views
    elements.notLoggedIn.classList.add('hidden');
    elements.trackerList.classList.remove('active');
    elements.addTracker.classList.add('hidden');
    elements.settingsView.classList.add('hidden');
    
    // Show selected view
    switch (viewName) {
        case 'not-logged-in':
            elements.notLoggedIn.classList.remove('hidden');
            break;
        case 'list':
            elements.trackerList.classList.add('active');
            break;
        case 'add':
            elements.addTracker.classList.remove('hidden');
            break;
        case 'settings':
            elements.settingsView.classList.add('active');
            elements.settingsView.classList.remove('hidden');
            break;
    }
}

async function checkIfOnShoppingSite(tab) {
    const shoppingPatterns = [
        /amazon\.(in|com)/,
        /flipkart\.com/,
        /myntra\.com/,
        /ajio\.com/,
        /meesho\.com/,
        /snapdeal\.com/,
        /tatacliq\.com/,
        /ebay\.(in|com)/
    ];
    
    const isShoppingSite = shoppingPatterns.some(pattern => pattern.test(tab.url));
    
    if (isShoppingSite) {
        // Send message to content script to get product info
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' });
            if (response && response.success) {
                state.productData = response.data;
                showProductPreview(response.data);
            }
        } catch (error) {
            // Content script not ready yet
            console.log('Content script not available');
        }
    }
}

function showProductPreview(data) {
    elements.currentProduct.innerHTML = `
        <div class="product-name">${data.name || 'Product'}</div>
        <div class="product-price">${data.currencySymbol || '₹'}${data.price}</div>
    `;
    
    // Auto-fill form
    document.getElementById('product-url').value = data.url || '';
    document.getElementById('product-name').value = data.name || '';
    document.getElementById('current-price').value = data.price || '';
    
    // Suggest target price (10% less)
    if (data.price) {
        const suggestedTarget = (data.price * 0.9).toFixed(2);
        document.getElementById('target-price').value = suggestedTarget;
    }
}

async function handleAddTracker(e) {
    e.preventDefault();
    
    const url = document.getElementById('product-url').value;
    const name = document.getElementById('product-name').value;
    const currentPrice = parseFloat(document.getElementById('current-price').value);
    const targetPrice = parseFloat(document.getElementById('target-price').value);
    
    if (!url || !name || !currentPrice || !targetPrice) {
        showToast('error', 'Please fill all fields');
        return;
    }
    
    const tracker = {
        id: Date.now(),
        url,
        productName: name,
        currentPrice,
        targetPrice,
        currency: 'INR',
        currencySymbol: '₹',
        createdAt: new Date().toISOString()
    };
    
    try {
        if (state.isLoggedIn) {
            const response = await fetch(`${API_BASE}/api/trackers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tracker)
            });
            
            if (!response.ok) throw new Error('Failed to create tracker');
        }
        
        // Save locally
        state.trackers.push(tracker);
        chrome.storage.local.set({ trackers: state.trackers });
        
        renderTrackers();
        switchView('list');
        showToast('success', 'Tracker created successfully!');
        
        // Reset form
        document.getElementById('add-tracker-form').reset();
    } catch (error) {
        showToast('error', 'Failed to create tracker');
    }
}

function viewTrackerDetails(trackerId) {
    const tracker = state.trackers.find(t => t.id === trackerId);
    if (!tracker) return;
    
    chrome.tabs.create({ url: tracker.url });
}

async function signOut() {
    try {
        await fetch(`${API_BASE}/logout`, { method: 'POST' });
    } catch (error) {
        // Ignore errors
    }
    
    state.isLoggedIn = false;
    state.user = null;
    state.trackers = [];
    
    chrome.storage.local.remove(['trackers']);
    
    showLoggedOutState();
    renderTrackers();
    showToast('success', 'Signed out successfully');
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

function showToast(type, message) {
    elements.toast.className = `toast ${type}`;
    elements.toast.querySelector('.toast-message').textContent = message;
    elements.toast.querySelector('.toast-icon').className = `toast-icon fa fa-${type === 'success' ? 'check' : 'times'}`;
    elements.toast.classList.remove('hidden');
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}
