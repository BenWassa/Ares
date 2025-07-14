@echo off
REM Quick Content Integration Script for Ares Project
REM Usage: build.bat [clean] [watch]

cd /d "%~dp0"

set PYTHON_CMD=C:/Users/benjamin.haddon/Documents/Ares/.venv/Scripts/python.exe
set BUILD_SCRIPT=unified_builder.py

echo 🏛️ Ares Content Integration
echo ===========================

if "%1"=="clean" (
    echo Running with clean option...
    %PYTHON_CMD% %BUILD_SCRIPT% --clean
) else if "%1"=="watch" (
    echo Running with file watching...
    %PYTHON_CMD% %BUILD_SCRIPT% --watch
) else if "%1"=="quiet" (
    echo Running in quiet mode...
    %PYTHON_CMD% %BUILD_SCRIPT% --quiet
) else (
    echo Running standard build...
    %PYTHON_CMD% %BUILD_SCRIPT%
)

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
) else (
    echo ✅ Build completed successfully
    echo 📁 Open: 01-core\index-with-content.html
)

pause
