# Email Fix Plan - Password Reset & OTP Mail Sending

## Objective
Fix password reset email functionality and add proper mail sending for OTPs using pricealerter@gmail.com

## Tasks

### 1. Update email_config.json
- [ ] Configure proper SMTP settings for pricealerter@gmail.com
- [ ] Add secure SMTP password placeholder (needs App Password)
- [ ] Verify settings match Gmail's requirements (TLS on port 587)

### 2. Add robust send_mail() function in app.py
- [ ] Create comprehensive send_mail() function
- [ ] Support both TLS and SSL modes
- [ ] Add HTML email support
- [ ] Add proper error handling
- [ ] Support demo mode for testing

### 3. Update send_password_reset_email() function
- [ ] Use new send_mail() function
- [ ] Properly construct reset links using url_for
- [ ] Add HTML email with styling
- [ ] Improve error handling

### 4. Update send_email_otp() function
- [ ] Use new send_mail() function
- [ ] Add HTML email with OTP styling
- [ ] Add branding elements

### 5. Test Configuration
- [ ] Verify email_config.json is valid JSON
- [ ] Verify SMTP settings are correct
- [ ] Test email sending in demo mode

## Implementation Details

### Gmail App Password Setup
1. Go to https://myaccount.google.com/security
2. Enable 2FA (required for app passwords)
3. Go to App passwords
4. Create "AI Price Alert" app password
5. Use the 16-character password in email_config.json

### Email Functions to Create

```python
def send_mail(to_email, subject, html_body, text_body=None):
    """Send email using SMTP with proper error handling"""
    # Implementation with Gmail TLS on port 587
    # Support for HTML emails
    # Demo mode fallback
```

### Updated Config Format
```json
{
  "enabled": true,
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_email": "pricealerter@gmail.com",
  "smtp_password": "xxxx xxxx xxxx xxxx",
  "from_name": "AI Price Alert",
  "provider": "gmail",
  "use_tls": true
}
```

## Expected Outcome
- Password reset emails will be sent from pricealerter@gmail.com
- OTP verification emails will work correctly
- All emails will have proper HTML formatting
- Demo mode will still work for testing

