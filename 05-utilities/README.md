# Project Ares - Utilities

Simple tools for developing and managing Project Ares.

## 🚀 Quick Start (Double-Click)

### Start Development Server
**Double-click:** `start-server.bat`
- Launches local web server on http://localhost:8000
- Automatically opens your browser
- Serves the project from `01-core/` folder

### Generate Project Status
**Double-click:** `generate-status.bat`
- Creates comprehensive project status report
- Perfect for sharing with ChatGPT for guidance
- Opens the report in Notepad when complete

## 📁 Folder Structure

```
05-utilities/
├── start-server.bat        # 🖱️ Double-click to start server
├── generate-status.bat     # 🖱️ Double-click for project status
├── scripts/                # 📂 Detailed implementation files
│   ├── serve.py           #    Python development server
│   ├── serve.ps1          #    PowerShell development server  
│   └── repo-status/       #    Status generation tools
│       ├── generate_repo_status.ps1
│       ├── generate_repo_status.sh
│       ├── run_status.ps1
│       ├── run_status.sh
│       ├── repo_status_ares.txt  # 📄 Generated status report
│       └── README.md
└── README.md              # 📖 This file
```

## 💡 Usage Tips

### For Development
1. **Start coding:** Double-click `start-server.bat`
2. **Edit files:** Modify files in `01-core/` folder
3. **See changes:** Refresh browser (server auto-serves latest files)

### For Project Updates
1. **Generate status:** Double-click `generate-status.bat`  
2. **Copy report:** Content from `scripts/repo-status/repo_status_ares.txt`
3. **Share with ChatGPT:** Paste report for guidance and suggestions

### Command Line Alternative
If you prefer command line:
```powershell
# Start server
.\scripts\serve.ps1

# Generate status  
.\scripts\repo-status\run_status.ps1
```

## 🔧 Troubleshooting

### "Scripts are disabled" Error
The batch files handle PowerShell execution policy automatically. If you see errors:
- Right-click batch file → "Run as administrator"
- Or manually run: `powershell -ExecutionPolicy Bypass -File script.ps1`

### Python Not Found
- Install Python from python.org
- Or use the PowerShell server (works without Python)

### Port Already in Use
- Close other local servers
- Or change port in `scripts/serve.ps1`

---

*Part of Project Ares - Digital Synopsis of Extreme Mass Homicide Research*
