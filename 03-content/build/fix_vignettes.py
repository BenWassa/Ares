#!/usr/bin/env python3
import re
from pathlib import Path

def simple_inject_vignettes():
    """Simple approach to inject Armenian genocide vignette"""
    
    # Read the HTML file
    html_path = Path("c:/Users/benjamin.haddon/Documents/Ares/01-core/index-with-content.html")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Read Armenian genocide content
    armenian_path = Path("c:/Users/benjamin.haddon/Documents/Ares/03-content/case-studies/armenian-genocide.md")
    with open(armenian_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the vignette
    vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', content, re.DOTALL)
    if vignette_match:
        vignette_text = vignette_match.group(1).strip()
        
        # Clean up the vignette - remove leading asterisk and format as paragraph
        vignette_text = re.sub(r'^\*', '', vignette_text, flags=re.MULTILINE)
        vignette_text = vignette_text.strip()
        
        # Replace the Armenian genocide placeholder
        pattern = r'(<section id="armenian-genocide".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: Armenian Genocide Opening Vignette with drop-cap -->\s*(</p>)'
        replacement = f'\\1\n                        {vignette_text}\n                    \\2'
        
        html = re.sub(pattern, replacement, html, flags=re.DOTALL)
        
        # Write back
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("Armenian genocide vignette injected successfully!")
        print(f"Vignette text: {vignette_text[:100]}...")
    else:
        print("No vignette found")

if __name__ == "__main__":
    simple_inject_vignettes()
