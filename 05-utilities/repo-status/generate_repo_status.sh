#!/usr/bin/env bash
set -euo pipefail

# Navigate to project root (two levels up from this script)
cd "$(dirname "$0")/../../"

OUTFILE="05-utilities/repo-status/repo_status_ares.txt"
DATE=$(date +"%a, %b %d, %Y %I:%M:%S %p")

# ─── Initialize Output ────────────────────────────────────────────────────────
cat > "$OUTFILE" <<EOF
==============================
PROJECT ARES – REPO SNAPSHOT
Generated: $DATE
==============================

🎯 PROJECT OVERVIEW
Project Ares is a digital humanities web application that transforms academic research 
"Extreme Mass Homicide: From Military Massacre to Genocide" (Dutton, Boyanowsky & Bond, 2005)
into an interactive, accessible synopsis with respectful presentation of sensitive content.

Tech Stack: HTML5, CSS3, Vanilla JavaScript
Focus Areas: Psychology, history, academic accessibility, emotional intelligence

🔎 CORE PROJECT FILES STATUS
EOF

# ─── Check Core Files & Directories (Numbered Structure) ─────────────────────
core_files=(01-core/index.html 01-core/stylesheet.css 01-core/script.js README.md 01-core/package.json)
directories=(01-core/ 02-assets/ 03-content/ 04-docs/ 05-utilities/)

echo "📄 Core Application Files (01-core/):" >> "$OUTFILE"
for f in "${core_files[@]}"; do
  if [[ -e $f ]]; then
    size=$(du -h "$f" 2>/dev/null | cut -f1 || echo "?")
    lines=$(wc -l < "$f" 2>/dev/null || echo "?")
    echo "✅ $(basename $f) - $size, $lines lines" >>"$OUTFILE"
  else
    echo "❌ $(basename $f) - MISSING" >>"$OUTFILE"
  fi
done

echo -e "\n📁 Project Structure (Numbered Folders):" >> "$OUTFILE"
for d in "${directories[@]}"; do
  if [[ -d $d ]]; then
    count=$(find "$d" -type f 2>/dev/null | wc -l || echo "0")
    echo "✅ $d - $count files" >>"$OUTFILE"
  else
    echo "❌ $d - MISSING" >>"$OUTFILE"
  fi
done

# ─── Development Status from README ───────────────────────────────────────────
echo -e "\n🚧 DEVELOPMENT PROGRESS" >> "$OUTFILE"
if [[ -f README.md ]]; then
  # Extract development status section from README
  awk '/## 🚧 Development Status/,/^---/ {print}' README.md | head -n -1 >> "$OUTFILE" 2>/dev/null || echo "Development status not found in README" >> "$OUTFILE"
else
  echo "❌ README.md not found" >> "$OUTFILE"
fi

# ─── Project Structure Analysis ───────────────────────────────────────────────
echo -e "\n📊 PROJECT METRICS" >> "$OUTFILE"
if [[ -f 01-core/index.html ]]; then
  html_lines=$(wc -l < 01-core/index.html)
  echo "📄 HTML: $html_lines lines" >> "$OUTFILE"
fi
if [[ -f 01-core/stylesheet.css ]]; then
  css_lines=$(wc -l < 01-core/stylesheet.css)
  echo "🎨 CSS: $css_lines lines" >> "$OUTFILE"
fi
if [[ -f 01-core/script.js ]]; then
  js_lines=$(wc -l < 01-core/script.js)
  echo "⚙️ JavaScript: $js_lines lines" >> "$OUTFILE"
fi

# Count placeholders and content gaps
if [[ -f 01-core/index.html ]]; then
  placeholders=$(grep -c "Placeholder\|placeholder\|content-placeholder" 01-core/index.html 2>/dev/null || echo "0")
  echo "🔲 Content placeholders: $placeholders" >> "$OUTFILE"
fi
# ─── Git Status & Sync Info ───────────────────────────────────────────────────
echo -e "\n🌿 GIT STATUS" >> "$OUTFILE"
if git rev-parse --git-dir > /dev/null 2>&1; then
  BRANCH=$(git symbolic-ref --short HEAD)
  UPSTREAM=$(git rev-parse --abbrev-ref "$BRANCH"@{upstream} 2>/dev/null || echo "")

  echo "Current branch: $BRANCH" >> "$OUTFILE"
  if [[ -n $UPSTREAM ]]; then
    read -r ahead behind < <(git rev-list --left-right --count "$UPSTREAM...$BRANCH")
    echo "Tracking:       $UPSTREAM" >> "$OUTFILE"
    echo "Ahead by:       $behind commits" >> "$OUTFILE"
    echo "Behind by:      $ahead commits"  >> "$OUTFILE"
  else
    echo "⚠️ No upstream branch set" >> "$OUTFILE"
  fi
else
  echo "❌ Not a git repository" >> "$OUTFILE"
fi

# ─── Recent Commits ────────────────────────────────────────────────────────────
echo -e "\n📜 LAST 5 COMMITS" >> "$OUTFILE"
if git rev-parse --git-dir > /dev/null 2>&1; then
  git log -5 --pretty=format:"- %h %s (%cr)" >>"$OUTFILE" 2>/dev/null || echo "No commits found" >> "$OUTFILE"
else
  echo "❌ Not a git repository" >> "$OUTFILE"
fi

# ─── Working Directory State ───────────────────────────────────────────────────
echo -e "\n📄 WORKING DIRECTORY" >> "$OUTFILE"
if git rev-parse --git-dir > /dev/null 2>&1; then
  if git status --short | grep -q .; then
    git status --short >> "$OUTFILE"
  else
    echo "Working directory clean" >> "$OUTFILE"
  fi
else
  echo "❌ Not a git repository" >> "$OUTFILE"
fi

# ─── Staged Changes Summary ───────────────────────────────────────────────────
echo -e "\n🔰 STAGED CHANGES SUMMARY" >> "$OUTFILE"
if git rev-parse --git-dir > /dev/null 2>&1; then
  if git diff --cached --stat | grep -q .; then
    git diff --cached --stat >>"$OUTFILE"
  else
    echo "No staged changes" >>"$OUTFILE"
  fi
else
  echo "❌ Not a git repository" >> "$OUTFILE"
fi

# ─── Directory Tree (2 levels) ────────────────────────────────────────────────
echo -e "\n🗂️ PROJECT STRUCTURE" >> "$OUTFILE"
if command -v tree >/dev/null 2>&1; then
  tree -L 2 -I ".git|node_modules|__pycache__|*.txt" >> "$OUTFILE"
else
  echo "📁 Root Directory:" >> "$OUTFILE"
  ls -la | grep -E '^d|\.html$|\.css$|\.js$|\.md$|\.json$|\.py$|\.ps1$' | awk '{print "  " $NF}' >> "$OUTFILE"
  echo -e "\n📁 Subdirectories:" >> "$OUTFILE"
  for dir in */; do
    if [[ -d "$dir" && ! "$dir" =~ ^\.git ]]; then
      echo "  $dir" >> "$OUTFILE"
      ls "$dir" 2>/dev/null | head -5 | sed 's/^/    - /' >> "$OUTFILE"
      count=$(ls "$dir" 2>/dev/null | wc -l)
      if [[ $count -gt 5 ]]; then
        echo "    ... and $((count - 5)) more files" >> "$OUTFILE"
      fi
    fi
  done
fi

# ─── Content Analysis ─────────────────────────────────────────────────────────
echo -e "\n📝 CONTENT ANALYSIS" >> "$OUTFILE"
if [[ -f 01-core/index.html ]]; then
  sections=$(grep -c "class.*section" 01-core/index.html 2>/dev/null || echo "0")
  echo "📄 HTML sections: $sections" >> "$OUTFILE"
  
  interactive_elements=$(grep -c "interactive\|glossary\|tooltip" 01-core/index.html 2>/dev/null || echo "0")
  echo "🎯 Interactive elements: $interactive_elements" >> "$OUTFILE"
fi

if [[ -f 01-core/script.js ]]; then
  functions=$(grep -c "function\|=>" 01-core/script.js 2>/dev/null || echo "0")
  echo "⚙️ JavaScript functions: $functions" >> "$OUTFILE"
fi

# ─── Data Files Check ─────────────────────────────────────────────────────────
echo -e "\n📊 DATA FILES" >> "$OUTFILE"
if [[ -d 03-content/data/ ]]; then
  echo "📁 Data directory contents:" >> "$OUTFILE"
  ls -la 03-content/data/ | grep -v "^total" | tail -n +2 | awk '{print "  " $NF " (" $5 " bytes)"}' >> "$OUTFILE" 2>/dev/null || echo "  (empty or inaccessible)" >> "$OUTFILE"
else
  echo "❌ No 03-content/data/ directory found" >> "$OUTFILE"
fi

# ─── Documentation Check ──────────────────────────────────────────────────────
echo -e "\n📚 DOCUMENTATION" >> "$OUTFILE"
if [[ -d 04-docs/docs/ ]]; then
  echo "📁 Documentation files:" >> "$OUTFILE"
  ls 04-docs/docs/ | sed 's/^/  /' >> "$OUTFILE" 2>/dev/null || echo "  (empty)" >> "$OUTFILE"
else
  echo "❌ No 04-docs/docs/ directory found" >> "$OUTFILE"
fi

# ─── TODO/FIXME Detection ─────────────────────────────────────────────────────
echo -e "\n📝 DEVELOPMENT NOTES" >> "$OUTFILE"
if grep -R -nE "TODO|FIXME|PLACEHOLDER|Placeholder" . --include="*.html" --include="*.css" --include="*.js" --include="*.md" >/dev/null 2>&1; then
  echo "🔍 Found development notes:" >> "$OUTFILE"
  grep -R -nE "TODO|FIXME|PLACEHOLDER|Placeholder" . --include="*.html" --include="*.css" --include="*.js" --include="*.md" | head -20 >> "$OUTFILE"
  total_notes=$(grep -R -cE "TODO|FIXME|PLACEHOLDER|Placeholder" . --include="*.html" --include="*.css" --include="*.js" --include="*.md" 2>/dev/null | awk -F: '{sum += $2} END {print sum}')
  if [[ $total_notes -gt 20 ]]; then
    echo "... and $((total_notes - 20)) more notes" >> "$OUTFILE"
  fi
else
  echo "✅ No TODO, FIXME, or PLACEHOLDER comments found" >> "$OUTFILE"
fi

# ─── Server Scripts Check ─────────────────────────────────────────────────────
echo -e "\n🖥️ LOCAL SERVER OPTIONS" >> "$OUTFILE"
server_scripts=(05-utilities/serve.py 05-utilities/serve.ps1)
for script in "${server_scripts[@]}"; do
  if [[ -f $script ]]; then
    echo "✅ $script available" >> "$OUTFILE"
  else
    echo "❌ $script missing" >> "$OUTFILE"
  fi
done

# ─── ChatGPT Context Summary ──────────────────────────────────────────────────
echo -e "\n🤖 CHATGPT CONTEXT SUMMARY" >> "$OUTFILE"
echo "Project Type: Digital humanities web application" >> "$OUTFILE"
echo "Tech Stack: HTML5, CSS3, Vanilla JavaScript" >> "$OUTFILE"
echo "Purpose: Interactive synopsis of academic research on extreme mass homicide" >> "$OUTFILE"
echo "Key Features: Responsive design, glossary tooltips, interactive maps/diagrams" >> "$OUTFILE"
echo "Development Focus: Content integration, accessibility, respectful presentation" >> "$OUTFILE"

# ─── Complete ─────────────────────────────────────────────────────────────────
echo -e "\n✅ Snapshot complete! File saved as: $OUTFILE" >> "$OUTFILE"
echo "📤 Ready to share with ChatGPT for project analysis and next steps." >> "$OUTFILE"

# Print completion message to console
echo "✅ Project Ares snapshot generated: $OUTFILE"
echo "📤 Ready to share with ChatGPT!"
