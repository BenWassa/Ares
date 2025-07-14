@echo off
title Project Ares - Repository Status
color 0E

echo.
echo ================================================
echo   PROJECT ARES - REPOSITORY STATUS
echo ================================================
echo.
echo Generating comprehensive project status...
echo.

REM Change to the project root directory
cd /d "%~dp0\.."

REM Run the PowerShell status generator
if exist "05-utilities\scripts\repo-status\generate_repo_status.ps1" (
    echo Using PowerShell status generator...
    powershell -ExecutionPolicy Bypass -File "05-utilities\scripts\repo-status\generate_repo_status.ps1"
) else (
    echo ERROR: Status generator not found!
    echo Please ensure generate_repo_status.ps1 exists in 05-utilities\scripts\repo-status folder.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   STATUS REPORT GENERATED
echo ================================================
echo.
echo Report saved to: 05-utilities\scripts\repo-status\repo_status_ares.txt
echo.
echo You can now copy the contents of that file and share with ChatGPT!
echo.

REM Ask if user wants to open the file
choice /C YN /M "Do you want to open the status report now"
if errorlevel 2 goto end
if errorlevel 1 goto open

:open
if exist "05-utilities\scripts\repo-status\repo_status_ares.txt" (
    start notepad "05-utilities\scripts\repo-status\repo_status_ares.txt"
) else (
    echo File not found: 05-utilities\scripts\repo-status\repo_status_ares.txt
)

:end
echo.
echo Press any key to close...
pause >nul
