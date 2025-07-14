# Content Organization Structure

This directory contains the modular content structure for the Ares project, organizing the Dutton, Boyanowsky & Bond (2005) synopsis into manageable sections.

## Directory Structure

```
03-content/
├── README.md                    # This file
├── sections/                    # Main analytical sections
│   ├── front-matter.md         # Executive summary, title page, usage guide
│   ├── scope-purpose.md        # Section 1: Scope & Purpose
│   ├── definitions-typology.md # Section 2: Key Definitions & Typology
│   ├── theoretical-lenses.md   # Section 3: Theoretical Lenses
│   ├── process-model.md        # Section 4: Process Model
│   ├── comparative-analysis.md # Comparative analysis across cases
│   ├── implications.md         # Policy and research implications
│   └── critical-reflection.md  # Final reflections and conclusions
├── case-studies/               # Individual historical case narratives
│   ├── armenian-genocide.md    # Case 1: Armenian Genocide (1915-1917)
│   ├── ukrainian-holodomor.md  # Case 2: Ukrainian Holodomor (1932-33)
│   ├── cambodian-genocide.md   # Case 3: Cambodian Killing Fields (1975-79)
│   ├── rwandan-genocide.md     # Case 4: Rwandan Genocide (1994)
│   ├── bosnian-war.md          # Case 5: Bosnia—Srebrenica & beyond (1992-95)
│   ├── nanking-massacre.md     # Case 6: Nanking Massacre (1937)
│   ├── my-lai-massacre.md      # Case 7: My Lai Massacre (1968)
│   └── el-mozote-massacre.md   # Case 8: El Mozote Massacre (1981)
├── data/                       # Existing data files
│   ├── casestudies.json        # Structured data for case studies
│   └── glossary.json           # Terminology definitions
├── maps/                       # Existing interactive maps
│   └── interactive-maps.json   # Geographic visualization data
└── build/                      # Build scripts and utilities
    ├── content-builder.js      # Script to compile sections into HTML
    ├── markdown-processor.js   # Markdown to HTML converter
    └── section-templates.json  # Templates for consistent formatting
```

## File Naming Convention

- **Sections**: Use kebab-case with descriptive names (e.g., `theoretical-lenses.md`)
- **Case Studies**: Include the main identifier and date range (e.g., `rwandan-genocide.md`)
- **Build Files**: Use camelCase for JavaScript files (e.g., `contentBuilder.js`)

## Content Guidelines

### For Sections (Analytical Tone)
- Use precise, academic prose
- Include bullet points for clarity
- Maintain consistent heading structure
- Reference case studies where appropriate

### For Case Studies (Narrative + Analytical Hybrid)
Each case study should follow the established template:
- **A. Opening Vignette** (100-150 words, cinematic)
- **B. Historical Context** (key actors, backdrop)
- **C. Chronology of Events** (timeline bullets)
- **D. Atrocity Pattern** (cruelty modalities)
- **E. Psychological & Societal Drivers** (theory connections)
- **F. Aftermath & Legacy** (tribunals, memory, trauma)

## Integration with HTML

These markdown files are designed to be processed and injected into the main `index.html` file in the `01-core/` directory. The build scripts will:

1. Convert markdown to HTML
2. Apply consistent styling
3. Insert content into appropriate HTML sections
4. Maintain cross-references and navigation

## Usage

1. **Individual Editing**: Edit specific sections without affecting others
2. **Bulk Updates**: Use build scripts to regenerate entire HTML structure
3. **Version Control**: Track changes to individual sections easily
4. **Collaborative Work**: Multiple contributors can work on different sections

## Next Steps

1. Populate individual markdown files from the content dump
2. Set up build process to compile into HTML
3. Test integration with existing HTML structure
4. Implement cross-referencing system
