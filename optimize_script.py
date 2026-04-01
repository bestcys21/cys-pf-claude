import os
import re

COMP_JS_PATH = r'c:\Users\bestc\Downloads\portfolio-web\js\components.js'
FILES = [
    r'c:\Users\bestc\Downloads\portfolio-web\index.html',
    r'c:\Users\bestc\Downloads\portfolio-web\detail.html',
    r'c:\Users\bestc\Downloads\portfolio-web\detail-syncflo.html'
]

# Replacement Map for Style -> Class
# (Summarized to prevent massive literal size)
REPLACEMENTS = {
    'style="display:flex;align-items:center;gap:var(--space-3);"': 'class="mk-flex mk-center mk-gap-3"',
    'style="display:flex;gap:6px;margin-bottom:var(--space-3);"': 'class="mk-flex mk-gap-2 mk-mb-3"',
    'style="display:flex;gap:6px;"': 'class="mk-flex mk-gap-2"',
    # ... more added below
}

# Regex and larger patterns
HEADER_RE = re.compile(r'<nav class="nav".*?</nav>', re.DOTALL)
FOOTER_RE = re.compile(r'<footer class="footer".*?</footer>', re.DOTALL)

def process_file(path):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add mockup.css link
    if 'mockup.css' not in content:
        content = content.replace('<link rel="stylesheet" href="css/style.css" />', 
                                  '<link rel="stylesheet" href="css/style.css" />\n  <link rel="stylesheet" href="css/mockup.css" />')
    
    # 2. Extract Nav/Footer
    content = HEADER_RE.sub('<common-header></common-header>', content)
    content = FOOTER_RE.sub('<common-footer></common-footer>', content)
    
    # 3. Add script
    if 'components.js' not in content:
        content = content.replace('</body>', '  <script src="js/components.js"></script>\n</body>')
    
    # 4. Clean up inline styles (simplified set)
    content = content.replace('style="flex:1;height:48px;border-radius:10px;background:rgba(255,255,255,0.2);"', 'class="mk-flex-1 mk-h-16 mk-rounded-lg mk-bg-glass-20"')
    # (Adding other key ones seen in grep)
    content = content.replace('style="height:80px;border-radius:14px;background:rgba(255,255,255,0.15);margin-bottom:var(--space-3);display:flex;align-items:center;justify-content:center;"', 'class="mk-h-32 mk-rounded-2xl mk-bg-glass-15 mk-mb-3 mk-center"')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for f in FILES:
    process_file(f)
    print(f"Processed: {f}")
