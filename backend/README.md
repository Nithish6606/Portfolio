# 🚀 Portfolio Backend API

This is the Django REST API backend for the Portfolio Dashboard application.

## 🏗️ Architecture

- **Framework**: Django 5.0+ with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Package Manager**: UV for fast dependency management
- **API Style**: RESTful with JSON responses
- **Documentation**: Auto-generated OpenAPI/Swagger docs

## 📁 Project Structure

```
backend/
├── portfolio_backend/       # Django project settings
│   ├── __init__.py
│   ├── settings.py         # Main configuration
│   ├── urls.py            # URL routing
│   ├── wsgi.py            # WSGI application
│   └── asgi.py            # ASGI application
├── portfolio/             # Main application
│   ├── models.py          # Database models
│   ├── views.py           # API views
│   ├── serializers.py     # API serializers
│   ├── urls.py            # URL patterns
│   ├── admin.py           # Django admin config
│   └── management/
│       └── commands/
│           └── init_portfolio.py  # Custom command
├── manage.py              # Django management
├── pyproject.toml         # UV dependencies
├── uv.lock               # Dependency lock file
└── db.sqlite3            # SQLite database
```

## 🚀 Quick Start

```bash
# Install dependencies
uv sync

# Setup database
uv run python manage.py migrate

# Load sample data
uv run python manage.py init_portfolio

# Start server
uv run python manage.py runserver
```

## 📡 API Endpoints

### Core Data
- `GET /api/health/` - Health check
- `GET /api/personal/` - Personal information
- `PUT /api/personal/` - Update personal info
- `GET /api/skills/` - All skills
- `PUT /api/skills/` - Update skills

### Experience & Projects
- `GET /api/experience/` - List experience
- `POST /api/experience/` - Create experience
- `PUT /api/experience/{id}/` - Update experience
- `DELETE /api/experience/{id}/` - Delete experience
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

### Contact & Admin
- `POST /api/contact/` - Submit contact form
- `GET /api/certifications/` - Get certifications
- `PUT /api/certifications/` - Update certifications

## 🗃️ Database Models

### PersonalInfo
- `name` - Full name
- `title` - Professional title
- `email` - Email address
- `phone` - Phone number
- `github` - GitHub URL
- `linkedin` - LinkedIn URL
- `bio` - Biography text
- `profile_picture` - Profile image URL

### Skills
- `programming_languages` - JSON array
- `web_technologies` - JSON array
- `frameworks` - JSON array
- `tools` - JSON array

### Experience
- `title` - Job title
- `company` - Company name
- `duration` - Employment period
- `description` - Job description

### Project
- `title` - Project name
- `description` - Project description
- `tech_stack` - Technology stack (JSON)
- `links` - Project links (JSON)

### Certification
- `name` - Certification name

### ContactMessage
- `name` - Sender name
- `email` - Sender email
- `subject` - Message subject
- `message` - Message content
- `created_at` - Timestamp

## ⚙️ Configuration

### Environment Variables (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
PORTFOLIO_ADMIN_PASSWORD=admin123
DATABASE_URL=sqlite:///db.sqlite3  # Optional
```

### Django Settings
Key settings in `portfolio_backend/settings.py`:
- `CORS_ALLOWED_ORIGINS` - Frontend URLs
- `REST_FRAMEWORK` - API configuration
- `DATABASES` - Database configuration

## 🧪 Development

### Management Commands
```bash
# Initialize with sample data
uv run python manage.py init_portfolio

# Create migrations
uv run python manage.py makemigrations

# Apply migrations
uv run python manage.py migrate

# Create superuser
uv run python manage.py createsuperuser

# Run tests
uv run python manage.py test
```

### Adding New Models
1. Define model in `models.py`
2. Create serializer in `serializers.py`
3. Add views in `views.py`
4. Configure URLs in `urls.py`
5. Run migrations

### API Authentication
Currently using session-based authentication for admin endpoints. Public endpoints don't require authentication.

## 🚀 Deployment

### Production Settings
- Set `DEBUG=False`
- Use PostgreSQL database
- Configure `ALLOWED_HOSTS`
- Set secure `SECRET_KEY`
- Configure static files

### Gunicorn (Production)
```bash
uv add gunicorn
uv run gunicorn portfolio_backend.wsgi:application
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install uv && uv sync
EXPOSE 8000
CMD ["uv", "run", "gunicorn", "portfolio_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 📊 Monitoring

### Health Check
```bash
curl http://127.0.0.1:8000/api/health/
```

### Admin Interface
Visit http://127.0.0.1:8000/admin/ to manage data through Django's admin interface.

### API Documentation
Interactive API docs available at http://127.0.0.1:8000/docs/

---

Built with Django ❤️ for the Portfolio Dashboard project.
