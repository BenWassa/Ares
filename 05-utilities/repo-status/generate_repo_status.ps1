# Project Ares - Repository Status Generator (PowerShell)
# Generates comprehensive project snapshot for ChatGPT analysis

param(
    [string]$OutputFile = "05-utilities\repo-status\repo_status_ares.txt"
)

# Navigate to project root (two levels up from script location)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)
Set-Location $ProjectRoot

$Date = Get-Date -Format "ddd, MMM dd, yyyy hh:mm:ss tt"
$OutPath = Join-Path $ProjectRoot $OutputFile

# ─── Initialize Output ────────────────────────────────────────────────────────
@"
==============================
PROJECT ARES – REPO SNAPSHOT  
Generated: $Date
==============================

[PROJECT OVERVIEW]
Project Ares is a digital humanities web application that transforms academic research 
"Extreme Mass Homicide: From Military Massacre to Genocide" (Dutton, Boyanowsky & Bond, 2005)
into an interactive, accessible synopsis with respectful presentation of sensitive content.

Tech Stack: HTML5, CSS3, Vanilla JavaScript
Focus Areas: Psychology, history, academic accessibility, emotional intelligence

[CORE PROJECT FILES STATUS]
"@ | Out-File -FilePath $OutPath -Encoding UTF8

# ─── Check Core Files & Project Structure ─────────────────────────────────────
$CoreFiles = @("01-core\index.html", "01-core\stylesheet.css", "01-core\script.js", "README.md", "01-core\package.json")
$Directories = @("01-core", "02-assets", "03-content", "04-docs", "05-utilities")

"[CORE APPLICATION FILES - 01-core]" | Add-Content $OutPath
foreach ($file in $CoreFiles) {
    if (Test-Path $file) {
        $size = [math]::Round((Get-Item $file).Length / 1KB, 1)
        $lines = (Get-Content $file | Measure-Object -Line).Lines
        $basename = Split-Path $file -Leaf
        "PASS $basename - $($size)KB, $lines lines" | Add-Content $OutPath
    } else {
        $basename = Split-Path $file -Leaf
        "FAIL $basename - MISSING" | Add-Content $OutPath
    }
}

"`n[PROJECT STRUCTURE - NUMBERED FOLDERS]" | Add-Content $OutPath
foreach ($dir in $Directories) {
    if (Test-Path $dir -PathType Container) {
        $count = (Get-ChildItem $dir -Recurse -File | Measure-Object).Count
        "PASS $dir\ - $count files" | Add-Content $OutPath
    } else {
        "FAIL $dir\ - MISSING" | Add-Content $OutPath
    }
}

# ─── Development Progress Analysis ─────────────────────────────────────────────
"`n[DEVELOPMENT PROGRESS & METRICS]" | Add-Content $OutPath

# Code metrics
if (Test-Path "01-core\index.html") {
    $htmlLines = (Get-Content "01-core\index.html" | Measure-Object -Line).Lines
    $placeholders = (Select-String -Path "01-core\index.html" -Pattern "placeholder|Placeholder|TODO" | Measure-Object).Count
    "HTML: $htmlLines lines, $placeholders placeholders/TODOs" | Add-Content $OutPath
}

if (Test-Path "01-core\stylesheet.css") {
    $cssLines = (Get-Content "01-core\stylesheet.css" | Measure-Object -Line).Lines
    $cssRules = (Select-String -Path "01-core\stylesheet.css" -Pattern "^\s*[a-zA-Z].*{" | Measure-Object).Count
    "CSS: $cssLines lines, ~$cssRules style rules" | Add-Content $OutPath
}

if (Test-Path "01-core\script.js") {
    $jsLines = (Get-Content "01-core\script.js" | Measure-Object -Line).Lines
    $functions = (Select-String -Path "01-core\script.js" -Pattern "function |=> |addEventListener" | Measure-Object).Count
    "JavaScript: $jsLines lines, ~$functions functions/events" | Add-Content $OutPath
}

# ─── Git Status & Repository State ────────────────────────────────────────────
"`n[GIT STATUS]" | Add-Content $OutPath
try {
    $branch = git symbolic-ref --short HEAD 2>$null
    $upstream = git rev-parse --abbrev-ref "$branch@{upstream}" 2>$null
    
    "Current branch: $branch" | Add-Content $OutPath
    if ($upstream) {
        $status = git rev-list --left-right --count "$upstream...$branch" 2>$null
        if ($status) {
            $behind, $ahead = $status -split '\s+'
            "Tracking: $upstream" | Add-Content $OutPath
            "Ahead by: $ahead commits" | Add-Content $OutPath
            "Behind by: $behind commits" | Add-Content $OutPath
        }
    } else {
        "WARNING: No upstream branch set" | Add-Content $OutPath
    }
} catch {
    "ERROR: Not a git repository or git not available" | Add-Content $OutPath
}

# ─── Recent Commits ────────────────────────────────────────────────────────────
"`n[RECENT COMMITS]" | Add-Content $OutPath
try {
    $commits = git log -5 --pretty=format:"- %h %s (%cr)" 2>$null
    if ($commits) {
        $commits | Add-Content $OutPath
    } else {
        "No commits found" | Add-Content $OutPath
    }
} catch {
    "ERROR: Git log unavailable" | Add-Content $OutPath
}

# ─── Working Directory State ───────────────────────────────────────────────────
"`n[WORKING DIRECTORY STATUS]" | Add-Content $OutPath
try {
    $status = git status --short 2>$null
    if ($status) {
        $status | Add-Content $OutPath
    } else {
        "CLEAN: Working directory clean" | Add-Content $OutPath
    }
} catch {
    "ERROR: Git status unavailable" | Add-Content $OutPath
}

# ─── Content & Data Analysis ───────────────────────────────────────────────────
"`n[CONTENT & DATA FILES]" | Add-Content $OutPath

# Data files
if (Test-Path "03-content\data") {
    "Data files (03-content\data):" | Add-Content $OutPath
    Get-ChildItem "03-content\data" -File | ForEach-Object {
        $sizeKB = [math]::Round($_.Length / 1KB, 1)
        "  - $($_.Name) - $($sizeKB)KB" | Add-Content $OutPath
    }
} else {
    "ERROR: No data directory found" | Add-Content $OutPath
}

# Documentation
if (Test-Path "04-docs\docs") {
    "`nDocumentation (04-docs\docs):" | Add-Content $OutPath
    Get-ChildItem "04-docs\docs" -File | ForEach-Object {
        "  - $($_.Name)" | Add-Content $OutPath
    }
} else {
    "`nERROR: No documentation directory found" | Add-Content $OutPath
}

# ─── Development Notes & TODOs ─────────────────────────────────────────────────
"`n[DEVELOPMENT NOTES]" | Add-Content $OutPath
$patterns = @("TODO", "FIXME", "PLACEHOLDER", "Placeholder", "HACK", "BUG")
$searchFiles = @("*.html", "*.css", "*.js", "*.md")

$allNotes = @()
foreach ($pattern in $patterns) {
    foreach ($fileType in $searchFiles) {
        try {
            $matches = Select-String -Path $fileType -Pattern $pattern -AllMatches 2>$null
            $allNotes += $matches
        } catch {
            # Ignore file access errors
        }
    }
}

if ($allNotes.Count -gt 0) {
    "Found $($allNotes.Count) development notes:" | Add-Content $OutPath
    $allNotes | Select-Object -First 15 | ForEach-Object {
        "- $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" | Add-Content $OutPath
    }
    if ($allNotes.Count -gt 15) {
        "... and $($allNotes.Count - 15) more notes" | Add-Content $OutPath
    }
} else {
    "CLEAN: No development notes found" | Add-Content $OutPath
}

# ─── Server & Utilities Check ─────────────────────────────────────────────────
"`n[LOCAL DEVELOPMENT TOOLS]" | Add-Content $OutPath
$serverScripts = @("05-utilities\serve.py", "05-utilities\serve.ps1")
foreach ($script in $serverScripts) {
    if (Test-Path $script) {
        "PASS: $script available" | Add-Content $OutPath
    } else {
        "FAIL: $script missing" | Add-Content $OutPath
    }
}

# ─── Project Health Summary ───────────────────────────────────────────────────
"`n[PROJECT HEALTH SUMMARY]" | Add-Content $OutPath
$healthScore = 0
$maxScore = 10

# Check critical files
if (Test-Path "01-core\index.html") { $healthScore++ }
if (Test-Path "01-core\stylesheet.css") { $healthScore++ }
if (Test-Path "01-core\script.js") { $healthScore++ }
if (Test-Path "README.md") { $healthScore++ }

# Check structure
if (Test-Path "01-core") { $healthScore++ }
if (Test-Path "02-assets") { $healthScore++ }
if (Test-Path "03-content") { $healthScore++ }
if (Test-Path "04-docs") { $healthScore++ }

# Check content
if (Test-Path "03-content\data") { $healthScore++ }
if (Test-Path "04-docs\docs") { $healthScore++ }

$healthPercent = [math]::Round(($healthScore / $maxScore) * 100)
"Project Health: $healthScore/$maxScore ($healthPercent%)" | Add-Content $OutPath

if ($healthPercent -ge 90) {
    "STATUS: Excellent - All core components present" | Add-Content $OutPath
} elseif ($healthPercent -ge 70) {
    "STATUS: Good - Minor components missing" | Add-Content $OutPath
} else {
    "STATUS: Needs attention - Critical components missing" | Add-Content $OutPath
}

# ─── ChatGPT Context Summary ──────────────────────────────────────────────────
"`n[CHATGPT CONTEXT SUMMARY]" | Add-Content $OutPath
@"
Project Type: Digital humanities web application
Tech Stack: HTML5, CSS3, Vanilla JavaScript (no frameworks)
Purpose: Interactive synopsis of academic research on extreme mass homicide
Key Features: Responsive design, glossary tooltips, interactive maps/diagrams
Development Focus: Content integration, accessibility, respectful presentation
Current Priority: Content population, UI refinement, accessibility testing

NEXT STEPS RECOMMENDATIONS:
- Complete content placeholder population
- Implement interactive features (glossary, tooltips)
- Add responsive design testing
- Accessibility audit and improvements
- Performance optimization
"@ | Add-Content $OutPath

# ─── Completion ───────────────────────────────────────────────────────────────
"`n[PROJECT STATUS COMPLETE]" | Add-Content $OutPath
"Generated: $OutPath" | Add-Content $OutPath
"Ready to share with ChatGPT for project analysis and guidance." | Add-Content $OutPath

# Console output
Write-Host "STATUS: Project Ares snapshot generated successfully!" -ForegroundColor Green
Write-Host "OUTPUT: $OutPath" -ForegroundColor Cyan
Write-Host "READY: Share with ChatGPT!" -ForegroundColor Yellow
