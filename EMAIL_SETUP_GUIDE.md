# Email Setup Guide for AI Price Alert

## Gmail Account Setup

### Step 1: Create Gmail Account
1. Go to https://accounts.google.com/signup
2. Create account with email: `pricealerter@gmail.com`
3. Set a strong password
4. Complete phone verification

### Step 2: Enable 2-Factor Authentication (2FA)
1. Go to https://myaccount.google.com/security
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the setup process to enable 2FA

### Step 3: Generate App Password
1. After enabling 2FA, go back to https://myaccount.google.com/security
2. Under "Signing in to Google", click "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "AI Price Alert" as the custom name
5. Click "Generate"
6. Copy the 16-character password

### Step 4: Update Configuration
1. Open `email_config.json`
2. Replace `"YOUR_APP_PASSWORD_HERE"` with the generated app password
3. Save the file

### Step 5: Test Email Sending
1. Restart the Flask application
2. Try the password reset feature
3. Check that emails are sent successfully

## Important Notes

- **App Passwords**: Gmail requires app passwords for SMTP access when 2FA is enabled
- **Security**: Never share your app password or main account password
- **Rate Limits**: Gmail has sending limits (500 emails/day for free accounts)
- **Production**: Consider using services like SendGrid, Mailgun, or AWS SES for production

## Troubleshooting

### Common Issues:

1. **"Application-specific password required"**
   - Solution: Generate and use app password instead of main password

2. **"Less secure app access"**
   - Solution: Enable 2FA and use app passwords (Google deprecated less secure access)

3. **Connection timeout**
   - Solution: Check internet connection and Gmail SMTP settings

4. **Authentication failed**
   - Solution: Verify app password is correct and 2FA is enabled

## Alternative Email Providers

If you prefer not to use Gmail, you can configure other providers:

### Outlook/Hotmail:
```json
{
  "enabled": true,
  "smtp_server": "smtp-mail.outlook.com",
  "smtp_port": 587,
  "smtp_email": "your-email@outlook.com",
  "smtp_password": "your-password",
  "from_name": "AI Price Alert",
  "provider": "outlook"
}
```

### Yahoo:
```json
{
  "enabled": true,
  "smtp_server": "smtp.mail.yahoo.com",
  "smtp_port": 587,
  "smtp_email": "your-email@yahoo.com",
  "smtp_password": "your-app-password",
  "from_name": "AI Price Alert",
  "provider": "yahoo"
}
```

## Testing Email Functionality

After setup, test the email system:

1. Go to `/forgot-password` page
2. Enter any email address
3. Check Flask console for success/error messages
4. Verify email is received (check spam folder)

## Production Email Services

For production deployments, consider:

- **SendGrid**: Free tier (100 emails/day), reliable delivery
- **Mailgun**: Free tier (5,000 emails/month)
- **AWS SES**: Pay-as-you-go, highly scalable
- **Postmark**: Excellent deliverability, paid service

Each service will provide SMTP credentials that you can use in the `email_config.json` file.
