@echo off
title Project Ares - Development Server
color 0B

echo.
echo ================================================
echo   PROJECT ARES - DEVELOPMENT SERVER
echo ================================================
echo.
echo Starting local development server...
echo.

REM Change to the project root directory
cd /d "%~dp0\.."

REM Try to start the server using PowerShell script first
if exist "05-utilities\scripts\serve.ps1" (
    echo Using PowerShell server script...
    powershell -ExecutionPolicy Bypass -File "05-utilities\scripts\serve.ps1"
) else if exist "05-utilities\scripts\serve.py" (
    echo Using Python server script...
    python "05-utilities\scripts\serve.py"
) else (
    echo ERROR: No server scripts found!
    echo Please ensure serve.ps1 or serve.py exists in 05-utilities\scripts folder.
    pause
    exit /b 1
)

echo.
echo Server stopped.
pause
