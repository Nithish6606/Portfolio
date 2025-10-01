#!/usr/bin/env python3
"""
Static files collection script for PythonAnywhere deployment
Run this script after uploading your Django project to PythonAnywhere
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to the Python path
project_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(project_dir))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')

# Setup Django
django.setup()

# Import Django management commands
from django.core.management import execute_from_command_line

def collect_static_files():
    """Collect all static files including Django admin CSS"""
    print("🔄 Collecting static files...")
    
    try:
        # Collect static files
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput', '--clear'])
        print("✅ Static files collected successfully!")
        
        # List collected files for verification
        staticfiles_dir = project_dir / 'staticfiles'
        if staticfiles_dir.exists():
            admin_dir = staticfiles_dir / 'admin'
            if admin_dir.exists():
                print(f"✅ Django admin static files found at: {admin_dir}")
                css_files = list(admin_dir.glob('**/*.css'))
                print(f"✅ Found {len(css_files)} CSS files for admin")
            else:
                print("⚠️  Django admin static files not found!")
        
    except Exception as e:
        print(f"❌ Error collecting static files: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🚀 PythonAnywhere Static Files Setup")
    print("=" * 40)
    
    if collect_static_files():
        print("\n✅ Setup completed successfully!")
        print("\nNext steps for PythonAnywhere:")
        print("1. Make sure your web app is configured with:")
        print("   - Static files URL: /static/")
        print("   - Static files directory: /home/Nithish6606/Portfolio/backend/staticfiles/")
        print("2. Reload your web app")
        print("3. Visit your admin panel to see the styling")
    else:
        print("\n❌ Setup failed. Please check the errors above.")

if __name__ == '__main__':
    main()
