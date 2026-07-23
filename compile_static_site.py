import os
import re

TEMPLATE_DIR = 'templates'
OUTPUT_DIR = '.'

# Map source templates to their destination static filenames
TEMPLATE_MAP = {
    'home.html': 'index.html',
    'index.html': 'dashboard.html',
    'login.html': 'login.html',
    'signup.html': 'signup.html',
    'forgot-password.html': 'forgot-password.html',
    'reset-password.html': 'reset-password.html',
    'about.html': 'about.html',
    'contact.html': 'contact.html',
    'privacy.html': 'privacy.html',
    'terms.html': 'terms.html',
    'blog.html': 'blog.html',
    'error.html': '404.html'
}

def compile_templates():
    print("Starting static site compilation...")
    for src, dest in TEMPLATE_MAP.items():
        src_path = os.path.join(TEMPLATE_DIR, src)
        dest_path = os.path.join(OUTPUT_DIR, dest)

        if not os.path.exists(src_path):
            print(f"Warning: Source template {src_path} does not exist. Skipping.")
            continue

        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Replace server routes in href links with static .html links (relative for portability)
        # Matches href="/login", href="/signup", etc.
        route_pattern = r'href="/(login|signup|dashboard|forgot-password|reset-password|about|contact|privacy|terms|blog|logout)"'
        content = re.sub(route_pattern, r'href="\1.html"', content)
        
        # Replace root href with index.html
        content = content.replace('href="/"', 'href="index.html"')

        # 2. Resolve Jinja2 variables
        # request.url -> canonical page URL
        canonical_url = f"https://pricealerter.in/{dest}"
        if dest == 'index.html':
            canonical_url = "https://pricealerter.in/"
        
        content = content.replace('{{ request.url }}', canonical_url)
        content = content.replace('{{ token }}', '')
        content = content.replace('{{ error }}', 'The page you requested could not be found.')

        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Compiled: {src_path} -> {dest_path}")

    print("Static site compilation complete!")

if __name__ == '__main__':
    compile_templates()
