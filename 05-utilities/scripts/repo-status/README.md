# Project Ares - Repository Status Tools

This directory contains tools for generating comprehensive project status reports that can be shared with ChatGPT for analysis and guidance.

## 🚀 Quick Start

### Windows (Recommended)
```powershell
# From project root
.\05-utilities\repo-status\run_status.ps1
```

### Cross-Platform
```bash
# From project root
./05-utilities/repo-status/run_status.sh
```

### Direct PowerShell Execution
```powershell
# If you encounter execution policy issues
powershell -ExecutionPolicy Bypass -File "05-utilities\repo-status\generate_repo_status.ps1"
```

## 📋 Generated Report Includes

### Project Overview
- Tech stack summary
- Project purpose and goals
- Current development focus

### File Analysis
- Core file status (HTML, CSS, JS, README)
- Project structure validation (numbered folders)
- Code metrics (lines, functions, placeholders)

### Git Status
- Current branch and tracking information
- Recent commits (last 5)
- Working directory status
- Staged/unstaged changes

### Content Analysis
- Data files in `03-content/data/`
- Documentation in `04-docs/docs/`
- Development notes and TODOs

### Health Assessment
- Project completeness score (0-100%)
- Missing components identification
- Next steps recommendations

## 🎯 Usage Scenarios

### For ChatGPT Analysis
1. Run the status generator
2. Copy contents of `repo_status_ares.txt`
3. Share with ChatGPT for:
   - Project guidance
   - Code review suggestions
   - Development prioritization
   - Architecture recommendations

### For Development Planning
- Track project completion status
- Identify missing components
- Monitor code growth and complexity
- Plan next development phases

### For Team Communication
- Quick project overview for new contributors
- Status updates for stakeholders
- Documentation of current state

## 📁 Files in This Directory

- `run_status.ps1` - PowerShell launcher (Windows)
- `run_status.sh` - Cross-platform launcher
- `generate_repo_status.ps1` - Main PowerShell implementation
- `generate_repo_status.sh` - Bash implementation
- `repo_status_ares.txt` - Generated output (auto-created)

## 🔧 Troubleshooting

### PowerShell Execution Policy
If you see execution policy errors:
```powershell
# Option 1: Use bypass flag
powershell -ExecutionPolicy Bypass -File "path\to\script.ps1"

# Option 2: Temporarily change policy (admin required)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git Not Found
Ensure Git is installed and available in PATH:
```bash
git --version
```

### Missing Dependencies
- No external dependencies required
- Uses built-in PowerShell/Bash commands
- Git is optional but recommended

## 📈 Sample Output Format

```
==============================
PROJECT ARES – REPO SNAPSHOT  
Generated: Mon, Jul 14, 2025 12:15:07 PM
==============================

[PROJECT OVERVIEW]
Project Ares is a digital humanities web application...

[CORE PROJECT FILES STATUS]
PASS index.html - 11.1KB, 256 lines
PASS stylesheet.css - 12.1KB, 602 lines
...

[PROJECT HEALTH SUMMARY]
Project Health: 10/10 (100%)
STATUS: Excellent - All core components present
```

---

*Part of Project Ares - Digital Synopsis of Extreme Mass Homicide Research*
