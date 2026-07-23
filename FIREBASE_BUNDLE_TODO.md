# Firebase Bundle Migration - TODO List

## Phase 1: Update Firebase Entry Point
- [x] Update firebase-entry.js with new Firebase config
- [x] Add proper exports for all Firebase modules
- [x] Include App Check configuration

## Phase 2: Build Bundle
- [x] Run `npm run build:firebase` to build the bundle (397.2kb)

## Phase 3: Update HTML Templates
- [x] Update templates/index.html - Replace CDN with local bundle
- [x] Update templates/login.html - Replace CDN with local bundle
- [x] Update templates/signup.html - Replace CDN with local bundle
- [x] Update templates/forgot-password.html - Replace CDN with local bundle
- [x] Update templates/reset-password.html - Replace CDN with local bundle

## Phase 4: Update Static JS Files
- [x] Update static/firebase-init.js with new config
- [x] Update static/firebase-auth.js with new config

## Phase 5: Verify
- [ ] Check bundle loads correctly
- [ ] Verify Firebase services work
- [ ] Test authentication flow
- [ ] Check console for errors

