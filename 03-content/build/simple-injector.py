#!/usr/bin/env python3
"""
Simple Content Injector for Ares Project
Direct replacement of placeholder content with markdown content
"""

import os
import re
from pathlib import Path

def read_file(file_path):
    """Read file content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return ""

def simple_markdown_to_html(markdown):
    """Very simple markdown to HTML conversion"""
    # Clean up HTML comments first
    markdown = re.sub(r'<!--.*?-->', '', markdown, flags=re.DOTALL)
    
    # Remove metadata lines
    markdown = re.sub(r'^\*This file.*?\*\s*', '', markdown, flags=re.MULTILINE)
    
    html = markdown
    
    # Headers
    html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Bold and italic
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # Lists
    lines = html.split('\n')
    in_list = False
    processed_lines = []
    
    for line in lines:
        if line.strip().startswith('* '):
            if not in_list:
                processed_lines.append('<ul>')
                in_list = True
            content = line.strip()[2:]  # Remove '* '
            processed_lines.append(f'<li>{content}</li>')
        else:
            if in_list:
                processed_lines.append('</ul>')
                in_list = False
            if line.strip():
                processed_lines.append(line)
    
    if in_list:
        processed_lines.append('</ul>')
    
    html = '\n'.join(processed_lines)
    
    # Add glossary terms
    glossary_terms = [
        'genocide', 'dehumanization', 'obedience to authority', 
        'group polarization', 'moral disengagement', 'mass homicide',
        'atrocity', 'perpetrator', 'escalation ladder'
    ]
    
    for term in glossary_terms:
        pattern = r'\b(' + re.escape(term) + r')\b'
        replacement = r'<span class="glossary-term" data-term="\1">\1</span>'
        html = re.sub(pattern, replacement, html, flags=re.IGNORECASE)
    
    # Simple paragraph wrapping
    paragraphs = []
    current_para = []
    
    for line in html.split('\n'):
        line = line.strip()
        if not line:
            if current_para:
                para_text = ' '.join(current_para)
                if not para_text.startswith('<'):
                    para_text = f'<p>{para_text}</p>'
                paragraphs.append(para_text)
                current_para = []
        elif line.startswith('<h') or line.startswith('<ul') or line.startswith('<li'):
            if current_para:
                para_text = ' '.join(current_para)
                if not para_text.startswith('<'):
                    para_text = f'<p>{para_text}</p>'
                paragraphs.append(para_text)
                current_para = []
            paragraphs.append(line)
        else:
            current_para.append(line)
    
    if current_para:
        para_text = ' '.join(current_para)
        if not para_text.startswith('<'):
            para_text = f'<p>{para_text}</p>'
        paragraphs.append(para_text)
    
    return '\n'.join(paragraphs)

def main():
    """Main function to inject content"""
    base_dir = Path(__file__).parent.parent
    
    # Read the original HTML
    html_file = base_dir.parent / "01-core" / "index.html"
    html_content = read_file(html_file)
    
    print("Starting content injection...")
    
    # 1. Front Matter - Executive Summary
    front_matter = read_file(base_dir / "sections" / "front-matter.md")
    if front_matter:
        # Extract executive summary
        exec_match = re.search(r'### Executive Summary(.*?)(?=###|$)', front_matter, re.DOTALL)
        if exec_match:
            exec_content = simple_markdown_to_html(exec_match.group(1).strip())
            html_content = html_content.replace(
                '<!-- Placeholder: Executive Summary Content -->',
                exec_content
            )
            print("✓ Executive Summary injected")
        
        # Extract how to use
        how_to_match = re.search(r'### How to Use This Synopsis(.*?)(?=###|$)', front_matter, re.DOTALL)
        if how_to_match:
            how_to_content = simple_markdown_to_html(how_to_match.group(1).strip())
            html_content = html_content.replace(
                '<!-- Placeholder: How to Use This Synopsis Content -->',
                how_to_content
            )
            print("✓ How to Use injected")
    
    # 2. Scope & Purpose
    scope_purpose = read_file(base_dir / "sections" / "scope-purpose.md")
    if scope_purpose:
        scope_html = simple_markdown_to_html(scope_purpose)
        # Replace the placeholder in the scope section
        html_content = re.sub(
            r'<div class="content-placeholder">\s*<!-- Placeholder: Scope & Purpose Text -->\s*</div>',
            f'<div class="content-placeholder">\n                    {scope_html}\n                </div>',
            html_content,
            flags=re.DOTALL
        )
        print("✓ Scope & Purpose injected")
    
    # 3. Theoretical Framework
    theoretical = read_file(base_dir / "sections" / "theoretical-lenses.md")
    if theoretical:
        theoretical_html = simple_markdown_to_html(theoretical)
        html_content = re.sub(
            r'<div class="content-placeholder">\s*<!-- Placeholder: Theoretical Framework Text -->\s*</div>',
            f'<div class="content-placeholder">\n                    {theoretical_html}\n                </div>',
            html_content,
            flags=re.DOTALL
        )
        print("✓ Theoretical Framework injected")
    
    # 4. Process Model (for Methodological Approach)
    process_model = read_file(base_dir / "sections" / "process-model.md")
    if process_model:
        process_html = simple_markdown_to_html(process_model)
        html_content = re.sub(
            r'<div class="content-placeholder">\s*<!-- Placeholder: Methodological Approach Text -->\s*</div>',
            f'<div class="content-placeholder">\n                    {process_html}\n                </div>',
            html_content,
            flags=re.DOTALL
        )
        print("✓ Process Model injected")
    
    # 5. Armenian Genocide Case Study
    armenian = read_file(base_dir / "case-studies" / "armenian-genocide.md")
    if armenian:
        # Extract vignette
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', armenian, re.DOTALL)
        if vignette_match:
            vignette_content = simple_markdown_to_html(vignette_match.group(1).strip())
            # Add drop-cap class to first paragraph
            vignette_content = re.sub(r'^<p>', '<p class="drop-cap-paragraph">', vignette_content)
            
            html_content = html_content.replace(
                '<!-- Placeholder: Armenian Genocide Opening Vignette with drop-cap -->',
                vignette_content
            )
            html_content = html_content.replace(
                '<!-- Placeholder: Narrative vignette content -->',
                '<!-- Vignette content injected above -->'
            )
            print("✓ Armenian Genocide vignette injected")
        
        # Extract analysis
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', armenian, re.DOTALL)
        if analysis_match:
            analysis_content = simple_markdown_to_html(analysis_match.group(1).strip())
            # Find the first analytic content placeholder (should be Armenian)
            html_content = re.sub(
                r'<div class="content-placeholder">\s*<!-- Placeholder: Analytic content -->\s*</div>',
                f'<div class="content-placeholder">\n                        {analysis_content}\n                    </div>',
                html_content,
                count=1,
                flags=re.DOTALL
            )
            print("✓ Armenian Genocide analysis injected")
    
    # 6. My Lai Massacre Case Study
    my_lai = read_file(base_dir / "case-studies" / "my-lai-massacre.md")
    if my_lai:
        # Extract vignette
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', my_lai, re.DOTALL)
        if vignette_match:
            vignette_content = simple_markdown_to_html(vignette_match.group(1).strip())
            vignette_content = re.sub(r'^<p>', '<p class="drop-cap-paragraph">', vignette_content)
            
            html_content = html_content.replace(
                '<!-- Placeholder: My Lai Opening Vignette with drop-cap -->',
                vignette_content
            )
            print("✓ My Lai vignette injected")
        
        # Extract analysis
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', my_lai, re.DOTALL)
        if analysis_match:
            analysis_content = simple_markdown_to_html(analysis_match.group(1).strip())
            # Find the second analytic content placeholder (should be My Lai)
            placeholders = list(re.finditer(r'<div class="content-placeholder">\s*<!-- Placeholder: Analytic content -->\s*</div>', html_content, flags=re.DOTALL))
            if len(placeholders) >= 2:
                start, end = placeholders[1].span()
                replacement = f'<div class="content-placeholder">\n                        {analysis_content}\n                    </div>'
                html_content = html_content[:start] + replacement + html_content[end:]
                print("✓ My Lai analysis injected")
    
    # 7. Rwandan Genocide Case Study
    rwanda = read_file(base_dir / "case-studies" / "rwandan-genocide.md")
    if rwanda:
        # Extract vignette
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', rwanda, re.DOTALL)
        if vignette_match:
            vignette_content = simple_markdown_to_html(vignette_match.group(1).strip())
            vignette_content = re.sub(r'^<p>', '<p class="drop-cap-paragraph">', vignette_content)
            
            html_content = html_content.replace(
                '<!-- Placeholder: Rwandan Genocide Opening Vignette with drop-cap -->',
                vignette_content
            )
            print("✓ Rwandan Genocide vignette injected")
        
        # Extract analysis
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', rwanda, re.DOTALL)
        if analysis_match:
            analysis_content = simple_markdown_to_html(analysis_match.group(1).strip())
            # Find the third analytic content placeholder (should be Rwanda)
            placeholders = list(re.finditer(r'<div class="content-placeholder">\s*<!-- Placeholder: Analytic content -->\s*</div>', html_content, flags=re.DOTALL))
            if len(placeholders) >= 3:
                start, end = placeholders[2].span()
                replacement = f'<div class="content-placeholder">\n                        {analysis_content}\n                    </div>'
                html_content = html_content[:start] + replacement + html_content[end:]
                print("✓ Rwandan Genocide analysis injected")
    
    # Write the output
    output_file = base_dir.parent / "01-core" / "index-with-content.html"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\n✅ Content injection complete!")
    print(f"📄 Output file: {output_file}")
    print("\n🌐 You can now view the page with integrated content.")

if __name__ == "__main__":
    main()
