# Price Alert App - Launch Plan

## Phase 1: OTP 2-Step Verification System
- [ ] Create OTP database tables (email_otps, phone_otps)
- [ ] Implement email OTP generation and verification
- [ ] Implement phone OTP generation (mock/demo mode)
- [ ] Add OTP verification UI (modals for email/phone)
- [ ] Create verification status tracking in user accounts

## Phase 2: Authentication System Enhancements
- [ ] Update signup flow with 2-step verification option
- [ ] Update login flow with 2FA support
- [ ] Add "Remember me" functionality with secure tokens
- [ ] Implement password reset with OTP

## Phase 3: UI/UX Improvements
- [ ] Enhanced browser-like interface
- [ ] Better loading states and animations
- [ ] Improved error handling and toasts
- [ ] Mobile-responsive design fixes
- [ ] Dark mode enhancements

## Phase 4: Backend Improvements
- [ ] Rate limiting for API endpoints
- [ ] Input validation and sanitization
- [ ] Secure session management
- [ ] CORS configuration for production

## Phase 5: Testing & Launch
- [ ] Test all authentication flows
- [ ] Test OTP verification
- [ ] Test price tracking functionality
- [ ] Create production deployment config

---

## Implementation Details

### Database Schema Changes
```sql
-- OTP verification table
CREATE TABLE IF NOT EXISTS otp_verification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    email TEXT,
    phone TEXT,
    email_otp TEXT,
    phone_otp TEXT,
    email_verified INTEGER DEFAULT 0,
    phone_verified INTEGER DEFAULT 0,
    otp_expiry TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Update users table for 2FA
ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN two_factor_method TEXT DEFAULT 'none';
```

### Email OTP Flow
1. User enters email during signup
2. System generates 6-digit OTP
3. OTP sent via SMTP (using App Password)
4. User enters OTP to verify email
5. Email verification status stored in database

### Phone OTP Flow
1. User enters phone number during signup
2. System generates 6-digit OTP
3. OTP sent via SMS service (Twilio ready)
4. User enters OTP to verify phone
5. Phone verification status stored in database

### 2FA at Login
1. User enters email/password
2. If 2FA enabled, show OTP input
3. User enters OTP from email/phone
4. Login complete after verification

---

## Files to Create/Modify
- `app.py` - Add OTP routes, 2FA logic
- `templates/signup.html` - Add OTP verification UI
- `templates/login.html` - Add 2FA login UI
- `templates/verify.html` - New OTP verification page
- `static/auth.js` - Add OTP handling functions
- `static/otp.css` - New OTP modal styles
- `static/otp.js` - OTP verification logic

