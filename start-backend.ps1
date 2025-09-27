Write-Host "Starting Portfolio Backend on port 8000..." -ForegroundColor Green
Set-Location backend
uv run python manage.py runserver 8000
