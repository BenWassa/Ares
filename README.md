# Project Ares: Interactive Digital Synopsis  
_A web-based exploration of extreme mass homicide through psychological and historical lenses._

## 🧭 Overview

**Project Ares** is a digital humanities initiative that transforms the seminal academic paper  
**“Extreme Mass Homicide: From Military Massacre to Genocide”** by Dutton, Boyanowsky & Bond (2005)  
into an interactive, readable, and emotionally intelligent web synopsis.

This project merges structured academic content with narrative historical storytelling,  
guided by a detailed design vision that balances clarity, empathy, and engagement.

## 🎯 Core Goals

- Translate complex academic insights into a digestible digital format
- Present dark historical events respectfully and accessibly
- Distinguish **analytic content** from **narrative vignettes** using dual visual styles
- Integrate **interactive diagrams**, **responsive layouts**, and **glossary tooltips**
- Maintain readability, accessibility, and emotional pacing throughout

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server (optional but recommended)

### Quick Start
1. **Clone or download** this repository
2. **Open locally**:
   ```bash
   # Option 1: Python (if installed)
   python 05-utilities/serve.py
   
   # Option 2: PowerShell (Windows)
   .\05-utilities\serve.ps1
   
   # Option 3: Simple file opening
   # Open 01-core/index.html directly in your browser
   ```
3. **Navigate** to `http://localhost:8000` (or open `01-core/index-with-content.html`)

> **Note**: The project includes both `index.html` (template) and `index-with-content.html` (fully integrated content). For the complete experience, open `index-with-content.html`.

### Development Workflow
- **Edit content**: Modify markdown files in `03-content/sections/` or `03-content/case-studies/`
- **Build content**: Run `python build.py` (single command rebuilds everything)
- **View results**: Open `01-core/index-with-content.html` in browser
- **Edit styles**: Modify `01-core/stylesheet.css`
- **Add interactivity**: Edit `01-core/script.js`
- **Start server:** Double-click `05-utilities\start-server.bat`
- **Generate status:** Double-click `05-utilities\generate-status.bat`

---

## 🧱 Project Structure

The project uses a numbered folder system for clear organization:

### Core Application (`01-core/`)
- `index.html` – Semantic HTML structure with content placeholders
- `index-with-content.html` – Complete integrated version with all content
- `stylesheet.css` – Design system implementing the full visual specification  
- `script.js` – Interactive functionality (TOC, tooltips, navigation, progress tracking)
- `package.json` – Node.js project configuration

### Assets (`02-assets/`)
- `images/` – Project images and visual content
- `svgs/` – Scalable vector graphics and diagrams  

### Content & Data (`03-content/`)
- `sections/` – Analytical markdown content (8 files: front-matter, scope-purpose, etc.)
- `case-studies/` – Historical case narratives (8 files: Armenian genocide, Rwanda, etc.)
- `data/` – JSON data files (glossary, case studies)
- `maps/` – Interactive map configurations
- `build/` – Content build system with unified_builder.py

### Documentation (`04-docs/`)
- `docs/` – Project documentation (Design Vision, Development Guide)

### Utilities (`05-utilities/`)
- `start-server.bat` – 🖱️ Double-click to start development server
- `generate-status.bat` – 🖱️ Double-click to generate project status report
- `scripts/` – Detailed implementation files (serve.py, serve.ps1, repo-status tools)

---

## ⚡ Build System

The project features a unified build system that automatically processes all markdown content:

```bash
# Build all content (run from anywhere in project)
python build.py

# Clean build with file cleanup
python build.py --clean

# Watch for changes and auto-rebuild
python build.py --watch
```

This system:
- Processes 16 markdown files (8 sections + 8 case studies)
- Generates `index-with-content.html` from the `index.html` template
- Handles glossary term highlighting automatically
- Provides comprehensive build logging and error handling

---

## 📐 Design Highlights

- **Measured Seriousness**: Clean layout, muted color palette, calm typography
- **Dual Voice Cueing**: Distinct styling for analytic vs. narrative sections
- **Glossary Integration**: Hover/click definitions for key terms
- **Interactive Process Model**: SVG diagram showing stages of atrocity escalation
- **Sticky Table of Contents**: Always-visible TOC for easy navigation
- **Accessibility First**: Semantic HTML5, high contrast, ARIA attributes, keyboard-friendly

See [`04-docs/docs/Design_Vision.md`](04-docs/docs/Design_Vision.md) for the full visual and interaction spec.

---

## 📂 Key Sections (Content Placeholder Structure)

- **Front Matter**: Title Page, Executive Summary, Usage Guide  
- **Part I**: Conceptual Foundations (psychological theory, process model)  
- **Part II**: Historical Case Narratives (Armenia, Rwanda, Cambodia, etc.)  
- **Part III**: Cross-Case Analysis (themes, cruelty patterns, propaganda)  
- **Part IV**: Integrated Escalation Model  
- **Part V**: Implications & Prevention  
- **Part VI**: Ethical Reflections  
- **Appendices**: Glossary, Data Tables, Maps, References

---

## 🚧 Development Status

✅ Initial design spec complete  
✅ HTML structure implemented with semantic markup  
✅ CSS design system implemented  
✅ JavaScript interactivity implemented  
✅ Basic project infrastructure complete  
✅ Content integration system complete  
✅ Unified build system with auto-rebuild capability  
✅ 16 markdown content files fully integrated  
🔲 Interactive SVG + map integration  
🔲 Full accessibility audit and refinement  
🔲 Performance optimization

---

## 📜 License

MIT License.  
You may reuse the structure, styles, and design ideas with proper attribution.  
The original paper and any associated content remain the intellectual property of the authors.

---

## 🤝 Acknowledgements

- **Primary Source**: Dutton, Donald G., Boyanowsky, Ehor, & Bond, Michael H. (2005)  
  _Extreme Mass Homicide: From Military Massacre to Genocide_  
  [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1359178904000461)

- **Project Lead**: Ben Haddon  
- **Web Developer Agent**: Claude AI  
- **Design System & Content Integration**: ChatGPT (OpenAI) & Gemini 2.5 Flash

---

## 📬 Contact

For feedback, collaboration, or to contribute:  
**Ben Haddon** – [GitHub Profile](https://github.com/BenWassa) | benjamin.haddon@gmail.com