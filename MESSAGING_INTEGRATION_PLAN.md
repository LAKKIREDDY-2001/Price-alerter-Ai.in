# Telegram & WhatsApp Integration Plan

## Overview
Add Telegram Bot and WhatsApp notification support for instant price alerts.

## Files to Create
1. `telegram_config.json` - Telegram Bot configuration
2. `whatsapp_config.json` - Twilio WhatsApp configuration

## Files to Modify
1. `app.py` - Add new endpoints and functions
2. `templates/index.html` - Add connection modals
3. `static/script.js` - Add connection handlers
4. Database - Add new columns

## Telegram Bot Setup
1. Create a bot via @BotFather on Telegram
2. Get the bot token
3. Configure webhook for updates
4. Users connect by clicking "Connect" and messaging the bot

## WhatsApp Setup (via Twilio)
1. Get Twilio WhatsApp number
2. Configure from/to numbers
3. Users add their WhatsApp number

## Implementation Steps

### Step 1: Create Configuration Files
- [ ] Create `telegram_config.json`
- [ ] Create `whatsapp_config.json`

### Step 2: Update app.py
- [ ] Add `load_telegram_config()` function
- [ ] Add `load_whatsapp_config()` function  
- [ ] Add `send_telegram_alert()` function
- [ ] Add `send_whatsapp_alert()` function
- [ ] Add `/api/telegram/connect` endpoint
- [ ] Add `/api/telegram/disconnect` endpoint
- [ ] Add `/api/whatsapp/connect` endpoint
- [ ] Add `/api/whatsapp/disconnect` endpoint
- [ ] Add `/api/notifications/preferences` endpoint
- [ ] Update `init_db()` with new columns

### Step 3: Update Frontend
- [ ] Add Telegram connection modal to index.html
- [ ] Add WhatsApp connection modal to index.html
- [ ] Add `connectTelegram()` function to script.js
- [ ] Add `connectWhatsApp()` function to script.js
- [ ] Update settings to show connection status

### Step 4: Testing
- [ ] Test Telegram bot connection
- [ ] Test WhatsApp connection
- [ ] Test price alert notifications

## Message Templates

### Telegram Alert
```
🔔 Price Drop Alert!

Product: [Product Name]
Original: ₹[Old Price]
Current: ₹[New Price]
Save: ₹[Savings] ([%]%)

[Product URL]
```

### WhatsApp Alert
```
🔔 AI Price Alert - Price Drop!

*[Product Name]*

Price dropped from ₹[Old Price] to ₹[New Price]!
You save: ₹[Savings] ([%]%)

Link: [Product URL]
```

