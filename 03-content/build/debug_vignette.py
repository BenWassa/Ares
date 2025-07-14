#!/usr/bin/env python3
import re
from pathlib import Path

# Test the Armenian genocide vignette extraction
armenian_path = Path("c:/Users/benjamin.haddon/Documents/Ares/03-content/case-studies/armenian-genocide.md")
with open(armenian_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("=== TESTING VIGNETTE PATTERNS ===")

# Test the pattern
vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', content, re.DOTALL)
if vignette_match:
    vignette_text = vignette_match.group(1).strip()
    print(f"FOUND VIGNETTE - Length: {len(vignette_text)}")
    print("Content:", vignette_text[:200])
    
    # Now test HTML conversion
    html = vignette_text
    html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # Convert paragraphs
    paragraphs = html.split('\n\n')
    processed_paragraphs = []
    
    for para in paragraphs:
        para = para.strip()
        if para and not para.startswith('<'):
            para = f'<p>{para}</p>'
        if para:
            processed_paragraphs.append(para)
    
    html_result = '\n'.join(processed_paragraphs)
    print("\n=== HTML RESULT ===")
    print(html_result[:400])
    
    # Extract first paragraph
    first_para_match = re.search(r'<p>(.*?)</p>', html_result, re.DOTALL)
    if first_para_match:
        first_para = first_para_match.group(1)
        print("\n=== FIRST PARAGRAPH ===")
        print(first_para[:200])
    
else:
    print("NO VIGNETTE FOUND")
