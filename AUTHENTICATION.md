# Portfolio Authentication & Authorization System

## 🔐 Authentication Overview

The portfolio backend now includes a comprehensive authentication and authorization system with the following features:

### Authentication Methods
- **Token Authentication**: Primary method using Django REST Framework tokens
- **Session Authentication**: For web-based admin interface
- **Basic Authentication**: For development and testing

### Permission Levels
1. **Public Access**: Anyone can read portfolio data
2. **Authenticated Users**: Can perform specific operations
3. **Admin Users**: Full control over all content
4. **Superusers**: Complete system access

---

## 🚀 Quick Start

### 1. Admin Credentials
- **Username**: `admin`
- **Password**: Set during superuser creation
- **Email**: `admin@portfolio.com`

### 2. Testing Authentication
Open the admin test page: http://localhost:3000/admin-test.html

---

## 📋 API Endpoints

### Authentication Endpoints
```
POST /api/auth/login/     - Login and get token
POST /api/auth/logout/    - Logout and invalidate token
GET  /api/auth/user/      - Get current user info
```

### Portfolio Data Endpoints (with permissions)
```
GET    /api/personal-info/     - ✅ Public read access
POST   /api/personal-info/     - 🔒 Admin only
PUT    /api/personal-info/{id}/ - 🔒 Admin only
DELETE /api/personal-info/{id}/ - 🔒 Admin only

GET    /api/skills/            - ✅ Public read access
POST   /api/skills/            - 🔒 Admin only
PUT    /api/skills/{id}/       - 🔒 Admin only
DELETE /api/skills/{id}/       - 🔒 Admin only

GET    /api/experience/        - ✅ Public read access
POST   /api/experience/        - 🔒 Admin only
PUT    /api/experience/{id}/   - 🔒 Admin only
DELETE /api/experience/{id}/   - 🔒 Admin only

GET    /api/projects/          - ✅ Public read access
POST   /api/projects/          - 🔒 Admin only
PUT    /api/projects/{id}/     - 🔒 Admin only
DELETE /api/projects/{id}/     - 🔒 Admin only

GET    /api/certifications/    - ✅ Public read access
POST   /api/certifications/    - 🔒 Admin only
PUT    /api/certifications/{id}/ - 🔒 Admin only
DELETE /api/certifications/{id}/ - 🔒 Admin only

POST   /api/contact-messages/  - ✅ Anyone can send messages
GET    /api/contact-messages/  - 🔒 Admin only (view messages)
DELETE /api/contact-messages/{id}/ - 🔒 Admin only
```

---

## 🔑 Using Authentication

### 1. Frontend JavaScript (Token Authentication)
```javascript
// Login
const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'admin',
        password: 'your_password'
    })
});

const data = await response.json();
const token = data.token;

// Store token
localStorage.setItem('auth_token', token);

// Make authenticated requests
const authResponse = await fetch('http://127.0.0.1:8000/api/skills/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    },
    body: JSON.stringify({
        name: 'New Skill',
        category: 'tools',
        level: 'Advanced'
    })
});
```

### 2. cURL Examples
```bash
# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "password": "your_password"}'

# Use token for authenticated requests
curl -X POST http://127.0.0.1:8000/api/skills/ \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Token your_token_here" \\
  -d '{"name": "Docker", "category": "tools", "level": "Intermediate"}'
```

### 3. Python Requests
```python
import requests

# Login
login_response = requests.post('http://127.0.0.1:8000/api/auth/login/', json={
    'username': 'admin',
    'password': 'your_password'
})

token = login_response.json()['token']

# Make authenticated request
headers = {'Authorization': f'Token {token}'}
response = requests.post('http://127.0.0.1:8000/api/skills/', 
                        json={'name': 'Kubernetes', 'category': 'tools', 'level': 'Beginner'},
                        headers=headers)
```

---

## 🛡️ Security Features

### Rate Limiting
- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour

### CORS Configuration
- Allows requests from frontend ports (3000, 8080, 5500)
- Supports credentials for authentication

### Permission Classes
- **IsAdminOrReadOnly**: Admin can edit, everyone can read
- **ContactMessagePermission**: Anyone can create, only admin can view/manage
- **IsAuthenticated**: Requires valid authentication token

### Error Handling
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **400 Bad Request**: Invalid data or format

---

## 🧪 Testing Authentication

### 1. Manual Testing
Use the admin test page: http://localhost:3000/admin-test.html

### 2. API Testing Tools
- **Postman**: Import the API collection
- **Insomnia**: Use the REST client
- **curl**: Command line testing

### 3. Test Scenarios
1. **Read without auth** ✅ Should work for public endpoints
2. **Write without auth** ❌ Should return 401/403
3. **Login with valid credentials** ✅ Should return token
4. **Write with valid token** ✅ Should work for admin users
5. **Access with invalid token** ❌ Should return 401

---

## 🔧 Administration

### Creating Users
```bash
# Create superuser
cd backend
uv run python manage.py createsuperuser

# Create staff user
cd backend
uv run python manage.py shell
>>> from django.contrib.auth.models import User
>>> user = User.objects.create_user('editor', 'editor@portfolio.com', 'password')
>>> user.is_staff = True
>>> user.save()
```

### Managing Tokens
```bash
# View tokens
cd backend
uv run python manage.py shell
>>> from rest_framework.authtoken.models import Token
>>> Token.objects.all()

# Create token for user
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='admin')
>>> token = Token.objects.create(user=user)
>>> print(token.key)
```

---

## 📊 Monitoring & Logging

### Authentication Events
- Login attempts are logged
- Failed authentication is tracked
- Token usage is monitored

### API Usage
- Request rates are tracked
- Endpoint usage statistics
- Error rates and types

---

## 🚨 Important Notes

1. **Development vs Production**:
   - Current setup is for development
   - Use HTTPS in production
   - Set proper CORS origins in production

2. **Token Security**:
   - Tokens don't expire by default
   - Implement token rotation for production
   - Store tokens securely

3. **Admin Access**:
   - Only grant admin access to trusted users
   - Regular security audits recommended
   - Monitor admin actions

4. **Frontend Integration**:
   - Frontend automatically handles authentication
   - Fallback to localStorage when API unavailable
   - Seamless user experience

---

## 🎯 Next Steps

1. **Enhanced Security**:
   - Implement JWT tokens with expiration
   - Add two-factor authentication
   - Rate limiting per user

2. **User Management**:
   - User registration system
   - Role-based permissions
   - User profile management

3. **Audit Trail**:
   - Log all admin actions
   - Track data changes
   - Security monitoring

4. **API Documentation**:
   - Swagger/OpenAPI integration
   - Interactive API explorer
   - Automated testing
