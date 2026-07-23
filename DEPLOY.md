# AI Price Alert - Deployment Guide

## 🚀 Quick Deploy to Render (Free)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** price-alerter
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Plan:** Free

5. Click "Create Web Service"

### Step 3: Environment Variables (Optional)

Add these environment variables in Render dashboard for email/SMS features:

```
SMTP_ENABLED=false
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
TWILIO_ENABLED=false
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TELEGRAM_ENABLED=false
TELEGRAM_BOT_TOKEN=your_bot_token
```

## 📁 Project Structure

```
price-alerter/
├── app.py              # Main Flask application
├── Procfile            # For Render deployment
├── runtime.txt         # Python version
├── requirements.txt    # Python dependencies
├── database.db         # SQLite database (auto-created)
├── static/             # CSS, JS, images
├── templates/          # HTML templates
│   ├── index.html      # Dashboard
│   ├── login.html      # Login page
│   └── signup.html     # Signup page
└── browser-extension/  # Browser extension files
```

## 🏠 Local Development

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Locally
```bash
python app.py
```
Access at: http://localhost:8081

## 🌐 Features

- ✅ Track prices from Amazon, Flipkart, Myntra, Ajio, Meesho, Snapdeal, Tata CLiQ, Reliance Digital
- ✅ Email & SMS notifications (Twilio)
- ✅ Telegram bot notifications
- ✅ Browser extension
- ✅ User authentication with 2FA
- ✅ Price drop alerts

## 📝 Notes

- **Free tier limitations:** Render free tier puts services to sleep after 15 minutes of inactivity
- **Database:** Uses SQLite (file-based) - suitable for small projects
- **Production:** For high-traffic apps, consider upgrading to paid plans or using PostgreSQL

## 🔧 Troubleshooting

1. **Build fails:** Check requirements.txt has all dependencies
2. **Service won't start:** Check logs in Render dashboard
3. **Database errors:** Ensure database.db has proper permissions
4. **CORS issues:** The app is configured with CORS for all origins

## 📄 License

MIT License

