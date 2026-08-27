#!/usr/bin/env python3
"""Project Ares static publication build entry point.

ADR #6 keeps ``python build.py`` as the stable repository-level command. Ares
2.0 Issue #10 introduces a scoped builder extension for glossary/process
surfaces while the shared legacy builder is incrementally decomposed by the
wider programme.
"""

import subprocess
import sys
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

    builder_path = project_root / "03-content" / "build" / "ares2_builder.py"
    if not builder_path.exists():
        print(f"❌ Error: Could not find Ares 2.0 builder at {builder_path}")
        sys.exit(1)

    python_cmd = sys.executable
    venv_python = project_root / ".venv" / "Scripts" / "python.exe"
    if venv_python.exists():
        python_cmd = str(venv_python)

    if "--quiet" not in sys.argv:
        print("🏛️ Project Ares - Static Publication Builder")
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
    except Exception as exc:  # noqa: BLE001 - CLI should surface launch failure
        print(f"❌ Error running builder: {exc}")
        sys.exit(1)


if __name__ == "__main__":
    main()
