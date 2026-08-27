#!/usr/bin/env python3
"""
Project Ares - Unified Content Builder
Can be run from anywhere in the project.

Ares 2.0 Issue #9 routes the stable build command through the case-study
specialization layer while retaining the existing static generator underneath.

Usage from project root:
  python build.py
  python build.py --clean
  python build.py --watch
"""

import sys
import subprocess
from pathlib import Path


def main():
    current_dir = Path.cwd()
    project_root = None

    if (current_dir / "01-core").exists() and (current_dir / "03-content").exists():
        project_root = current_dir
    else:
        for parent in current_dir.parents:
            if (parent / "01-core").exists() and (parent / "03-content").exists():
                project_root = parent
                break

    if not project_root:
        print("❌ Error: Could not find Ares project root")
        print("   Make sure you're in the Ares project directory")
        sys.exit(1)

    builder_path = project_root / "03-content" / "build" / "case_study_builder.py"

    if not builder_path.exists():
        print(f"❌ Error: Could not find case_study_builder.py at {builder_path}")
        sys.exit(1)

    python_cmd = None
    venv_python = project_root / ".venv" / "Scripts" / "python.exe"

    if venv_python.exists():
        python_cmd = str(venv_python)
    else:
        try:
            subprocess.run([sys.executable, "--version"], check=True, capture_output=True)
            python_cmd = sys.executable
        except Exception:
            print("❌ Error: Could not find Python executable")
            sys.exit(1)

    print("🏛️ Project Ares - Unified Content Builder")
    print(f"📁 Project root: {project_root}")
    print(f"🐍 Using Python: {python_cmd}")
    print("=" * 50)

    cmd = [python_cmd, str(builder_path)] + sys.argv[1:]

    try:
        result = subprocess.run(cmd, cwd=str(project_root))
        sys.exit(result.returncode)
    except KeyboardInterrupt:
        print("\n🛑 Build cancelled by user")
        sys.exit(1)
    except Exception as exc:
        print(f"❌ Error running builder: {exc}")
        sys.exit(1)


if __name__ == "__main__":
    main()
