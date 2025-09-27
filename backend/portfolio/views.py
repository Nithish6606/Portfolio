from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from collections import defaultdict
import json

from .models import (
    PersonalInfo, Skill, Experience, Project, 
    Certification, ContactMessage, PortfolioSettings
)
from .serializers import (
    PersonalInfoSerializer, SkillSerializer, SkillsByCategorySerializer,
    ExperienceSerializer, ProjectSerializer, CertificationSerializer,
    ContactMessageSerializer, PortfolioSettingsSerializer,
    PortfolioDataSerializer, AdminLoginSerializer, PortfolioImportSerializer
)


class PersonalInfoViewSet(viewsets.ModelViewSet):
    queryset = PersonalInfo.objects.all()
    serializer_class = PersonalInfoSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        # Always return the first (and ideally only) personal info record
        personal_info, created = PersonalInfo.objects.get_or_create(
            pk=1,
            defaults={
                'name': 'Mada Nithish Reddy',
                'title': 'Computer Science Engineer',
                'email': 'madanithishreddy@gmail.com',
                'phone': '+91 9704715088',
                'github': 'https://github.com/Nithish6606',
                'linkedin': 'https://linkedin.com/in/nithish-mada',
                'bio': 'Recent BTech Computer Science graduate passionate about web development, machine learning, and creating innovative solutions to real-world problems.',
            }
        )
        return personal_info


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        if category:
            return self.queryset.filter(category=category)
        return self.queryset


class SkillsByCategoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        skills = Skill.objects.all()
        skills_by_category = defaultdict(list)
        
        for skill in skills:
            skills_by_category[skill.category].append(skill.name)
        
        # Ensure all expected categories exist
        expected_categories = ['programmingLanguages', 'webTechnologies', 'frameworks', 
                              'databases', 'technologies', 'tools']
        for category in expected_categories:
            if category not in skills_by_category:
                skills_by_category[category] = []
        
        return Response(dict(skills_by_category))


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        featured_only = self.request.query_params.get('featured', None)
        if featured_only and featured_only.lower() == 'true':
            return self.queryset.filter(is_featured=True)
        return self.queryset


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [AllowAny]


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Anyone can create a contact message
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        # Only authenticated users can list messages
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        return super().list(request, *args, **kwargs)


class PortfolioDataView(APIView):
    """API endpoint to get complete portfolio data in the format expected by frontend"""
    permission_classes = [AllowAny]

    def get(self, request):
        # Get personal info
        personal_info, _ = PersonalInfo.objects.get_or_create(pk=1)
        
        # Get skills by category
        skills = Skill.objects.all()
        skills_by_category = defaultdict(list)
        for skill in skills:
            skills_by_category[skill.category].append(skill.name)
        
        # Ensure all expected categories exist
        expected_categories = ['programmingLanguages', 'webTechnologies', 'frameworks', 
                              'databases', 'technologies', 'tools']
        for category in expected_categories:
            if category not in skills_by_category:
                skills_by_category[category] = []

        # Get experience
        experience = Experience.objects.all()
        
        # Get projects
        projects = Project.objects.all()
        
        # Get certifications as simple list of titles
        certifications = list(Certification.objects.values_list('title', flat=True))

        data = {
            'personalInfo': PersonalInfoSerializer(personal_info).data,
            'skills': dict(skills_by_category),
            'experience': ExperienceSerializer(experience, many=True).data,
            'projects': ProjectSerializer(projects, many=True).data,
            'certifications': certifications,
        }
        
        return Response(data)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            # Set session to indicate admin is logged in
            request.session['is_admin'] = True
            return Response({'message': 'Login successful', 'isAdmin': True})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        request.session.pop('is_admin', None)
        return Response({'message': 'Logout successful', 'isAdmin': False})


class PortfolioImportView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Check if user is admin
        if not request.session.get('is_admin', False):
            return Response({'detail': 'Admin access required'}, 
                          status=status.HTTP_401_UNAUTHORIZED)

        serializer = PortfolioImportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                data = serializer.validated_data
                
                # Update personal info
                personal_info, _ = PersonalInfo.objects.get_or_create(pk=1)
                for field, value in data['personalInfo'].items():
                    setattr(personal_info, field, value)
                personal_info.save()

                # Clear and recreate skills
                Skill.objects.all().delete()
                for category, skills in data['skills'].items():
                    for skill_name in skills:
                        Skill.objects.create(name=skill_name, category=category)

                # Clear and recreate experience
                Experience.objects.all().delete()
                for i, exp_data in enumerate(data['experience']):
                    Experience.objects.create(
                        title=exp_data['title'],
                        company=exp_data['company'],
                        duration=exp_data['duration'],
                        description=exp_data['description'],
                        order=i
                    )

                # Clear and recreate projects
                Project.objects.all().delete()
                for i, proj_data in enumerate(data['projects']):
                    Project.objects.create(
                        title=proj_data['title'],
                        description=proj_data['description'],
                        tech_stack=proj_data.get('techStack', []),
                        github_url=proj_data.get('github_url', ''),
                        live_url=proj_data.get('live_url', ''),
                        order=i
                    )

                # Clear and recreate certifications
                Certification.objects.all().delete()
                for i, cert_title in enumerate(data['certifications']):
                    Certification.objects.create(title=cert_title, order=i)

            return Response({'message': 'Portfolio data imported successfully'})
            
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def export_portfolio_data(request):
    """Export portfolio data as JSON"""
    if not request.session.get('is_admin', False):
        return Response({'detail': 'Admin access required'}, 
                       status=status.HTTP_401_UNAUTHORIZED)
    
    view = PortfolioDataView()
    response = view.get(request)
    
    return Response({
        'filename': 'portfolio-data.json',
        'data': response.data
    })


# Health check endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'healthy', 'message': 'Portfolio API is running'})


# Legacy endpoint for frontend compatibility
@api_view(['GET'])
@permission_classes([AllowAny])
def portfolio_data_legacy(request):
    """Legacy endpoint to maintain compatibility with existing frontend"""
    view = PortfolioDataView()
    return view.get(request)


# Frontend serving views
def serve_frontend(request):
    """Serve the main portfolio HTML file"""
    import os
    from django.http import FileResponse, Http404
    from django.conf import settings
    
    # Path to the frontend files (parent directory of backend)
    frontend_path = os.path.join(settings.FRONTEND_ROOT, 'index.html')
    
    if os.path.exists(frontend_path):
        return FileResponse(open(frontend_path, 'rb'), content_type='text/html')
    else:
        raise Http404("Portfolio frontend not found")


def serve_frontend_assets(request, path):
    """Serve frontend static assets (CSS, JS, images)"""
    import os
    from django.http import FileResponse, Http404
    from django.conf import settings
    import mimetypes
    
    # Path to the requested file
    file_path = os.path.join(settings.FRONTEND_ROOT, path)
    
    if os.path.exists(file_path) and os.path.isfile(file_path):
        # Get the correct MIME type
        content_type, _ = mimetypes.guess_type(file_path)
        if content_type is None:
            content_type = 'application/octet-stream'
        
        return FileResponse(open(file_path, 'rb'), content_type=content_type)
    else:
        raise Http404(f"File not found: {path}")
