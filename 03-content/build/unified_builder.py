#!/usr/bin/env python3
"""
Unified Content Integration System for Ares Project
Single script to process all markdown content and inject into HTML template

Usage: python unified_builder.py [--watch] [--clean]
  --watch: Monitor files for changes and auto-rebuild
  --clean: Clean build artifacts before building
"""

import os
import sys
import re
import json
import time
import argparse
from pathlib import Path
from datetime import datetime

# Optional file watching (requires: pip install watchdog)
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    HAS_WATCHDOG = True
except ImportError:
    HAS_WATCHDOG = False

class ContentIntegrator:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.sections_dir = self.base_dir / "sections"
        self.case_studies_dir = self.base_dir / "case-studies"
        self.output_dir = self.base_dir.parent / "01-core"
        self.html_template = self.output_dir / "index.html"
        self.output_file = self.output_dir / "index-with-content.html"
        
        # Content processing order
        self.content_config = {
            'sections': [
                'front-matter.md',
                'scope-purpose.md', 
                'definitions-typology.md',
                'theoretical-lenses.md',
                'process-model.md',
                'comparative-analysis.md',
                'implications.md',
                'critical-reflection.md'
            ],
            'case_studies': [
                'armenian-genocide.md',
                'my-lai-massacre.md',
                'rwandan-genocide.md',
                'ukrainian-holodomor.md',
                'cambodian-genocide.md',
                'bosnian-war.md',
                'nanking-massacre.md',
                'el-mozote-massacre.md'
            ]
        }
        
        # Glossary terms for auto-linking
        self.glossary_terms = [
            'genocide', 'dehumanization', 'obedience to authority', 
            'group polarization', 'moral disengagement', 'mass homicide',
            'atrocity', 'perpetrator', 'escalation ladder', 'extreme mass homicide'
        ]

    def log(self, message, level="INFO"):
        """Logging with timestamps"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def read_markdown_file(self, file_path):
        """Read markdown file and return content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            self.log(f"Read {file_path.name}")
            return content
        except FileNotFoundError:
            self.log(f"File not found: {file_path}", "WARNING")
            return f"<!-- Content not available: {file_path.name} -->"
        except Exception as e:
            self.log(f"Error reading {file_path}: {e}", "ERROR")
            return f"<!-- Error loading: {file_path.name} -->"

    def markdown_to_html(self, markdown):
        """Enhanced markdown to HTML converter"""
        # Remove HTML comments and metadata
        markdown = re.sub(r'<!--.*?-->', '', markdown, flags=re.DOTALL)
        markdown = re.sub(r'^\*This file.*?\*\s*', '', markdown, flags=re.MULTILINE)
        
        html = markdown
        
        # Headers
        html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        
        # Bold and italic
        html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.*?)\*(?!\*)', r'<em>\1</em>', html)
        
        # Lists
        lines = html.split('\n')
        processed_lines = []
        in_list = False
        
        for line in lines:
            stripped = line.strip()
            if stripped.startswith('* '):
                if not in_list:
                    processed_lines.append('<ul>')
                    in_list = True
                content = stripped[2:]  # Remove '* '
                processed_lines.append(f'<li>{content}</li>')
            else:
                if in_list:
                    processed_lines.append('</ul>')
                    in_list = False
                processed_lines.append(line)
        
        if in_list:
            processed_lines.append('</ul>')
        
        html = '\n'.join(processed_lines)
        
        # Add glossary term highlighting
        for term in self.glossary_terms:
            pattern = r'\b(' + re.escape(term) + r')\b'
            replacement = r'<span class="glossary-term" data-term="\1">\1</span>'
            html = re.sub(pattern, replacement, html, flags=re.IGNORECASE)
        
        # Convert to paragraphs
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
            elif line.startswith('<h') or line.startswith('<ul') or line.startswith('<li') or line.startswith('</ul>'):
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

    def inject_front_matter(self, html, front_matter_content):
        """Inject front matter sections"""
        self.log("Processing front matter...")
        
        # Extract executive summary
        exec_match = re.search(r'### Executive Summary(.*?)(?=### How to Use|$)', front_matter_content, re.DOTALL)
        if exec_match:
            exec_content = exec_match.group(1).strip()
            exec_content = re.sub(r'^\*\s+', '', exec_content, flags=re.MULTILINE)
            exec_content = re.sub(r'\n+', ' ', exec_content)
            exec_content = f'<p>{exec_content}</p>'
            
            pattern = r'(<div class="executive-summary">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Executive Summary Content -->\s*(</div>)'
            replacement = f'\\1\n                    {exec_content}\n                \\2'
            html = re.sub(pattern, replacement, html, flags=re.DOTALL)
            self.log("✓ Executive summary injected")
        
        # Extract how to use section
        how_to_match = re.search(r'### How to Use This Synopsis(.*?)(?=###|$)', front_matter_content, re.DOTALL)
        if how_to_match:
            how_to_content = how_to_match.group(1).strip()
            how_to_content = f'<p>{how_to_content}</p>'
            
            pattern = r'(<div class="how-to-use">.*?<div class="content-placeholder">)\s*<!-- Placeholder: How to Use This Synopsis Content -->\s*(</div>)'
            replacement = f'\\1\n                    {how_to_content}\n                \\2'
            html = re.sub(pattern, replacement, html, flags=re.DOTALL)
            self.log("✓ How to use section injected")
        
        return html

    def inject_analytical_sections(self, html, sections_content):
        """Inject all analytical sections"""
        self.log("Processing analytical sections...")
        
        replacements = {
            'scope-purpose': (
                r'(<section id="scope-purpose".*?<div class="content-placeholder">)\s*<!-- Placeholder: Scope & Purpose Text -->\s*(</div>)',
                "✓ Scope & Purpose injected"
            ),
            'theoretical-lenses': (
                r'(<section id="theoretical-framework".*?<div class="content-placeholder">)\s*<!-- Placeholder: Theoretical Framework Text -->\s*(</div>)',
                "✓ Theoretical Framework injected"
            ),
            'process-model': (
                r'(<section id="methodological-approach".*?<div class="content-placeholder">)\s*<!-- Placeholder: Methodological Approach Text -->\s*(</div>)',
                "✓ Process Model injected"
            )
        }
        
        for section_key, (pattern, success_msg) in replacements.items():
            if section_key in sections_content:
                content_html = self.markdown_to_html(sections_content[section_key])
                replacement = f'\\1\n                    {content_html}\n                \\2'
                html = re.sub(pattern, replacement, html, flags=re.DOTALL)
                self.log(success_msg)
        
        return html

    def inject_case_study(self, html, case_content, case_key):
        """Inject individual case study (vignette + analysis)"""
        # Extract vignette
        vignette_match = re.search(r'## A\. Opening Vignette(.*?)(?=## B\.|$)', case_content, re.DOTALL)
        if vignette_match:
            vignette_text = vignette_match.group(1).strip()
            vignette_text = re.sub(r'^\*', '', vignette_text, flags=re.MULTILINE)
            vignette_text = vignette_text.strip()
            
            # Case-specific vignette injection
            vignette_patterns = {
                'armenian-genocide': r'(<section id="armenian-genocide".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: Armenian Genocide Opening Vignette with drop-cap -->\s*(</p>)',
                'my-lai-massacre': r'(<section id="my-lai-massacre".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: My Lai Opening Vignette with drop-cap -->\s*(</p>)',
                'rwandan-genocide': r'(<section id="rwandan-genocide".*?<p class="drop-cap-paragraph">)\s*<!-- Placeholder: Rwandan Genocide Opening Vignette with drop-cap -->\s*(</p>)'
            }
            
            if case_key in vignette_patterns:
                pattern = vignette_patterns[case_key]
                replacement = f'\\1\n                        {vignette_text}\n                    \\2'
                html = re.sub(pattern, replacement, html, flags=re.DOTALL)
                self.log(f"✓ {case_key} vignette injected")
        
        # Extract and inject analysis
        analysis_match = re.search(r'## B\. Historical Context(.*?)$', case_content, re.DOTALL)
        if analysis_match:
            analysis_text = analysis_match.group(1).strip()
            analysis_html = self.markdown_to_html(analysis_text)
            
            # Case-specific analysis injection
            analysis_patterns = {
                'armenian-genocide': r'(<section id="armenian-genocide".*?<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)',
                'my-lai-massacre': r'(<section id="my-lai-massacre".*?<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)',
                'rwandan-genocide': None  # Special handling for Rwanda due to regex complexity
            }
            
            if case_key == 'rwandan-genocide':
                # Special handling for Rwanda
                rwanda_section_match = re.search(r'(<section id="rwandan-genocide".*?</section>)', html, re.DOTALL)
                if rwanda_section_match:
                    rwanda_section = rwanda_section_match.group(1)
                    updated_section = re.sub(
                        r'(<div class="analytic-content">.*?<div class="content-placeholder">)\s*<!-- Placeholder: Analytic content -->\s*(</div>)',
                        f'\\1\n                        {analysis_html}\n                    \\2',
                        rwanda_section,
                        flags=re.DOTALL
                    )
                    html = html.replace(rwanda_section_match.group(1), updated_section)
                    self.log(f"✓ {case_key} analysis injected")
            elif case_key in analysis_patterns and analysis_patterns[case_key]:
                pattern = analysis_patterns[case_key]
                replacement = f'\\1\n                        {analysis_html}\n                    \\2'
                html = re.sub(pattern, replacement, html, flags=re.DOTALL)
                self.log(f"✓ {case_key} analysis injected")
        
        return html

    def inject_all_case_studies(self, html, case_studies_content):
        """Inject all case studies"""
        self.log("Processing case studies...")
        
        # Process main case studies that are in the HTML template
        main_cases = ['armenian-genocide', 'my-lai-massacre', 'rwandan-genocide']
        
        for case_key in main_cases:
            if case_key in case_studies_content:
                html = self.inject_case_study(html, case_studies_content[case_key], case_key)
        
        return html

    def build_content_structure(self):
        """Build complete content structure from all markdown files"""
        self.log("Building content structure...")
        
        content = {
            'sections': {},
            'case_studies': {}
        }
        
        # Read sections
        for filename in self.content_config['sections']:
            file_path = self.sections_dir / filename
            key = filename.replace('.md', '')
            content['sections'][key] = self.read_markdown_file(file_path)
        
        # Read case studies
        for filename in self.content_config['case_studies']:
            file_path = self.case_studies_dir / filename
            key = filename.replace('.md', '')
            content['case_studies'][key] = self.read_markdown_file(file_path)
        
        return content

    def generate_manifest(self, content):
        """Generate build manifest"""
        manifest = {
            'generated': datetime.now().isoformat(),
            'template_source': str(self.html_template),
            'output_file': str(self.output_file),
            'sections_processed': list(content['sections'].keys()),
            'case_studies_processed': list(content['case_studies'].keys()),
            'total_files': len(content['sections']) + len(content['case_studies']),
            'glossary_terms': len(self.glossary_terms)
        }
        
        manifest_path = Path(__file__).parent / 'build-manifest.json'
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        
        self.log(f"Build manifest saved: {manifest['total_files']} files processed")
        return manifest

    def build_integrated_html(self):
        """Main build process - integrate all content into HTML"""
        try:
            # Read template
            if not self.html_template.exists():
                self.log(f"Template not found: {self.html_template}", "ERROR")
                return False
            
            with open(self.html_template, 'r', encoding='utf-8') as f:
                html = f.read()
            
            self.log(f"Loaded template: {self.html_template}")
            
            # Build content structure
            content = self.build_content_structure()
            
            # Inject content step by step
            if 'front-matter' in content['sections']:
                html = self.inject_front_matter(html, content['sections']['front-matter'])
            
            html = self.inject_analytical_sections(html, content['sections'])
            html = self.inject_all_case_studies(html, content['case_studies'])
            
            # Write output
            with open(self.output_file, 'w', encoding='utf-8') as f:
                f.write(html)
            
            # Generate manifest
            manifest = self.generate_manifest(content)
            
            self.log(f"✅ BUILD COMPLETE!")
            self.log(f"📄 Output: {self.output_file}")
            self.log(f"📊 Stats: {manifest['total_files']} files, {manifest['glossary_terms']} glossary terms")
            
            return True
            
        except Exception as e:
            self.log(f"Build failed: {e}", "ERROR")
            import traceback
            traceback.print_exc()
            return False

    def clean_build_artifacts(self):
        """Clean up old build files"""
        artifacts = [
            'content-builder.js',
            'debug_test.py',
            'debug_vignette.py', 
            'fix_vignettes.py',
            'inject_all_cases.py',
            'inject_front_matter.py',
            'content-manifest.json'
        ]
        
        cleaned = 0
        for artifact in artifacts:
            artifact_path = Path(__file__).parent / artifact
            if artifact_path.exists():
                artifact_path.unlink()
                cleaned += 1
                self.log(f"Removed: {artifact}")
        
        if cleaned > 0:
            self.log(f"🧹 Cleaned {cleaned} build artifacts")
        else:
            self.log("No artifacts to clean")

class ContentWatcher:
    """File system watcher for auto-rebuild (requires watchdog package)"""
    
    def __init__(self, integrator):
        if not HAS_WATCHDOG:
            raise ImportError("Watchdog package required for file watching")
        
        # Import here to avoid issues if watchdog isn't installed
        from watchdog.events import FileSystemEventHandler
        
        class Handler(FileSystemEventHandler):
            def __init__(self, integrator):
                self.integrator = integrator
                self.last_build = 0
                self.debounce_seconds = 2
            
            def on_modified(self, event):
                if event.is_directory:
                    return
                
                # Only watch .md files
                if not event.src_path.endswith('.md'):
                    return
                
                # Debounce rapid file changes
                current_time = time.time()
                if current_time - self.last_build < self.debounce_seconds:
                    return
                
                self.last_build = current_time
                self.integrator.log(f"📝 File changed: {Path(event.src_path).name}")
                self.integrator.log("🔄 Rebuilding...")
                self.integrator.build_integrated_html()
        
        self.handler = Handler(integrator)
    
    def get_handler(self):
        return self.handler

def main():
    """Main CLI interface"""
    parser = argparse.ArgumentParser(description='Unified Content Integration for Ares Project')
    parser.add_argument('--watch', action='store_true', help='Watch files for changes and auto-rebuild')
    parser.add_argument('--clean', action='store_true', help='Clean build artifacts before building')
    parser.add_argument('--quiet', action='store_true', help='Minimal output')
    
    args = parser.parse_args()
    
    integrator = ContentIntegrator()
    
    if not args.quiet:
        print("🏛️ Ares Content Integration System")
        print("=" * 40)
    
    # Clean if requested
    if args.clean:
        integrator.clean_build_artifacts()
    
    # Build once
    success = integrator.build_integrated_html()
    
    if not success:
        sys.exit(1)
    
    # Watch mode
    if args.watch:
        if not HAS_WATCHDOG:
            integrator.log("❌ File watching requires 'watchdog' package", "ERROR")
            integrator.log("Install with: pip install watchdog", "INFO")
            sys.exit(1)
        
        integrator.log("👀 Watching for file changes... (Ctrl+C to stop)")
        
        observer = Observer()
        watcher = ContentWatcher(integrator)
        event_handler = watcher.get_handler()
        
        # Watch both content directories
        observer.schedule(event_handler, str(integrator.sections_dir), recursive=False)
        observer.schedule(event_handler, str(integrator.case_studies_dir), recursive=False)
        
        observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            integrator.log("🛑 Stopping file watcher...")
            observer.stop()
        observer.join()

if __name__ == "__main__":
    main()
