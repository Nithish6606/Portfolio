// Portfolio Application JavaScript

// Default portfolio data
const DEFAULT_DATA = {
  personalInfo: {
    name: "Mada Nithish Reddy",
    title: "Computer Science Engineer",
    email: "madanithishreddy@gmail.com",
    phone: "+91 9704715088",
    github: "https://github.com/Nithish6606",
    linkedin: "https://linkedin.com/in/nithish-mada",
    bio: "Recent BTech Computer Science graduate passionate about web development, machine learning, and creating innovative solutions to real-world problems."
  },
  skills: {
    programmingLanguages: ["Python", "Java", "C", "C++", "SQL", "Salesforce Apex"],
    webTechnologies: ["HTML5", "CSS3"],
    frameworks: ["Flask", "Fast API"],
    databases: ["MySQL"],
    technologies: ["Web Development", "Machine Learning"],
    tools: ["Visual Studio Code", "Google Colab", "Jupyter", "PyCharm IDE", "MySQL Workbench"]
  },
  experience: [
    {
      title: "Salesforce Developer Virtual Internship",
      company: "SmartInternz, Hyderabad",
      duration: "Nov 2024 – Jan 2025",
      description: "Completed an 8-week virtual internship focused on Salesforce development. Engaged in various Salesforce Trailhead modules, including Salesforce Fundamentals, Organizational Setup, and Relationship & Process Automation. Achieved Super Badges in Apex Specialist, Process Automation Specialist, and Developer Super Set."
    },
    {
      title: "Artificial Intelligence Fundamentals",
      company: "IBM SkillsBuild",
      duration: "May 2024 – July 2024",
      description: "Demonstrated knowledge of AI concepts, including natural language processing, computer vision, machine learning, deep learning, chatbots, and neural networks. Gained an understanding of AI ethics and its applications across various industries. Developed a conceptual understanding of running AI models using IBM Watson Studio."
    }
  ],
  projects: [
    {
      title: "Speech To ISL (Indian Sign Language) Translator",
      description: "An application designed to assist individuals with hearing impairments by recognizing speech and providing visual feedback through images and GIFs. Features include live voice recognition, translation of spoken language, and display of corresponding ISL GIFs or alphabet images.",
      techStack: ["Python", "SpeechRecognition", "Googletrans", "Tkinter", "Matplotlib", "Pillow", "EasyGUI"],
      links: []
    },
    {
      title: "Fake Currency Detection",
      description: "An application for processing images of currency notes (500 rupee). It includes functions for resizing images, applying median filtering, converting to grayscale, edge detection, and adaptive thresholding for segmentation.",
      techStack: ["Python", "OpenCV", "NumPy", "Pickle"],
      links: []
    },
    {
      title: "URL Shortener Application",
      description: "A Flask web application that generates short URLs for long URLs. Includes functionality to handle GET and POST requests for the root page.",
      techStack: ["Python", "Flask", "HTML", "CSS"],
      links: []
    }
  ],
  certifications: [
    "Certified in Github Foundations offered by Github",
    "Certified in Introduction to SQL offered by Simplilearn",
    "Elite grade certification in Internet of Things offered by IIT Kharagpur in NPTEL course",
    "Elite grade certification in Cloud Computing offered by IIT Kharagpur in NPTEL course",
    "Completed Developer Super Set offered by Salesforce"
  ]
};

// Application state
let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || DEFAULT_DATA;
let isAdminLoggedIn = false;
const ADMIN_PASSWORD = 'admin123';

// DOM Elements
const loadingScreen = document.getElementById('loading');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const portfolioContent = document.getElementById('portfolio-content');
const notification = document.getElementById('notification');

// Admin panel elements (will be null if not in HTML)
const adminPanel = document.getElementById('admin-panel');
const adminLogin = document.getElementById('admin-login');
const adminDashboard = document.getElementById('admin-dashboard');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Hide loading screen immediately
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }

  // Initialize portfolio content
  loadPortfolioData();
  
  // Set up event listeners
  setupEventListeners();
  
  // Handle routing
  handleRouting();
}

function setupEventListeners() {
  // Theme toggle
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  
  // Mobile navigation
  if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
  
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', handleContactForm);
  
  // Experience management
  const addExperienceBtn = document.getElementById('add-experience');
  if (addExperienceBtn) addExperienceBtn.addEventListener('click', addNewExperience);
  
  // Project management
  const addProjectBtn = document.getElementById('add-project');
  if (addProjectBtn) addProjectBtn.addEventListener('click', addNewProject);
  
  // Certification management
  const addCertificationBtn = document.getElementById('add-certification-btn');
  if (addCertificationBtn) addCertificationBtn.addEventListener('click', addNewCertification);
  
  // Notification close
  const notificationClose = document.getElementById('notification-close');
  if (notificationClose) notificationClose.addEventListener('click', hideNotification);
  
  // Window hash change
  window.addEventListener('hashchange', handleRouting);
  
  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') !== '#admin') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

function handleRouting() {
  const hash = window.location.hash.slice(1) || 'home';
  
  if (hash === 'admin') {
    showAdminPanel();
  } else {
    hideAdminPanel();
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${hash}`) {
        link.classList.add('active');
      }
    });
  }
}

function loadPortfolioData() {
  const data = portfolioData;
  
  // Load personal info
  document.getElementById('hero-name').textContent = data.personalInfo.name;
  document.getElementById('hero-title').textContent = data.personalInfo.title;
  document.getElementById('hero-bio').textContent = data.personalInfo.bio;
  document.getElementById('hero-github').href = data.personalInfo.github;
  document.getElementById('hero-linkedin').href = data.personalInfo.linkedin;
  document.getElementById('hero-email').href = `mailto:${data.personalInfo.email}`;
  
  document.getElementById('about-name').textContent = data.personalInfo.name;
  document.getElementById('about-bio').textContent = data.personalInfo.bio;
  document.getElementById('about-email').textContent = data.personalInfo.email;
  document.getElementById('about-phone').textContent = data.personalInfo.phone;
  
  document.getElementById('contact-email').textContent = data.personalInfo.email;
  document.getElementById('contact-phone').textContent = data.personalInfo.phone;
  document.getElementById('contact-github').href = data.personalInfo.github;
  document.getElementById('contact-linkedin').href = data.personalInfo.linkedin;
  
  document.getElementById('brand-link').textContent = data.personalInfo.name.split(' ')[0] + ' ' + data.personalInfo.name.split(' ')[data.personalInfo.name.split(' ').length - 1];
  
  // Load skills
  loadSkills();
  
  // Load experience
  loadExperience();
  
  // Load projects
  loadProjects();
  
  // Load certifications
  loadCertifications();
}

function loadSkills() {
  const skillsGrid = document.getElementById('skills-grid');
  skillsGrid.innerHTML = '';
  
  const skillCategories = [
    { name: 'Programming Languages', key: 'programmingLanguages' },
    { name: 'Web Technologies', key: 'webTechnologies' },
    { name: 'Frameworks', key: 'frameworks' },
    { name: 'Databases', key: 'databases' },
    { name: 'Technologies', key: 'technologies' },
    { name: 'Tools', key: 'tools' }
  ];
  
  skillCategories.forEach(category => {
    const skills = portfolioData.skills[category.key] || [];
    if (skills.length > 0) {
      const skillCategory = document.createElement('div');
      skillCategory.className = 'skill-category';
      skillCategory.innerHTML = `
        <h3>${category.name}</h3>
        <div class="skill-tags">
          ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      `;
      skillsGrid.appendChild(skillCategory);
    }
  });
}

function loadExperience() {
  const timeline = document.getElementById('experience-timeline');
  timeline.innerHTML = '';
  
  portfolioData.experience.forEach(exp => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <div class="timeline-content">
        <h3 class="experience-title">${exp.title}</h3>
        <h4 class="experience-company">${exp.company}</h4>
        <p class="experience-duration">${exp.duration}</p>
        <p class="experience-description">${exp.description}</p>
      </div>
      <div class="timeline-dot"></div>
    `;
    timeline.appendChild(timelineItem);
  });
}

function loadProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = '';
  
  portfolioData.projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="tech-stack">
          ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        ${project.links && project.links.length > 0 ? `
          <div class="project-links">
            ${project.links.map(link => `<a href="${link.url}" target="_blank" class="project-link">${link.label}</a>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    projectsGrid.appendChild(projectCard);
  });
}

function loadCertifications() {
  const certificationsList = document.getElementById('certifications-list');
  certificationsList.innerHTML = '';
  
  portfolioData.certifications.forEach(cert => {
    const certItem = document.createElement('div');
    certItem.className = 'certification-item';
    certItem.textContent = cert;
    certificationsList.appendChild(certItem);
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  
  localStorage.setItem('theme', newTheme);
}

function toggleMobileNav() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
}

function handleNavClick(e) {
  if (window.innerWidth <= 768) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
}

function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };
  
  // Simulate form submission
  showNotification('Message sent successfully! (This is a demo)', 'success');
  e.target.reset();
}

// Admin Panel Functions
function showAdminPanel() {
  if (portfolioContent) portfolioContent.style.display = 'none';
  if (adminPanel) adminPanel.classList.remove('hidden');
  
  if (!isAdminLoggedIn) {
    if (adminLogin) adminLogin.classList.remove('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
  } else {
    if (adminLogin) adminLogin.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    loadAdminData();
  }
}

function hideAdminPanel() {
  if (portfolioContent) portfolioContent.style.display = 'block';
  if (adminPanel) adminPanel.classList.add('hidden');
}

function handleAdminLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('admin-password').value;
  
  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    if (adminLogin) adminLogin.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    loadAdminData();
    showNotification('Admin login successful!', 'success');
  } else {
    showNotification('Invalid password!', 'error');
  }
}

function adminLogout() {
  isAdminLoggedIn = false;
  window.location.hash = 'home';
}

function handleAdminNav(e) {
  const section = e.target.dataset.section;
  
  // Update active nav button
  document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // Show corresponding section
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(`admin-${section}`).classList.add('active');
}

function loadAdminData() {
  // Load personal info form
  const personalForm = document.getElementById('personal-form');
  if (personalForm) {
    if (personalForm.elements['edit-name']) personalForm.elements['edit-name'].value = portfolioData.personalInfo.name;
    if (personalForm.elements['edit-title']) personalForm.elements['edit-title'].value = portfolioData.personalInfo.title;
    if (personalForm.elements['edit-email']) personalForm.elements['edit-email'].value = portfolioData.personalInfo.email;
    if (personalForm.elements['edit-phone']) personalForm.elements['edit-phone'].value = portfolioData.personalInfo.phone;
    if (personalForm.elements['edit-github']) personalForm.elements['edit-github'].value = portfolioData.personalInfo.github;
    if (personalForm.elements['edit-linkedin']) personalForm.elements['edit-linkedin'].value = portfolioData.personalInfo.linkedin;
    if (personalForm.elements['edit-bio']) personalForm.elements['edit-bio'].value = portfolioData.personalInfo.bio;
  }
  
  // Load skills admin
  loadSkillsAdmin();
  
  // Load experience admin
  loadExperienceAdmin();
  
  // Load projects admin
  loadProjectsAdmin();
  
  // Load certifications admin
  loadCertificationsAdmin();
}

function loadSkillsAdmin() {
  const skillCategories = {
    'programming': { name: 'Programming Languages', key: 'programmingLanguages' },
    'web': { name: 'Web Technologies', key: 'webTechnologies' },
    'framework': { name: 'Frameworks', key: 'frameworks' },
    'tool': { name: 'Tools', key: 'tools' }
  };
  
  Object.entries(skillCategories).forEach(([id, category]) => {
    const container = document.getElementById(`${id}-skills`);
    if (container) {
      container.innerHTML = '';
      
      const skills = portfolioData.skills[category.key] || [];
      skills.forEach((skill, index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
          <span>${skill}</span>
          <button class="skill-remove" onclick="removeSkill('${category.key}', ${index})">×</button>
        `;
        container.appendChild(skillItem);
      });
    }
  });
}

function addSkill(categoryKey) {
  const inputMap = {
    'programmingLanguages': 'new-programming-skill',
    'webTechnologies': 'new-web-skill',
    'frameworks': 'new-framework-skill',
    'tools': 'new-tool-skill'
  };
  
  const input = document.getElementById(inputMap[categoryKey]);
  const skillName = input.value.trim();
  
  if (skillName) {
    if (!portfolioData.skills[categoryKey]) {
      portfolioData.skills[categoryKey] = [];
    }
    portfolioData.skills[categoryKey].push(skillName);
    saveData();
    loadSkillsAdmin();
    loadSkills();
    input.value = '';
    showNotification('Skill added successfully!', 'success');
  }
}

function removeSkill(categoryKey, index) {
  portfolioData.skills[categoryKey].splice(index, 1);
  saveData();
  loadSkillsAdmin();
  loadSkills();
  showNotification('Skill removed successfully!', 'success');
}

function updatePersonalInfo(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  portfolioData.personalInfo = {
    name: formData.get('edit-name'),
    title: formData.get('edit-title'),
    email: formData.get('edit-email'),
    phone: formData.get('edit-phone'),
    github: formData.get('edit-github'),
    linkedin: formData.get('edit-linkedin'),
    bio: formData.get('edit-bio')
  };
  
  saveData();
  loadPortfolioData();
  showNotification('Personal information updated successfully!', 'success');
}

function loadExperienceAdmin() {
  const experienceList = document.getElementById('experience-list');
  if (!experienceList) return;
  experienceList.innerHTML = '';
  
  portfolioData.experience.forEach((exp, index) => {
    const expItem = document.createElement('div');
    expItem.className = 'experience-item';
    expItem.innerHTML = `
      <div class="item-header">
        <h3>${exp.title}</h3>
        <div class="item-actions">
          <button class="btn btn--outline btn--sm" onclick="editExperience(${index})">Edit</button>
          <button class="btn btn--secondary btn--sm" onclick="removeExperience(${index})">Delete</button>
        </div>
      </div>
      <div id="exp-display-${index}">
        <p><strong>Company:</strong> ${exp.company}</p>
        <p><strong>Duration:</strong> ${exp.duration}</p>
        <p><strong>Description:</strong> ${exp.description}</p>
      </div>
      <div id="exp-edit-${index}" class="hidden">
        <form onsubmit="updateExperience(event, ${index})">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Job Title</label>
              <input type="text" name="title" value="${exp.title}" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label">Company</label>
              <input type="text" name="company" value="${exp.company}" class="form-control" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Duration</label>
            <input type="text" name="duration" value="${exp.duration}" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="4" required>${exp.description}</textarea>
          </div>
          <div class="flex gap-8">
            <button type="submit" class="btn btn--primary btn--sm">Save</button>
            <button type="button" class="btn btn--outline btn--sm" onclick="cancelEditExperience(${index})">Cancel</button>
          </div>
        </form>
      </div>
    `;
    experienceList.appendChild(expItem);
  });
}

function addNewExperience() {
  const newExp = {
    title: 'New Position',
    company: 'Company Name',
    duration: 'Start Date - End Date',
    description: 'Job description here...'
  };
  
  portfolioData.experience.unshift(newExp);
  saveData();
  loadExperienceAdmin();
  loadExperience();
  showNotification('New experience added! Please edit the details.', 'success');
}

function editExperience(index) {
  document.getElementById(`exp-display-${index}`).classList.add('hidden');
  document.getElementById(`exp-edit-${index}`).classList.remove('hidden');
}

function cancelEditExperience(index) {
  document.getElementById(`exp-display-${index}`).classList.remove('hidden');
  document.getElementById(`exp-edit-${index}`).classList.add('hidden');
}

function updateExperience(e, index) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  portfolioData.experience[index] = {
    title: formData.get('title'),
    company: formData.get('company'),
    duration: formData.get('duration'),
    description: formData.get('description')
  };
  
  saveData();
  loadExperienceAdmin();
  loadExperience();
  showNotification('Experience updated successfully!', 'success');
}

function removeExperience(index) {
  if (confirm('Are you sure you want to delete this experience?')) {
    portfolioData.experience.splice(index, 1);
    saveData();
    loadExperienceAdmin();
    loadExperience();
    showNotification('Experience deleted successfully!', 'success');
  }
}

function loadProjectsAdmin() {
  const projectList = document.getElementById('project-list');
  if (!projectList) return;
  projectList.innerHTML = '';
  
  portfolioData.projects.forEach((project, index) => {
    const projItem = document.createElement('div');
    projItem.className = 'project-item';
    projItem.innerHTML = `
      <div class="item-header">
        <h3>${project.title}</h3>
        <div class="item-actions">
          <button class="btn btn--outline btn--sm" onclick="editProject(${index})">Edit</button>
          <button class="btn btn--secondary btn--sm" onclick="removeProject(${index})">Delete</button>
        </div>
      </div>
      <div id="proj-display-${index}">
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Tech Stack:</strong> ${project.techStack.join(', ')}</p>
      </div>
      <div id="proj-edit-${index}" class="hidden">
        <form onsubmit="updateProject(event, ${index})">
          <div class="form-group">
            <label class="form-label">Project Title</label>
            <input type="text" name="title" value="${project.title}" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="4" required>${project.description}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Tech Stack (comma-separated)</label>
            <input type="text" name="techStack" value="${project.techStack.join(', ')}" class="form-control" required>
          </div>
          <div class="flex gap-8">
            <button type="submit" class="btn btn--primary btn--sm">Save</button>
            <button type="button" class="btn btn--outline btn--sm" onclick="cancelEditProject(${index})">Cancel</button>
          </div>
        </form>
      </div>
    `;
    projectList.appendChild(projItem);
  });
}

function addNewProject() {
  const newProject = {
    title: 'New Project',
    description: 'Project description here...',
    techStack: ['Technology1', 'Technology2'],
    links: []
  };
  
  portfolioData.projects.unshift(newProject);
  saveData();
  loadProjectsAdmin();
  loadProjects();
  showNotification('New project added! Please edit the details.', 'success');
}

function editProject(index) {
  document.getElementById(`proj-display-${index}`).classList.add('hidden');
  document.getElementById(`proj-edit-${index}`).classList.remove('hidden');
}

function cancelEditProject(index) {
  document.getElementById(`proj-display-${index}`).classList.remove('hidden');
  document.getElementById(`proj-edit-${index}`).classList.add('hidden');
}

function updateProject(e, index) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const techStack = formData.get('techStack').split(',').map(tech => tech.trim()).filter(tech => tech);
  
  portfolioData.projects[index] = {
    title: formData.get('title'),
    description: formData.get('description'),
    techStack: techStack,
    links: portfolioData.projects[index].links || []
  };
  
  saveData();
  loadProjectsAdmin();
  loadProjects();
  showNotification('Project updated successfully!', 'success');
}

function removeProject(index) {
  if (confirm('Are you sure you want to delete this project?')) {
    portfolioData.projects.splice(index, 1);
    saveData();
    loadProjectsAdmin();
    loadProjects();
    showNotification('Project deleted successfully!', 'success');
  }
}

function loadCertificationsAdmin() {
  const certificationList = document.getElementById('certification-list');
  if (!certificationList) return;
  certificationList.innerHTML = '';
  
  portfolioData.certifications.forEach((cert, index) => {
    const certItem = document.createElement('div');
    certItem.className = 'certification-item';
    certItem.innerHTML = `
      <div class="item-header">
        <span>${cert}</span>
        <button class="btn btn--secondary btn--sm" onclick="removeCertification(${index})">Delete</button>
      </div>
    `;
    certificationList.appendChild(certItem);
  });
}

function addNewCertification() {
  const input = document.getElementById('new-certification');
  const certName = input.value.trim();
  
  if (certName) {
    portfolioData.certifications.push(certName);
    saveData();
    loadCertificationsAdmin();
    loadCertifications();
    input.value = '';
    showNotification('Certification added successfully!', 'success');
  }
}

function removeCertification(index) {
  if (confirm('Are you sure you want to delete this certification?')) {
    portfolioData.certifications.splice(index, 1);
    saveData();
    loadCertificationsAdmin();
    loadCertifications();
    showNotification('Certification deleted successfully!', 'success');
  }
}

function saveData() {
  localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

function exportData() {
  const dataStr = JSON.stringify(portfolioData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolio-data.json';
  link.click();
  
  URL.revokeObjectURL(url);
  showNotification('Data exported successfully!', 'success');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedData = JSON.parse(event.target.result);
      
      // Validate imported data structure
      if (importedData.personalInfo && importedData.skills && 
          importedData.experience && importedData.projects && 
          importedData.certifications) {
        
        portfolioData = importedData;
        saveData();
        loadPortfolioData();
        loadAdminData();
        showNotification('Data imported successfully!', 'success');
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      showNotification('Error importing data. Please check the file format.', 'error');
    }
  };
  
  reader.readAsText(file);
  e.target.value = ''; // Reset file input
}

function showNotification(message, type = 'success') {
  const notificationMessage = document.getElementById('notification-message');
  if (notificationMessage) notificationMessage.textContent = message;
  
  if (notification) {
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }
}

function hideNotification() {
  if (notification) notification.classList.add('hidden');
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-color-scheme', savedTheme);
  
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
});

// Make functions globally available for onclick handlers
window.handleAdminLogin = handleAdminLogin;
window.adminLogout = adminLogout;
window.handleAdminNav = handleAdminNav;
window.updatePersonalInfo = updatePersonalInfo;
window.exportData = exportData;
window.importData = importData;
window.addNewCertification = addNewCertification;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.editExperience = editExperience;
window.cancelEditExperience = cancelEditExperience;
window.updateExperience = updateExperience;
window.removeExperience = removeExperience;
window.editProject = editProject;
window.cancelEditProject = cancelEditProject;
window.updateProject = updateProject;
window.removeProject = removeProject;
window.removeCertification = removeCertification;