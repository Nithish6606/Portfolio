from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'personal-info', views.PersonalInfoViewSet, basename='personalinfo')
router.register(r'skills', views.SkillViewSet)
router.register(r'experience', views.ExperienceViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'certifications', views.CertificationViewSet)
router.register(r'contact-messages', views.ContactMessageViewSet)

urlpatterns = [
    # Welcome page (root endpoint)
    path('', views.welcome_view, name='welcome'),
    
    # Include router URLs
    path('api/', include(router.urls)),
    
    # Authentication endpoints
    path('api/auth/login/', views.AdminLoginView.as_view(), name='auth-login'),
    path('api/auth/logout/', views.AdminLogoutView.as_view(), name='auth-logout'),
    path('api/auth/user/', views.CurrentUserView.as_view(), name='current-user'),
    
    # Custom API endpoints
    path('api/skills-by-category/', views.SkillsByCategoryView.as_view(), name='skills-by-category'),
    path('api/portfolio-data/', views.PortfolioDataView.as_view(), name='portfolio-data'),
    path('api/admin/login/', views.AdminLoginView.as_view(), name='admin-login'),
    path('api/admin/logout/', views.AdminLogoutView.as_view(), name='admin-logout'),
    path('api/admin/import/', views.PortfolioImportView.as_view(), name='portfolio-import'),
    path('api/admin/export/', views.export_portfolio_data, name='portfolio-export'),
    path('api/health/', views.health_check, name='health-check'),
    
    # Legacy endpoints for frontend compatibility
    path('api/data/', views.portfolio_data_legacy, name='portfolio-data-legacy'),
]
