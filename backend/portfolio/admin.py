from django.contrib import admin
from .models import (
    PersonalInfo, Skill, Experience, Project, 
    Certification, ContactMessage, PortfolioSettings
)


@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'email', 'updated_at']
    fields = ['name', 'title', 'email', 'phone', 'github', 'linkedin', 'bio']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'created_at']
    list_filter = ['category']
    search_fields = ['name']
    ordering = ['category', 'name']


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'duration', 'order', 'created_at']
    list_editable = ['order']
    ordering = ['order', '-created_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'order', 'created_at']
    list_filter = ['is_featured']
    list_editable = ['is_featured', 'order']
    search_fields = ['title', 'description']
    ordering = ['order', '-created_at']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'issuer', 'issue_date', 'order', 'created_at']
    list_editable = ['order']
    search_fields = ['title', 'issuer']
    ordering = ['order', '-created_at']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    ordering = ['-created_at']

    def has_add_permission(self, request):
        return False


@admin.register(PortfolioSettings)
class PortfolioSettingsAdmin(admin.ModelAdmin):
    list_display = ['theme', 'maintenance_mode', 'last_backup', 'updated_at']
    fields = ['theme', 'maintenance_mode']

    def has_add_permission(self, request):
        return not PortfolioSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
