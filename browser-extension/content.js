// Content script for AI Price Tracker Extension
// Runs on supported e-commerce websites

let priceTrackerUI = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeContentScript);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'show-price-tracker') {
        showPriceTracker(request.url);
    }
});

function initializeContentScript() {
    // Add a subtle indicator that the extension is active
    addExtensionIndicator();

    // Listen for price tracker requests
    document.addEventListener('click', handlePriceTrackerClick);
}

function addExtensionIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'ai-price-tracker-indicator';
    indicator.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff9f0a, #ff7b00);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(255, 159, 10, 0.3);
            display: flex;
            align-items: center;
            gap: 6px;
        ">
            <span>🔔</span>
            <span>AI Tracker Active</span>
        </div>
    `;

    indicator.addEventListener('click', () => showPriceTracker(window.location.href));
    document.body.appendChild(indicator);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        indicator.style.opacity = '0.7';
    }, 3000);
}

function handlePriceTrackerClick(e) {
    // Check if the click is on the extension indicator or related elements
    if (e.target.closest('#ai-price-tracker-indicator') || 
        e.target.closest('[data-track-price]')) {
        showPriceTracker(window.location.href);
    }
}

function showPriceTracker(url) {
    if (priceTrackerUI) {
        priceTrackerUI.remove();
    }

    priceTrackerUI = document.createElement('div');
    priceTrackerUI.id = 'ai-price-tracker-ui';
    priceTrackerUI.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: white;
                border-radius: 16px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                ">
                    <h3 style="
                        margin: 0;
                        color: #1d1d1f;
                        font-size: 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <span>🔔</span>
                        AI Price Tracker
                    </h3>
                    <button id="close-tracker" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #86868b;
                        padding: 4px;
                    ">×</button>
                </div>

                <div id="tracker-content">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #ff9f0a, #ff7b00);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 16px;
                            font-size: 24px;
                        ">📊</div>
                        <p style="color: #86868b; margin: 0;">Analyzing current price...</p>
                    </div>

                    <div id="price-display" style="display: none;">
                        <div style="
                            background: #f5f5f7;
                            padding: 16px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            text-align: center;
                        ">
                            <div style="font-size: 0.9rem; color: #86868b; margin-bottom: 8px;">Current Price</div>
                            <div id="current-price" style="font-size: 1.8rem; font-weight: 700; color: #1d1d1f;">--</div>

                        <div style="margin-bottom: 20px;">
                            <label style="
                                display: block;
                                font-weight: 600;
                                color: #1d1d1f;
                                margin-bottom: 8px;
                            ">Set Target Price</label>
                            <input type="number" id="target-price" style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #e5e5e5;
                                border-radius: 8px;
                                font-size: 16px;
                                box-sizing: border-box;
                            " placeholder="Enter target price">
                        </div>

                        <button id="track-price-btn" style="
                            width: 100%;
                            background: linear-gradient(135deg, #ff9f0a, #ff7b00);
                            color: white;
                            border: none;
                            padding: 14px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: transform 0.2s;
                        ">
                            🚀 Start AI Tracking
                        </button>
                    </div>
            </div>
    `;

    document.body.appendChild(priceTrackerUI);

    // Add event listeners
    document.getElementById('close-tracker').addEventListener('click', () => {
        priceTrackerUI.remove();
        priceTrackerUI = null;
    });

    document.getElementById('track-price-btn').addEventListener('click', () => {
        const targetPrice = document.getElementById('target-price').value;
        if (targetPrice) {
            addToTracker(url, parseFloat(targetPrice));
        }
    });

    // Extract and display current price
    extractPrice();
}

function extractPrice() {
    // Try to find price on the page
    const priceSelectors = [
        '[data-cy="price-recipe"]',
        '.a-price .a-offscreen',
        '.price',
        '.product-price',
        '.offer-price',
        '.selling-price',
        '.current-price',
        '[class*="price"]',
        '[id*="price"]'
    ];

    let price = null;
    let currency = '$';

    for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            const text = element.textContent.trim();
            const priceMatch = text.match(/[\$₹€£¥₩₽₫฿]/);
            if (priceMatch) {
                price = parseFloat(text.replace(/[^0-9.]/g, ''));
                currency = priceMatch[0];
                break;
            }
        }
    }

    // Update the display
    const priceDisplay = document.getElementById('price-display');
    const currentPriceElement = document.getElementById('current-price');

    if (price) {
        currentPriceElement.textContent = currency + price.toFixed(2);
        priceDisplay.style.display = 'block';
    } else {
        // Show manual input
        document.querySelector('#tracker-content').innerHTML = `
            <div style="margin-bottom: 20px;">
                <label style="
                    display: block;
                    font-weight: 600;
                    color: #1d1d1f;
                    margin-bottom: 8px;
                ">Current Price</label>
                <input type="number" id="current-price-input" style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e5e5;
                    border-radius: 8px;
                    font-size: 16px;
                    box-sizing: border-box;
                    margin-bottom: 16px;
                " placeholder="Enter current price">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="
                    display: block;
                    font-weight: 600;
                    color: #1d1d1f;
                    margin-bottom: 8px;
                ">Set Target Price</label>
                <input type="number" id="target-price" style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e5e5;
                    border-radius: 8px;
                    font-size: 16px;
                    box-sizing: border-box;
                " placeholder="Enter target price">
            </div>
            <button id="track-price-btn" style="
                width: 100%;
                background: linear-gradient(135deg, #ff9f0a, #ff7b00);
                color: white;
                border: none;
                padding: 14px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            ">
                🚀 Start AI Tracking
            </button>
        `;

        document.getElementById('track-price-btn').addEventListener('click', () => {
            const currentPrice = document.getElementById('current-price-input').value;
            const targetPrice = document.getElementById('target-price').value;
            if (currentPrice && targetPrice) {
                addToTracker(url, parseFloat(targetPrice), parseFloat(currentPrice));
            }
        });
    }
}

async function addToTracker(url, targetPrice, currentPrice = null) {
    // Get existing trackers
    const { priceTrackers = [] } = await chrome.storage.local.get('priceTrackers');

    // Add new tracker
    priceTrackers.push({
        url: url,
        title: document.title.substring(0, 100),
        targetPrice: targetPrice,
        currentPrice: currentPrice,
        createdAt: Date.now()
    });

    // Save to storage
    await chrome.storage.local.set({ priceTrackers });

    // Show success message
    showNotification('Price tracking started!', 'We will notify you when the price drops.');
}

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 80px;
            right: 20px;
            background: #34c759;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
            animation: slideIn 0.3s ease-out;
        ">
            <div style="margin-bottom: 4px;">✓ ${title}</div>
            <div style="font-weight: 400; opacity: 0.9;">${message}</div>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
