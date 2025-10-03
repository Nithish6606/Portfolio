# Environment Variables Setup Guide

This guide explains how to set up environment variables for different deployment platforms.

## 📁 Files Created

- `.env` - Development environment variables
- `.env.production` - Production environment variables  
- `.env.template` - Template file with examples
- `env-config.js` - Runtime configuration loader

## 🔧 How It Works

The application now uses environment variables to determine the backend API URL:

1. **Build-time variables** (Webpack/Vite/Parcel)
2. **Runtime configuration** (window.ENV)
3. **Meta tag configuration** (server-side rendered)
4. **Fallback detection** (based on hostname)

## 🚀 Deployment Instructions

### GitHub Pages

1. **Option A: GitHub Actions (Recommended)**
   ```yaml
   # .github/workflows/deploy.yml
   - name: Deploy to GitHub Pages
     env:
       REACT_APP_API_URL: https://Nithish6606.pythonanywhere.com/api
     run: |
       npm run build
       npm run deploy
   ```

2. **Option B: Manual Build**
   ```bash
   # Set environment variable before build
   $env:REACT_APP_API_URL="https://Nithish6606.pythonanywhere.com/api"
   npm run build
   ```

### Netlify

1. **Environment Variables in Dashboard:**
   - Go to Site Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://Nithish6606.pythonanywhere.com/api`

2. **netlify.toml (optional):**
   ```toml
   [build.environment]
     REACT_APP_API_URL = "https://Nithish6606.pythonanywhere.com/api"
   ```

### Vercel

1. **Environment Variables in Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://Nithish6606.pythonanywhere.com/api`

2. **vercel.json (optional):**
   ```json
   {
     "env": {
       "REACT_APP_API_URL": "https://Nithish6606.pythonanywhere.com/api"
     }
   }
   ```

### Local Development

1. **Copy environment file:**
   ```bash
   cp .env.template .env
   ```

2. **Edit `.env` file:**
   ```env
   API_URL=http://127.0.0.1:8000/api
   REACT_APP_API_URL=http://127.0.0.1:8000/api
   ```

## 🔒 Security Benefits

- ✅ API URLs not visible in source code
- ✅ Different URLs for different environments
- ✅ Easy to change without code modifications
- ✅ Environment-specific configurations
- ✅ Fallback mechanisms for reliability

## 🛠️ Usage Examples

### For React/Webpack Projects
```bash
# Development
REACT_APP_API_URL=http://localhost:8000/api npm start

# Production build
REACT_APP_API_URL=https://your-api.com/api npm run build
```

### For Static HTML Projects
The `env-config.js` file automatically detects the environment and sets appropriate URLs.

### For Server-Side Rendered Projects
Set the meta tag in your HTML:
```html
<meta name="api-url" content="https://your-api.com/api">
```

## 🔍 Debugging

To check which API URL is being used:
```javascript
console.log('Current API URL:', API_BASE_URL);
console.log('Environment Config:', window.ENV);
```

## 📝 Notes

- Environment files (`.env*`) are in `.gitignore` for security
- Template files are committed to help team setup
- Multiple fallback mechanisms ensure reliability
- Works with both build-time and runtime configuration