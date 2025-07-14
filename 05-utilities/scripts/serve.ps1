# Project Ares Development Server
# PowerShell script for Windows development
# Run from project root: .\05-utilities\serve.ps1

param(
    [int]$Port = 8000,
    [switch]$NoBrowser
)

# Navigate to the core directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$coreDir = Join-Path (Split-Path -Parent $scriptDir) "01-core"

Write-Host "🚀 Project Ares Development Server" -ForegroundColor Cyan
Write-Host "📂 Serving directory: $coreDir" -ForegroundColor Gray
Write-Host "🌐 Server starting on port: $Port" -ForegroundColor Green

try {
    # Check if Python is available
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCmd) {
        $pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue
    }
    
    if ($pythonCmd) {
        Write-Host "🐍 Using Python: $($pythonCmd.Source)" -ForegroundColor Yellow
        
        # Start Python HTTP server from core directory
        $url = "http://localhost:$Port"
        Write-Host "📖 Project URL: $url" -ForegroundColor Green
        Write-Host "⭐ Press Ctrl+C to stop the server" -ForegroundColor Magenta
        Write-Host "═" * 60 -ForegroundColor DarkGray
        
        # Open browser unless disabled
        if (-not $NoBrowser) {
            Start-Sleep -Seconds 2
            Start-Process $url
            Write-Host "🌟 Browser opened automatically" -ForegroundColor Green
        }
        
        # Start server
        & $pythonCmd.Source -m http.server $Port
    }
    else {
        Write-Host "❌ Python not found in PATH" -ForegroundColor Red
        Write-Host "💡 Please install Python or use another method:" -ForegroundColor Yellow
        Write-Host "   - Node.js: npx http-server -p $Port" -ForegroundColor Gray
        Write-Host "   - PHP: php -S localhost:$Port" -ForegroundColor Gray
        Write-Host "   - Live Server extension in VS Code" -ForegroundColor Gray
        exit 1
    }
}
catch {
    Write-Host "❌ Error starting server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
