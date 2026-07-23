# Login Authentication Fix Plan

## Problem Identified
The signup flow requires completing ALL verification steps (email + phone OTP) before the actual user account is created. This causes "Invalid credentials" on login because:
1. Users submit signup form → creates pending_signups entry
2. Users verify email OTP → pending_signups updated but NO users entry created
3. Users never complete phone verification + "Complete Registration" button click
4. No entry in `users` table → login fails with "Invalid credentials"

## Solution Plan

### 1. Fix Signup Flow (app.py)
- Modify `/api/signup-complete` to create user account after EMAIL verification (phone optional)
- Create user immediately after email OTP is verified
- Allow phone verification to happen separately or later

### 2. Add Debug Endpoint
- Add `/api/debug/users` to list all registered users (for testing)
- Add `/api/check-email/<email>` to check if email is registered

### 3. Improve Error Messages
- Add more specific error messages for login failures
- Show "Email not verified" or "Account not completed" messages

## Files to Modify
1. `app.py` - Fix signup flow and add debug endpoints
2. `static/auth.js` - Improve error handling

## Implementation Steps
1. Create user account immediately after email OTP verification
2. Keep phone verification as optional post-signup step
3. Add debug endpoints for testing
4. Update login error messages

