#!/usr/bin/env bash
set -euo pipefail

OUTFILE="repo_status_ares.txt"
DATE=$(date +"%a, %b %d, %Y %I:%M:%S %p")

# ─── Initialize Output ────────────────────────────────────────────────────────
cat > "$OUTFILE" <<EOF
==============================
PROJECT ARES – REPO SNAPSHOT
Generated: $DATE
==============================

🎯 PROJECT OVERVIEW
This is a digital humanities project transforming academic research on extreme mass homicide
into an interactive web synopsis. Key focus: psychology, history, and respectful presentation.

🔎 CORE PROJECT FILES CHECK
EOF

# ─── Check Core Files & Directories (Updated for Ares) ───────────────────────
core_files=(index.html stylesheet.css script.js README.md package.json)
directories=(assets/ data/ docs/ images/ maps/ svgs/)

echo "📄 Core Files:" >> "$OUTFILE"
for f in "${core_files[@]}"; do
  if [[ -e $f ]]; then
    size=$(du -h "$f" 2>/dev/null | cut -f1 || echo "?")
    echo "✅ $f ($size)" >>"$OUTFILE"
  else
    echo "❌ $f missing" >>"$OUTFILE"
  fi
done

echo -e "\n📁 Key Directories:" >> "$OUTFILE"
for d in "${directories[@]}"; do
  if [[ -d $d ]]; then
    count=$(find "$d" -type f 2>/dev/null | wc -l || echo "0")
    echo "✅ $d ($count files)" >>"$OUTFILE"
  else
    echo "❌ $d missing" >>"$OUTFILE"
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
if [[ -f index.html ]]; then
  html_lines=$(wc -l < index.html)
  echo "📄 HTML: $html_lines lines" >> "$OUTFILE"
fi
if [[ -f stylesheet.css ]]; then
  css_lines=$(wc -l < stylesheet.css)
  echo "🎨 CSS: $css_lines lines" >> "$OUTFILE"
fi
if [[ -f script.js ]]; then
  js_lines=$(wc -l < script.js)
  echo "⚙️ JavaScript: $js_lines lines" >> "$OUTFILE"
fi

# Count placeholders and content gaps
if [[ -f index.html ]]; then
  placeholders=$(grep -c "Placeholder\|placeholder\|content-placeholder" index.html 2>/dev/null || echo "0")
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
if [[ -f index.html ]]; then
  sections=$(grep -c "class.*section" index.html 2>/dev/null || echo "0")
  echo "📄 HTML sections: $sections" >> "$OUTFILE"
  
  interactive_elements=$(grep -c "interactive\|glossary\|tooltip" index.html 2>/dev/null || echo "0")
  echo "🎯 Interactive elements: $interactive_elements" >> "$OUTFILE"
fi

if [[ -f script.js ]]; then
  functions=$(grep -c "function\|=>" script.js 2>/dev/null || echo "0")
  echo "⚙️ JavaScript functions: $functions" >> "$OUTFILE"
fi

# ─── Data Files Check ─────────────────────────────────────────────────────────
echo -e "\n📊 DATA FILES" >> "$OUTFILE"
if [[ -d data/ ]]; then
  echo "📁 Data directory contents:" >> "$OUTFILE"
  ls -la data/ | grep -v "^total" | tail -n +2 | awk '{print "  " $NF " (" $5 " bytes)"}' >> "$OUTFILE" 2>/dev/null || echo "  (empty or inaccessible)" >> "$OUTFILE"
else
  echo "❌ No data/ directory found" >> "$OUTFILE"
fi

# ─── Documentation Check ──────────────────────────────────────────────────────
echo -e "\n📚 DOCUMENTATION" >> "$OUTFILE"
if [[ -d docs/ ]]; then
  echo "📁 Documentation files:" >> "$OUTFILE"
  ls docs/ | sed 's/^/  /' >> "$OUTFILE" 2>/dev/null || echo "  (empty)" >> "$OUTFILE"
else
  echo "❌ No docs/ directory found" >> "$OUTFILE"
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
server_scripts=(serve.py serve.ps1)
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
