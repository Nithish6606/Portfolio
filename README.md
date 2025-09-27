# 🚀 Portfolio Dashboard with Django Backend

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0+-green.svg)](https://djangoproject.com)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

A modern, responsive portfolio website with a powerful Django REST API backend. This project combines an elegant frontend with a robust backend for seamless data management, admin controls, and professional portfolio presentation.

## ✨ Overview

This portfolio dashboard represents a complete full-stack solution featuring:
- **Modern Frontend**: Responsive design with dark/light theme support
- **Django Backend**: RESTful API with complete CRUD operations
- **Admin Panel**: Comprehensive content management system
- **Live Updates**: Real-time data synchronization
- **Fallback Support**: Works offline with localStorage backup

## 🎯 Key Features

### � **Backend Capabilities**
- **RESTful API**: Complete set of endpoints for all portfolio operations
- **Database Persistence**: SQLite database with Django ORM
- **Contact Management**: Functional contact form with message storage
- **Authentication**: Secure admin access with session management
- **Data Operations**: Import/Export functionality for portfolio backup
- **CORS Enabled**: Cross-origin support for seamless frontend integration
- **Admin Interface**: Django admin panel for advanced data management
- **API Documentation**: Interactive API docs at `/docs/`

### � **Frontend Excellence**
- **Responsive Design**: Mobile-first approach with modern CSS
- **Theme Support**: Dynamic dark/light mode switching
- **Live Status**: Real-time backend connection indicator
- **Smart Fallback**: Automatic localStorage backup when offline
- **Smooth Animations**: Enhanced UX with CSS transitions
- **Admin Panel**: Built-in content management interface
- **Error Handling**: Graceful error management with user feedback

### 🛠️ **Technical Stack**
- **Backend**: Django 5.0+, Django REST Framework, SQLite
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Package Management**: UV for fast Python dependency management
- **API**: RESTful architecture with JSON responses
- **Authentication**: Session-based admin authentication

## 📁 Project Structure

```
Portfolio-Dashboard/
├── 📂 backend/                     # Django Backend Application
│   ├── 📂 portfolio_backend/       # Django Project Configuration
│   │   ├── __init__.py
│   │   ├── settings.py            # Django settings & configuration
│   │   ├── urls.py                # Main URL routing
│   │   ├── wsgi.py                # WSGI application
│   │   └── asgi.py                # ASGI application
│   ├── 📂 portfolio/               # Main Django App
│   │   ├── models.py              # Database models
│   │   ├── views.py               # API views and logic
│   │   ├── serializers.py         # API serializers
│   │   ├── urls.py                # App URL patterns
│   │   ├── admin.py               # Django admin configuration
│   │   └── 📂 management/commands/
│   │       └── init_portfolio.py  # Custom management command
│   ├── manage.py                  # Django management script
│   ├── db.sqlite3                 # SQLite database file
│   ├── pyproject.toml             # UV project dependencies
│   └── uv.lock                    # UV lock file
├── 📄 index.html                  # Frontend HTML structure
├── 🎨 style.css                   # Frontend styling & themes
├── 📄 profile.jpg                 # Profile image asset
├── ⚙️ app.js                      # Original JavaScript (localStorage)
├── 🚀 app-django.js               # Enhanced JavaScript (API + fallback)
└── 📖 README.md                   # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** - [Download Python](https://python.org/downloads/)
- **UV Package Manager** - [Install UV](https://docs.astral.sh/uv/getting-started/installation/)

### 1. 🏗️ Backend Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Portfolio-Dashboard

# Navigate to backend directory
cd backend

# Install dependencies with UV (fast!)
uv sync

# Set up the database
uv run python manage.py makemigrations
uv run python manage.py migrate

# Initialize with sample portfolio data
uv run python manage.py init_portfolio

# (Optional) Create Django admin superuser
uv run python manage.py createsuperuser

# Start the development server
uv run python manage.py runserver 8000
```

### 2. 🌐 Access Your Portfolio

Once the server is running, access these URLs:

| Service | URL | Description |
|---------|-----|-------------|
| 🏠 **Portfolio Website** | http://127.0.0.1:8000/ | Main portfolio site |
| 📚 **API Documentation** | http://127.0.0.1:8000/docs/ | Interactive API docs |
| ⚙️ **Django Admin** | http://127.0.0.1:8000/admin/ | Django admin interface |
| 🔧 **Admin Panel** | http://127.0.0.1:8000/#admin | Built-in admin panel |

### 3. 🎮 Default Credentials

- **Admin Panel Password**: `admin123`
- **Django Admin**: Use superuser credentials (if created)

## 📡 API Reference

The portfolio includes a comprehensive REST API. Visit http://127.0.0.1:8000/docs/ for interactive documentation.

### 🔍 Core Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health/` | 📊 API health check | ❌ |
| `GET` | `/api/personal/` | 👤 Get personal info | ❌ |
| `PUT` | `/api/personal/` | ✏️ Update personal info | ✅ |
| `GET` | `/api/skills/` | 🛠️ Get all skills | ❌ |
| `PUT` | `/api/skills/` | 🔄 Update skills | ✅ |

### 💼 Experience & Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/experience/` | 📋 List all experience | ❌ |
| `POST` | `/api/experience/` | ➕ Create experience | ✅ |
| `PUT` | `/api/experience/{id}/` | ✏️ Update experience | ✅ |
| `DELETE` | `/api/experience/{id}/` | 🗑️ Delete experience | ✅ |
| `GET` | `/api/projects/` | 🚀 List all projects | ❌ |
| `POST` | `/api/projects/` | ➕ Create project | ✅ |
| `PUT` | `/api/projects/{id}/` | ✏️ Update project | ✅ |
| `DELETE` | `/api/projects/{id}/` | 🗑️ Delete project | ✅ |

### 📞 Contact & Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/contact/` | 📧 Submit contact form | ❌ |
| `GET` | `/api/certifications/` | 🏆 Get certifications | ❌ |
| `PUT` | `/api/certifications/` | 🔄 Update certifications | ✅ |

> 💡 **Tip**: Use the interactive API documentation at `/docs/` to test endpoints directly in your browser!

## Configuration

### Environment Variables (.env)
```env
SECRET_KEY=your-secret-key-change-this-in-production
DEBUG=True
PORTFOLIO_ADMIN_PASSWORD=admin123
```

### 🔧 Configuration Files

Create a `.env` file in the `backend/` directory:

```env
# Security
SECRET_KEY=your-secret-key-change-this-in-production
DEBUG=True

# Portfolio Admin
PORTFOLIO_ADMIN_PASSWORD=admin123

# Database (Optional - defaults to SQLite)
# DATABASE_URL=postgresql://user:pass@localhost/dbname
```

Frontend configuration in `app-django.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const USE_BACKEND = true; // Toggle API/localStorage mode
```

## 💡 Usage Guide

### 🎛️ Admin Panel Features
1. **Access**: Navigate to http://127.0.0.1:8000/#admin
2. **Login**: Enter password `admin123`
3. **Manage**: Full CRUD operations for all portfolio sections
4. **Export/Import**: Backup and restore your data as JSON

### 📧 Contact Form
- **Functional**: Messages are saved to the database
- **Admin View**: Access messages via Django admin panel
- **Validation**: Built-in form validation and error handling

### 💾 Data Management
| Action | Method | Description |
|--------|--------|-------------|
| **Backup** | Export Data | Download complete portfolio as JSON |
| **Restore** | Import Data | Upload JSON file to restore data |
| **Reset** | Django Admin | Clear and reinitialize database |

### 🎨 Theme System
- **Auto-Detection**: Respects system theme preference
- **Manual Toggle**: Theme switcher in top-right corner
- **Persistent**: Theme choice saved in localStorage

## 🛠️ Development Guide

### 🏗️ Adding New Features

#### Backend Development
```bash
# 1. Create new models
# Edit: backend/portfolio/models.py

# 2. Create/update serializers  
# Edit: backend/portfolio/serializers.py

# 3. Add API views
# Edit: backend/portfolio/views.py

# 4. Configure URLs
# Edit: backend/portfolio/urls.py

# 5. Apply changes
uv run python manage.py makemigrations
uv run python manage.py migrate
```

#### Frontend Integration
```javascript
// Update app-django.js with new API calls
const newFeatureAPI = {
    async getData() {
        return await apiCall('GET', '/api/new-feature/');
    },
    async updateData(data) {
        return await apiCall('PUT', '/api/new-feature/', data);
    }
};
```

### 🗃️ Database Operations

| Command | Purpose |
|---------|---------|
| `makemigrations` | Generate migration files |
| `migrate` | Apply database changes |
| `init_portfolio` | Load sample data |
| `flush` | Clear all data |
| `shell` | Django interactive shell |

```bash
# Quick database reset
rm backend/db.sqlite3
cd backend
uv run python manage.py migrate
uv run python manage.py init_portfolio
```

### 🧪 Testing

```bash
# Run Django tests
cd backend
uv run python manage.py test

# Check code style
uv run ruff check
uv run ruff format

# Type checking
uv run mypy .
```

## 🚀 Deployment

### 🐳 Docker Deployment (Recommended)

```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/ .
RUN pip install uv && uv sync
EXPOSE 8000
CMD ["uv", "run", "gunicorn", "portfolio_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```bash
# Build and run
docker build -t portfolio-dashboard .
docker run -p 8000:8000 portfolio-dashboard
```

### ☁️ Production Checklist

| Task | Status | Description |
|------|--------|-------------|
| `DEBUG=False` | ⚠️ | Disable debug mode |
| Database | ⚠️ | Use PostgreSQL/MySQL |
| Static Files | ⚠️ | Configure `STATIC_ROOT` |
| HTTPS | ⚠️ | Enable SSL/TLS |
| Environment | ✅ | Use `.env` files |
| CORS | ✅ | Configure allowed origins |

### 🌍 Platform-Specific Deployment

#### Heroku
```bash
# Install Heroku CLI and login
heroku create your-portfolio-app
git push heroku main
```

#### Railway
```bash
# Connect Railway to your repo
railway login
railway init
railway up
```

#### DigitalOcean App Platform
- Connect GitHub repository
- Select Python environment
- Set build command: `uv sync`
- Set run command: `uv run gunicorn portfolio_backend.wsgi:application`

## 🔧 Troubleshooting

### Common Issues & Solutions

| Problem | Solution | Command |
|---------|----------|---------|
| 🔌 **Port in use** | Use different port | `uv run python manage.py runserver 8001` |
| 🌐 **CORS errors** | Check allowed origins | Edit `CORS_ALLOWED_ORIGINS` in settings.py |
| 🗃️ **Database issues** | Reset database | `rm db.sqlite3 && uv run python manage.py migrate` |
| 📡 **API not responding** | Check server status | Verify server running at http://127.0.0.1:8000 |
| 🚫 **Permission denied** | Fix file permissions | `chmod +x manage.py` |
| 📦 **Dependencies error** | Reinstall packages | `uv sync --reinstall` |

### 📊 Debug Information

```bash
# Check Python version
python --version

# Check UV installation
uv --version

# Check Django installation
uv run python -c "import django; print(django.VERSION)"

# Check database status
uv run python manage.py showmigrations

# Test API endpoints
curl http://127.0.0.1:8000/api/health/
```

### 📱 Frontend Issues

| Issue | Check | Solution |
|-------|-------|----------|
| **Blank page** | Browser console (F12) | Check JavaScript errors |
| **API errors** | Network tab in DevTools | Verify backend is running |
| **Theme not working** | localStorage | Clear browser storage |
| **Admin not loading** | URL hash | Ensure `#admin` in URL |

### 🎯 Getting Help

1. **Check Logs**: Server terminal shows Django errors
2. **Browser Console**: F12 → Console for frontend errors  
3. **API Status**: Visit http://127.0.0.1:8000/api/health/
4. **Django Admin**: http://127.0.0.1:8000/admin/ for data inspection

## 🔮 Future Enhancements

### 🎯 Planned Features
- [ ] **User Authentication** - Multi-user support
- [ ] **Blog System** - Built-in blogging functionality  
- [ ] **Analytics Dashboard** - Portfolio visit tracking
- [ ] **Email Notifications** - Contact form alerts
- [ ] **File Uploads** - Project image management
- [ ] **Search & Filtering** - Enhanced content discovery
- [ ] **API Rate Limiting** - Security improvements
- [ ] **Caching Layer** - Performance optimization
- [ ] **Mobile App** - React Native companion
- [ ] **Social Integration** - GitHub/LinkedIn sync

### 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **Django** - The web framework for perfectionists with deadlines
- **UV** - Lightning-fast Python package management
- **SQLite** - Reliable embedded database
- **Modern CSS** - For beautiful, responsive design

---

## 🎉 Success!

Your portfolio is now powered by a professional full-stack architecture:

- ✅ **Backend**: Django REST API with database persistence
- ✅ **Frontend**: Modern, responsive design with theme support  
- ✅ **Admin**: Complete content management system
- ✅ **Deployment**: Production-ready configuration
- ✅ **Fallback**: Works offline with localStorage backup

**Ready to showcase your work to the world!** 🚀

---

<div align="center">

**Made with ❤️ by Mada Nithish Reddy**

[🌐 Live Demo](http://127.0.0.1:8000) • [📚 API Docs](http://127.0.0.1:8000/docs/) • [⚙️ Admin Panel](http://127.0.0.1:8000/admin/)

</div>
