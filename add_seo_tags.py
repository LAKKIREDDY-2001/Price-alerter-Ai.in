#!/usr/bin/env python3
"""Add SEO meta tags to HTML files"""

import os

# SEO meta tags to add
SEO_TAGS = '''
    <meta name="description" content="Create your free account on AI Price Alert. Start tracking product prices across Amazon, Flipkart, Myntra and 100+ stores. Never miss a price drop again!">
    <meta name="keywords" content="price tracker, price alert, sign up, register, amazon price tracker, flipkart price tracker, myntra price alert, save money shopping">
    <meta property="og:title" content="Sign Up - AI Price Alert | Never Miss a Price Drop">
    <meta property="og:description" content="Create your free account and start tracking prices across 100+ stores. Save money on every purchase!">
    <meta property="og:image" content="https://aipricealert.com/static/og-image.png">
    <meta property="og:url" content="https://aipricealert.com/signup">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Sign Up - AI Price Alert">
    <meta name="twitter:description" content="Never miss a price drop again! Track prices across 100+ stores.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><text y=\\'.9em\\' font-size=\\'90\\'>🔔</text></svg>">
    <link rel="canonical" href="https://aipricealert.com/signup">'''

# Files to update with their specific content
files_to_update = [
    {
        'path': 'templates/signup.html',
        'title': 'Sign Up - AI Price Alert | Never Miss a Price Drop',
        'og_url': 'https://aipricealert.com/signup'
    },
    {
        'path': 'templates/login.html',
        'title': 'Login - AI Price Alert | Access Your Price Trackers',
        'og_url': 'https://aipricealert.com/login'
    },
    {
        'path': 'templates/index.html',
        'title': 'Dashboard - AI Price Alert | Track Prices & Save Money',
        'og_url': 'https://aipricealert.com/dashboard'
    }
]

def add_seo_tags(file_path, title, og_url):
    """Add SEO meta tags to an HTML file"""
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if SEO tags already exist
    if 'og:title' in content:
        print(f"SEO tags already exist in {file_path}, skipping...")
        return True
    
    # Replace title
    old_title = '<title>Sign Up - AI Price Alert</title>'
    if 'Sign Up' in title:
        old_title = '<title>Sign Up - AI Price Alert</title>'
    elif 'Login' in title:
        old_title = '<title>Login - AI Price Alert</title>'
    elif 'Dashboard' in title:
        old_title = '<title>AI Price Alert - Dashboard</title>'
    
    new_title = f'<title>{title}</title>'
    content = content.replace(old_title, new_title)
    
    # Add SEO tags after the title tag
    seo_tags = SEO_TAGS.replace('https://aipricealert.com/signup', og_url)
    
    # Find where to insert (after title tag)
    insert_pos = content.find('</title>')
    if insert_pos != -1:
        insert_pos = insert_pos + len('</title>')
        content = content[:insert_pos] + '\n' + seo_tags + content[insert_pos:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Added SEO tags to {file_path}")
    return True

# Process each file
for file_info in files_to_update:
    add_seo_tags(file_info['path'], file_info['title'], file_info['og_url'])

print("\nSEO tags added successfully!")

