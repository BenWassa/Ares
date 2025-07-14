#!/usr/bin/env python3
"""
Project Ares - Unified Content Builder
Can be run from anywhere in the project

Usage from project root:
  python build.py
  python build.py --clean
  python build.py --watch
"""

import sys
import subprocess
from pathlib import Path

def main():
    # Find the project root (contains 01-core, 03-content folders)
    current_dir = Path.cwd()
    project_root = None
    
    # Check if we're already in project root
    if (current_dir / "01-core").exists() and (current_dir / "03-content").exists():
        project_root = current_dir
    else:
        # Look up the directory tree
        for parent in current_dir.parents:
            if (parent / "01-core").exists() and (parent / "03-content").exists():
                project_root = parent
                break
    
    if not project_root:
        print("❌ Error: Could not find Ares project root")
        print("   Make sure you're in the Ares project directory")
        sys.exit(1)
    
    # Path to the unified builder
    builder_path = project_root / "03-content" / "build" / "unified_builder.py"
    
    if not builder_path.exists():
        print(f"❌ Error: Could not find unified_builder.py at {builder_path}")
        sys.exit(1)
    
    # Find Python executable
    python_cmd = None
    venv_python = project_root / ".venv" / "Scripts" / "python.exe"
    
    if venv_python.exists():
        python_cmd = str(venv_python)
    else:
        # Try system Python
        try:
            subprocess.run([sys.executable, "--version"], check=True, capture_output=True)
            python_cmd = sys.executable
        except:
            print("❌ Error: Could not find Python executable")
            sys.exit(1)
    
    print(f"🏛️ Project Ares - Unified Content Builder")
    print(f"📁 Project root: {project_root}")
    print(f"🐍 Using Python: {python_cmd}")
    print("=" * 50)
    
    # Run the unified builder with all arguments
    cmd = [python_cmd, str(builder_path)] + sys.argv[1:]
    
    try:
        result = subprocess.run(cmd, cwd=str(project_root))
        sys.exit(result.returncode)
    except KeyboardInterrupt:
        print("\n🛑 Build cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error running builder: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
