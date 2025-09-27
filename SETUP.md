# Portfolio Development Setup

## Frontend and Backend Separation

This portfolio is now set up to run frontend and backend separately:

- **Frontend**: Runs on port 3000
- **Backend**: Django REST API runs on port 8000

## Quick Start

### 1. Start Backend (Port 8000)
```bash
cd backend
uv run python manage.py runserver 8000
```

### 2. Start Frontend (Port 3000)
Choose one of these methods:

**Option 1: Using Python HTTP Server**
```bash
# From root directory
python -m http.server 3000
```

**Option 2: Using npm (if you have Node.js)**
```bash
npm start
```

**Option 3: Using PowerShell (Windows)**
```powershell
# From root directory
python -m http.server 3000
```

**Option 4: Using Live Server (VS Code Extension)**
- Install Live Server extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"
- Configure it to use port 3000

## Verification

1. **Backend**: Visit http://127.0.0.1:8000/api/health/ - should return health status
2. **Frontend**: Visit http://localhost:3000 - should show portfolio with API connection indicator

## Project Structure

```
Portfolio-Dashboard/
├── 🎨 style.css                   # Frontend styling
├── 📄 index.html                  # Frontend HTML
├── 📄 profile.jpg                 # Profile image
├── ⚙️ app.js                      # Standalone version (localStorage)
├── 🚀 app-django.js               # Full-stack version (API integration)
├── 📦 package.json               # Frontend package config
├── 🧪 test-portfolio.html          # API testing
├── 📖 README.md                   # Documentation
└── backend/                       # Django REST API (Port 8000)
    ├── portfolio_backend/         # Django settings
    ├── portfolio/                 # Main app
    ├── manage.py                  # Django management
    └── db.sqlite3                 # Database
```

## Features

- ✅ CORS properly configured for port 3000
- ✅ API health check endpoint
- ✅ Real-time connection status indicator
- ✅ Fallback to localStorage when API unavailable
- ✅ Separate development servers
- ✅ No frontend serving from Django (pure API)

## Development Notes

- Frontend uses `app-django.js` for full API integration
- Backend only serves API endpoints (no static files)
- CORS allows requests from localhost:3000
- Health check shows connection status on page load
