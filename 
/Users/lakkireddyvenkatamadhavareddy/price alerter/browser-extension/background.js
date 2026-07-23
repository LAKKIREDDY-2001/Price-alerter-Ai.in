// Background Service Worker for AI Price Tracker Extension

// Extension Installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('AI Price Tracker installed:', details.reason);
    
    // Initialize default settings
    chrome.storage.sync.get(null, (items) => {
        if (!items.darkMode) chrome.storage.sync.set({ darkMode: false });
        if (!items.pushNotifications) chrome.storage.sync.set({ pushNotifications: true });
        if (!items.soundAlerts) chrome.storage.sync.set({ soundAlerts: false });
        if (!items.refreshInterval) chrome.storage.sync.set({ refreshInterval: 15 }); // minutes
    });
    
    // Create context menu
    createContextMenu();
});

// Context Menu
function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'track-price',
            title: 'Track Price with AI',
            contexts: ['page', 'link', 'selection']
        });
        
        chrome.contextMenus.create({
            id: 'view-trackers',
            title: 'View My Trackers',
            contexts: ['page']
        });
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'track-price') {
        const url = info.linkUrl || info.pageUrl || tab.url;
        chrome.runtime.sendMessage({ action: 'trackPrice', url });
    } else if (info.menuItemId === 'view-trackers') {
        chrome.runtime.sendMessage({ action: 'openPopup' });
    }
});

// Message Handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender).then(sendResponse);
    return true; // Keep channel open for async response
});

async function handleMessage(request, sender) {
    switch (request.action) {
        case 'trackPrice':
            return await handleTrackPrice(request.url);
        case 'openPopup':
            chrome.action.openPopup();
            return { success: true };
        case 'checkPrices':
            return await checkAllPrices();
        case 'notificationClicked':
            await handleNotificationClick(request.trackerId);
            return { success: true };
        default:
            return { success: false, error: 'Unknown action' };
    }
}

async function handleTrackPrice(url) {
    try {
        // Get current trackers
        const { trackers = [] } = await chrome.storage.local.get('trackers');
        
        // Check if already tracking
        const exists = trackers.find(t => t.url === url);
        if (exists) {
            return { success: false, error: 'Already tracking this product' };
        }
        
        return { success: true, message: 'Ready to track', url };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function checkAllPrices() {
    try {
        const { trackers = [] } = await chrome.storage.local.get('trackers');
        const { pushNotifications = true } = await chrome.storage.sync.get('pushNotifications');
        
        for (const tracker of trackers) {
            try {
                const response = await fetch(tracker.url);
                const html = await response.text();
                const price = extractPriceFromHtml(html);
                
                if (price > 0 && price < tracker.currentPrice) {
                    const droppedBy = tracker.currentPrice - price;
                    const percentDropped = ((droppedBy / tracker.currentPrice) * 100).toFixed(1);
                    
                    tracker.currentPrice = price;
                    tracker.lastChecked = new Date().toISOString();
                    
                    // Send notification
                    if (pushNotifications) {
                        await sendPriceDropNotification(tracker, droppedBy, percentDropped);
                    }
                }
                
                tracker.lastChecked = new Date().toISOString();
            } catch (error) {
                console.error(`Error checking price for ${tracker.url}:`, error);
            }
        }
        
        await chrome.storage.local.set({ trackers });
        return { success: true, checked: trackers.length };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function extractPriceFromHtml(html) {
    // Simple price extraction - can be improved with more patterns
    const patterns = [
        /[\u20b9$£\u20ac\u00a5]\s*([\d,]+(?:\.\d{1,2})?)/,
        /price.*?([\d,]+(?:\.\d{1,2})?)/i,
        /[\d,]{3,10}\.?\d{0,2}/
    ];
    
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) {
            const price = parseFloat(match[1].replace(/,/g, ''));
            if (price > 0 && price < 1000000) {
                return price;
            }
        }
    }
    
    return 0;
}

async function sendPriceDropNotification(tracker, droppedBy, percentDropped) {
    const options = {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Price Drop Alert!',
        message: `${tracker.productName}\nDropped by ${percentDropped}% (${tracker.currencySymbol}${droppedBy.toFixed(2)} less)`,
        priority: 2,
        buttons: [
            { title: 'View Product' },
            { title: 'View Trackers' }
        ]
    };
    
    const notificationId = `price-drop-${tracker.id}`;
    await chrome.notifications.create(notificationId, options);
}

async function handleNotificationClick(trackerId) {
    const { trackers = [] } = await chrome.storage.local.get('trackers');
    const tracker = trackers.find(t => t.id === trackerId);
    
    if (tracker) {
        const [tab] = await chrome.tabs.create({ url: tracker.url, active: true });
    } else {
        chrome.action.openPopup();
    }
}

// Price Check Alarm
chrome.alarms.create('checkPrices', { periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkPrices') {
        checkAllPrices();
    }
});

// Badge Update
async function updateBadge() {
    const { trackers = [] } = await chrome.storage.local.get('trackers');
    const activeTrackers = trackers.filter(t => t.currentPrice > t.targetPrice).length;
    
    chrome.action.setBadgeText({ text: activeTrackers > 0 ? String(activeTrackers) : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff9f0a' });
}

// Call badge update on init and when trackers change
chrome.runtime.onStartup.addListener(updateBadge);
chrome.storage.onChanged.addListener((changes) => {
    if (changes.trackers) {
        updateBadge();
    }
});

