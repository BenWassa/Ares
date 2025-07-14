/**
 * Content Builder for Ares Project
 * Processes markdown files and prepares them for HTML integration
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  sectionsDir: path.join(__dirname, '..', 'sections'),
  caseStudiesDir: path.join(__dirname, '..', 'case-studies'),
  outputDir: path.join(__dirname, '..', '..', '01-core'),
  htmlTemplate: path.join(__dirname, '..', '..', '01-core', 'index.html')
};

// Section order for proper HTML integration
const sectionOrder = [
  'front-matter.md',
  'scope-purpose.md', 
  'definitions-typology.md',
  'theoretical-lenses.md',
  'process-model.md'
];

// Case study order
const caseStudyOrder = [
  'armenian-genocide.md',
  'ukrainian-holodomor.md',
  'cambodian-genocide.md',
  'rwandan-genocide.md',
  'bosnian-war.md',
  'nanking-massacre.md',
  'my-lai-massacre.md',
  'el-mozote-massacre.md'
];

// Additional sections
const additionalSections = [
  'comparative-analysis.md',
  'implications.md',
  'critical-reflection.md'
];

/**
 * Read markdown file and return content
 */
function readMarkdownFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}`);
    return `<!-- Content not yet available for ${path.basename(filePath)} -->`;
  }
}

/**
 * Simple markdown to HTML converter (basic implementation)
 */
function markdownToHtml(markdown) {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    // Paragraphs (basic)
    .replace(/\n\n/g, '</p><p>')
    // Wrap in paragraph tags
    .replace(/^(?!<[h|l|p])/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[h|l])/g, '$1');
}

/**
 * Build content structure
 */
function buildContent() {
  console.log('Building content structure...');
  
  const content = {
    sections: {},
    caseStudies: {},
    additional: {}
  };
  
  // Read analytical sections
  sectionOrder.forEach(filename => {
    const filePath = path.join(config.sectionsDir, filename);
    const key = filename.replace('.md', '');
    content.sections[key] = readMarkdownFile(filePath);
  });
  
  // Read case studies
  caseStudyOrder.forEach(filename => {
    const filePath = path.join(config.caseStudiesDir, filename);
    const key = filename.replace('.md', '');
    content.caseStudies[key] = readMarkdownFile(filePath);
  });
  
  // Read additional sections
  additionalSections.forEach(filename => {
    const filePath = path.join(config.sectionsDir, filename);
    const key = filename.replace('.md', '');
    content.additional[key] = readMarkdownFile(filePath);
  });
  
  return content;
}

/**
 * Generate content manifest
 */
function generateManifest() {
  const content = buildContent();
  const manifest = {
    generated: new Date().toISOString(),
    sections: Object.keys(content.sections),
    caseStudies: Object.keys(content.caseStudies),
    additional: Object.keys(content.additional),
    totalFiles: Object.keys(content.sections).length + 
                Object.keys(content.caseStudies).length + 
                Object.keys(content.additional).length
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'content-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`Content manifest generated: ${manifest.totalFiles} files processed`);
  return manifest;
}

/**
 * Inject content into HTML template
 */
function injectContentIntoHTML(content) {
  const htmlPath = config.htmlTemplate;
  
  try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Inject front matter content
    if (content.sections['front-matter']) {
      html = injectFrontMatter(html, content.sections['front-matter']);
    }
    
    // Inject analytical sections
    html = injectAnalyticalSections(html, content.sections);
    
    // Inject case studies
    html = injectCaseStudies(html, content.caseStudies);
    
    // Write updated HTML
    const outputPath = path.join(config.outputDir, 'index-with-content.html');
    fs.writeFileSync(outputPath, html);
    
    console.log(`HTML with content generated: ${outputPath}`);
    return outputPath;
    
  } catch (error) {
    console.error('Error injecting content into HTML:', error);
    return null;
  }
}

/**
 * Inject front matter content
 */
function injectFrontMatter(html, frontMatterContent) {
  const htmlContent = markdownToHtml(frontMatterContent);
  
  // Extract different parts
  const executiveSummaryMatch = htmlContent.match(/### Executive Summary(.*?)(?=###|$)/s);
  const howToUseMatch = htmlContent.match(/### How to Use This Synopsis(.*?)(?=###|$)/s);
  
  if (executiveSummaryMatch) {
    html = html.replace(
      /<!-- Placeholder: Executive Summary Content -->/,
      executiveSummaryMatch[1].trim()
    );
  }
  
  if (howToUseMatch) {
    html = html.replace(
      /<!-- Placeholder: How to Use This Synopsis Content -->/,
      howToUseMatch[1].trim()
    );
  }
  
  return html;
}

/**
 * Inject analytical sections
 */
function injectAnalyticalSections(html, sections) {
  // Scope & Purpose
  if (sections['scope-purpose']) {
    html = html.replace(
      /<!-- Placeholder: Scope & Purpose Text -->/,
      markdownToHtml(sections['scope-purpose'])
    );
  }
  
  // Theoretical Framework
  if (sections['theoretical-lenses']) {
    html = html.replace(
      /<!-- Placeholder: Theoretical Framework Text -->/,
      markdownToHtml(sections['theoretical-lenses'])
    );
  }
  
  // Process Model
  if (sections['process-model']) {
    html = html.replace(
      /<!-- Placeholder: Methodological Approach Text -->/,
      markdownToHtml(sections['process-model'])
    );
  }
  
  return html;
}

/**
 * Inject case studies with dual voice structure
 */
function injectCaseStudies(html, caseStudies) {
  // Armenian Genocide
  if (caseStudies['armenian-genocide']) {
    html = injectCaseStudy(html, caseStudies['armenian-genocide'], 'armenian');
  }
  
  // My Lai Massacre
  if (caseStudies['my-lai-massacre']) {
    html = injectCaseStudy(html, caseStudies['my-lai-massacre'], 'my-lai');
  }
  
  // Rwandan Genocide
  if (caseStudies['rwandan-genocide']) {
    html = injectCaseStudy(html, caseStudies['rwandan-genocide'], 'rwanda');
  }
  
  return html;
}

/**
 * Inject individual case study with proper narrative/analytic structure
 */
function injectCaseStudy(html, caseContent, caseKey) {
  const htmlContent = markdownToHtml(caseContent);
  
  // Extract opening vignette (A. Opening Vignette)
  const vignetteMatch = htmlContent.match(/## A\. Opening Vignette(.*?)(?=## B\.|$)/s);
  
  // Extract historical context and analysis (B. Historical Context onwards)
  const analysisMatch = htmlContent.match(/## B\. Historical Context(.*?)$/s);
  
  if (vignetteMatch) {
    const vignetteContent = vignetteMatch[1].trim();
    const vignetteSelector = getVignetteSelector(caseKey);
    
    if (vignetteSelector) {
      html = html.replace(vignetteSelector, vignetteContent);
    }
  }
  
  if (analysisMatch) {
    const analysisContent = analysisMatch[1].trim();
    const analysisSelector = getAnalysisSelector(caseKey);
    
    if (analysisSelector) {
      html = html.replace(analysisSelector, analysisContent);
    }
  }
  
  return html;
}

/**
 * Get appropriate placeholder selector for case study vignettes
 */
function getVignetteSelector(caseKey) {
  const selectors = {
    'armenian': /<!-- Placeholder: Armenian Genocide Opening Vignette with drop-cap -->[\s\S]*?<!-- Placeholder: Narrative vignette content -->/,
    'my-lai': /<!-- Placeholder: My Lai Opening Vignette with drop-cap -->[\s\S]*?<!-- Placeholder: Narrative vignette content -->/,
    'rwanda': /<!-- Placeholder: Rwandan Genocide Opening Vignette with drop-cap -->[\s\S]*?<!-- Placeholder: Narrative vignette content -->/
  };
  
  return selectors[caseKey];
}

/**
 * Get appropriate placeholder selector for case study analysis
 */
function getAnalysisSelector(caseKey) {
  const selectors = {
    'armenian': /<!-- Placeholder: Analytic content -->/,
    'my-lai': /<!-- Placeholder: Analytic content -->/,
    'rwanda': /<!-- Placeholder: Analytic content -->/
  };
  
  return selectors[caseKey];
}

/**
 * Enhanced markdown to HTML converter with better formatting
 */
function enhancedMarkdownToHtml(markdown) {
  return markdown
    // Headers with proper structure
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists with proper nesting
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Glossary terms (look for key terms that should be glossary-linked)
    .replace(/\b(genocide|dehumanization|obedience to authority|group polarization|moral disengagement)\b/gi, 
             '<span class="glossary-term" data-term="$1">$1</span>')
    
    // Paragraphs
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<li')) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join('\n');
}

/**
 * Main build and inject function
 */
function buildAndInject() {
  console.log('Starting content build and injection process...');
  
  // Build content structure
  const content = buildContent();
  
  // Generate manifest for tracking
  const manifest = generateManifest();
  
  // Inject content into HTML
  const outputPath = injectContentIntoHTML(content);
  
  if (outputPath) {
    console.log('Content successfully integrated into HTML!');
    console.log(`Output file: ${outputPath}`);
    console.log(`Sections processed: ${manifest.sections.length}`);
    console.log(`Case studies processed: ${manifest.caseStudies.length}`);
  } else {
    console.error('Failed to integrate content into HTML');
  }
  
  return { content, manifest, outputPath };
}

// Export functions for use in other scripts
module.exports = {
  buildContent,
  generateManifest,
  markdownToHtml,
  enhancedMarkdownToHtml,
  injectContentIntoHTML,
  buildAndInject,
  config
};

// If run directly, execute build and inject
if (require.main === module) {
  buildAndInject();
}
