# AI Price Alert - Development TODO List

## Project Overview
AI Price Alert is a comprehensive price tracking web application with:
- Flask backend with Firebase authentication
- Browser extension for Chrome/Firefox
- AdSense monetization
- Multi-currency support (15 currencies)
- Telegram & WhatsApp notifications
- Support for Amazon, Flipkart, Myntra, Ajio, Meesho, Snapdeal, Tata CLiQ, Reliance Digital, eBay

---

## 🎯 Priority 1: Critical Issues (Must Fix)

### 1.1 Firebase Bundle Path Issue
- **Status**: 🔴 Not Started
- **Issue**: Templates reference `/static/firebase-bundle.js` but the bundle may not exist
- **Fix**: 
  - Verify `firebase-entry.js` builds correctly to `/static/firebase-bundle.js`
  - Add fallback initialization if bundle fails to load
  - Check `static/firebase-init.js` and `static/firebase-auth.js` for proper integration
- **Files**: 
  - `firebase-entry.js`
  - `templates/*.html`
  - `static/firebase-init.js`
  - `static/firebase-auth.js`

### 1.2 API Base URL Configuration
- **Status**: 🔴 Not Started
- **Issue**: Both `static/auth.js` and `static/script.js` have `API_BASE_URL = ''` 
- **Fix**: 
  - Create environment-based configuration
  - Add proper API_BASE_URL for production/preview environments
  - Document deployment configuration
- **Files**: `static/auth.js`, `static/script.js`

### 1.3 Toast Notification Conflicts
- **Status**: 🔴 Not Started
- **Issue**: Both `auth.js` and `script.js` have different toast implementations
- **Fix**: 
  - Unify toast notification system
  - Add CSS styles dynamically in `auth.js` as it already does
  - Remove inline styles and use shared CSS classes
- **Files**: `static/auth.js`, `static/script.js`

---

## 🎯 Priority 2: Security Improvements

### 2.1 Password Validation Enhancement
- **Status**: 🟡 In Progress
- **Current**: Only checks minimum 6 characters
- **Improve**: Add password strength requirements
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character
- **Files**: `static/auth.js` (handleSignup, handleResetPassword)

### 2.2 CSRF Protection
- **Status**: 🔴 Not Started
- **Issue**: No CSRF tokens on forms
- **Fix**: 
  - Implement CSRF tokens for all forms
  - Add CSRF validation middleware to Flask
- **Files**: `app.py`, `templates/*.html`, `static/auth.js`, `static/script.js`

### 2.3 Rate Limiting for OTP
- **Status**: 🔴 Not Started
- **Issue**: No rate limiting on OTP endpoints
- **Fix**: 
  - Add rate limiting (e.g., max 3 OTPs per hour per email/phone)
  - Track attempts in Redis or database
- **Files**: `app.py` (OTP endpoints)

### 2.4 Input Sanitization
- **Status**: 🔴 Not Started
- **Fix**: 
  - Sanitize all user inputs
  - Add XSS protection headers
  - Implement proper output escaping in templates
- **Files**: `app.py`, `templates/*.html`

---

## 🎯 Priority 3: Firebase Integration

### 3.1 Firebase App Check
- **Status**: 🟡 Pending (see `APP_CHECK_TODO.md`)
- **Fix**: Enable Firebase App Check for added security
- **Files**: `static/firebase-init.js`, Firebase Console

### 3.2 Firebase Bundle Migration
- **Status**: 🟡 Pending (see `FIREBASE_BUNDLE_TODO.md`)
- **Fix**: Complete Firebase SDK bundle migration
- **Files**: `firebase-entry.js`, `package.json`, `static/*.js`

### 3.3 Firebase Authentication States
- **Status**: 🟡 In Progress
- **Fix**: 
  - Add proper session management
  - Handle auth state changes globally
  - Implement protected routes decorator
- **Files**: `static/firebase-auth.js`, `app.py`

---

## 🎯 Priority 4: User Experience Improvements

### 4.1 Loading States Enhancement
- **Status**: 🟡 In Progress
- **Current**: Basic loading text
- **Improve**: 
  - Add spinner animations
  - Disable form during submission
  - Show progress for multi-step operations
- **Files**: `static/auth.js`, `static/script.js`, `static/auth.css`

### 4.2 Form Validation UI
- **Status**: 🔴 Not Started
- **Fix**: 
  - Add inline field validation
  - Show real-time feedback
  - Highlight invalid fields
- **Files**: `templates/*.html`, `static/auth.js`, `static/auth.css`

### 4.3 Mobile Responsiveness
- **Status**: 🔴 Not Started
- **Issue**: Auth forms may not be fully responsive
- **Fix**: 
  - Test on mobile devices
  - Adjust CSS breakpoints
  - Ensure touch-friendly controls
- **Files**: `static/auth.css`, `static/style.css`

### 4.4 Empty States & Guidance
- **Status**: 🟡 In Progress
- **Current**: Basic empty state in trackers
- **Improve**: 
  - Add more helpful empty states
  - Add onboarding tooltips
  - Add product suggestions
- **Files**: `templates/index.html`, `static/script.js`, `static/style.css`

---

## 🎯 Priority 5: AdSense Integration

### 5.1 Ad Placement Optimization
- **Status**: 🟡 In Progress (see `ADSENSE_INTEGRATION_PLAN.md`)
- **Fix**: 
  - Optimize ad placements for better CTR
  - Add lazy loading for ads
  - A/B test ad positions
- **Files**: `templates/*.html`, `static/ads.js`

### 5.2 AdSense Verification
- **Status**: 🟡 Pending (see `ADSENSE_VERIFICATION_TODO.md`)
- **Fix**: Complete AdSense verification process
- **Files**: `templates/*.html`, `static/ads.js`

---

## 🎯 Priority 6: Browser Extension

### 6.1 Extension Manifest V3 Update
- **Status**: 🔴 Not Started
- **Issue**: Need to ensure manifest.json is V3 compliant
- **Fix**: 
  - Update manifest to V3
  - Update service worker syntax
  - Fix deprecated APIs
- **Files**: `browser-extension/manifest.json`, `browser-extension/background.js`

### 6.2 Extension Popup Improvements
- **Status**: 🟡 In Progress (see `BROWSER_EXTENSION_TODO.md`)
- **Fix**: 
  - Improve popup UI
  - Add quick add feature
  - Show notification badges
- **Files**: `browser-extension/popup.html`, `browser-extension/popup.js`, `browser-extension/popup.css`

### 6.3 Content Script Enhancements
- **Status**: 🔴 Not Started
- **Fix**: 
  - Add price extraction on product pages
  - Add floating "Track Price" button
  - Improve site detection
- **Files**: `browser-extension/content.js`, `browser-extension/content.css`

---

## 🎯 Priority 7: Price Tracking Logic

### 7.1 Price Fetching Reliability
- **Status**: 🟡 In Progress (see `MYNTRA_FIX_PLAN.md`, `price_fix_plan.md`)
- **Fix**: 
  - Improve Myntra price extraction
  - Handle dynamic content loading
  - Add retry logic with exponential backoff
- **Files**: `app.py`, `scrapers/*.py`

### 7.2 Price Prediction AI
- **Status**: 🔴 Not Started
- **Feature**: 
  - Implement ML-based price predictions
  - Use historical data patterns
  - Provide confidence scores
- **Files**: `app.py`, `litellm_config.yaml`

### 7.3 Multi-Currency Price Conversion
- **Status**: 🟡 In Progress
- **Current**: 15 currencies supported in UI
- **Fix**: 
  - Implement real-time currency conversion
  - Store base currency preference
  - Handle exchange rate updates
- **Files**: `static/script.js`, `app.py`

---

## 🎯 Priority 8: Notifications

### 8.1 Telegram Integration
- **Status**: 🟡 In Progress (see `MESSAGING_INTEGRATION_PLAN.md`)
- **Fix**: 
  - Complete Telegram bot setup
  - Handle /start, /stop commands
  - Add inline keyboard support
- **Files**: `telegram_config.json`, `app.py`, `bot.py`

### 8.2 WhatsApp Integration
- **Status**: 🟡 In Progress (see `MESSAGING_INTEGRATION_PLAN.md`)
- **Fix**: 
  - Complete WhatsApp Business API integration
  - Handle message templates
  - Add opt-in/opt-out
- **Files**: `whatsapp_config.json`, `app.py`

### 8.3 Push Notifications
- **Status**: 🔴 Not Started
- **Fix**: 
  - Implement browser push notifications
  - Add service worker for notifications
  - Handle permission requests
- **Files**: `browser-extension/background.js`, `app.py`

---

## 🎯 Priority 9: Backend Improvements

### 9.1 Database Optimization
- **Status**: 🔴 Not Started
- **Fix**: 
  - Add indexes on frequently queried fields
  - Implement pagination for large datasets
  - Add query caching
- **Files**: `app.py`, database models

### 9.2 API Documentation
- **Status**: 🔴 Not Started
- **Fix**: 
  - Add OpenAPI/Swagger documentation
  - Document all endpoints
  - Add example requests/responses
- **Files**: `app.py`, create `docs/` directory

### 9.3 Error Handling & Logging
- **Status**: 🔴 Not Started
- **Fix**: 
  - Implement structured logging
  - Add error boundaries
  - Create error response templates
- **Files**: `app.py`

### 9.4 Background Jobs
- **Status**: 🔴 Not Started
- **Fix**: 
  - Implement Celery for background tasks
  - Schedule price checks
  - Send notification queue
- **Files**: `app.py`, `tasks.py`, `requirements.txt`

---

## 🎯 Priority 10: DevOps & Deployment

### 10.1 CI/CD Pipeline
- **Status**: 🟡 In Progress (see `.github/workflows/ci.yml`)
- **Fix**: 
  - Add automated tests
  - Implement linting
  - Add deployment automation
- **Files**: `.github/workflows/ci.yml`

### 10.2 Docker Setup
- **Status**: 🔴 Not Started
- **Fix**: 
  - Create Dockerfile
  - Create docker-compose.yml
  - Document local development setup
- **Files**: Create `Dockerfile`, `docker-compose.yml`

### 10.3 Environment Configuration
- **Status**: 🔴 Not Started
- **Fix**: 
  - Create `.env.example`
  - Document all environment variables
  - Implement config validation
- **Files**: Create `.env.example`, update `app.py`

---

## 🎯 Priority 11: WordPress Integration

### 11.1 Plugin Enhancement
- **Status**: 🟡 In Progress (see `WORDPRESS_INTEGRATION.md`)
- **Fix**: 
  - Improve WordPress plugin
  - Add shortcode support
  - Fix redirect issues
- **Files**: `wordpress-plugin/price-alert-embed.php`, `wordpress-plugin/redirect-solution.html`

### 11.2 Embeddable Widget
- **Status**: 🔴 Not Started
- **Fix**: 
  - Create standalone JS widget
  - Add iframe embedding option
  - Support custom styling
- **Files**: Create `static/widget.js`, `static/widget.css`

---

## 🎯 Priority 12: Documentation

### 12.1 README Enhancement
- **Status**: 🔴 Not Started
- **Fix**: 
  - Add getting started guide
  - Document all features
  - Add troubleshooting section
- **Files**: `README.md`

### 12.2 API Documentation
- **Status**: 🔴 Not Started
- **Fix**: 
  - Create API documentation
  - Add authentication guide
  - Document rate limits
- **Files**: Create `docs/API.md`

### 12.3 Contributing Guidelines
- **Status**: 🟡 In Progress (see `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`)
- **Fix**: 
  - Improve contribution guide
  - Add style guides
  - Document commit conventions
- **Files**: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

---

## 📋 Task Checklist

### Completed ✅
- [ ] Project structure setup
- [ ] Basic Flask application
- [ ] Firebase authentication setup
- [ ] Basic templates (login, signup, dashboard)
- [ ] AdSense integration
- [ ] Multi-currency support (15 currencies)
- [ ] Browser extension basic structure
- [ ] Telegram/WhatsApp config files

### In Progress 🔄
- [ ] Firebase bundle migration
- [ ] App Check implementation
- [ ] Price tracking reliability improvements
- [ ] Messaging integration

### Not Started ⏳
- All Priority 1-12 tasks marked as "Not Started"

---

## 📁 File References

### Core Application
- `app.py` - Main Flask application
- `firebase-entry.js` - Firebase bundle entry point
- `static/auth.js` - Authentication logic
- `static/script.js` - Dashboard functionality
- `static/auth.css` - Auth page styles
- `static/style.css` - Dashboard styles

### Templates
- `templates/signup.html` - Signup page
- `templates/login.html` - Login page
- `templates/index.html` - Dashboard
- `templates/forgot-password.html` - Password reset request
- `templates/reset-password.html` - Password reset form
- `templates/error.html` - Error page

### Configuration
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies
- `firebase.json` - Firebase configuration
- `litellm_config.yaml` - LLM configuration

### Plans & Documentation
- `TODO.md` - This file
- `LOGIN_FIX_PLAN.md` - Login fixes
- `MYNTRA_FIX_PLAN.md` - Myntra fixes
- `LITELLM_FIX_PLAN.md` - LLM fixes
- `FIREBASE_INTEGRATION_PLAN.md` - Firebase integration
- `FIREBASE_SDK_SETUP_PLAN.md` - Firebase SDK setup
- `FIREBASE_BUNDLE_MIGRATION_PLAN.md` - Bundle migration
- `ADSENSE_INTEGRATION_PLAN.md` - AdSense setup
- `ADSENSE_VERIFICATION_TODO.md` - AdSense verification
- `MESSAGING_INTEGRATION_PLAN.md` - Telegram/WhatsApp
- `BROWSER_EXTENSION_TODO.md` - Extension improvements
- `WORDPRESS_INTEGRATION.md` - WordPress setup
- `DEPLOY.md` - Deployment guide

---

## 🚀 Quick Wins (Can Complete in < 1 Hour)

1. **Add password strength meter** in signup form
2. **Add loading spinner CSS** to auth.css
3. **Add favicon** to all templates
4. **Fix empty state icon sizes**
5. **Add hover effects** to buttons
6. **Optimize ad placement CSS**
7. **Add proper meta tags** for SEO
8. **Add 404 page**

---

## 📅 Development Sprints

### Sprint 1: Foundation (Week 1)
- [ ] Fix Firebase bundle issues
- [ ] Resolve API configuration
- [ ] Unify toast notifications
- [ ] Add CSRF protection

### Sprint 2: Security (Week 2)
- [ ] Password validation
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Security headers

### Sprint 3: UX Improvements (Week 3)
- [ ] Loading states
- [ ] Form validation UI
- [ ] Mobile responsiveness
- [ ] Empty states

### Sprint 4: Features (Week 4)
- [ ] Push notifications
- [ ] Price predictions
- [ ] Background jobs
- [ ] API documentation

---

*Last Updated: 2024
*Version: 2.0.0

