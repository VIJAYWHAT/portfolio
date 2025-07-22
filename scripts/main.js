// Main JavaScript functionality for the portfolio website

class PortfolioApp {
    constructor() {
        this.currentTheme = 'dark';
        this.isLoading = false;
        this.activeSection = 'home';
        this.typingText = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
        this.currentTypeIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
        this.startTypingAnimation();
        this.initIntersectionObserver();
        this.loadContent();
        this.hideLoadingOverlay();
        this.setupDetailPages();
    }

    // Theme Management
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Mobile navigation
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNavLink(link);
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Project filters
        this.setupFilters('.project-filters .filter-btn', this.filterProjects.bind(this));
        this.setupFilters('.blog-filters .filter-btn', this.filterBlogs.bind(this));

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Scroll event for navbar
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    setupFilters(selector, filterFunction) {
        const filterBtns = document.querySelectorAll(selector);
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter content
                const filterValue = btn.getAttribute('data-filter');
                filterFunction(filterValue);
            });
        });
    }

    // Typing Animation
    startTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const typeText = () => {
            const currentText = this.typingText[this.currentTypeIndex];
            
            if (this.isDeleting) {
                typingElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
            }

            let typeSpeed = this.isDeleting ? 50 : 100;

            if (!this.isDeleting && this.currentCharIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTypeIndex = (this.currentTypeIndex + 1) % this.typingText.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        };

        typeText();
    }

    // Smooth scrolling and navigation
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 70; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = `${getComputedStyle(document.documentElement).getPropertyValue('--bg-primary')}ee`;
        } else {
            navbar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
        }

        // Update active section based on scroll position
        const sections = document.querySelectorAll('.section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection && currentSection !== this.activeSection) {
            this.activeSection = currentSection;
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                this.setActiveNavLink(activeLink);
            }
        }
    }

    // Intersection Observer for animations
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.timeline-entry, .project-card, .blog-card, .skill-category, .stat-item').forEach(el => {
            el.classList.add('observe-fade');
            observer.observe(el);
        });
    }

    // Content Loading and Filtering
    async loadContent() {
        try {
            await Promise.all([
                this.loadProjects(),
                this.loadSkills(),
                this.loadEducation(),
                this.loadExperience(),
                this.loadBlogs(),
                this.loadJourneyTimeline()
            ]);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async loadProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        try {
            // Use the data from data.js
            const projects = window.portfolioData.projects;
            
            container.innerHTML = projects.map(project => `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">
                        <i class="fas fa-code"></i>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank">Live Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank">GitHub</a>` : ''}
                        <button class="project-link view-details" onclick="portfolioApp.showProjectDetails(${project.id})">View Details</button>
                        <a href="project-detail.html?id=${project.id}&type=project" class="project-link">View Details</a>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
            container.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        }
    }

    async loadSkills() {
        const container = document.getElementById('skills-categories');
        if (!container) return;

        try {
            const skills = window.portfolioData.skills;
            
            container.innerHTML = `
                <div class="space-y-10">
                    ${Object.entries(skills).map(([category, skillList]) => `
                        <div class="skill-category">
                            <h3>${category}</h3>
                            <div class="skills-list">
                                ${skillList.map(skill => `
                                    <span class="skill-tag">${skill}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }

    async loadEducation() {
        const container = document.getElementById('education-timeline');
        if (!container) return;

        try {
            const education = window.portfolioData.education;
            
            container.innerHTML = education.map(edu => `
                <div class="timeline-entry">
                    <div class="entry-header">
                        <div>
                            <h3 class="entry-title">${edu.degree}</h3>
                            <p class="entry-institution">${edu.institution}</p>
                        </div>
                        <div class="entry-duration">${edu.duration}</div>
                    </div>
                    <div class="entry-description">
                        <p><strong>CGPA:</strong> ${edu.cgpa}</p>
                        <p>${edu.description}</p>
                        ${edu.achievements ? `
                            <h4>Achievements:</h4>
                            <ul class="entry-responsibilities">
                                ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading education:', error);
        }
    }

    async loadExperience() {
        const container = document.getElementById('experience-timeline');
        if (!container) return;

        try {
            const experience = window.portfolioData.experience;
            
            container.innerHTML = experience.map(exp => `
                <div class="timeline-entry">
                    <div class="entry-header">
                        <div>
                            <h3 class="entry-title">${exp.position}</h3>
                            <p class="entry-company">${exp.company}</p>
                        </div>
                        <div class="entry-duration">${exp.duration}</div>
                    </div>
                    <div class="entry-description">
                        <p>${exp.description}</p>
                        <h4>Key Responsibilities:</h4>
                        <ul class="entry-responsibilities">
                            ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                        <div class="project-tech">
                            ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading experience:', error);
        }
    }

    async loadBlogs() {
        const container = document.getElementById('blog-grid');
        if (!container) return;

        try {
            const blogs = window.portfolioData.blogs;
            
            container.innerHTML = blogs.map(blog => `
                <div class="blog-card" data-category="${blog.type}">
                    <div class="blog-image">
                        <i class="fas ${blog.type === 'presentation' ? 'fa-presentation' : 'fa-blog'}"></i>
                    </div>
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.excerpt}</p>
                    <div class="blog-meta">
                        <span class="blog-date">${blog.date}</span>
                        ${blog.readTime ? `<span class="blog-read-time">${blog.readTime} min read</span>` : ''}
                        ${blog.audience ? `<span class="blog-audience">${blog.audience} attendees</span>` : ''}
                    </div>
                    <div class="project-links">
                        <a href="${blog.url}" class="project-link" target="_blank">
                            ${blog.type === 'presentation' ? 'View Slides' : 'Read More'}
                        </a>
                        <a href="blog-detail.html?id=${blog.id}&type=blog" class="project-link">View Details</a>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading blogs:', error);
        }
    }

    async loadJourneyTimeline() {
        const container = document.getElementById('journey-timeline');
        if (!container) return;

        try {
            const journey = window.portfolioData.journey;
            
            container.innerHTML = journey.map(item => `
                <div class="timeline-item">
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading journey:', error);
        }
    }

    // Filtering Functions
    filterProjects(category) {
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(project => {
            const projectCategory = project.getAttribute('data-category');
            if (category === 'all' || projectCategory === category) {
                project.style.display = 'block';
                project.classList.add('fade-in');
            } else {
                project.style.display = 'none';
                project.classList.remove('fade-in');
            }
        });
    }

    filterBlogs(category) {
        const blogs = document.querySelectorAll('.blog-card');
        blogs.forEach(blog => {
            const blogCategory = blog.getAttribute('data-category');
            if (category === 'all' || 
                (category === 'blogs' && blogCategory === 'blog') ||
                (category === 'presentations' && blogCategory === 'presentation')) {
                blog.style.display = 'block';
                blog.classList.add('fade-in');
            } else {
                blog.style.display = 'none';
                blog.classList.remove('fade-in');
            }
        });
    }

    // Contact Form Handling
    async handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    validateForm(form) {
        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message'];
        
        fields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const errorElement = field.parentElement.querySelector('.error-message');
            
            if (!field.value.trim()) {
                this.showFieldError(field, errorElement, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
                isValid = false;
            } else if (fieldName === 'email' && !this.isValidEmail(field.value)) {
                this.showFieldError(field, errorElement, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.clearFieldError(field, errorElement);
            }
        });
        
        return isValid;
    }

    showFieldError(field, errorElement, message) {
        field.style.borderColor = 'var(--error-color)';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(field, errorElement) {
        field.style.borderColor = 'var(--border-color)';
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            maxWidth: '300px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'success' ? 'var(--success-color)' : 
                           type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Loading Overlay
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 1000);
        }
    }

    // Detail Pages Setup
    setupDetailPages() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('detail-modal')) {
            const modal = document.createElement('div');
            modal.id = 'detail-modal';
            modal.className = 'detail-modal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="portfolioApp.closeDetailModal()"></div>
                <div class="modal-content">
                    <button class="modal-close" onclick="portfolioApp.closeDetailModal()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body" id="modal-body">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Add some utility functions for enhanced functionality
window.portfolioUtils = {
    // Smooth scroll to element
    scrollTo: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    // Copy text to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },
    
    // Debounce function for performance
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }
};