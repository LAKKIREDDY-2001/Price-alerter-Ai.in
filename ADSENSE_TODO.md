# AdSense Integration TODO List

## Phase 1: Setup
- [ ] Create AdSense account at https://www.google.com/adsense/
- [ ] Add website domain for approval
- [ ] Create ad units (banner, rectangle, responsive)
- [ ] Get Publisher ID and ad unit IDs

## Phase 2: Create AdSense Script
- [x] Create `static/ads.js` with AdSense integration
- [x] Implement ad loading functions
- [x] Add tracking utilities

## Phase 3: Update Web Templates
- [x] Update `templates/index.html` with ad containers
- [x] Update `templates/login.html` with ad containers
- [x] Update `templates/signup.html` with ad containers

## Phase 4: Add Ad Styling
- [x] Update `static/style.css` with ad container styles
- [x] Add responsive ad styles
- [x] Add ad label styling
- [x] Update `static/auth.css` with auth page ad styles

## Phase 5: Browser Extension Affiliate System
- [x] Update `browser-extension/popup.html` with affiliate section
- [x] Update `browser-extension/popup.css` with affiliate styles
- [x] Update `browser-extension/popup.js` with affiliate logic

## Phase 6: Configuration Required Before Launch
- [ ] Add your AdSense Publisher ID in `static/ads.js`
- [ ] Add your Ad Unit IDs in `static/ads.js`
- [ ] Add your Amazon Affiliate ID in `browser-extension/popup.js`
- [ ] Add your Flipkart Affiliate ID in `browser-extension/popup.js`
- [ ] Add your Myntra Affiliate ID in `browser-extension/popup.js`

## Phase 7: Compliance
- [ ] Add ad disclosure to privacy policy
- [ ] Add cookie consent (if EU users)

## Phase 8: Testing & Deployment
- [ ] Test ads on staging
- [ ] Verify ad rendering
- [ ] Check responsive behavior
- [ ] Deploy to production
- [ ] Monitor performance metrics

