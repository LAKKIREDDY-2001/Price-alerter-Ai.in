# Project Enhancement Plan

## Issues to Fix

### 1. AdSense Policy Violations ✅ IDENTIFIED
- **Problem**: Google-served ads on screens without publisher content
- **Solution**: Add substantial content pages, blog section, informational content

### 2. Forget Password Email Issues ✅ IDENTIFIED  
- **Problem**: Uses hardcoded localhost URL
- **Solution**: Make configurable, use proper HTML template

### 3. Email Configuration ✅ IDENTIFIED
- **Problem**: Needs Gmail App Password setup
- **Solution**: Configure proper SMTP settings

### 4. Link Pasting Issues ✅ IDENTIFIED
- **Problem**: URL validation needs improvement
- **Solution**: Enhanced URL parsing and auto-fix

### 5. 3D Visual Enhancements ✅ PLANNED
- **Solution**: Add more immersive 3D effects throughout the app

---

## Implementation Tasks

### Phase 1: Email & Password Reset Fixes
- [ ] Update email_config.json with production settings
- [ ] Fix send_password_reset_email() to use configurable host
- [ ] Add proper HTML template for password reset emails
- [ ] Create email setup guide

### Phase 2: AdSense Policy Compliance
- [ ] Add landing page with full content
- [ ] Create blog section with articles
- [ ] Add FAQ section
- [ ] Add pricing/tracking information pages
- [ ] Modify ad placement strategy

### Phase 3: 3D Visual Enhancements
- [ ] Add 3D tilt effects to all cards
- [ ] Add 3D animated backgrounds
- [ ] Add 3D product card effects
- [ ] Add 3D notification animations
- [ ] Add 3D price comparison cards

### Phase 4: Link & URL Improvements
- [ ] Enhanced URL validation
- [ ] Auto-fix common URL issues
- [ ] Better error messages for invalid URLs

---

## File Changes Required

1. **email_config.json** - Email configuration
2. **app.py** - Password reset email fixes
3. **static/auth.css** - 3D enhancements
4. **static/style.css** - 3D visual effects
5. **templates/*.html** - Content additions
6. **static/script.js** - URL validation improvements

## Progress

Started: Implementation in progress

