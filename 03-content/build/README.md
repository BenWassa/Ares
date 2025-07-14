# Content Build System

## Quick Start

### Single Command Build
```bash
# Standard build
python unified_builder.py

# Clean old files and build
python unified_builder.py --clean

# Watch for file changes (requires: pip install watchdog)
python unified_builder.py --watch

# Quiet mode (minimal output)
python unified_builder.py --quiet
```

### Windows Batch Script
```cmd
# Standard build
build.bat

# Clean build
build.bat clean

# Watch mode  
build.bat watch

# Quiet mode
build.bat quiet
```

## What It Does

The unified builder automatically:

1. **Reads all markdown files** from `sections/` and `case-studies/`
2. **Converts markdown to HTML** with glossary term highlighting
3. **Injects content** into the HTML template (`01-core/index.html`)
4. **Generates output** as `01-core/index-with-content.html`
5. **Creates build manifest** with processing stats

## Content Processing

### Front Matter
- Executive Summary → `<div class="executive-summary">`
- How to Use → `<div class="how-to-use">`

### Analytical Sections
- Scope & Purpose → `#scope-purpose`
- Theoretical Framework → `#theoretical-framework` 
- Process Model → `#methodological-approach`

### Case Studies
- Armenian Genocide → `#armenian-genocide`
- My Lai Massacre → `#my-lai-massacre`
- Rwandan Genocide → `#rwandan-genocide`

Each case study processes:
- **Opening Vignette** (A. section) → Drop-cap narrative paragraph
- **Historical Analysis** (B. section onwards) → Analytical content

## Features

- ✅ **Automatic glossary term highlighting** (genocide, dehumanization, etc.)
- ✅ **Proper HTML formatting** (headers, lists, paragraphs)
- ✅ **Build manifest generation** with stats
- ✅ **Error handling** and logging
- ✅ **File cleanup** (removes old build scripts)
- ✅ **Watch mode** for auto-rebuild on file changes

## Files

### Active Files
- `unified_builder.py` - Main build script
- `build.bat` - Windows convenience script
- `build-manifest.json` - Generated build stats

### Deprecated (cleaned automatically)
- ~~content-builder.js~~ - Old Node.js version
- ~~simple-injector.py~~ - Superseded by unified builder
- ~~debug_*.py~~ - Development scripts
- ~~inject_*.py~~ - Individual injection scripts

## Workflow

1. **Edit markdown files** in `sections/` or `case-studies/`
2. **Run build command** (`python unified_builder.py`)
3. **View results** in `01-core/index-with-content.html`

That's it! Single command to rebuild everything.

## Adding New Content

### New Section
1. Create `sections/new-section.md`
2. Add to `content_config['sections']` in `unified_builder.py`
3. Add corresponding HTML placeholder in template
4. Run build

### New Case Study
1. Create `case-studies/new-case.md` with A. and B. sections
2. Add to `content_config['case_studies']` in `unified_builder.py`
3. Add HTML section in template with proper IDs
4. Update injection patterns if needed
5. Run build

## Dependencies

- **Python 3.7+** (included in project)
- **watchdog** (optional, for --watch mode): `pip install watchdog`
