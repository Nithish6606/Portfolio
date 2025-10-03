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
├── 🎨 style.css                   # Frontend styling & themes
├── 📄 index.html                  # Frontend HTML structure
├── 📄 profile.jpg                 # Profile image asset
├── ⚙️ app.js                      # Standalone JavaScript (localStorage only)
├── 🚀 app-django.js               # Full-stack JavaScript (API + fallback)
├── 🧪 test-portfolio.html          # API testing interface
├── 📖 README.md                   # Project documentation
└── backend/                       # Django REST API
    ├── portfolio_backend/         # Django project settings
    │   ├── settings.py           # Main configuration
    │   ├── urls.py              # URL routing
    │   └── wsgi.py              # WSGI application
    ├── portfolio/               # Main application
    │   ├── models.py            # Database models
    │   ├── views.py             # API views
    │   ├── serializers.py       # API serializers
    │   ├── admin.py             # Django admin config
    │   └── management/
    │       └── commands/
    │           └── init_portfolio.py  # Custom management command
    ├── manage.py                # Django management script
    ├── db.sqlite3              # SQLite database file
    ├── pyproject.toml           # UV project dependencies
    └── uv.lock                  # UV lock file
```

## 🚀 Quick Start

This section helps you get started with both development and production environments, and explains how to deploy and use the dashboard effectively.

### 1. 🔧 Choose Your Setup Mode

#### Option A: **Standalone Mode** (No Backend)
```html
<!-- In index.html, use: -->
<script src="app.js"></script>
```
- ✅ Works immediately
- 📁 Data stored in localStorage
- 🚫 Contact form is demo only

#### Option B: **Full-Stack Mode** (With Backend)
```html
<!-- In index.html, use: -->
<script src="app-django.js"></script>
```
- 🌐 Full API integration
- 📧 Working contact form
- 🔄 Data persistence in database


---

### 2. 🚀 Backend Setup (Option B only)


#### **Prerequisites**
- Python 3.8+ (Recommended: Python 3.11+)
- [UV package manager](https://github.com/astral-sh/uv) (for fast dependency management)
- (Optional) PostgreSQL for production
- (Optional) Node.js & npm (for static server or advanced frontend tooling)


#### **Installation Steps**
```bash
# 1. Clone the repository
git clone https://github.com/Nithish6606/Portfolio-Dashboard.git
cd Portfolio-Dashboard

# 2. Backend setup
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py init_portfolio
uv run python manage.py runserver 8000

# 3. (Optional) Create a superuser for Django admin
uv run python manage.py createsuperuser

# 4. Frontend (from project root)
cd ..
python -m http.server 3000
# or use npm start if you have a Node.js static server
```


#### **Verify Setup**
```bash
# Test API endpoint
curl http://127.0.0.1:8000/api/health/
# Expected response:
{"status": "healthy", "timestamp": "2024-01-01T12:00:00Z"}
```

---

## 🏭 Production Setup

For production, follow these extra steps:

1. **Environment Variables**: Copy `.env.template` to `.env.production` and set `DEBUG=False`, configure `ALLOWED_HOSTS`, and set secure secrets.
2. **Database**: Use PostgreSQL or another production-ready DB. Update `DATABASES` in `backend/portfolio_backend/settings.py`.
3. **Static Files**: Collect static files:
  ```bash
  uv run python manage.py collectstatic --noinput
  ```
4. **WSGI/ASGI Server**: Use Gunicorn, Daphne, or Uvicorn for serving Django in production.
5. **Reverse Proxy**: Use Nginx or Apache to serve static/media files and proxy API requests.
6. **Process Management**: Use Supervisor or systemd to keep backend running.
7. **HTTPS**: Always use SSL certificates in production.

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 💡 Usage Guide

### 🎛️ Admin Panel Access

The admin panel is available in both modes, but with different storage backends:

| Mode | Access Method | Password | Features |
|------|---------------|----------|----------|
| **app.js** | `#admin` in URL | `admin123` | ✅ Full CRUD, localStorage only |
| **app-django.js** | `#admin` in URL | `admin123` | ✅ Full CRUD + API sync |

**Steps to Access:**
1. Navigate to your portfolio website (local or deployed)
2. Add `#admin` to the URL (e.g., `http://localhost:3000/#admin`)
3. Enter password: `admin123` (change this in production!)
4. Start managing your portfolio content!

**Django Admin:**
- For advanced data management, visit `http://127.0.0.1:8000/admin/` and log in with your Django superuser credentials.

### 📊 **Data Storage Comparison**

| Feature | Standalone (app.js) | Full-Stack (app-django.js) |
|---------|---------------------|----------------------------|
| Data Storage | localStorage | Database + localStorage backup |
| Contact Form | Demo only | ✅ Functional (saves to DB) |
| Data Persistence | Browser only | ✅ Server persistent |
| Multi-device Sync | ❌ | ✅ |
| Backup/Restore | JSON export only | ✅ Database + JSON |
| Admin Panel | In-browser | In-browser + Django admin |
| API Access | ❌ | ✅ |

| Feature | app.js (Standalone) | app-django.js (Full-Stack) |
|---------|-------------------|---------------------------|
| **Data Storage** | localStorage | Database + localStorage backup |
| **Contact Form** | Demo only | ✅ Functional (saves to DB) |
| **Data Persistence** | Browser only | ✅ Server persistent |
| **Multi-device Sync** | ❌ | ✅ |
| **Backup/Restore** | JSON export only | ✅ Database + JSON |

## 🤔 Which File Should I Use?

### **Choose app.js if you want:**
- ✅ Simple, immediate deployment
- ✅ No server setup required  
- ✅ GitHub Pages / Netlify hosting
- ❌ Contact form is demo only

### **Choose app-django.js if you want:**
- ✅ Professional backend integration
- ✅ Working contact form with database
- ✅ Data persistence across devices
- ✅ Admin panel with API sync
- ⚠️ Requires Django server setup

### **Switching Between Modes**
```html
<!-- In index.html, change this line: -->

<!-- For Standalone Mode: -->
<script src="app.js"></script>

<!-- For Full-Stack Mode: -->  
<script src="app-django.js"></script>
```

---

## 📡 API Reference

> ⚠️ **Note**: API endpoints only work with `app-django.js`. The standalone `app.js` uses localStorage only.

### 🔍 Core Endpoints (app-django.js only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health/` | 📊 API health check | ❌ |
| `GET` | `/api/portfolio-data/` | 📦 Complete portfolio data | ❌ |
| `GET` | `/api/personal/` | 👤 Get personal info | ❌ |
| `PUT` | `/api/personal/` | ✏️ Update personal info | ✅ |
| `GET` | `/api/skills/` | 🛠️ Get skills data | ❌ |
| `POST` | `/api/skills/` | ➕ Add new skill | ✅ |
| `GET` | `/api/experience/` | 💼 Get experience list | ❌ |
| `POST` | `/api/experience/` | ➕ Add experience | ✅ |
| `GET` | `/api/projects/` | 🚀 Get projects list | ❌ |
| `POST` | `/api/projects/` | ➕ Add project | ✅ |

### 📝 **Example API Usage**

You can use these endpoints with `fetch`, `axios`, or any HTTP client. For authenticated endpoints, login via the admin panel or use Django's session authentication.
```javascript
// Get portfolio data
const response = await fetch('http://127.0.0.1:8000/api/portfolio-data/');
const portfolioData = await response.json();

// Add new skill
await fetch('http://127.0.0.1:8000/api/skills/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    category: 'programmingLanguages',
    name: 'JavaScript' 
  })
});
```

---

## 🎨 Customization

### **Theme Colors**

You can easily change the look and feel by editing CSS variables in `style.css`.
```css
/* In style.css, modify CSS variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
}
```

### **Personal Information**

Update your personal details in `app.js` or via the admin panel (in full-stack mode).
```javascript
// In app.js, modify DEFAULT_DATA object
const DEFAULT_DATA = {
  personalInfo: {
    name: "Your Name",
    title: "Your Title",
    email: "your.email@domain.com",
    // ...
  }
}
```

---

## 🚀 Deployment

### Frontend Only (app.js)
- **GitHub Pages**: Push to repository, enable Pages in repo settings.
- **Netlify**: Drag & drop the project folder or connect your repo.
- **Vercel**: Import your GitHub repository and deploy.

### Full-Stack (app-django.js)
- **Railway**: Connect GitHub, auto-deploy backend and frontend.
- **Heroku**: Use Django buildpack, set environment variables.
- **DigitalOcean**: Use App Platform or a Droplet for custom deployment.
- **Self-Hosted VPS**: Use Docker Compose or manual setup (see [DEPLOYMENT.md](DEPLOYMENT.md)).

**Production Tips:**
- Always set `DEBUG=False` in production.
- Use a strong, unique admin password.
- Set up regular database backups.
- Monitor logs (`backend/logs/portfolio.log`).

### **Frontend Only (app.js)**
- **GitHub Pages**: Push to repository, enable Pages
- **Netlify**: Drag & drop folder
- **Vercel**: Import GitHub repository

### **Full-Stack (app-django.js)**
- **Railway**: Connect GitHub, auto-deploy
- **Heroku**: Use buildpack for Django
- **DigitalOcean**: App Platform deployment

---

## 🛠️ Technology Stack

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **localStorage** - Client-side data persistence

### **Backend**
- **Django 5.0+** - Web framework
- **Django REST Framework** - API development
- **SQLite** (dev) / **PostgreSQL** (prod) - Database
- **UV** - Modern Python package management

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mada Nithish Reddy**
- 🌐 Portfolio: [Your Portfolio URL]
- 🐙 GitHub: [@Nithish6606](https://github.com/Nithish6606)
- 💼 LinkedIn: [nithish-mada](https://linkedin.com/in/nithish-mada)
- 📧 Email: madanithishreddy@gmail.com

---

## 🙏 Acknowledgments

- Django REST Framework documentation
- Modern CSS techniques and best practices
- UV package manager for fast Python dependencies
