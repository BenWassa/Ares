#!/usr/bin/env bash
# Project Ares - Cross-platform repo status launcher
# Automatically detects system and runs appropriate script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Project Ares - Repository Status Generator"
echo "=============================================="

# Check if we're on Windows (WSL/Git Bash) or have PowerShell available
if command -v powershell.exe >/dev/null 2>&1; then
    echo "🪟 Windows detected - Running PowerShell version..."
    powershell.exe -ExecutionPolicy Bypass -File "$SCRIPT_DIR/generate_repo_status.ps1"
elif command -v pwsh >/dev/null 2>&1; then
    echo "🪟 PowerShell Core detected - Running PowerShell version..."
    pwsh -File "$SCRIPT_DIR/generate_repo_status.ps1"
else
    echo "🐧 Unix/Linux detected - Running Bash version..."
    bash "$SCRIPT_DIR/generate_repo_status.sh"
fi

echo ""
echo "✅ Status generation complete!"
echo "📁 Check 05-utilities/repo-status/repo_status_ares.txt"
