// Portfolio Application JavaScript with Django Backend Integration

// Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const USE_BACKEND = true; // Set to false to use localStorage only

// Default portfolio data (fallback)
const DEFAULT_DATA = {
  personalInfo: {
    name: "Mada Nithish Reddy",
    title: "Computer Science Engineer",
    email: "madanithishreddy@gmail.com",
    phone: "+91 9704715088",
    github: "https://github.com/Nithish6606",
    linkedin: "https://linkedin.com/in/nithish-mada",
    bio: "Recent BTech Computer Science graduate passionate about web development, machine learning, and creating innovative solutions to real-world problems.",
    profilePicture: "./profile.jpg"
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
let portfolioData = DEFAULT_DATA;

// DOM Elements
const loadingScreen = document.getElementById('loading');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const portfolioContent = document.getElementById('portfolio-content');
const notification = document.getElementById('notification');

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  };

  const config = { ...defaultOptions, ...options };
  
  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async function loadPortfolioDataFromAPI() {
  if (!USE_BACKEND) {
    console.log('Backend disabled, using localStorage or default data');
    return JSON.parse(localStorage.getItem('portfolioData')) || DEFAULT_DATA;
  }

  try {
    console.log('Attempting to load data from API...');
    const data = await apiRequest('/portfolio-data/');
    console.log('Data loaded from API successfully:', data);
    return data;
  } catch (error) {
    console.warn('Failed to load data from API, using localStorage fallback:', error);
    const fallbackData = JSON.parse(localStorage.getItem('portfolioData')) || DEFAULT_DATA;
    console.log('Using fallback data:', fallbackData);
    return fallbackData;
  }
}

async function savePortfolioDataToAPI(data) {
  if (!USE_BACKEND) {
    localStorage.setItem('portfolioData', JSON.stringify(data));
    return;
  }

  try {
    await apiRequest('/admin/import/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('Failed to save data to API, using localStorage fallback:', error);
    localStorage.setItem('portfolioData', JSON.stringify(data));
  }
}

async function submitContactForm(formData) {
  if (!USE_BACKEND) {
    // Simulate form submission for demo
    return { success: true, message: 'Message sent successfully! (Demo mode)' };
  }

  try {
    await apiRequest('/contact-messages/', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      }),
    });
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return { success: false, message: 'Failed to send message. Please try again.' };
  }
}

// Initialize application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded, initializing app...');
    initializeApp();
  });
} else {
  console.log('DOM already ready, initializing app immediately...');
  initializeApp();
}

async function initializeApp() {
  // Initialize theme first to prevent flash
  initializeTheme();
  
  // Load portfolio data from API
  try {
    console.log('Starting portfolio data load...');
    portfolioData = await loadPortfolioDataFromAPI();
    console.log('Portfolio data loaded successfully:', portfolioData);
  } catch (error) {
    console.error('Failed to load from API, using default data:', error);
    portfolioData = DEFAULT_DATA;
    console.log('Using default portfolio data:', portfolioData);
  }
  
  // Ensure we have valid data
  if (!portfolioData || !portfolioData.personalInfo) {
    console.warn('Invalid portfolio data, using default');
    portfolioData = DEFAULT_DATA;
  }
  
  // Load content into DOM
  loadPortfolioData();
  
  // Set up event listeners
  setupEventListeners();
  
  // Handle routing
  handleRouting();
  
  // Hide loading screen immediately
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Mobile navigation
  hamburger.addEventListener('click', toggleMobileNav);
  
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Contact form
  document.getElementById('contact-form').addEventListener('submit', handleContactForm);
  
  // Notification close
  document.getElementById('notification-close').addEventListener('click', hideNotification);
  
  // Window hash change
  window.addEventListener('hashchange', handleRouting);
  
  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function handleRouting() {
  const hash = window.location.hash.substring(1) || 'home';
  
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`[href="#${hash}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function loadPortfolioData() {
  if (!portfolioData) {
    console.error('Portfolio data not available');
    return;
  }
  
  const data = portfolioData;
  
  // Load personal info with null checks
  const heroName = document.getElementById('hero-name');
  const heroTitle = document.getElementById('hero-title');
  const heroBio = document.getElementById('hero-bio');
  const heroGithub = document.getElementById('hero-github');
  const heroLinkedin = document.getElementById('hero-linkedin');
  const heroEmail = document.getElementById('hero-email');
  
  if (heroName) heroName.textContent = data.personalInfo.name;
  if (heroTitle) heroTitle.textContent = data.personalInfo.title;
  if (heroBio) heroBio.textContent = data.personalInfo.bio;
  if (heroGithub) heroGithub.href = data.personalInfo.github;
  if (heroLinkedin) heroLinkedin.href = data.personalInfo.linkedin;
  if (heroEmail) heroEmail.href = `mailto:${data.personalInfo.email}`;
  
  // Load profile pictures
  const profilePicUrl = data.personalInfo.profilePicture || './profile.jpg';
  const heroProfilePic = document.getElementById('hero-profile-pic');
  const aboutProfilePic = document.getElementById('about-profile-pic');
  if (heroProfilePic) heroProfilePic.src = profilePicUrl;
  if (aboutProfilePic) aboutProfilePic.src = profilePicUrl;
  
  const aboutName = document.getElementById('about-name');
  const aboutBio = document.getElementById('about-bio');
  const aboutEmail = document.getElementById('about-email');
  const aboutPhone = document.getElementById('about-phone');
  
  if (aboutName) aboutName.textContent = data.personalInfo.name;
  if (aboutBio) aboutBio.textContent = data.personalInfo.bio;
  if (aboutEmail) aboutEmail.textContent = data.personalInfo.email;
  if (aboutPhone) aboutPhone.textContent = data.personalInfo.phone;
  
  const contactEmail = document.getElementById('contact-email');
  const contactPhone = document.getElementById('contact-phone');
  const contactGithub = document.getElementById('contact-github');
  const contactLinkedin = document.getElementById('contact-linkedin');
  
  if (contactEmail) contactEmail.textContent = data.personalInfo.email;
  if (contactPhone) contactPhone.textContent = data.personalInfo.phone;
  if (contactGithub) contactGithub.href = data.personalInfo.github;
  if (contactLinkedin) contactLinkedin.href = data.personalInfo.linkedin;
  
  // Load skills
  loadSkills();
  
  // Load experience
  loadExperience();
  
  // Load projects
  loadProjects();
  
  // Load certifications
  loadCertifications();
  
  console.log('Portfolio data loaded successfully:', data);
}

function loadSkills() {
  const skillsGrid = document.getElementById('skills-grid');
  if (!skillsGrid) return;
  
  skillsGrid.innerHTML = '';
  
  const skills = portfolioData.skills;
  const skillCategories = [
    { key: 'programmingLanguages', name: 'Programming Languages', bgClass: 'bg-1' },
    { key: 'webTechnologies', name: 'Web Technologies', bgClass: 'bg-2' },
    { key: 'frameworks', name: 'Frameworks', bgClass: 'bg-3' },
    { key: 'databases', name: 'Databases', bgClass: 'bg-4' },
    { key: 'technologies', name: 'Technologies', bgClass: 'bg-5' },
    { key: 'tools', name: 'Tools', bgClass: 'bg-6' }
  ];
  
  skillCategories.forEach(category => {
    if (skills[category.key] && skills[category.key].length > 0) {
      const skillCard = document.createElement('div');
      skillCard.className = `skill-category ${category.bgClass}`;
      skillCard.innerHTML = `
        <h3>${category.name}</h3>
        <div class="skill-tags">
          ${skills[category.key].map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      `;
      skillsGrid.appendChild(skillCard);
    }
  });
}

function loadExperience() {
  const timeline = document.getElementById('experience-timeline');
  if (!timeline) return;
  
  timeline.innerHTML = '';
  
  portfolioData.experience.forEach((exp, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h3 class="experience-title">${exp.title}</h3>
        <h4 class="experience-company">${exp.company}</h4>
        <p class="experience-duration">${exp.duration}</p>
        <p class="timeline-description">${exp.description}</p>
      </div>
    `;
    timeline.appendChild(timelineItem);
  });
}

function loadProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;
  
  projectsGrid.innerHTML = '';
  
  portfolioData.projects.forEach((project, index) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Handle both techStack and tech_stack properties for compatibility
    const techStack = project.techStack || project.tech_stack || [];
    
    projectCard.innerHTML = `
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="tech-stack">
          ${Array.isArray(techStack) ? techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
        </div>
        ${project.links && project.links.length > 0 ? `
          <div class="project-links">
            ${project.links.map(link => `<a href="${link.url}" target="_blank" class="project-link">${link.text}</a>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    projectsGrid.appendChild(projectCard);
  });
}

function loadCertifications() {
  const certificationsList = document.getElementById('certifications-list');
  if (!certificationsList) return;
  
  certificationsList.innerHTML = '';
  
  portfolioData.certifications.forEach((cert, index) => {
    const certItem = document.createElement('div');
    certItem.className = 'certification-item';
    certItem.innerHTML = `
      <p>${cert}</p>
    `;
    certificationsList.appendChild(certItem);
  });
}

// Theme functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-color-scheme', savedTheme);
  
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
}

// Mobile navigation
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

// Contact form
async function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const result = await submitContactForm(formData);
  
  if (result.success) {
    showNotification(result.message, 'success');
    e.target.reset();
  } else {
    showNotification(result.message, 'error');
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('admin-password').value;
  const loginButton = e.target.querySelector('button[type="submit"]');
  const originalText = loginButton.textContent;
  
  // Show loading state
  loginButton.textContent = 'Logging in...';
  loginButton.disabled = true;
  
  try {
    const success = await adminLoginAPI(password);
    
    if (success) {
      isAdminLoggedIn = true;
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      adminLogin.classList.add('hidden');
      adminDashboard.classList.remove('hidden');
      loadAdminData();
      updateAdminNavVisibility();
      showNotification('Welcome to Admin Panel! You are now logged in.', 'success');
    } else {
      showNotification('Invalid password! Please try again.', 'error');
    }
  } catch (error) {
    showNotification('Login failed. Please check your connection and try again.', 'error');
  } finally {
    // Reset button state
    loginButton.textContent = originalText;
    loginButton.disabled = false;
    document.getElementById('admin-password').value = '';
  }
}

async function adminLogout() {
  try {
    await adminLogoutAPI();
    isAdminLoggedIn = false;
    sessionStorage.removeItem('isAdminLoggedIn');
    
    // Reset admin panel state
    adminLogin.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    
    // Update navigation
    updateAdminNavVisibility();
    
    // Redirect to home
    window.location.hash = 'home';
    
    showNotification('You have been logged out successfully.', 'success');
  } catch (error) {
    console.error('Logout error:', error);
    // Force logout even if API call fails
    isAdminLoggedIn = false;
    sessionStorage.removeItem('isAdminLoggedIn');
    updateAdminNavVisibility();
    window.location.hash = 'home';
    showNotification('Logged out (offline mode).', 'success');
  }
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
  personalForm.elements['edit-name'].value = portfolioData.personalInfo.name;
  personalForm.elements['edit-title'].value = portfolioData.personalInfo.title;
  personalForm.elements['edit-email'].value = portfolioData.personalInfo.email;
  personalForm.elements['edit-phone'].value = portfolioData.personalInfo.phone;
  personalForm.elements['edit-github'].value = portfolioData.personalInfo.github;
  personalForm.elements['edit-linkedin'].value = portfolioData.personalInfo.linkedin;
  personalForm.elements['edit-bio'].value = portfolioData.personalInfo.bio;
  personalForm.elements['edit-profile-picture'].value = portfolioData.personalInfo.profilePicture || '';
  
  // Load skills admin
  loadSkillsAdmin();
  
  // Load experience admin
  loadExperienceAdmin();
  
  // Load projects admin
  loadProjectsAdmin();
  
  // Load certifications admin
  loadCertificationsAdmin();
}

// Skills management
function loadSkillsAdmin() {
  const skillCategories = {
    'programming': { name: 'Programming Languages', key: 'programmingLanguages' },
    'web': { name: 'Web Technologies', key: 'webTechnologies' },
    'framework': { name: 'Frameworks', key: 'frameworks' },
    'tool': { name: 'Tools', key: 'tools' }
  };
  
  Object.entries(skillCategories).forEach(([id, category]) => {
    const container = document.getElementById(`${id}-skills`);
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

// Personal info management
async function updatePersonalInfo(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  portfolioData.personalInfo = {
    name: formData.get('edit-name'),
    title: formData.get('edit-title'),
    email: formData.get('edit-email'),
    phone: formData.get('edit-phone'),
    github: formData.get('edit-github'),
    linkedin: formData.get('edit-linkedin'),
    bio: formData.get('edit-bio'),
    profilePicture: formData.get('edit-profile-picture') || './profile.jpg'
  };
  
  await saveData();
  loadPortfolioData();
  showNotification('Personal information updated successfully!', 'success');
}

// Experience management
function loadExperienceAdmin() {
  const experienceList = document.getElementById('experience-list');
  experienceList.innerHTML = '';
  
  portfolioData.experience.forEach((exp, index) => {
    const expItem = document.createElement('div');
    expItem.className = 'experience-item';
    expItem.innerHTML = `
      <div class="item-header">
        <h3>${exp.title} at ${exp.company}</h3>
        <div class="item-actions">
          <button class="btn btn--outline btn--sm" onclick="editExperience(${index})">Edit</button>
          <button class="btn btn--secondary btn--sm" onclick="removeExperience(${index})">Delete</button>
        </div>
      </div>
      <div id="exp-display-${index}">
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

async function updateExperience(e, index) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  portfolioData.experience[index] = {
    title: formData.get('title'),
    company: formData.get('company'),
    duration: formData.get('duration'),
    description: formData.get('description')
  };
  
  await saveData();
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

// Projects management  
function loadProjectsAdmin() {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';
  
  portfolioData.projects.forEach((project, index) => {
    const projItem = document.createElement('div');
    projItem.className = 'project-item';
    
    const techStack = project.techStack || project.tech_stack || [];
    
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
        <p><strong>Tech Stack:</strong> ${Array.isArray(techStack) ? techStack.join(', ') : techStack}</p>
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
            <input type="text" name="techStack" value="${Array.isArray(techStack) ? techStack.join(', ') : techStack}" class="form-control" required>
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
    techStack: [],
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

async function updateProject(e, index) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const techStackString = formData.get('techStack');
  
  portfolioData.projects[index] = {
    title: formData.get('title'),
    description: formData.get('description'),
    techStack: techStackString.split(',').map(tech => tech.trim()).filter(tech => tech),
    links: portfolioData.projects[index].links || []
  };
  
  await saveData();
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

// Certifications management
function loadCertificationsAdmin() {
  const certificationList = document.getElementById('certification-list');
  certificationList.innerHTML = '';
  
  portfolioData.certifications.forEach((cert, index) => {
    const certItem = document.createElement('div');
    certItem.className = 'certification-item-admin';
    certItem.innerHTML = `
      <span>${cert}</span>
      <button class="btn btn--secondary btn--sm" onclick="removeCertification(${index})">Delete</button>
    `;
    certificationList.appendChild(certItem);
  });
}

function addNewCertification() {
  const input = document.getElementById('new-certification');
  const certTitle = input.value.trim();
  
  if (certTitle) {
    portfolioData.certifications.push(certTitle);
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

// Data management
async function saveData() {
  await savePortfolioDataToAPI(portfolioData);
}

async function exportData() {
  if (USE_BACKEND) {
    try {
      const response = await apiRequest('/admin/export/');
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename || 'portfolio-data.json';
      link.click();
      
      URL.revokeObjectURL(url);
      showNotification('Data exported successfully!', 'success');
      return;
    } catch (error) {
      console.warn('API export failed, falling back to local data:', error);
    }
  }
  
  // Fallback to local export
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

async function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async function(event) {
    try {
      const importedData = JSON.parse(event.target.result);
      
      // Validate imported data structure
      if (importedData.personalInfo && importedData.skills && 
          importedData.experience && importedData.projects && 
          importedData.certifications) {
        
        portfolioData = importedData;
        await saveData();
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

// Notification system (disabled)
let notificationTimeout;

function showNotification(message, type = 'success') {
  // Notification system is disabled
  return;
  
  const notification = document.getElementById('notification');
  const messageElement = document.getElementById('notification-message');
  
  // Clear existing timeout if any
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  
  messageElement.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');
  
  // Auto hide after 15 seconds
  notificationTimeout = setTimeout(() => {
    hideNotification();
  }, 15000);
}

function hideNotification() {
  const notification = document.getElementById('notification');
  notification.classList.add('hidden');
  
  // Clear timeout if notification is manually closed
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
}

// Make functions globally available for onclick handlers
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
