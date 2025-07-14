#!/usr/bin/env python3
"""
Content Builder for Ares Project - Python Version
Processes markdown files and prepares them for HTML integration
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

class ContentBuilder:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.sections_dir = self.base_dir / "sections"
        self.case_studies_dir = self.base_dir / "case-studies"
        self.output_dir = self.base_dir.parent / "01-core"
        self.html_template = self.output_dir / "index.html"
        
        # Section order for proper HTML integration
        self.section_order = [
            'front-matter.md',
            'scope-purpose.md', 
            'definitions-typology.md',
            'theoretical-lenses.md',
            'process-model.md'
        ]
        
        # Case study order
        self.case_study_order = [
            'armenian-genocide.md',
            'ukrainian-holodomor.md',
            'cambodian-genocide.md',
            'rwandan-genocide.md',
            'bosnian-war.md',
            'nanking-massacre.md',
            'my-lai-massacre.md',
            'el-mozote-massacre.md'
        ]
        
        # Additional sections
        self.additional_sections = [
            'comparative-analysis.md',
            'implications.md',
            'critical-reflection.md'
        ]

    def read_markdown_file(self, file_path):
        """Read markdown file and return content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Warning: Could not read {file_path}")
            return f"<!-- Content not yet available for {file_path.name} -->"

    def markdown_to_html(self, markdown):
        """Simple markdown to HTML converter"""
        # Remove HTML comments first
        markdown = re.sub(r'<!--.*?-->', '', markdown, flags=re.DOTALL)
        
        html = markdown
        # Headers
        html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        
        # Bold and italic
        html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
        
        # Lists
        html = re.sub(r'^\* (.*$)', r'<li>\1</li>', html, flags=re.MULTILINE)
        
        # Glossary terms (key terms that should be glossary-linked)
        glossary_terms = [
            'genocide', 'dehumanization', 'obedience to authority', 
            'group polarization', 'moral disengagement', 'mass homicide',
            'atrocity', 'perpetrator', 'escalation ladder'
        ]
        
        for term in glossary_terms:
            pattern = r'\b(' + re.escape(term) + r')\b'
            replacement = r'<span class="glossary-term" data-term="\1">\1</span>'
            html = re.sub(pattern, replacement, html, flags=re.IGNORECASE)
        
        # Convert paragraphs
        paragraphs = html.split('\n\n')
        processed_paragraphs = []
        
        for para in paragraphs:
            para = para.strip()
            if para and not para.startswith('<'):
                para = f'<p>{para}</p>'
            if para:
                processed_paragraphs.append(para)
        
        return '\n'.join(processed_paragraphs)

    def build_content(self):
        """Build content structure"""
        print("Building content structure...")
        
        content = {
            'sections': {},
            'case_studies': {},
            'additional': {}
        }
        
        # Read analytical sections
        for filename in self.section_order:
            file_path = self.sections_dir / filename
            key = filename.replace('.md', '')
            content['sections'][key] = self.read_markdown_file(file_path)
        
        # Read case studies
        for filename in self.case_study_order:
            file_path = self.case_studies_dir / filename
            key = filename.replace('.md', '')
            content['case_studies'][key] = self.read_markdown_file(file_path)
        
        # Read additional sections
        for filename in self.additional_sections:
            file_path = self.sections_dir / filename
            key = filename.replace('.md', '')
            content['additional'][key] = self.read_markdown_file(file_path)
        
        return content

    def inject_front_matter(self, html, front_matter_content):
        """Inject front matter content"""
        html_content = self.markdown_to_html(front_matter_content)
        
        # Extract executive summary
        exec_match = re.search(r'### Executive Summary(.*?)(?=###|$)', html_content, re.DOTALL)
        if exec_match:
            exec_content = exec_match.group(1).strip()
            # Replace the executive summary placeholder - look in the executive-summary div
            exec_pattern = r'(<div class="executive-summary">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Executive Summary Content -->\s*(</div>)'
            exec_replacement = f'\\1\n                    {exec_content}\n                \\2'
            html = re.sub(exec_pattern, exec_replacement, html, flags=re.DOTALL)
        
        # Extract how to use
        how_to_match = re.search(r'### How to Use This Synopsis(.*?)(?=###|$)', html_content, re.DOTALL)
        if how_to_match:
            how_to_content = how_to_match.group(1).strip()
            # Replace the how to use placeholder - look in the how-to-use div
            how_to_pattern = r'(<div class="how-to-use">.*?<div class="content-placeholder">)\s*<!-- Placeholder: How to Use This Synopsis Content -->\s*(</div>)'
            how_to_replacement = f'\\1\n                    {how_to_content}\n                \\2'
            html = re.sub(how_to_pattern, how_to_replacement, html, flags=re.DOTALL)
        
        return html

    def inject_analytical_sections(self, html, sections):
        """Inject analytical sections"""
        
        # Scope & Purpose
        if 'scope-purpose' in sections:
            content = self.markdown_to_html(sections['scope-purpose'])
            # Replace the scope & purpose placeholder
            scope_pattern = r'(<section id="scope-purpose".*?<div class="content-placeholder">)\s*<!-- Placeholder: Scope & Purpose Text -->\s*(</div>)'
            scope_replacement = f'\\1\n                    {content}\n                \\2'
            html = re.sub(scope_pattern, scope_replacement, html, flags=re.DOTALL)
        
        # Theoretical Framework
        if 'theoretical-lenses' in sections:
            content = self.markdown_to_html(sections['theoretical-lenses'])
            # Find and replace theoretical framework placeholder
            theo_pattern = r'(<section id="theoretical-framework".*?<div class="content-placeholder">)\s*<!-- Placeholder: Theoretical Framework Text -->\s*(</div>)'
            theo_replacement = f'\\1\n                    {content}\n                \\2'
            html = re.sub(theo_pattern, theo_replacement, html, flags=re.DOTALL)
        
        # Process Model (use process-model content for methodological approach)
        if 'process-model' in sections:
            content = self.markdown_to_html(sections['process-model'])
            # Find and replace methodological approach placeholder
            method_pattern = r'(<section id="methodological-approach".*?<div class="content-placeholder">)\s*<!-- Placeholder: Methodological Approach Text -->\s*(</div>)'
            method_replacement = f'\\1\n                    {content}\n                \\2'
            html = re.sub(method_pattern, method_replacement, html, flags=re.DOTALL)
        
        return html

    def inject_case_study(self, html, case_content, case_key):
        """Inject individual case study with proper narrative/analytic structure"""
        
        # Extract opening vignette (A. Opening Vignette) from original markdown
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', case_content, re.DOTALL)
        
        # Extract historical context and analysis (B. Historical Context onwards) from original markdown  
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', case_content, re.DOTALL)
        
        # Define patterns for different case studies
        vignette_patterns = {
            'armenian': r'(<section id="armenian-genocide".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: Armenian Genocide Opening Vignette with drop-cap -->\s*(</p>\s*<div class="content-placeholder">)\s*<!-- Placeholder: Narrative vignette content -->\s*(</div>)',
            'my-lai': r'(<section id="my-lai-massacre".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: My Lai Opening Vignette with drop-cap -->\s*(</p>\s*<div class="content-placeholder">)\s*<!-- Placeholder: Narrative vignette content -->\s*(</div>)',
            'rwanda': r'(<section id="rwandan-genocide".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: Rwandan Genocide Opening Vignette with drop-cap -->\s*(</p>\s*<div class="content-placeholder">)\s*<!-- Placeholder: Narrative vignette content -->\s*(</div>)'
        }
        
        analysis_patterns = {
            'armenian': r'(<section id="armenian-genocide".*?<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)',
            'my-lai': r'(<section id="my-lai-massacre".*?<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)',
            'rwanda': r'(<section id="rwandan-genocide".*?<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)'
        }
        
        if vignette_match and case_key in vignette_patterns:
            vignette_content = vignette_match.group(1).strip()
            # Convert to HTML
            vignette_html = self.markdown_to_html(vignette_content)
            # Extract just the first paragraph for drop cap
            first_para_match = re.search(r'<p>(.*?)</p>', vignette_html, re.DOTALL)
            if first_para_match:
                first_para = first_para_match.group(1)
                rest_content = vignette_html[first_para_match.end():]
                
                vignette_replacement = f'\\1{first_para}\\2\n                        {rest_content}\n                    \\3'
                html = re.sub(vignette_patterns[case_key], vignette_replacement, html, flags=re.DOTALL)
        
        if analysis_match and case_key in analysis_patterns:
            analysis_content = analysis_match.group(1).strip()
            analysis_html = self.markdown_to_html(analysis_content)
            analysis_replacement = f'\\1\n                        {analysis_html}\n                    \\2'
            html = re.sub(analysis_patterns[case_key], analysis_replacement, html, flags=re.DOTALL)
        
        return html

    def inject_case_studies(self, html, case_studies):
        """Inject case studies with dual voice structure"""
        
        # Armenian Genocide
        if 'armenian-genocide' in case_studies:
            html = self.inject_case_study(html, case_studies['armenian-genocide'], 'armenian')
        
        # My Lai Massacre
        if 'my-lai-massacre' in case_studies:
            html = self.inject_case_study(html, case_studies['my-lai-massacre'], 'my-lai')
        
        # Rwandan Genocide
        if 'rwandan-genocide' in case_studies:
            html = self.inject_case_study(html, case_studies['rwandan-genocide'], 'rwanda')
        
        return html

    def inject_content_into_html(self, content):
        """Inject content into HTML template"""
        try:
            with open(self.html_template, 'r', encoding='utf-8') as f:
                html = f.read()
            
            print("Injecting content into HTML...")
            
            # Inject front matter content
            if 'front-matter' in content['sections']:
                print("Processing front matter...")
                html = self.inject_front_matter(html, content['sections']['front-matter'])
            
            # Inject analytical sections
            print("Processing analytical sections...")
            html = self.inject_analytical_sections(html, content['sections'])
            
            # Inject case studies
            print("Processing case studies...")
            html = self.inject_case_studies(html, content['case_studies'])
            
            # Write updated HTML
            output_path = self.output_dir / 'index-with-content.html'
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"HTML with content generated: {output_path}")
            return str(output_path)
            
        except Exception as error:
            print(f"Error injecting content into HTML: {error}")
            import traceback
            traceback.print_exc()
            return None

    def generate_manifest(self, content):
        """Generate content manifest"""
        manifest = {
            'generated': datetime.now().isoformat(),
            'sections': list(content['sections'].keys()),
            'case_studies': list(content['case_studies'].keys()),
            'additional': list(content['additional'].keys()),
            'total_files': len(content['sections']) + len(content['case_studies']) + len(content['additional'])
        }
        
        manifest_path = Path(__file__).parent / 'content-manifest.json'
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        
        print(f"Content manifest generated: {manifest['total_files']} files processed")
        return manifest

    def build_and_inject(self):
        """Main build and inject function"""
        print("Starting content build and injection process...")
        
        # Build content structure
        content = self.build_content()
        
        # Generate manifest for tracking
        manifest = self.generate_manifest(content)
        
        # Inject content into HTML
        output_path = self.inject_content_into_html(content)
        
        if output_path:
            print("Content successfully integrated into HTML!")
            print(f"Output file: {output_path}")
            print(f"Sections processed: {len(manifest['sections'])}")
            print(f"Case studies processed: {len(manifest['case_studies'])}")
        else:
            print("Failed to integrate content into HTML")
        
        return {'content': content, 'manifest': manifest, 'output_path': output_path}

if __name__ == "__main__":
    builder = ContentBuilder()
    builder.build_and_inject()
