from rest_framework import serializers
from .models import PersonalInfo, Skill, Experience, Project, Certification, ContactMessage, PortfolioSettings


class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInfo
        fields = ['id', 'name', 'title', 'email', 'phone', 'github', 'linkedin', 'bio', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'proficiency', 'created_at']
        read_only_fields = ['id', 'created_at']


class SkillsByCategorySerializer(serializers.Serializer):
    """Serializer to return skills grouped by category"""
    programmingLanguages = serializers.ListField(child=serializers.CharField(), read_only=True)
    webTechnologies = serializers.ListField(child=serializers.CharField(), read_only=True)
    frameworks = serializers.ListField(child=serializers.CharField(), read_only=True)
    databases = serializers.ListField(child=serializers.CharField(), read_only=True)
    technologies = serializers.ListField(child=serializers.CharField(), read_only=True)
    tools = serializers.ListField(child=serializers.CharField(), read_only=True)


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'title', 'company', 'duration', 'description', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    tech_stack_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'tech_stack', 'tech_stack_display', 
                 'github_url', 'live_url', 'image', 'order', 'is_featured', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'tech_stack_display', 'created_at', 'updated_at']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issuer', 'issue_date', 'credential_id', 
                 'credential_url', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'is_read', 'created_at']


class PortfolioSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioSettings
        fields = ['id', 'theme', 'maintenance_mode', 'last_backup', 'created_at', 'updated_at']
        read_only_fields = ['id', 'last_backup', 'created_at', 'updated_at']


class PortfolioDataSerializer(serializers.Serializer):
    """Serializer for complete portfolio data export/import"""
    personalInfo = PersonalInfoSerializer(read_only=True)
    skills = SkillsByCategorySerializer(read_only=True)
    experience = ExperienceSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    certifications = serializers.ListField(child=serializers.CharField(), read_only=True)


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        """Validate username and password"""
        username = attrs.get('username')
        password = attrs.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("Username and password are required")
        
        return attrs


class PortfolioImportSerializer(serializers.Serializer):
    """Serializer for importing portfolio data"""
    personalInfo = serializers.DictField()
    skills = serializers.DictField()
    experience = serializers.ListField(child=serializers.DictField())
    projects = serializers.ListField(child=serializers.DictField())
    certifications = serializers.ListField(child=serializers.CharField())
    
    def validate_personalInfo(self, value):
        required_fields = ['name', 'title', 'email', 'phone', 'github', 'linkedin', 'bio']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        return value
    
    def validate_skills(self, value):
        expected_categories = ['programmingLanguages', 'webTechnologies', 'frameworks', 
                              'databases', 'technologies', 'tools']
        for category in expected_categories:
            if category not in value:
                value[category] = []
        return value
