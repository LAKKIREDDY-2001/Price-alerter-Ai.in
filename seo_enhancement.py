#!/usr/bin/env python3
"""
SEO Enhancement Script for Price Alerter
Adds SEO meta tags, favicon, and Open Graph tags to all HTML templates
"""

import os
import re
from pathlib import Path

# Configuration - Auto-detect current directory
PROJECT_DIR = Path(__file__).parent.resolve()
TEMPLATES_DIR = PROJECT_DIR / "templates"

# SEO Configuration
SEO_CONFIG = {
    "title": "Price Alerter AI - Smart Price Tracking & Alerts",
    "description": "Track product prices across Amazon, Flipkart, Myntra and more. Get instant alerts when prices drop. Save money with AI-powered price monitoring.",
    "keywords": "price alert, price tracker, price monitor, amazon price tracker, flipkart price alert, myntra price drop, shopping deals, price comparison, alert system",
    "author": "Price Alerter AI",
    "site_name": "Price Alerter AI",
    "favicon_url": "https://www.google.com/s2/favicons?domain=google.com&sz=32",
    "og_image": "https://pricealerterai.in/images/og-image.png",
    "twitter_card": "summary_large_image",
    "locale": "en_US",
    "type": "website"
}

def get_seo_tags():
    """Generate SEO meta tags"""
    return f"""
    <!-- SEO Meta Tags -->
    <meta name="description" content="{SEO_CONFIG['description']}">
    <meta name="keywords" content="{SEO_CONFIG['keywords']}">
    <meta name="author" content="{SEO_CONFIG['author']}">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="{SEO_CONFIG['type']}">
    <meta property="og:url" content="{{{{ request.url }}}}">
    <meta property="og:title" content="{SEO_CONFIG['title']}">
    <meta property="og:description" content="{SEO_CONFIG['description']}">
    <meta property="og:image" content="{SEO_CONFIG['og_image']}">
    <meta property="og:site_name" content="{SEO_CONFIG['site_name']}">
    <meta property="og:locale" content="{SEO_CONFIG['locale']}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="{SEO_CONFIG['twitter_card']}">
    <meta property="twitter:url" content="{{{{ request.url }}}}">
    <meta property="twitter:title" content="{SEO_CONFIG['title']}">
    <meta property="twitter:description" content="{SEO_CONFIG['description']}">
    <meta property="twitter:image" content="{SEO_CONFIG['og_image']}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{SEO_CONFIG['favicon_url']}">
    <link rel="shortcut icon" type="image/x-icon" href="{SEO_CONFIG['favicon_url']}">
    <link rel="apple-touch-icon" sizes="32x32" href="{SEO_CONFIG['favicon_url']}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{{{ request.url }}}}">
"""

def add_seo_to_html(html_content, page_title=""):
    """Add SEO tags to HTML content"""
    
    title = page_title if page_title else SEO_CONFIG['title']
    seo_tags = get_seo_tags()
    
    # Check if SEO tags already exist
    if '<meta name="description"' in html_content:
        print(f"  SEO tags already exist, skipping...")
        return html_content
    
    # Find the </head> tag and insert SEO tags before it
    if '</head>' in html_content:
        html_content = html_content.replace('</head>', f'{seo_tags}\n</head>')
    elif '<head>' in html_content:
        # If </head> not found, insert after <head>
        html_content = html_content.replace('<head>', f'<head>\n{seo_tags}')
    
    return html_content

def process_templates():
    """Process all HTML templates in the templates directory"""
    
    if not TEMPLATES_DIR.exists():
        print(f"Error: Templates directory not found: {TEMPLATES_DIR}")
        return False
    
    # Define page-specific titles
    page_titles = {
        "index.html": "Price Alerter AI - Smart Price Tracking & Alerts",
        "home.html": "Dashboard - Price Alerter AI",
        "login.html": "Login - Price Alerter AI",
        "signup.html": "Sign Up - Price Alerter AI",
        "dashboard.html": "Dashboard - Price Alerter AI",
        "about.html": "About Us - Price Alerter AI",
        "contact.html": "Contact Us - Price Alerter AI",
        "privacy.html": "Privacy Policy - Price Alerter AI",
        "terms.html": "Terms of Service - Price Alerter AI",
        "blog.html": "Blog - Price Alerter AI",
        "error.html": "Error - Price Alerter AI",
        "forgot-password.html": "Forgot Password - Price Alerter AI",
        "reset-password.html": "Reset Password - Price Alerter AI",
    }
    
    html_files = list(TEMPLATES_DIR.glob("*.html"))
    print(f"Found {len(html_files)} HTML files in templates/")
    
    processed = 0
    for html_file in html_files:
        print(f"\nProcessing: {html_file.name}")
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Get page-specific title or use default
            page_title = page_titles.get(html_file.name, f"{html_file.stem.title()} - Price Alerter AI")
            
            # Add SEO tags
            new_content = add_seo_to_html(content, page_title)
            
            if new_content != content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"  ✓ Added SEO tags to {html_file.name}")
                processed += 1
            else:
                print(f"  - No changes needed for {html_file.name}")
                
        except Exception as e:
            print(f"  ✗ Error processing {html_file.name}: {e}")
    
    print(f"\n✓ Successfully processed {processed}/{len(html_files)} files")
    return True

def main():
    """Main function"""
    print("=" * 60)
    print("Price Alerter - SEO Enhancement Script")
    print("=" * 60)
    print(f"\nProject Directory: {PROJECT_DIR}")
    print(f"Templates Directory: {TEMPLATES_DIR}")
    print()
    
    if process_templates():
        print("\n" + "=" * 60)
        print("SEO Enhancement Complete!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Review the updated templates")
        print("2. Test the changes locally")
        print("3. Commit and push to create PR")
    else:
        print("\n✗ SEO Enhancement Failed")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

