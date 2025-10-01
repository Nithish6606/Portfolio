# Portfolio Deployment Guide - READY FOR DEPLOYMENT! 🚀

## 🌐 Live URLs (After Deployment)
- **Portfolio**: https://nithish6606.github.io/Portfolio
- **API**: https://nithish6606.pythonanywhere.com/api/
- **Admin**: https://nithish6606.pythonanywhere.com/admin/

## ✅ Pre-Deployment Configuration Complete
- [x] Frontend configured for GitHub Pages with dynamic API URLs
- [x] Backend configured for PythonAnywhere deployment
- [x] CORS settings updated to include GitHub Pages URL
- [x] Production environment file created
- [x] Security headers and rate limiting configured
- [x] Input validation and sanitization implemented

## 🔧 Updated Configuration Files
- [x] `app-django.js` - Updated with production API URLs
- [x] `index.html` - Added dynamic API URL detection
- [x] `settings.py` - Configured for PythonAnywhere with security settings
- [x] `.env.production` - Created with production environment variables

## 🌐 Production Deployment Steps

### 1. Server Setup
```bash
# Install Python 3.11+
# Install uv package manager
# Clone repository
git clone https://github.com/your-username/portfolio-dashboard.git
cd portfolio-dashboard/backend
```

### 2. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Edit .env file with production values:
SECRET_KEY=your-super-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOW_ALL_ORIGINS=False
PORTFOLIO_ADMIN_PASSWORD=your-secure-admin-password
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

### 3. Database Setup (Production)
```bash
# For PostgreSQL (recommended)
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db

# Install PostgreSQL adapter
uv add psycopg2-binary

# Run migrations
uv run python manage.py migrate

# Create superuser
uv run python manage.py createsuperuser
```

### 4. Static Files & Media
```bash
# Collect static files
uv run python manage.py collectstatic --noinput

# Configure web server (Nginx) to serve static files
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    
    location /static/ {
        alias /path/to/portfolio/backend/staticfiles/;
    }
    
    location /media/ {
        alias /path/to/portfolio/backend/media/;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Process Management (Gunicorn + Supervisor)
```bash
# Install Gunicorn
uv add gunicorn

# Create Gunicorn configuration
# gunicorn.conf.py
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
timeout = 120
keepalive = 2
max_requests = 1000
max_requests_jitter = 50

# Supervisor configuration
# /etc/supervisor/conf.d/portfolio.conf
[program:portfolio]
command=/path/to/venv/bin/gunicorn portfolio_backend.wsgi:application -c gunicorn.conf.py
directory=/path/to/portfolio/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/portfolio/portfolio.log
```

### 6. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Monitoring & Logging
```bash
# Install monitoring tools
uv add sentry-sdk

# Add to settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

if not DEBUG:
    sentry_sdk.init(
        dsn="YOUR_SENTRY_DSN",
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        send_default_pii=True
    )

# Log rotation
# /etc/logrotate.d/portfolio
/var/log/portfolio/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        supervisorctl restart portfolio
    endscript
}
```

## 🔒 Security Hardening

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Fail2ban for SSH protection
sudo apt install fail2ban
```

### Regular Security Tasks
- [ ] Update dependencies monthly: `uv sync --upgrade`
- [ ] Review access logs weekly
- [ ] Monitor failed login attempts
- [ ] Backup database daily
- [ ] Update SSL certificates (automated)
- [ ] Security audit quarterly

## 📊 Performance Optimization

### Caching (Redis)
```bash
# Install Redis
sudo apt install redis-server

# Add to requirements
uv add django-redis

# Configure in settings.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

CACHE_TTL = 60 * 15  # 15 minutes

# Session storage
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
```

### Database Optimization
```python
# Add database indexes in models.py
class Skill(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    category = models.CharField(max_length=50, choices=SKILL_CATEGORIES, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['category', 'name']),
        ]
```

## 🔧 Maintenance Commands

```bash
# Health check
curl -f http://localhost:8000/api/health/ || exit 1

# Database backup
pg_dump portfolio_db > backup_$(date +%Y%m%d_%H%M%S).sql

# View logs
tail -f /var/log/portfolio/portfolio.log

# Restart services
sudo supervisorctl restart portfolio
sudo systemctl reload nginx

# Security scan
python security_test.py

# Performance test
ab -n 1000 -c 10 http://yourdomain.com/api/portfolio-data/
```

## 📈 Monitoring Endpoints

- Health: `https://yourdomain.com/api/health/`
- Admin: `https://yourdomain.com/admin/`
- API Docs: `https://yourdomain.com/api/`

## 🚨 Incident Response

### If Security Breach Detected:
1. Immediately change all passwords
2. Revoke all API tokens
3. Review access logs
4. Update all dependencies
5. Restore from clean backup if needed
6. Implement additional security measures

---

**Last Updated:** September 27, 2025  
**Next Review:** December 27, 2025
