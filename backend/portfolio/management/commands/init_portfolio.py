from django.core.management.base import BaseCommand
from portfolio.models import PersonalInfo, Skill, Experience, Project, Certification


class Command(BaseCommand):
    help = 'Initialize portfolio with default data from your current portfolio'

    def handle(self, *args, **options):
        self.stdout.write('Initializing portfolio with default data...')

        # Create personal info
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
        
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Personal info created'))
        else:
            self.stdout.write('✓ Personal info already exists')

        # Create skills
        skills_data = {
            'programmingLanguages': ['Python', 'Java', 'C', 'C++', 'SQL', 'Salesforce Apex'],
            'webTechnologies': ['HTML5', 'CSS3'],
            'frameworks': ['Flask', 'Fast API'],
            'databases': ['MySQL'],
            'technologies': ['Web Development', 'Machine Learning'],
            'tools': ['Visual Studio Code', 'Google Colab', 'Jupyter', 'PyCharm IDE', 'MySQL Workbench']
        }

        for category, skills in skills_data.items():
            for skill_name in skills:
                skill, created = Skill.objects.get_or_create(
                    name=skill_name,
                    category=category,
                    defaults={'proficiency': 80}
                )
                if created:
                    self.stdout.write(f'✓ Created skill: {skill_name} ({category})')

        # Create experience
        experience_data = [
            {
                'title': 'Salesforce Developer Virtual Internship',
                'company': 'SmartInternz, Hyderabad',
                'duration': 'Nov 2024 – Jan 2025',
                'description': 'Completed an 8-week virtual internship focused on Salesforce development. Engaged in various Salesforce Trailhead modules, including Salesforce Fundamentals, Organizational Setup, and Relationship & Process Automation. Achieved Super Badges in Apex Specialist, Process Automation Specialist, and Developer Super Set.',
                'order': 0
            },
            {
                'title': 'Artificial Intelligence Fundamentals',
                'company': 'IBM SkillsBuild',
                'duration': 'May 2024 – July 2024',
                'description': 'Demonstrated knowledge of AI concepts, including natural language processing, computer vision, machine learning, deep learning, chatbots, and neural networks. Gained an understanding of AI ethics and its applications across various industries. Developed a conceptual understanding of running AI models using IBM Watson Studio.',
                'order': 1
            }
        ]

        for exp_data in experience_data:
            experience, created = Experience.objects.get_or_create(
                title=exp_data['title'],
                company=exp_data['company'],
                defaults=exp_data
            )
            if created:
                self.stdout.write(f'✓ Created experience: {exp_data["title"]}')

        # Create projects
        projects_data = [
            {
                'title': 'Speech To ISL (Indian Sign Language) Translator',
                'description': 'An application designed to assist individuals with hearing impairments by recognizing speech and providing visual feedback through images and GIFs. Features include live voice recognition, translation of spoken language, and display of corresponding ISL GIFs or alphabet images.',
                'tech_stack': ['Python', 'SpeechRecognition', 'Googletrans', 'Tkinter', 'Matplotlib', 'Pillow', 'EasyGUI'],
                'order': 0,
                'is_featured': True
            },
            {
                'title': 'Fake Currency Detection',
                'description': 'An application for processing images of currency notes (500 rupee). It includes functions for resizing images, applying median filtering, converting to grayscale, edge detection, and adaptive thresholding for segmentation.',
                'tech_stack': ['Python', 'OpenCV', 'NumPy', 'Pickle'],
                'order': 1,
                'is_featured': True
            },
            {
                'title': 'URL Shortener Application',
                'description': 'A Flask web application that generates short URLs for long URLs. Includes functionality to handle GET and POST requests for the root page.',
                'tech_stack': ['Python', 'Flask', 'HTML', 'CSS'],
                'order': 2,
                'is_featured': False
            }
        ]

        for proj_data in projects_data:
            project, created = Project.objects.get_or_create(
                title=proj_data['title'],
                defaults=proj_data
            )
            if created:
                self.stdout.write(f'✓ Created project: {proj_data["title"]}')

        # Create certifications
        certifications_data = [
            'Certified in Github Foundations offered by Github',
            'Certified in Introduction to SQL offered by Simplilearn',
            'Elite grade certification in Internet of Things offered by IIT Kharagpur in NPTEL course',
            'Elite grade certification in Cloud Computing offered by IIT Kharagpur in NPTEL course',
            'Completed Developer Super Set offered by Salesforce'
        ]

        for i, cert_title in enumerate(certifications_data):
            certification, created = Certification.objects.get_or_create(
                title=cert_title,
                defaults={'order': i}
            )
            if created:
                self.stdout.write(f'✓ Created certification: {cert_title}')

        self.stdout.write(self.style.SUCCESS('\n🎉 Portfolio initialization completed successfully!'))
        self.stdout.write('You can now run the server and your portfolio data will be available via the API.')
