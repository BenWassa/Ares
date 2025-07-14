# Development Guide: Project Ares

## Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/BenWassa/Ares.git
cd Ares

# Start local server (Python)
python -m http.server 8000

# Or using Node.js (if available)
npx http-server -p 8000

# Open in browser
open http://localhost:8000
```

### File Structure Overview
```
Ares/
├── index.html              # Main content structure
├── stylesheet.css          # Complete design system
├── script.js              # Core interactivity
├── javascript.js          # Extended functionality (legacy)
├── package.json           # Project metadata
├── README.md              # Project overview
├── /docs/                 # Documentation
│   └── Design_Vision.md   # Complete design specification
├── /data/                 # JSON data files
│   ├── glossary.json      # Glossary terms and definitions
│   └── casestudies.json   # Historical case study data
├── /maps/                 # Interactive map configurations
│   └── interactive-maps.json
├── /svgs/                 # Vector graphics and diagrams
│   └── process-model.svg  # Escalation model diagram
├── /images/               # Photographs and illustrations
├── /assets/               # Static resources
└── .git/                  # Version control
```

## Development Workflow

### 1. Content Development Phase
- Add historical case study content to appropriate HTML sections
- Implement glossary terms with `class="glossary-term" data-term="termName"`
- Create narrative vignettes with proper drop-cap styling
- Develop analytical content sections

### 2. Interactive Features
- Expand SVG diagrams with click interactions
- Implement map integration (consider Leaflet.js for future)
- Add timeline visualizations
- Create data table interactivity

### 3. Testing Workflow
```bash
# Validate HTML/CSS
html5validator --root . --also-check-css

# Accessibility testing
axe-core --dir .

# Performance testing
lighthouse http://localhost:8000 --output json
```

## Content Guidelines

### HTML Structure
- Use semantic HTML5 elements
- Maintain consistent section IDs matching navigation
- Add ARIA labels for accessibility
- Use appropriate heading hierarchy (h1 > h2 > h3...)

### CSS Classes
- `.analytic-section` - For academic/theoretical content
- `.narrative-vignette` - For human stories and historical narratives
- `.glossary-term` - For terms with definitions
- `.interactive-diagram` - For SVG and interactive elements
- `.case-study` - For individual historical cases

### JavaScript Integration
- All glossary terms automatically get tooltip functionality
- Navigation automatically updates based on scroll position
- Progress bar tracks reading completion
- Side panel shows expanded definitions on click

## Adding New Content

### Glossary Terms
1. Add definition to `/data/glossary.json`
2. Use in HTML: `<span class="glossary-term" data-term="termKey">Term Text</span>`
3. Automatic tooltip and side panel integration

### Case Studies
1. Add data to `/data/casestudies.json`
2. Create HTML section with `.case-study` class
3. Include both narrative and analytic subsections
4. Add map placeholder with unique ID

### Interactive Diagrams
1. Create SVG in `/svgs/` directory
2. Include in HTML with `.interactive-diagram` wrapper
3. Add click handlers in JavaScript if needed
4. Ensure responsive scaling

## Accessibility Checklist

### Required Standards
- [ ] WCAG 2.1 AA compliance
- [ ] Minimum 4.5:1 color contrast ratio
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader compatibility
- [ ] Alternative text for all images
- [ ] Focus indicators for keyboard users

### Testing Tools
- WAVE Web Accessibility Evaluator
- axe DevTools browser extension
- Keyboard-only navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)

## Performance Optimization

### Current Optimizations
- Minimal JavaScript dependencies
- Optimized CSS with efficient selectors
- Responsive images (implement WebP when adding photos)
- Critical CSS inlining potential

### Future Optimizations
- Image lazy loading
- Service worker for offline access
- Content delivery network (CDN) for assets
- Code splitting for large interactive features

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- CSS Grid and Flexbox
- ES6 JavaScript features
- SVG support
- CSS Custom Properties

## Deployment

### Static Hosting Options
- GitHub Pages (recommended for project repository)
- Netlify
- Vercel
- Traditional web hosting

### Build Process
Currently none required - static files deploy directly.

Future considerations:
- Content management system integration
- Multi-language support build process
- Asset optimization pipeline

## Contributing

### Content Contributions
1. Research historical accuracy
2. Maintain respectful tone for sensitive subject matter
3. Cite all sources appropriately
4. Follow established dual-voice pattern (analytic vs. narrative)

### Code Contributions
1. Follow existing code style
2. Test accessibility compliance
3. Ensure responsive design
4. Document new features

### Review Process
1. Historical accuracy review
2. Accessibility audit
3. Performance testing
4. Cross-browser testing

## Future Development Roadmap

### Phase 2: Enhanced Interactivity
- Advanced SVG animations
- Timeline scrubbing interface
- Interactive data visualizations
- Audio narration support

### Phase 3: Educational Features
- Discussion prompts
- Educational worksheets
- Teacher guide materials
- Assessment tools

### Phase 4: Community Features
- User annotations
- Discussion forums
- Expert commentary system
- Multilingual support

---

For questions or contributions, contact: benjamin.haddon@gmail.com
