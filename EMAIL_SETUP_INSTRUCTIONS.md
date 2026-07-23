# Email Setup Instructions for Gmail

## Problem
Gmail is rejecting the regular password. You need to use an **App Password** instead.

## Solution: Generate an App Password

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/
2. Click on **Security**
3. Under "Signing in to Google", click **App passwords**
   - (If you don't see this, make sure 2-Step Verification is enabled first!)
4. Select app type: **Mail**
5. Select device: **Other** → Enter "AI Price Alert"
6. Click **Generate**
7. **Copy the 16-character password** (shown in yellow box)

### Step 3: Update email_config.json
Replace `Lakki@1234` with the App Password you just generated:

```json
{
    "enabled": true,
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_email": "pricealerterai@gmail.com",
    "smtp_password": "YOUR-16-CHAR-APP-PASSWORD",
    "from_name": "AI Price Alert",
    "provider": "gmail",
    "use_tls": true,
    "host_url": "http://localhost:8081"
}
```

### Important Notes
- App Password is 16 characters (no spaces)
- You'll need to generate a new App Password if you change your Google password
- Keep the App Password secure - treat it like a regular password

## Alternative: Use a Different Email Provider

If you cannot generate an App Password, you can use:
- **Outlook/Hotmail**: Use regular password or App Password
- **Yahoo**: Requires App Password (generate from account security settings)
- **Custom SMTP**: Any SMTP server with authentication

## After Updating the Password

1. Save the config file
2. Restart the server:
```bash
lsof -ti:8081 | xargs kill -9
python3 app.py
```

3. Test forgot password again at: http://localhost:8081/forgot-password

---

**Note:** The email will be sent from `pricealerterai@gmail.com`. Make sure this email account exists and has access to send emails.

