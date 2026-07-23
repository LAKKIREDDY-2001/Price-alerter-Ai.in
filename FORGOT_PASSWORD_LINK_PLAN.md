# Forgot Password - Display Reset Link in Demo Mode

## Task Summary
Modify the forgot password flow to display the reset link on the page when email sending is disabled (demo mode), instead of printing to console and telling users to "check their email".

## Current Behavior
- User submits forgot password form
- Backend generates reset token and sends email (prints to console in demo mode)
- API returns success message "Password reset instructions sent to your email"
- Frontend shows "Check your email" message

## Desired Behavior
- When email is **enabled**: Send link via email, show "check your email" message (unchanged)
- When email is **disabled (demo mode)**: Display the reset link directly on the page

## Implementation Plan

### Step 1: Modify Backend (app.py)
**File**: `/Users/lakkireddyvenkatamadhavareddy/price alerter/app.py`

**Function**: `api_forgot_password()`

**Current Code**:
```python
@app.route('/api/forgot-password', methods=['POST'])
def api_forgot_password():
    """API endpoint for forgot password"""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(minutes=30)
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO password_resets (user_id, reset_token, reset_token_expiry)
            VALUES (?, ?, ?)
        """, (user[0], reset_token, expiry.isoformat()))
        conn.commit()
        conn.close()
        
        # Try to send email (but don't fail if it doesn't work)
        email_sent = send_password_reset_email(email, reset_token)
        
        # SECURITY FIX: Never return reset_link in API response!
        # The link is sent via email only
        return jsonify({
            "success": True,
            "message": "Password reset instructions sent to your email",
            "email_sent": email_sent,
            "demo_mode": not EMAIL_CONFIG['enabled'] or not email_sent
        }), 200
    
    # Always return success to prevent email enumeration
    return jsonify({
        "success": True,
        "message": "If an account exists, a reset link has been sent"
    }), 200
```

**New Code**:
```python
@app.route('/api/forgot-password', methods=['POST'])
def api_forgot_password():
    """API endpoint for forgot password"""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(minutes=30)
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO password_resets (user_id, reset_token, reset_token_expiry)
            VALUES (?, ?, ?)
        """, (user[0], reset_token, expiry.isoformat()))
        conn.commit()
        conn.close()
        
        # Try to send email (but don't fail if it doesn't work)
        email_sent = send_password_reset_email(email, reset_token)
        
        # Build response
        response_data = {
            "success": True,
            "message": "Password reset instructions sent to your email",
            "email_sent": email_sent,
            "demo_mode": not EMAIL_CONFIG['enabled'] or not email_sent
        }
        
        # In demo mode (email disabled), return the reset_link so it can be displayed on the page
        if not EMAIL_CONFIG['enabled'] or not email_sent:
            host_url = EMAIL_CONFIG.get('host_url', 'http://localhost:8081')
            response_data["reset_link"] = f"{host_url}/reset-password?token={reset_token}"
            response_data["message"] = "Email sending is disabled. Use the reset link below."
        
        return jsonify(response_data), 200
    
    # Always return success to prevent email enumeration
    return jsonify({
        "success": True,
        "message": "If an account exists, a reset link has been sent"
    }), 200
```

### Step 2: Modify Frontend (static/auth.js)
**File**: `/Users/lakkireddyvenkatamadhavareddy/price alerter/static/auth.js`

**Function**: `handleForgotPassword(e)`

**Current Code**:
```javascript
async function handleForgotPassword(e) {
    e.preventDefault();

    // Find email input - check multiple possible IDs
    const emailInput = document.getElementById('forgot-email') ||
                       document.getElementById('email') ||
                       document.querySelector('input[name="email"]');
    const email = emailInput?.value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const submitBtn = e.target?.querySelector('button[type="submit"]');

    if (!email) {
        showError('Please enter your email address');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
    }
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    if (successMessage) {
        successMessage.style.display = 'none';
    }

    try {
        const response = await fetch(API_BASE_URL + '/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message inline (works on all pages)
            const authForm = document.querySelector('.auth-form');
            if (authForm) {
                authForm.innerHTML = `
                    <div style="text-align: center; padding: 20px 0;">
                        <i class="fa fa-check-circle" style="font-size: 64px; color: #4caf50; margin-bottom: 20px;"></i>
                        <h2 style="margin-bottom: 12px;">Check your email</h2>
                        <p style="color: #666; margin-bottom: 24px;">We've sent password reset instructions to ${email}</p>
                        <p style="color: #888; font-size: 13px; margin-bottom: 24px;">Click the link in the email to reset your password. The link expires in 30 minutes.</p>
                        <a href="/login" class="auth-btn" style="display: inline-block; text-decoration: none;">
                            <i class="fa fa-arrow-left"></i> Back to Login
                        </a>
                    </div>
                `;
            }

            // Also show toast notification
            showToast('success', 'Password reset instructions sent!');
        } else {
            showError(data.error || 'Failed to send reset link', errorMessage?.id || 'error-message');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Reset Link';
            }
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showError('An error occurred. Please try again.', errorMessage?.id || 'error-message');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Reset Link';
        }
    }
}
```

**New Code**:
```javascript
async function handleForgotPassword(e) {
    e.preventDefault();

    // Find email input - check multiple possible IDs
    const emailInput = document.getElementById('forgot-email') ||
                       document.getElementById('email') ||
                       document.querySelector('input[name="email"]');
    const email = emailInput?.value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const submitBtn = e.target?.querySelector('button[type="submit"]');

    if (!email) {
        showError('Please enter your email address');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
    }
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    if (successMessage) {
        successMessage.style.display = 'none';
    }

    try {
        const response = await fetch(API_BASE_URL + '/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            // Check if reset_link is provided (demo mode)
            if (data.reset_link) {
                // Demo mode - show reset link directly on page
                const authForm = document.querySelector('.auth-form');
                if (authForm) {
                    authForm.innerHTML = `
                        <div style="text-align: center; padding: 20px 0;">
                            <i class="fa fa-link" style="font-size: 64px; color: #667eea; margin-bottom: 20px;"></i>
                            <h2 style="margin-bottom: 12px;">Demo Mode - Reset Link</h2>
                            <p style="color: #666; margin-bottom: 16px;">Email sending is disabled. Use the link below to reset your password:</p>
                            
                            <div style="background: #f5f5f5; border: 2px dashed #ddd; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                <a href="${data.reset_link}" 
                                   style="color: #667eea; font-size: 16px; word-break: break-all; text-decoration: none; display: block; padding: 10px;">
                                    ${data.reset_link}
                                </a>
                            </div>
                            
                            <button onclick="copyResetLink('${data.reset_link}')" 
                                    style="background: #f0f0f0; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-bottom: 16px; display: inline-flex; align-items: center; gap: 8px;">
                                <i class="fa fa-copy"></i> Copy Link
                            </button>
                            
                            <p style="color: #888; font-size: 13px; margin-top: 16px;">This link expires in 30 minutes for your security.</p>
                            <a href="/login" class="auth-btn" style="display: inline-block; text-decoration: none; margin-top: 16px;">
                                <i class="fa fa-arrow-left"></i> Back to Login
                            </a>
                        </div>
                    `;
                }
                showToast('info', 'Reset link displayed below!');
            } else {
                // Normal mode - show "check your email" message
                const authForm = document.querySelector('.auth-form');
                if (authForm) {
                    authForm.innerHTML = `
                        <div style="text-align: center; padding: 20px 0;">
                            <i class="fa fa-check-circle" style="font-size: 64px; color: #4caf50; margin-bottom: 20px;"></i>
                            <h2 style="margin-bottom: 12px;">Check your email</h2>
                            <p style="color: #666; margin-bottom: 24px;">We've sent password reset instructions to ${email}</p>
                            <p style="color: #888; font-size: 13px; margin-bottom: 24px;">Click the link in the email to reset your password. The link expires in 30 minutes.</p>
                            <a href="/login" class="auth-btn" style="display: inline-block; text-decoration: none;">
                                <i class="fa fa-arrow-left"></i> Back to Login
                            </a>
                        </div>
                    `;
                }
                showToast('success', 'Password reset instructions sent!');
            }
        } else {
            showError(data.error || 'Failed to send reset link', errorMessage?.id || 'error-message');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Reset Link';
            }
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showError('An error occurred. Please try again.', errorMessage?.id || 'error-message');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Reset Link';
        }
    }
}

// Add copy link function
function copyResetLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        showToast('success', 'Link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('success', 'Link copied to clipboard!');
    });
}
```

## Files to Modify
1. `/Users/lakkireddyvenkatamadhavareddy/price alerter/app.py` - Modify `api_forgot_password()` function
2. `/Users/lakkireddyvenkatamadhavareddy/price alerter/static/auth.js` - Modify `handleForgotPassword()` function and add `copyResetLink()` function

## Testing
After implementing:
1. Restart the Flask server
2. Go to `/forgot-password` page
3. Enter an email address
4. Verify that the reset link is displayed on the page (when email is disabled)
5. Verify that the link works and redirects to the reset password page

## Rollback Plan
If issues arise:
1. Keep backups of original files
2. Use `git checkout` to revert changes if needed

