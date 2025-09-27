from django.db import models
from django.contrib.auth.models import User
import json


class PersonalInfo(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    github = models.URLField()
    linkedin = models.URLField()
    bio = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Personal Information"
        verbose_name_plural = "Personal Information"

    def __str__(self):
        return self.name


class Skill(models.Model):
    SKILL_CATEGORIES = [
        ('programmingLanguages', 'Programming Languages'),
        ('webTechnologies', 'Web Technologies'),
        ('frameworks', 'Frameworks'), 
        ('databases', 'Databases'),
        ('technologies', 'Technologies'),
        ('tools', 'Tools'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=SKILL_CATEGORIES)
    proficiency = models.IntegerField(default=80, help_text="Proficiency level (0-100)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['name', 'category']
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Experience(models.Model):
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    description = models.TextField()
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.title} at {self.company}"


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    tech_stack = models.JSONField(default=list, help_text="List of technologies used")
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    @property
    def tech_stack_display(self):
        """Return tech stack as comma-separated string for easier display"""
        if isinstance(self.tech_stack, list):
            return ', '.join(self.tech_stack)
        return str(self.tech_stack)


class Certification(models.Model):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=100, blank=True)
    issue_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


class PortfolioSettings(models.Model):
    """Global settings for the portfolio"""
    theme = models.CharField(max_length=20, default='light', choices=[
        ('light', 'Light'),
        ('dark', 'Dark'),
    ])
    maintenance_mode = models.BooleanField(default=False)
    admin_password_hash = models.CharField(max_length=256, blank=True)
    last_backup = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Portfolio Settings"
        verbose_name_plural = "Portfolio Settings"

    def save(self, *args, **kwargs):
        # Ensure only one settings instance exists
        if not self.pk and PortfolioSettings.objects.exists():
            raise ValueError('Only one PortfolioSettings instance is allowed')
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Get or create the portfolio settings instance"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def __str__(self):
        return "Portfolio Settings"
