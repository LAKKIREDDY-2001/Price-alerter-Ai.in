# Password Reset Security Fix - TODO

## Issue
The forgot password functionality exposes reset links in console output (demo mode) which allows anyone with access to the terminal to reset user passwords.

## Fix Plan

### Step 1: Fix Backend - Remove reset_link from console output
- [ ] Remove `print(f"Reset Link: {reset_link}")` from `send_password_reset_email` function
- [ ] Keep demo mode notification but without exposing the actual link
- [ ] Update `api_forgot_password` to not log the token

### Step 2: Update Frontend - Add explicit security check
- [ ] Update `handleForgotPassword` to explicitly handle demo mode
- [ ] Add clear messaging that reset link is sent via email only
- [ ] Never display or log any reset tokens in frontend

### Step 3: Test the fix
- [ ] Verify API doesn't return reset_link
- [ ] Verify console doesn't expose reset links
- [ ] Verify frontend shows proper email-sent message

## Files to Modify
1. `/Users/lakkireddyvenkatamadhavareddy/price alerter/app.py`
   - `send_password_reset_email` function (lines ~370-420)
   - `api_forgot_password` function (lines ~820-860)

2. `/Users/lakkireddyvenkatamadhavareddy/price alerter/static/auth.js`
   - `handleForgotPassword` function

## Security Best Practices Applied
1. Never expose reset tokens in API responses
2. Never log reset tokens to console
3. Always send via email only
4. Generic success messages to prevent user enumeration

