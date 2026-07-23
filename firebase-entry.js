// Firebase entry point - exports for browser use
// Built with npm Firebase SDK + esbuild

import { initializeApp, getApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Your web app's Firebase configuration (from task)
const firebaseConfig = {
  apiKey: "AIzaSyCNmtIZice9l2M-sk-lJ82m0BWYC2Ypl08",
  authDomain: "ai-price-alert.firebaseapp.com",
  projectId: "ai-price-alert",
  storageBucket: "ai-price-alert.firebasestorage.app",
  messagingSenderId: "150142041812",
  appId: "1:150142041812:web:c645b3d9d6f1fea4b6c541",
  measurementId: "G-0WZN54TWR0"
};

// reCAPTCHA v3 Site Key for Firebase App Check
const RECAPTCHA_SITE_KEY = "6Lfi-UUsAAAAALVa4-MIVKWmfy7P7wMR0jZRa9KY";

// Initialize Firebase
let app;
let analytics;
let auth;
let googleProvider;
let appCheck;

try {
  // Check if Firebase is already initialized
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (e) {
  console.error('Firebase initialization error:', e);
  // Try to get existing app
  try {
    app = getApp();
  } catch (getError) {
    console.error('Failed to get existing Firebase app:', getError);
  }
}

// Initialize Firebase services
if (app) {
  try {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } catch (e) {
    console.warn('Firebase Analytics initialization skipped:', e.message);
  }

  try {
    auth = getAuth(app);
    // Configure auth settings
    auth.useDeviceLanguage();
    console.log('Firebase Auth initialized');
  } catch (e) {
    console.warn('Firebase Auth initialization skipped:', e.message);
  }

  try {
    // Initialize App Check with reCAPTCHA v3
    const provider = new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY);
    initializeAppCheck(app, {
      provider: provider,
      isTokenAutoRefreshEnabled: true
    });
    console.log('Firebase App Check initialized with reCAPTCHA v3');
  } catch (e) {
    console.warn('Firebase App Check initialization skipped:', e.message);
  }
}

// Create Google Auth Provider
if (auth) {
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
}

// Export Firebase instances and functions
window.firebaseApp = app || null;
window.firebaseAnalytics = analytics || null;
window.firebaseAuth = auth || null;
window.firebaseConfig = firebaseConfig;
window.recaptchaSiteKey = RECAPTCHA_SITE_KEY;

// Auth helper functions
window.firebaseAuthFunctions = {
  // Sign in with Google
  signInWithGoogle: function() {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return Promise.reject(new Error('Firebase Auth not initialized'));
    }
    return signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log('Google sign-in successful:', result.user);
        return result.user;
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        throw error;
      });
  },

  // Sign in with email/password
  signInWithEmail: function(email, password) {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return Promise.reject(new Error('Firebase Auth not initialized'));
    }
    return signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log('Email sign-in successful:', result.user);
        return result.user;
      })
      .catch((error) => {
        console.error('Email sign-in error:', error);
        throw error;
      });
  },

  // Sign up with email/password
  signUpWithEmail: function(email, password, username) {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return Promise.reject(new Error('Firebase Auth not initialized'));
    }
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        const user = result.user;
        // Update profile with username
        try {
          await user.updateProfile({ displayName: username });
        } catch (updateError) {
          console.warn('Could not update user profile:', updateError);
        }
        console.log('Email sign-up successful:', user);
        return user;
      })
      .catch((error) => {
        console.error('Email sign-up error:', error);
        throw error;
      });
  },

  // Sign out
  signOut: function() {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return Promise.reject(new Error('Firebase Auth not initialized'));
    }
    return signOut(auth)
      .then(() => {
        console.log('Sign-out successful');
      })
      .catch((error) => {
        console.error('Sign-out error:', error);
        throw error;
      });
  },

  // Send password reset email
  resetPassword: function(email) {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return Promise.reject(new Error('Firebase Auth not initialized'));
    }
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent:', email);
      })
      .catch((error) => {
        console.error('Password reset error:', error);
        throw error;
      });
  },

  // Get current user
  getCurrentUser: function() {
    return auth ? auth.currentUser : null;
  },

  // Get ID token
  getIdToken: async function() {
    if (!auth || !auth.currentUser) {
      return null;
    }
    return await auth.currentUser.getIdToken();
  },

  // Listen to auth state changes
  onAuthStateChanged: function(callback) {
    if (auth) {
      auth.onAuthStateChanged(callback);
    }
  },

  // Check if authenticated
  isAuthenticated: function() {
    return auth ? auth.currentUser !== null : false;
  }
};

// Analytics helper functions
window.firebaseAnalyticsFunctions = {
  logEvent: function(eventName, params) {
    if (analytics) {
      logEvent(analytics, eventName, params);
      console.log('Analytics event logged:', eventName);
    } else {
      console.warn('Firebase Analytics not initialized, event not logged:', eventName);
    }
  },

  logPageView: function(pagePath, pageTitle) {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  },

  logTrackerCreated: function(productName, site) {
    if (analytics) {
      logEvent(analytics, 'tracker_created', {
        product_name: productName,
        site: site
      });
    }
  },

  logPriceAlert: function(price, discount) {
    if (analytics) {
      logEvent(analytics, 'price_alert', {
        price: price,
        discount_percentage: discount
      });
    }
  }
};

console.log('Firebase bundle loaded successfully');
console.log('App:', app ? 'initialized' : 'not initialized');
console.log('Auth:', auth ? 'initialized' : 'not initialized');
console.log('Analytics:', analytics ? 'initialized' : 'not initialized');

