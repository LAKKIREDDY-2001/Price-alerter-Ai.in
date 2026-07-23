/**
 * AI Price Tracker - Background Service Worker
 * Handles alarms, notifications, context menus, and background sync
 */

// API Configuration
const API_BASE = 'https://aipricealert.com';

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
    console.log('AI Price Tracker extension installed');
    
    // Set up context menus
    await setupContextMenus();
    
    // Set up price check alarm (runs every hour)
    chrome.alarms.create('priceCheck', {
        periodInMinutes: 60
    });
    
    // Initialize storage
    chrome.storage.local.get(['trackers', 'notifications', 'userSettings'], (result) => {
        if (!result.trackers) {
            chrome.storage.local.set({ trackers: [] });
        }
        if (!result.notifications) {
            chrome.storage.local.set({ notifications: [] });
        }
        if (!result.userSettings) {
            chrome.storage.local.set({ 
                userSettings: {
                    pushNotifications: true,
                    soundAlerts: false,
                    checkFrequency: 60 // minutes
                }
            });
        }
    });
});

// Context Menu Setup
async function setupContextMenus() {
    // Remove any existing menus first
    chrome.contextMenus.removeAll();
    
    // Main menu
    chrome.contextMenus.create({
        id: 'price-tracker-main',
        title: 'AI Price Tracker',
        contexts: ['all']
    });
    
    // Track price submenu
    chrome.contextMenus.create({
        id: 'track-price',
        parentId: 'price-tracker-main',
        title: 'Track Price on This Page',
        contexts: ['page', 'link']
    });
    
    // Quick actions
    chrome.contextMenus.create({
        id: 'view-trackers',
        parentId: 'price-tracker-main',
        title: 'View My Trackers',
        contexts: ['page', 'link']
    });
    
    chrome.contextMenus.create({
        id: 'open-dashboard',
        parentId: 'price-tracker-main',
        title: 'Open Dashboard',
        contexts: ['page', 'link']
    });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'track-price':
            openPriceTracker(tab);
            break;
        case 'view-trackers':
            chrome.action.openPopup();
            break;
        case 'open-dashboard':
            chrome.tabs.create({ url: `${API_BASE}/dashboard` });
            break;
    }
});

// Open the extension popup with current page data
function openPriceTracker(tab) {
    // Send message to content script to get product info
    chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' }, (response) => {
        if (chrome.runtime.lastError) {
            // Content script not available, just open popup
            chrome.action.openPopup();
            return;
        }
        
        // Store the product data for popup
        if (response && response.success) {
            chrome.storage.local.set({ currentTabProduct: response.data }, () => {
                chrome.action.openPopup();
            });
        } else {
            chrome.action.openPopup();
        }
    });
}

// Alarm event handler for scheduled price checks
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'priceCheck') {
        checkPrices();
    }
});

// Check prices for all trackers
async function checkPrices() {
    try {
        // Get user settings
        const { userSettings } = await chrome.storage.local.get('userSettings');
        
        if (!userSettings?.pushNotifications) {
            return; // Notifications disabled
        }
        
        // Get trackers
        const { trackers = [] } = await chrome.storage.local.get('trackers');
        
        if (trackers.length === 0) {
            return;
        }
        
        // Check each tracker
        for (const tracker of trackers) {
            try {
                const response = await fetch(`${API_BASE}/api/trackers/${tracker.id}/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: tracker.url,
                        currentPrice: tracker.currentPrice
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.priceDropped && data.newPrice <= tracker.targetPrice) {
                        // Target price reached!
                        await showPriceDropNotification(tracker, data.newPrice);
                        
                        // Update tracker locally
                        tracker.currentPrice = data.newPrice;
                        tracker.lastChecked = new Date().toISOString();
                    }
                    
                    tracker.lastChecked = new Date().toISOString();
                }
            } catch (error) {
                console.error(`Error checking tracker ${tracker.id}:`, error);
            }
        }
        
        // Save updated trackers
        await chrome.storage.local.set({ trackers });
        
    } catch (error) {
        console.error('Error in price check:', error);
    }
}

// Show price drop notification
async function showPriceDropNotification(tracker, newPrice) {
    const savings = tracker.currentPrice - newPrice;
    const percentDrop = ((savings / tracker.currentPrice) * 100).toFixed(1);
    
    const notificationId = `price-drop-${tracker.id}-${Date.now()}`;
    
    const notification = await chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🎉 Price Drop Alert!',
        message: `${tracker.productName} is now ₹${newPrice} (down ${percentDrop}%)`,
        priority: 2,
        buttons: [
            { title: 'View Product' },
            { title: 'Dismiss' }
        ],
        requireInteraction: true
    });
    
    // Play sound if enabled
    const { userSettings } = await chrome.storage.local.get('userSettings');
    if (userSettings?.soundAlerts) {
        playAlertSound();
    }
    
    // Store notification
    const { notifications = [] } = await chrome.storage.local.get('notifications');
    notifications.push({
        id: notificationId,
        trackerId: tracker.id,
        type: 'price_drop',
        title: 'Price Drop Alert',
        message: `${tracker.productName} dropped to ₹${newPrice}`,
        createdAt: new Date().toISOString(),
        read: false
    });
    await chrome.storage.local.set({ notifications });
}

// Play alert sound
function playAlertSound() {
    // AudioContext is not available in service worker context
    // This function is a placeholder for future implementation
    // In a real extension, you could use chrome.alarms or chrome.notifications
    // to play sounds, or use the offscreen document API
    console.log('Alert sound would play here (AudioContext not available in service worker)');
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    // Parse notification ID to get tracker info
    const parts = notificationId.split('-');
    const trackerId = parseInt(parts[2]);
    
    if (buttonIndex === 0) {
        // View Product button
        chrome.storage.local.get(['trackers'], (result) => {
            const tracker = result.trackers?.find(t => t.id === trackerId);
            if (tracker) {
                chrome.tabs.create({ url: tracker.url });
            }
        });
    }
    
    // Dismiss button (buttonIndex === 1) - just close notification
    chrome.notifications.clear(notificationId);
});

// Handle notification closed by user
chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    if (byUser) {
        // Mark as read in storage
        chrome.storage.local.get(['notifications'], (result) => {
            const notifications = result.notifications || [];
            const updated = notifications.map(n => 
                n.id === notificationId ? { ...n, read: true } : n
            );
            chrome.storage.local.set({ notifications: updated });
        });
    }
});

// Message handler for communication between popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
        switch (request.action) {
            case 'getTrackers':
                // Return all trackers
                const { trackers } = await chrome.storage.local.get('trackers');
                sendResponse({ success: true, trackers: trackers || [] });
                break;
                
            case 'addTracker':
                // Add new tracker
                const newTracker = request.tracker;
                const { trackers: existingTrackers } = await chrome.storage.local.get('trackers');
                const trackersList = existingTrackers || [];
                
                // Check for duplicates
                const exists = trackersList.some(t => t.url === newTracker.url);
                if (exists) {
                    sendResponse({ success: false, error: 'Tracker already exists for this URL' });
                    return;
                }
                
                trackersList.push({
                    ...newTracker,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                    lastChecked: null,
                    notificationsSent: 0
                });
                
                await chrome.storage.local.set({ trackers: trackersList });
                
                // Also sync to server if user is logged in
                try {
                    await fetch(`${API_BASE}/api/trackers`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newTracker)
                    });
                } catch (error) {
                    console.error('Failed to sync tracker to server:', error);
                }
                
                sendResponse({ success: true, tracker: newTracker });
                break;
                
            case 'removeTracker':
                // Remove tracker
                const trackerId = request.trackerId;
                let { trackers: allTrackers } = await chrome.storage.local.get('trackers');
                allTrackers = allTrackers?.filter(t => t.id !== trackerId) || [];
                await chrome.storage.local.set({ trackers: allTrackers });
                
                // Also remove from server
                try {
                    await fetch(`${API_BASE}/api/trackers/${trackerId}`, {
                        method: 'DELETE'
                    });
                } catch (error) {
                    console.error('Failed to delete tracker from server:', error);
                }
                
                sendResponse({ success: true });
                break;
                
            case 'updateTracker':
                // Update tracker
                const updatedTracker = request.tracker;
                let { trackers: trackerList } = await chrome.storage.local.get('trackers');
                trackerList = trackerList?.map(t => 
                    t.id === updatedTracker.id ? { ...t, ...updatedTracker } : t
                ) || [];
                await chrome.storage.local.set({ trackers: trackerList });
                sendResponse({ success: true });
                break;
                
            case 'checkPriceNow':
                // Check price for specific tracker immediately
                const { trackerId: idToCheck } = request;
                let { trackers: tList } = await chrome.storage.local.get('trackers');
                const trackerToCheck = tList?.find(t => t.id === idToCheck);
                
                if (trackerToCheck) {
                    try {
                        const response = await fetch(`${API_BASE}/api/trackers/${idToCheck}/check`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                url: trackerToCheck.url,
                                currentPrice: trackerToCheck.currentPrice
                            })
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            
                            // Update local tracker
                            tList = tList.map(t => 
                                t.id === idToCheck ? { 
                                    ...t, 
                                    currentPrice: data.newPrice || t.currentPrice,
                                    lastChecked: new Date().toISOString()
                                } : t
                            );
                            await chrome.storage.local.set({ trackers: tList });
                            
                            if (data.priceDropped && data.newPrice <= trackerToCheck.targetPrice) {
                                await showPriceDropNotification(trackerToCheck, data.newPrice);
                            }
                            
                            sendResponse({ success: true, data });
                        } else {
                            sendResponse({ success: false, error: 'Price check failed' });
                        }
                    } catch (error) {
                        sendResponse({ success: false, error: error.message });
                    }
                } else {
                    sendResponse({ success: false, error: 'Tracker not found' });
                }
                break;
                
            case 'getNotifications':
                // Get all notifications
                const { notifications } = await chrome.storage.local.get('notifications');
                sendResponse({ success: true, notifications: notifications || [] });
                break;
                
            case 'clearNotifications':
                // Clear all notifications
                await chrome.storage.local.set({ notifications: [] });
                sendResponse({ success: true });
                break;
                
            case 'markNotificationRead':
                // Mark specific notification as read
                const notifId = request.notificationId;
                let { notifications: allNotifs } = await chrome.storage.local.get('notifications');
                allNotifs = allNotifs?.map(n => 
                    n.id === notifId ? { ...n, read: true } : n
                ) || [];
                await chrome.storage.local.set({ notifications: allNotifs });
                sendResponse({ success: true });
                break;
                
            case 'updateSettings':
                // Update user settings
                await chrome.storage.local.get(['userSettings'], (result) => {
                    const settings = { ...result.userSettings, ...request.settings };
                    chrome.storage.local.set({ userSettings: settings });
                });
                
                // Update alarm if frequency changed
                if (request.settings.checkFrequency) {
                    chrome.alarms.create('priceCheck', {
                        periodInMinutes: request.settings.checkFrequency
                    });
                }
                
                sendResponse({ success: true });
                break;
                
            case 'getSettings':
                // Get user settings
                const { userSettings } = await chrome.storage.local.get('userSettings');
                sendResponse({ success: true, settings: userSettings });
                break;
                
            case 'syncWithServer':
                // Sync local trackers with server
                try {
                    const response = await fetch(`${API_BASE}/api/trackers`);
                    if (response.ok) {
                        const serverTrackers = await response.json();
                        await chrome.storage.local.set({ trackers: serverTrackers });
                        sendResponse({ success: true, synced: serverTrackers.length });
                    } else {
                        sendResponse({ success: false, error: 'Failed to fetch from server' });
                    }
                } catch (error) {
                    sendResponse({ success: false, error: error.message });
                }
                break;
                
            case 'sendTestNotification':
                // Send a test notification
                await chrome.notifications.create('test-notification-' + Date.now(), {
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: 'Test Notification',
                    message: 'This is a test notification from AI Price Tracker',
                    priority: 2
                });
                sendResponse({ success: true });
                break;
                
            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
    })();
    
    return true; // Keep message channel open for async response
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Open popup (this is the default behavior, but we can add custom logic here if needed)
    // Note: For MV3, if you have a popup defined in manifest, this won't fire
});

// Periodic cleanup of old notifications (keep last 50)
async function cleanupOldNotifications() {
    const { notifications = [] } = await chrome.storage.local.get('notifications');
    
    if (notifications.length > 50) {
        const sorted = notifications.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        const kept = sorted.slice(0, 50);
        await chrome.storage.local.set({ notifications: kept });
    }
}

// Run cleanup every day
chrome.alarms.create('cleanupNotifications', {
    periodInMinutes: 1440 // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanupNotifications') {
        cleanupOldNotifications();
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE,
        checkPrices,
        showPriceDropNotification
    };
}

