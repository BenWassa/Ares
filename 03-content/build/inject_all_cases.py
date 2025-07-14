#!/usr/bin/env python3
import re
from pathlib import Path

def inject_remaining_case_studies():
    """Inject My Lai and Rwanda case study vignettes"""
    
    # Read the HTML file
    html_path = Path("c:/Users/benjamin.haddon/Documents/Ares/01-core/index-with-content.html")
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Read My Lai content
    mylai_path = Path("c:/Users/benjamin.haddon/Documents/Ares/03-content/case-studies/my-lai-massacre.md")
    if mylai_path.exists():
        with open(mylai_path, 'r', encoding='utf-8') as f:
            mylai_content = f.read()
        
        # Extract the vignette
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', mylai_content, re.DOTALL)
        if vignette_match:
            vignette_text = vignette_match.group(1).strip()
            vignette_text = re.sub(r'^\*', '', vignette_text, flags=re.MULTILINE)
            vignette_text = vignette_text.strip()
            
            # Replace the My Lai placeholder
            pattern = r'(<section id="my-lai-massacre".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: My Lai Opening Vignette with drop-cap -->\s*(</p>)'
            replacement = f'\\1\n                        {vignette_text}\n                    \\2'
            html = re.sub(pattern, replacement, html, flags=re.DOTALL)
            print("My Lai vignette injected")
        
        # Extract and inject analysis
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', mylai_content, re.DOTALL)
        if analysis_match:
            analysis_text = analysis_match.group(1).strip()
            # Convert to basic HTML
            analysis_html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\\1</strong>', analysis_text)
            analysis_html = re.sub(r'\*(.*?)\*', r'<em>\\1</em>', analysis_html)
            analysis_html = re.sub(r'^### (.*?)$', r'<h3>\\1</h3>', analysis_html, flags=re.MULTILINE)
            analysis_html = re.sub(r'^## (.*?)$', r'<h2>\\1</h2>', analysis_html, flags=re.MULTILINE)
            # Convert to paragraphs
            paragraphs = analysis_html.split('\n\n')
            processed = []
            for para in paragraphs:
                para = para.strip()
                if para and not para.startswith('<'):
                    para = f'<p>{para}</p>'
                if para:
                    processed.append(para)
            analysis_html = '\n'.join(processed)
            
            # Replace My Lai analysis
            pattern = r'(<section id="my-lai-massacre".*?<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)'
            replacement = f'\\1\n                        {analysis_html}\n                    \\2'
            html = re.sub(pattern, replacement, html, flags=re.DOTALL)
            print("My Lai analysis injected")
    
    # Read Rwanda content
    rwanda_path = Path("c:/Users/benjamin.haddon/Documents/Ares/03-content/case-studies/rwandan-genocide.md")
    if rwanda_path.exists():
        with open(rwanda_path, 'r', encoding='utf-8') as f:
            rwanda_content = f.read()
        
        # Extract the vignette
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', rwanda_content, re.DOTALL)
        if vignette_match:
            vignette_text = vignette_match.group(1).strip()
            vignette_text = re.sub(r'^\*', '', vignette_text, flags=re.MULTILINE)
            vignette_text = vignette_text.strip()
            
            # Replace the Rwanda placeholder
            pattern = r'(<section id="rwandan-genocide".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: Rwandan Genocide Opening Vignette with drop-cap -->\s*(</p>)'
            replacement = f'\\1\n                        {vignette_text}\n                    \\2'
            html = re.sub(pattern, replacement, html, flags=re.DOTALL)
            print("Rwanda vignette injected")
        
        # Extract and inject analysis
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', rwanda_content, re.DOTALL)
        if analysis_match:
            analysis_text = analysis_match.group(1).strip()
            # Convert to basic HTML
            analysis_html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\\1</strong>', analysis_text)
            analysis_html = re.sub(r'\*(.*?)\*', r'<em>\\1</em>', analysis_html)
            analysis_html = re.sub(r'^### (.*?)$', r'<h3>\\1</h3>', analysis_html, flags=re.MULTILINE)
            analysis_html = re.sub(r'^## (.*?)$', r'<h2>\\1</h2>', analysis_html, flags=re.MULTILINE)
            # Convert to paragraphs
            paragraphs = analysis_html.split('\n\n')
            processed = []
            for para in paragraphs:
                para = para.strip()
                if para and not para.startswith('<'):
                    para = f'<p>{para}</p>'
                if para:
                    processed.append(para)
            analysis_html = '\n'.join(processed)
            
            # Replace Rwanda analysis - need to find the last occurrence for Rwanda
            # Split into sections and process Rwanda separately
            rwanda_section_match = re.search(r'(<section id="rwandan-genocide".*?</section>)', html, re.DOTALL)
            if rwanda_section_match:
                rwanda_section = rwanda_section_match.group(1)
                # Replace within this section
                rwanda_section = re.sub(
                    r'(<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)',
                    f'\\1\n                        {analysis_html}\n                    \\2',
                    rwanda_section,
                    flags=re.DOTALL
                )
                # Replace the section back in the full HTML
                html = html.replace(rwanda_section_match.group(1), rwanda_section)
                print("Rwanda analysis injected")
    
    # Write back
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("All remaining case studies injected!")

if __name__ == "__main__":
    inject_remaining_case_studies()
