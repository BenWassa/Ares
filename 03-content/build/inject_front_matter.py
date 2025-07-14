#!/usr/bin/env python3
import re
from pathlib import Path

def inject_front_matter():
    """Inject front matter content"""
    
    # Read the HTML file
    html_path = Path("c:/Users/benjamin.haddon/Documents/Ares/01-core/index-with-content.html")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Read front matter content
    front_matter_path = Path("c:/Users/benjamin.haddon/Documents/Ares/03-content/sections/front-matter.md")
    with open(front_matter_path, 'r', encoding='utf-8') as f:
        front_matter = f.read()
    
    # Extract executive summary
    exec_match = re.search(r'### Executive Summary(.*?)(?=### How to Use|$)', front_matter, re.DOTALL)
    if exec_match:
        exec_content = exec_match.group(1).strip()
        # Clean up - remove list formatting and make it a proper paragraph
        exec_content = re.sub(r'^\*\s+', '', exec_content, flags=re.MULTILINE)
        exec_content = re.sub(r'\n+', ' ', exec_content)
        exec_content = f'<p>{exec_content}</p>'
        
        # Replace executive summary placeholder
        exec_pattern = r'(<div class="executive-summary">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Executive Summary Content -->\s*(</div>)'
        exec_replacement = f'\\1\n                    {exec_content}\n                \\2'
        html = re.sub(exec_pattern, exec_replacement, html, flags=re.DOTALL)
        print("Executive summary injected")
    
    # Extract how to use section
    how_to_match = re.search(r'### How to Use This Synopsis(.*?)(?=###|$)', front_matter, re.DOTALL)
    if how_to_match:
        how_to_content = how_to_match.group(1).strip()
        # Format as paragraph
        how_to_content = f'<p>{how_to_content}</p>'
        
        # Replace how to use placeholder
        how_to_pattern = r'(<div class="how-to-use">.*?<div class="content-placeholder">)\s*<!-- Placeholder: How to Use This Synopsis Content -->\s*(</div>)'
        how_to_replacement = f'\\1\n                    {how_to_content}\n                \\2'
        html = re.sub(how_to_pattern, how_to_replacement, html, flags=re.DOTALL)
        print("How to use section injected")
    
    # Clean up the Armenian vignette (remove trailing asterisk)
    html = re.sub(r'(the land\.)\*', r'\1', html)
    
    # Write back
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("Front matter injection completed!")

if __name__ == "__main__":
    inject_front_matter()
