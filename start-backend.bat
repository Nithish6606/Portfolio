@echo off
echo Starting Portfolio Backend on port 8000...
cd backend
uv run python manage.py runserver 8000
