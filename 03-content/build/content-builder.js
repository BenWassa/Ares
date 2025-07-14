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

// Export functions for use in other scripts
module.exports = {
  buildContent,
  generateManifest,
  markdownToHtml,
  config
};

// If run directly
if (require.main === module) {
  generateManifest();
}
