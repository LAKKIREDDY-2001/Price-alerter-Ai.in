#!/usr/bin/env python3
seo = '''
    <meta name="description" content="Create your free account on AI Price Alert. Start tracking product prices across Amazon, Flipkart, Myntra and 100+ stores. Never miss a price drop again!">
    <meta name="keywords" content="price tracker, price alert, sign up, register">
    <meta property="og:title" content="Sign Up - AI Price Alert">
    <meta property="og:description" content="Create your free account and start tracking prices across 100+ stores.">
    <meta property="og:image" content="https://aipricealert.com/static/og-image.png">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔔</text></svg>
    <link rel="canonical" href="https://aipricealert.com/signup">'''
with open('templates/signup.html','r') as f: c=f.read()
c=c.replace('<title>Sign Up - AI Price Alert</title>','<title>Sign Up - AI Price Alert</title>'+seo)
with open('templates/signup.html','w') as f: f.write(c)
print('Done')
