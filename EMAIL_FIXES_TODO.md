# Email Fixes TODO List

## Issues Identified
1. [x] `generate_html_email_template()` references undefined `to_email` variable
2. [x] `send_password_reset_email()` uses `request.host_url` outside request context
3. [x] `send_email_otp()` lacks timeout handling
4. [x] `send_password_reset_email()` lacks proper TLS/SSL handling and better error messages

## Fixes Implemented
- [x] Fixed `generate_html_email_template()` - Added `recipient_email` parameter and safe fallback
- [x] Fixed `send_password_reset_email()` - Replaced `request.host_url` with hardcoded localhost URL
- [x] Fixed `send_password_reset_email()` - Added TLS/SSL support and better error handling
- [x] Fixed `send_email_otp()` - Added 30-second timeout to SMTP connection

## Remaining Improvements
- [ ] Update `send_email_otp()` to use HTML template with better styling
- [ ] Update email_config.json with proper Gmail App Password settings

## Files Modified
- [x] /Users/lakkireddyvenkatamadhavareddy/price alerter/app.py - Fixed `generate_html_email_template()`
- [x] /Users/lakkireddyvenkatamadhavareddy/price alerter/app.py - Fixed `send_password_reset_email()` request.host_url issues
- [x] /Users/lakkireddyvenkatamadhavareddy/price alerter/app.py - Added TLS/SSL support and better error handling
- [x] /Users/lakkireddyvenkatamadhavareddy/price alerter/app.py - Added SMTP timeout to OTP function

## Summary of Changes

### 1. `generate_html_email_template()` Function
**Before:** Used undefined `to_email` variable in footer
**After:** Added `recipient_email` parameter with safe fallback to "you"

### 2. `send_password_reset_email()` Function
**Before:** Used `request.host_url` which fails outside request context
**After:** 
- Uses hardcoded `http://localhost:8081` as default
- Added TLS/SSL support based on config
- Added proper error handling for SMTP authentication errors
- Added 30-second timeout

### 3. `send_email_otp()` Function
**Before:** No timeout on SMTP connection
**After:** Added 30-second timeout to prevent hanging connections

## Testing Checklist
- [ ] Verify email_config.json is loaded correctly
- [ ] Test send_mail() function in demo mode
- [ ] Test send_email_otp() function
- [ ] Test send_password_reset_email() function
- [ ] Verify all email functions work without errors

## Progress
- ✅ Fixed `generate_html_email_template()` - Added `recipient_email` parameter and safe fallback
- ✅ Fixed `send_password_reset_email()` - Replaced `request.host_url` with hardcoded localhost URL
- ✅ Fixed `send_password_reset_email()` - Added TLS/SSL support and better error handling
- ✅ Fixed `send_email_otp()` - Added 30-second timeout to SMTP connection

