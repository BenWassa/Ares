# Project Ares - Repository Status Launcher (PowerShell)
# Simple launcher for the status generator

Write-Host "PROJECT ARES - Repository Status Generator" -ForegroundColor Blue
Write-Host "=========================================="

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$StatusScript = Join-Path $ScriptDir "generate_repo_status.ps1"

if (Test-Path $StatusScript) {
    Write-Host "Generating project status..." -ForegroundColor Yellow
    
    # Run with execution policy bypass to avoid script execution issues
    try {
        powershell -ExecutionPolicy Bypass -File $StatusScript
        Write-Host ""
        Write-Host "STATUS: Generation complete!" -ForegroundColor Green
        Write-Host "OUTPUT: 05-utilities\repo-status\repo_status_ares.txt" -ForegroundColor Cyan
        Write-Host "READY: Share with ChatGPT!" -ForegroundColor Yellow
    } catch {
        Write-Host "ERROR: Failed to generate status" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
} else {
    Write-Host "ERROR: generate_repo_status.ps1 not found!" -ForegroundColor Red
    Write-Host "Expected location: $StatusScript" -ForegroundColor Yellow
}
