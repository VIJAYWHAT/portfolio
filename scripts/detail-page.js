// Detail Page JavaScript functionality

class DetailPageManager {
    constructor() {
        this.currentItem = null;
        this.itemType = null;
        this.init();
    }

    init() {
        this.getItemFromURL();
        this.loadItemDetails();
        this.hideLoadingOverlay();
    }

    getItemFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        const type = urlParams.get('type') || this.detectPageType();
        
        if (!itemId) {
            this.showError('Item not found');
            return;
        }

        this.itemType = type;
        this.loadItemData(parseInt(itemId));
    }

    detectPageType() {
        const path = window.location.pathname;
        if (path.includes('project-detail')) return 'project';
        if (path.includes('blog-detail')) return 'blog';
        return 'project';
    }

    loadItemData(itemId) {
        let data;
        
        if (this.itemType === 'project') {
            data = window.portfolioData.projects.find(p => p.id === itemId);
        } else if (this.itemType === 'blog') {
            data = window.portfolioData.blogs.find(b => b.id === itemId);
        }

        if (!data) {
            this.showError('Item not found');
            return;
        }

        this.currentItem = data;
    }

    loadItemDetails() {
        if (!this.currentItem) return;

        const container = document.getElementById('detail-content');
        
        if (this.itemType === 'project') {
            this.renderProjectDetails(container);
        } else if (this.itemType === 'blog') {
            this.renderBlogDetails(container);
        }

        // Update page title
        document.title = `${this.currentItem.title} - John Doe Portfolio`;
    }

    renderProjectDetails(container) {
        const project = this.currentItem;
        
        container.innerHTML = `
            <div class="detail-hero">
                <div class="detail-hero-content">
                    <h1 class="detail-title">${project.title}</h1>
                    <p class="detail-subtitle">${project.description}</p>
                    <div class="detail-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>Completed: ${project.completedAt}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-code"></i>
                            <span>${project.technologies.length} Technologies</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${project.category}</span>
                        </div>
                    </div>
                    <div class="detail-tags">
                        ${project.technologies.map(tech => `<span class="detail-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="detail-body">
                <div class="detail-image">
                    <i class="fas fa-code"></i>
                </div>
                
                <div class="detail-section">
                    <h2>Project Overview</h2>
                    <div class="markdown-content">
                        ${this.parseMarkdown(this.getProjectMarkdown(project.id))}
                    </div>
                </div>
                
                ${project.challenges ? `
                    <div class="detail-section">
                        <h2>Challenges & Solutions</h2>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${project.outcomes ? `
                    <div class="detail-section">
                        <h2>Outcomes & Impact</h2>
                        <ul>
                            ${project.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="detail-section">
                    <h2>Technologies Used</h2>
                    <div class="tech-showcase">
                        ${project.technologies.map(tech => `<div class="tech-item">${tech}</div>`).join('')}
                    </div>
                </div>
                
                ${this.renderProjectStats(project)}
            </div>
            
            <div class="detail-actions">
                ${project.liveUrl ? `<a href="${project.liveUrl}" class="action-btn action-btn-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>` : ''}
                ${project.githubUrl ? `<a href="${project.githubUrl}" class="action-btn action-btn-outline" target="_blank">
                    <i class="fab fa-github"></i> View Code
                </a>` : ''}
                <a href="index.html#projects" class="action-btn action-btn-outline">
                    <i class="fas fa-arrow-left"></i> Back to Projects
                </a>
            </div>
        `;
    }

    renderBlogDetails(container) {
        const blog = this.currentItem;
        
        container.innerHTML = `
            <div class="detail-hero">
                <div class="detail-hero-content">
                    <h1 class="detail-title">${blog.title}</h1>
                    <p class="detail-subtitle">${blog.excerpt}</p>
                    <div class="detail-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${blog.date}</span>
                        </div>
                        ${blog.readTime ? `
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${blog.readTime} min read</span>
                            </div>
                        ` : ''}
                        ${blog.audience ? `
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${blog.audience} attendees</span>
                            </div>
                        ` : ''}
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${blog.type}</span>
                        </div>
                    </div>
                    <div class="detail-tags">
                        ${blog.tags.map(tag => `<span class="detail-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="detail-body">
                <div class="detail-image">
                    <i class="fas ${blog.type === 'presentation' ? 'fa-presentation' : 'fa-blog'}"></i>
                </div>
                
                <div class="detail-section">
                    <h2>${blog.type === 'presentation' ? 'Presentation' : 'Blog Post'} Content</h2>
                    <div class="markdown-content">
                        ${this.parseMarkdown(this.getBlogMarkdown(blog.id))}
                    </div>
                </div>
                
                ${blog.venue ? `
                    <div class="detail-section">
                        <h2>Event Details</h2>
                        <p><strong>Venue:</strong> ${blog.venue}</p>
                        ${blog.audience ? `<p><strong>Audience:</strong> ${blog.audience} attendees</p>` : ''}
                        ${blog.duration ? `<p><strong>Duration:</strong> ${blog.duration}</p>` : ''}
                    </div>
                ` : ''}
                
                ${blog.feedback ? this.renderFeedbackSection(blog.feedback) : ''}
                
                ${blog.series ? `
                    <div class="detail-section">
                        <h2>Series Information</h2>
                        <p>This is part ${blog.series.part} of ${blog.series.totalParts} in the "${blog.series.name}" series.</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-actions">
                <a href="${blog.url}" class="action-btn action-btn-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> 
                    ${blog.type === 'presentation' ? 'View Slides' : 'Read Full Post'}
                </a>
                ${blog.video ? `<a href="${blog.video}" class="action-btn action-btn-outline" target="_blank">
                    <i class="fas fa-video"></i> Watch Video
                </a>` : ''}
                ${blog.code ? `<a href="${blog.code}" class="action-btn action-btn-outline" target="_blank">
                    <i class="fab fa-github"></i> View Code
                </a>` : ''}
                <a href="index.html#blog" class="action-btn action-btn-outline">
                    <i class="fas fa-arrow-left"></i> Back to Blog
                </a>
            </div>
        `;
    }

    renderProjectStats(project) {
        // Generate some sample stats based on project data
        const stats = [
            { label: 'Technologies', value: project.technologies.length },
            { label: 'Category', value: project.category },
            { label: 'Status', value: 'Completed' }
        ];

        return `
            <div class="detail-section">
                <h2>Project Statistics</h2>
                <div class="project-stats">
                    ${stats.map(stat => `
                        <div class="stat-card">
                            <div class="stat-number">${stat.value}</div>
                            <div class="stat-label">${stat.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFeedbackSection(feedback) {
        const stars = '★'.repeat(Math.floor(feedback.rating)) + '☆'.repeat(5 - Math.floor(feedback.rating));
        
        return `
            <div class="detail-section">
                <h2>Feedback & Impact</h2>
                <div class="feedback-section">
                    <div class="feedback-rating">
                        <span class="rating-stars">${stars}</span>
                        <span><strong>${feedback.rating}/5</strong> (${feedback.totalResponses} responses)</span>
                    </div>
                    <div class="feedback-comments">
                        ${feedback.comments.map(comment => `
                            <div class="feedback-comment">"${comment}"</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    parseMarkdown(markdownText) {
        if (typeof marked !== 'undefined') {
            return marked.parse(markdownText);
        }
        // Fallback: simple markdown parsing
        return markdownText
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>')
            .replace(/^(.*)$/gim, '<p>$1</p>');
    }

    getProjectMarkdown(projectId) {
        // Detailed markdown content for each project
        const projectContent = {
            1: `# E-Commerce Platform

## Overview
This comprehensive e-commerce platform was built to provide a complete online shopping experience with modern web technologies. The platform includes user authentication, product catalog management, shopping cart functionality, and secure payment processing.

## Key Features
- **User Authentication**: Secure login/registration system with JWT tokens
- **Product Catalog**: Dynamic product listing with search and filtering
- **Shopping Cart**: Real-time cart updates with persistent storage
- **Payment Integration**: Secure payment processing with Stripe
- **Admin Dashboard**: Complete inventory and order management system
- **Responsive Design**: Optimized for all device sizes

## Technical Implementation
The platform was built using a modern tech stack with React for the frontend, Node.js with Express for the backend, and MongoDB for data storage. The architecture follows RESTful API principles with proper error handling and validation.

### Frontend Architecture
- **React Components**: Modular component structure with hooks
- **State Management**: Context API for global state
- **Routing**: React Router for navigation
- **Styling**: CSS Modules with responsive design

### Backend Architecture
- **Express.js**: RESTful API endpoints
- **MongoDB**: Document-based data storage
- **Authentication**: JWT-based authentication system
- **Payment Processing**: Stripe integration for secure payments

## Performance Optimizations
- Implemented lazy loading for product images
- Used React.memo for component optimization
- Added caching strategies for API responses
- Optimized database queries with proper indexing

## Security Measures
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration
- Rate limiting for API endpoints
- Secure payment processing with Stripe`,

            2: `# Task Management Application

## Project Overview
A collaborative task management application designed to improve team productivity through real-time updates, intuitive drag-and-drop interfaces, and comprehensive project tracking capabilities.

## Core Functionality
- **Real-time Collaboration**: Live updates across all connected users
- **Drag & Drop Interface**: Intuitive task organization with visual feedback
- **Team Management**: User roles and permissions system
- **Project Tracking**: Progress monitoring and reporting
- **Notification System**: Real-time alerts and updates

## Technical Architecture
Built with Vue.js for reactive frontend components, Socket.io for real-time communication, and PostgreSQL for robust data management. The application uses Docker for containerization and AWS for scalable deployment.

### Frontend Features
- **Vue 3 Composition API**: Modern reactive programming
- **Vuex State Management**: Centralized state handling
- **Real-time Updates**: Socket.io client integration
- **Responsive Design**: Mobile-first approach

### Backend Infrastructure
- **Node.js & Express**: Server-side logic
- **Socket.io**: Real-time bidirectional communication
- **PostgreSQL**: Relational database with ACID compliance
- **Docker**: Containerized deployment
- **AWS**: Cloud infrastructure

## Performance Achievements
- Handles 1000+ concurrent users efficiently
- Sub-second response times for all operations
- 99.9% uptime with proper error handling
- Optimized database queries for large datasets

## User Experience Impact
The application has significantly improved team productivity by 35% for beta users, with a user satisfaction rating of 4.8/5. The intuitive interface reduces the learning curve and increases adoption rates.`,

            3: `# Weather Dashboard

## Project Description
A comprehensive weather dashboard that provides current conditions, detailed forecasts, and interactive weather maps. The application integrates multiple weather APIs to deliver accurate and up-to-date meteorological information.

## Features & Capabilities
- **Current Weather**: Real-time weather conditions for any location
- **Extended Forecasts**: 7-day weather predictions with hourly breakdowns
- **Interactive Maps**: Weather radar and satellite imagery
- **Location Services**: GPS-based automatic location detection
- **Weather Alerts**: Severe weather notifications and warnings
- **Historical Data**: Past weather trends and comparisons

## Technical Implementation
Built with vanilla JavaScript for optimal performance, the dashboard uses modern web APIs and follows progressive web app principles. The application is fully responsive and works offline with cached data.

### API Integration
- **OpenWeather API**: Primary weather data source
- **Mapbox**: Interactive mapping and visualization
- **Geolocation API**: Automatic location detection
- **Service Workers**: Offline functionality

### Data Visualization
- **Chart.js**: Interactive weather charts and graphs
- **CSS Animations**: Smooth transitions and loading states
- **Responsive Charts**: Adaptive visualizations for all screen sizes

## Performance & Optimization
- Efficient API caching to reduce requests
- Lazy loading for map components
- Optimized images and assets
- Progressive loading for better user experience

## User Engagement
The dashboard serves over 10,000 monthly active users with 99.5% API uptime. It was featured in TechCrunch's "Best Weather Apps" article, highlighting its clean design and comprehensive features.`,

            4: `# Personal Blog Engine

## Project Overview
A custom-built blog engine designed specifically for technical writing, featuring markdown support, SEO optimization, and a comprehensive content management system.

## Key Features
- **Markdown Support**: Write posts in markdown with live preview
- **SEO Optimization**: Automatic meta tags and structured data
- **Content Management**: Easy post creation, editing, and publishing
- **Responsive Design**: Optimized reading experience on all devices
- **Search Functionality**: Full-text search across all posts
- **Tag System**: Categorization and filtering capabilities

## Technical Stack
Built with Next.js for server-side rendering and optimal SEO, MDX for enhanced markdown capabilities, and Tailwind CSS for utility-first styling. The blog is deployed on Vercel for optimal performance.

### Frontend Architecture
- **Next.js**: React framework with SSR/SSG
- **MDX**: Enhanced markdown with React components
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

### Content Management
- **File-based CMS**: Markdown files for content
- **Automatic Builds**: Git-based deployment workflow
- **Image Optimization**: Next.js image optimization
- **SEO Tools**: Automatic sitemap and meta tag generation

## Performance Metrics
- **Google PageSpeed Score**: 95+ on all pages
- **Load Time Improvement**: 60% faster than previous platform
- **SEO Impact**: 200% increase in organic search traffic
- **Core Web Vitals**: Excellent scores across all metrics

## Content Strategy
The blog focuses on technical tutorials, industry insights, and development best practices. Regular posting schedule with in-depth articles that provide real value to the developer community.`,

            5: `# Portfolio Website

## Project Overview
My personal portfolio website showcasing projects, skills, and professional journey. Built with modern web technologies and designed with a focus on user experience and accessibility.

## Design Philosophy
The portfolio follows Apple-level design aesthetics with meticulous attention to detail, clean typography, and intuitive navigation. Every element is carefully crafted to create a cohesive and professional presentation.

## Technical Features
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Performance Optimization**: Fast loading times and smooth animations
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- **SEO Optimization**: Structured data and meta tags
- **Progressive Enhancement**: Works without JavaScript

### Frontend Technologies
- **HTML5**: Semantic markup with proper structure
- **CSS3**: Modern styling with custom properties
- **JavaScript**: Vanilla JS for interactions and animations
- **GSAP**: Professional animations and micro-interactions

### Design System
- **Typography**: Consistent font hierarchy and spacing
- **Color Palette**: Carefully selected colors with proper contrast
- **Component Library**: Reusable UI components
- **Animation Guidelines**: Consistent motion design

## Performance & Accessibility
- **Accessibility Score**: 98% with screen reader support
- **Performance**: Optimized assets and efficient code
- **Cross-browser**: Compatible with all modern browsers
- **Mobile Optimization**: Touch-friendly interface

## Professional Impact
The portfolio has increased interview requests by 150% and was featured in "Developer Portfolio Inspiration" collections. It effectively communicates technical skills and professional experience to potential employers and clients.`,

            6: `# API Rate Limiter

## Project Overview
A flexible and efficient rate limiting middleware for Node.js applications, designed to prevent API abuse and ensure fair usage across multiple users and applications.

## Core Features
- **Multiple Algorithms**: Token bucket, sliding window, fixed window
- **Storage Backends**: Redis, MongoDB, in-memory storage
- **Flexible Configuration**: Customizable limits and time windows
- **Express Integration**: Easy middleware integration
- **TypeScript Support**: Full type definitions included
- **Monitoring**: Built-in metrics and logging

## Technical Architecture
The rate limiter is built with TypeScript for type safety and supports multiple storage backends for different deployment scenarios. It follows the middleware pattern for easy integration with Express applications.

### Algorithm Implementation
- **Token Bucket**: Smooth rate limiting with burst capacity
- **Sliding Window**: Precise rate limiting with rolling time windows
- **Fixed Window**: Simple and efficient for basic use cases
- **Distributed**: Support for multi-instance deployments

### Storage Options
- **Redis**: High-performance distributed caching
- **MongoDB**: Document-based persistent storage
- **Memory**: Fast in-memory storage for single instances
- **Custom**: Pluggable storage interface

## Performance Characteristics
- **Low Latency**: Sub-millisecond processing time
- **High Throughput**: Handles thousands of requests per second
- **Memory Efficient**: Minimal memory footprint
- **Scalable**: Horizontal scaling support

## Open Source Impact
- **Downloads**: 50K+ npm downloads
- **Production Usage**: 100+ companies using in production
- **Contributors**: 15+ open source contributors
- **Community**: Active GitHub community with regular updates

## Use Cases
Perfect for API protection, preventing abuse, ensuring fair usage, and maintaining service quality under high load conditions.`
        };

        return projectContent[projectId] || `# ${this.currentItem?.title || 'Project'}

## Project Details
This is a detailed description of the project. The content would include comprehensive information about the project's goals, implementation, challenges, and outcomes.

## Technical Implementation
Details about the technical aspects, architecture decisions, and development process.

## Results & Impact
Information about the project's success metrics, user feedback, and overall impact.`;
    }

    getBlogMarkdown(blogId) {
        // Detailed markdown content for each blog post
        const blogContent = {
            1: `# Building Scalable React Applications: Best Practices and Patterns

## Introduction
Building scalable React applications requires careful planning, proper architecture, and adherence to best practices. This comprehensive guide covers the essential patterns and techniques for creating maintainable React applications that can grow with your team and requirements.

## Component Architecture

### Component Composition
One of the most powerful patterns in React is component composition. Instead of building monolithic components, break them down into smaller, reusable pieces:

\`\`\`jsx
// Instead of this monolithic component
function UserProfile({ user, posts, followers }) {
  return (
    <div>
      <UserHeader user={user} />
      <UserStats followers={followers} posts={posts.length} />
      <PostList posts={posts} />
    </div>
  );
}

// Use composition for better maintainability
function UserProfile({ user, posts, followers }) {
  return (
    <UserLayout>
      <UserHeader user={user} />
      <UserStats followers={followers} posts={posts.length} />
      <PostList posts={posts} />
    </UserLayout>
  );
}
\`\`\`

### Custom Hooks for Logic Reuse
Extract common logic into custom hooks to promote reusability and separation of concerns:

\`\`\`jsx
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}
\`\`\`

## State Management Strategies

### Context API for Global State
Use React Context for truly global state that needs to be accessed by many components:

\`\`\`jsx
const ThemeContext = createContext();
const UserContext = createContext();

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}
\`\`\`

### Local State for Component-Specific Data
Keep state as local as possible. Only lift state up when multiple components need access to it.

## Performance Optimization

### Memoization Strategies
Use React.memo, useMemo, and useCallback strategically:

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcessing(item));
  }, [data]);

  const handleUpdate = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);

  return <div>{/* Component JSX */}</div>;
});
\`\`\`

### Code Splitting and Lazy Loading
Implement route-based code splitting for better initial load times:

\`\`\`jsx
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

## Testing Strategies

### Component Testing
Write comprehensive tests for your components using React Testing Library:

\`\`\`jsx
test('UserProfile displays user information correctly', () => {
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  render(<UserProfile user={mockUser} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
\`\`\`

### Integration Testing
Test component interactions and data flow between components.

## Conclusion
Building scalable React applications is about making thoughtful architectural decisions, following established patterns, and maintaining code quality through testing and documentation. These practices will help you create applications that can grow and evolve with your needs.`,

            2: `# The Future of Web Development: Trends to Watch in 2024

## Introduction
The web development landscape continues to evolve at a rapid pace. As we progress through 2024, several key trends are shaping the future of how we build and interact with web applications.

## AI Integration in Development

### AI-Powered Code Generation
Tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code:

- **Code Completion**: Intelligent suggestions based on context
- **Bug Detection**: AI-powered code analysis and debugging
- **Documentation**: Automatic generation of code documentation
- **Testing**: AI-assisted test case generation

### AI-Enhanced User Experiences
- **Personalization**: Dynamic content based on user behavior
- **Chatbots**: Intelligent customer service integration
- **Recommendation Systems**: Smart content and product suggestions
- **Voice Interfaces**: Natural language interaction capabilities

## WebAssembly (WASM) Adoption

### Performance Benefits
WebAssembly enables near-native performance in web browsers:

\`\`\`javascript
// Example: Using WASM for computationally intensive tasks
import wasmModule from './math-operations.wasm';

async function performComplexCalculation(data) {
  const wasm = await wasmModule();
  return wasm.processLargeDataset(data);
}
\`\`\`

### Use Cases
- **Gaming**: High-performance web games
- **Image/Video Processing**: Real-time media manipulation
- **Scientific Computing**: Complex calculations in the browser
- **Legacy Code**: Running existing C/C++ code in browsers

## Progressive Web Apps (PWAs) Evolution

### Enhanced Capabilities
PWAs are becoming more powerful with new APIs:

- **File System Access**: Direct file manipulation
- **Web Bluetooth**: IoT device integration
- **Background Sync**: Offline data synchronization
- **Push Notifications**: Native-like engagement

### Installation and Distribution
- **App Store Distribution**: PWAs in official app stores
- **Improved Installation**: Better user onboarding
- **Desktop Integration**: Full desktop app experience

## Edge Computing and CDNs

### Edge Functions
Serverless functions running at the edge for better performance:

\`\`\`javascript
// Edge function example
export default async function handler(request) {
  const userLocation = request.headers.get('cf-ipcountry');
  const content = await getLocalizedContent(userLocation);
  
  return new Response(content, {
    headers: { 'content-type': 'application/json' }
  });
}
\`\`\`

### Benefits
- **Reduced Latency**: Computation closer to users
- **Better Performance**: Faster response times
- **Improved Scalability**: Distributed processing

## Modern CSS Features

### Container Queries
Responsive design based on container size rather than viewport:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

### CSS Grid and Subgrid
Advanced layout capabilities for complex designs:

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.nested-grid {
  display: grid;
  grid: subgrid / subgrid;
}
\`\`\`

## Development Tools Evolution

### Build Tools
- **Vite**: Lightning-fast development server
- **esbuild**: Extremely fast bundling
- **SWC**: Rust-based compilation
- **Turbopack**: Next-generation bundler

### Testing Frameworks
- **Playwright**: Cross-browser testing
- **Vitest**: Fast unit testing
- **Cypress**: End-to-end testing
- **Storybook**: Component development

## Conclusion
The future of web development is exciting, with AI integration, performance improvements through WebAssembly, enhanced PWA capabilities, and modern CSS features leading the way. Staying current with these trends will help developers build better, faster, and more engaging web applications.

As we move forward, the focus will continue to be on performance, user experience, and developer productivity. Embracing these trends early will position developers and organizations for success in the evolving web landscape.`,

            3: `# Optimizing Node.js Performance: Tips and Techniques

## Introduction
Node.js performance optimization is crucial for building scalable applications that can handle high traffic loads efficiently. This comprehensive guide covers various techniques and best practices for improving your Node.js application performance.

## Understanding Node.js Performance

### Event Loop Optimization
The event loop is the heart of Node.js. Understanding how it works is crucial for optimization:

\`\`\`javascript
// Avoid blocking the event loop
// Bad: Synchronous file operations
const fs = require('fs');
const data = fs.readFileSync('large-file.txt'); // Blocks event loop

// Good: Asynchronous operations
fs.readFile('large-file.txt', (err, data) => {
  if (err) throw err;
  // Process data without blocking
});

// Better: Using promises/async-await
const fsPromises = require('fs').promises;
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('large-file.txt');
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
  }
}
\`\`\`

### Memory Management
Proper memory management prevents memory leaks and improves performance:

\`\`\`javascript
// Monitor memory usage
function logMemoryUsage() {
  const used = process.memoryUsage();
  console.log(\`Memory Usage:
    RSS: \${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB
    Heap Total: \${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB
    Heap Used: \${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB
    External: \${Math.round(used.external / 1024 / 1024 * 100) / 100} MB\`);
}

// Avoid memory leaks
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 1000;
  }
  
  addToCache(key, value) {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
\`\`\`

## Database Optimization

### Connection Pooling
Use connection pooling to manage database connections efficiently:

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function queryDatabase(query, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}
\`\`\`

### Query Optimization
Optimize database queries for better performance:

\`\`\`javascript
// Use indexes effectively
// Bad: Full table scan
SELECT * FROM users WHERE email = 'user@example.com';

// Good: Use indexed columns
CREATE INDEX idx_users_email ON users(email);
SELECT id, name, email FROM users WHERE email = 'user@example.com';

// Batch operations
async function batchInsertUsers(users) {
  const query = \`
    INSERT INTO users (name, email, created_at) 
    VALUES \${users.map((_, i) => \`($\${i * 3 + 1}, $\${i * 3 + 2}, $\${i * 3 + 3})\`).join(', ')}
  \`;
  
  const values = users.flatMap(user => [user.name, user.email, new Date()]);
  return await pool.query(query, values);
}
\`\`\`

## Caching Strategies

### In-Memory Caching
Implement caching to reduce database load:

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes TTL

async function getCachedUserData(userId) {
  const cacheKey = \`user_\${userId}\`;
  let userData = cache.get(cacheKey);
  
  if (!userData) {
    userData = await fetchUserFromDatabase(userId);
    cache.set(cacheKey, userData);
  }
  
  return userData;
}

// Redis caching for distributed systems
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key) {
  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const data = await fetchDataFromSource(key);
    await client.setex(key, 3600, JSON.stringify(data)); // 1 hour TTL
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return await fetchDataFromSource(key);
  }
}
\`\`\`

## HTTP Performance

### Compression
Enable gzip compression to reduce response sizes:

\`\`\`javascript
const express = require('express');
const compression = require('compression');

const app = express();

// Enable compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
\`\`\`

### HTTP/2 Support
Implement HTTP/2 for better performance:

\`\`\`javascript
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
});

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hello HTTP/2!</h1>');
});
\`\`\`

## Monitoring and Profiling

### Performance Monitoring
Use tools to monitor application performance:

\`\`\`javascript
const express = require('express');
const responseTime = require('response-time');

const app = express();

// Add response time header
app.use(responseTime());

// Custom performance middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.url} - \${duration}ms\`);
  });
  
  next();
});
\`\`\`

### CPU Profiling
Profile CPU usage to identify bottlenecks:

\`\`\`javascript
const v8Profiler = require('v8-profiler-next');

function startProfiling(name) {
  v8Profiler.startProfiling(name, true);
}

function stopProfiling(name) {
  const profile = v8Profiler.stopProfiling(name);
  profile.export((error, result) => {
    fs.writeFileSync(\`\${name}.cpuprofile\`, result);
    profile.delete();
  });
}
\`\`\`

## Conclusion
Node.js performance optimization requires a holistic approach covering event loop management, memory usage, database optimization, caching strategies, and continuous monitoring. By implementing these techniques, you can build high-performance applications that scale effectively with your user base.

Remember to measure performance before and after optimizations to ensure your changes have the desired impact. Use profiling tools and monitoring solutions to identify bottlenecks and track improvements over time.`,

            4: `# Introduction to GraphQL for REST API Developers

## What is GraphQL?
GraphQL is a query language and runtime for APIs that provides a more efficient, powerful, and flexible alternative to REST. Developed by Facebook in 2012 and open-sourced in 2015, GraphQL allows clients to request exactly the data they need.

## Key Differences from REST

### Single Endpoint vs Multiple Endpoints
**REST**: Multiple endpoints for different resources
\`\`\`
GET /api/users/1
GET /api/users/1/posts
GET /api/users/1/followers
\`\`\`

**GraphQL**: Single endpoint with flexible queries
\`\`\`graphql
query {
  user(id: 1) {
    name
    email
    posts {
      title
      content
    }
    followers {
      name
    }
  }
}
\`\`\`

### Over-fetching and Under-fetching
REST APIs often return fixed data structures, leading to:
- **Over-fetching**: Getting more data than needed
- **Under-fetching**: Making multiple requests for related data

GraphQL solves this by allowing clients to specify exactly what data they need.

## Core Concepts

### Schema Definition
GraphQL uses a schema to define the structure of your API:

\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  followers: [User!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  posts: [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
\`\`\`

### Resolvers
Resolvers are functions that fetch data for each field in your schema:

\`\`\`javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.db.user.findById(id);
    },
    users: async (parent, args, context) => {
      return await context.db.user.findMany();
    }
  },
  
  User: {
    posts: async (parent, args, context) => {
      return await context.db.post.findMany({
        where: { authorId: parent.id }
      });
    },
    followers: async (parent, args, context) => {
      return await context.db.user.findMany({
        where: { following: { some: { id: parent.id } } }
      });
    }
  },
  
  Mutation: {
    createUser: async (parent, { input }, context) => {
      return await context.db.user.create({
        data: input
      });
    }
  }
};
\`\`\`

## Setting Up a GraphQL Server

### Using Apollo Server
\`\`\`javascript
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const typeDefs = \`
  type Query {
    hello: String
  }
\`;

const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL!'
  }
};

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  
  const app = express();
  server.applyMiddleware({ app });
  
  app.listen(4000, () => {
    console.log(\`Server ready at http://localhost:4000\${server.graphqlPath}\`);
  });
}

startServer();
\`\`\`

## Client-Side Implementation

### Using Apollo Client
\`\`\`javascript
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
      posts {
        title
      }
    }
  }
\`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>
          {user.name} - {user.posts.length} posts
        </li>
      ))}
    </ul>
  );
}
\`\`\`

## Advanced Features

### Subscriptions for Real-time Data
\`\`\`graphql
type Subscription {
  postAdded: Post!
  userOnline(userId: ID!): User!
}
\`\`\`

\`\`\`javascript
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED'])
    }
  },
  
  Mutation: {
    createPost: async (parent, { input }, context) => {
      const post = await context.db.post.create({ data: input });
      pubsub.publish('POST_ADDED', { postAdded: post });
      return post;
    }
  }
};
\`\`\`

### Fragments for Reusable Queries
\`\`\`graphql
fragment UserInfo on User {
  id
  name
  email
  avatar
}

query GetUser($id: ID!) {
  user(id: $id) {
    ...UserInfo
    posts {
      title
      content
    }
  }
}
\`\`\`

## Best Practices

### Query Optimization
- Use DataLoader to solve N+1 query problems
- Implement query depth limiting
- Add query complexity analysis
- Use caching strategies

### Error Handling
\`\`\`javascript
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');

const resolvers = {
  Query: {
    sensitiveData: (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      
      if (!context.user.hasPermission('READ_SENSITIVE')) {
        throw new ForbiddenError('Insufficient permissions');
      }
      
      return getSensitiveData();
    }
  }
};
\`\`\`

### Security Considerations
- Implement authentication and authorization
- Use query depth limiting
- Add rate limiting
- Validate and sanitize inputs
- Use HTTPS in production

## Migration Strategy from REST

### Gradual Migration
1. **Start with a GraphQL layer**: Wrap existing REST APIs
2. **Identify common queries**: Convert frequently used endpoints
3. **Optimize resolvers**: Replace REST calls with direct database queries
4. **Update clients gradually**: Migrate frontend components one by one

### Coexistence Pattern
\`\`\`javascript
// GraphQL resolver that calls existing REST API
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      const response = await fetch(\`\${REST_API_URL}/users/\${id}\`);
      return response.json();
    }
  }
};
\`\`\`

## Conclusion
GraphQL offers significant advantages over REST for many use cases, including precise data fetching, strong typing, and excellent developer experience. While there's a learning curve, the benefits of improved performance, flexibility, and developer productivity make it worth considering for your next API project.

The key to successful GraphQL adoption is understanding your specific use case, planning a gradual migration strategy, and following best practices for performance and security.`,

            5: `# Modern Frontend Development with React and TypeScript

## Introduction
Combining React with TypeScript creates a powerful development environment that provides type safety, better developer experience, and more maintainable code. This guide covers best practices for using these technologies together effectively.

## Setting Up the Development Environment

### Project Initialization
\`\`\`bash
# Create a new React TypeScript project
npx create-react-app my-app --template typescript

# Or with Vite for faster development
npm create vite@latest my-app -- --template react-ts
\`\`\`

### TypeScript Configuration
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
\`\`\`

## Type-Safe Component Development

### Functional Components with TypeScript
\`\`\`typescript
import React from 'react';

interface UserProps {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  onUserClick: (userId: number) => void;
}

const UserCard: React.FC<UserProps> = ({
  id,
  name,
  email,
  avatar,
  isActive,
  onUserClick
}) => {
  const handleClick = () => {
    onUserClick(id);
  };

  return (
    <div className={\`user-card \${isActive ? 'active' : ''}\`}>
      {avatar && <img src={avatar} alt={\`\${name}'s avatar\`} />}
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={handleClick}>View Profile</button>
    </div>
  );
};

export default UserCard;
\`\`\`

### Custom Hooks with TypeScript
\`\`\`typescript
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UseUserDataReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useUserData(userId: number): UseUserDataReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(\`/api/users/\${userId}\`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const userData: User = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
}

export default useUserData;
\`\`\`

## State Management with TypeScript

### Context API with TypeScript
\`\`\`typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  theme: 'light',
  notifications: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
\`\`\`

## API Integration with TypeScript

### Type-Safe API Calls
\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await this.request<User>(\`/users/\${id}\`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.request<User>(\`/users/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  }
}

export const apiClient = new ApiClient(process.env.REACT_APP_API_URL || '');
\`\`\`

## Form Handling with TypeScript

### Type-Safe Forms
\`\`\`typescript
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  age: number;
  interests: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0,
    interests: []
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.age < 18) {
      newErrors.age = 'Must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await apiClient.createUser(formData);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
\`\`\`

## Testing with TypeScript

### Component Testing
\`\`\`typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from './UserCard';

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true
};

describe('UserCard', () => {
  const mockOnUserClick = jest.fn();

  beforeEach(() => {
    mockOnUserClick.mockClear();
  });

  test('renders user information correctly', () => {
    render(
      <UserCard
        {...mockUser}
        onUserClick={mockOnUserClick}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('calls onUserClick when button is clicked', () => {
    render(
      <UserCard
        {...mockUser}
        onUserClick={mockOnUserClick}
      />
    );

    fireEvent.click(screen.getByText('View Profile'));
    expect(mockOnUserClick).toHaveBeenCalledWith(1);
  });

  test('applies active class when user is active', () => {
    const { container } = render(
      <UserCard
        {...mockUser}
        onUserClick={mockOnUserClick}
      />
    );

    expect(container.firstChild).toHaveClass('user-card', 'active');
  });
});
\`\`\`

## Performance Optimization

### Memoization with TypeScript
\`\`\`typescript
import React, { memo, useMemo, useCallback } from 'react';

interface ExpensiveComponentProps {
  data: ComplexData[];
  onItemClick: (id: string) => void;
  filter: string;
}

const ExpensiveComponent = memo<ExpensiveComponentProps>(({
  data,
  onItemClick,
  filter
}) => {
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {filteredData.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

export default ExpensiveComponent;
\`\`\`

## Conclusion
React and TypeScript together provide a robust foundation for building scalable, maintainable frontend applications. The type safety, improved developer experience, and better refactoring capabilities make this combination ideal for large-scale projects.

Key benefits include:
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Improved Maintainability**: Easier to refactor and update code
- **Team Collaboration**: Clear interfaces and contracts

By following these patterns and best practices, you can build robust React applications that are easier to maintain, test, and scale over time.`,

            6: `# Building Scalable Web Applications - DevConf 2024 Presentation

## Presentation Overview
This presentation was delivered at DevConf 2024 to an audience of 200+ developers, focusing on architectural patterns and strategies for building web applications that can scale effectively with growing user bases and feature requirements.

## Key Topics Covered

### 1. Scalability Fundamentals
Understanding the different types of scalability and their implications:

#### Horizontal vs Vertical Scaling
- **Vertical Scaling (Scale Up)**: Adding more power to existing machines
  - Pros: Simple to implement, no application changes needed
  - Cons: Hardware limits, single point of failure
  - Best for: Databases, legacy applications

- **Horizontal Scaling (Scale Out)**: Adding more machines to the pool
  - Pros: No theoretical limit, better fault tolerance
  - Cons: Application complexity, data consistency challenges
  - Best for: Web servers, microservices

#### Performance vs Scalability
- **Performance**: How fast a system processes a single request
- **Scalability**: How well a system handles increased load
- **Key Insight**: You can have a performant system that doesn't scale, and a scalable system that isn't performant

### 2. Architectural Patterns

#### Microservices Architecture
Breaking down monolithic applications into smaller, independent services:

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │  Order Service  │    │Product Service  │
│                 │    │                 │    │                 │
│ - Authentication│    │ - Order Management│  │ - Catalog       │
│ - User Profiles │    │ - Payment       │    │ - Inventory     │
│ - Preferences   │    │ - Shipping      │    │ - Reviews       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │                 │
                    │ - Routing       │
                    │ - Authentication│
                    │ - Rate Limiting │
                    │ - Load Balancing│
                    └─────────────────┘
\`\`\`

**Benefits:**
- Independent deployment and scaling
- Technology diversity
- Team autonomy
- Fault isolation

**Challenges:**
- Distributed system complexity
- Data consistency
- Network latency
- Monitoring and debugging

#### Event-Driven Architecture
Using events to decouple services and enable asynchronous processing:

\`\`\`javascript
// Event Publisher
class OrderService {
  async createOrder(orderData) {
    const order = await this.saveOrder(orderData);
    
    // Publish event
    await this.eventBus.publish('order.created', {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      total: order.total
    });
    
    return order;
  }
}

// Event Subscribers
class InventoryService {
  async handleOrderCreated(event) {
    const { items } = event.data;
    await this.updateInventory(items);
  }
}

class EmailService {
  async handleOrderCreated(event) {
    const { userId, orderId } = event.data;
    await this.sendOrderConfirmation(userId, orderId);
  }
}
\`\`\`

### 3. Database Scaling Strategies

#### Read Replicas
Distributing read operations across multiple database instances:

\`\`\`javascript
class DatabaseManager {
  constructor() {
    this.writeDB = new Database(WRITE_DB_CONFIG);
    this.readDBs = [
      new Database(READ_DB_1_CONFIG),
      new Database(READ_DB_2_CONFIG),
      new Database(READ_DB_3_CONFIG)
    ];
  }
  
  async write(query, params) {
    return await this.writeDB.query(query, params);
  }
  
  async read(query, params) {
    const randomIndex = Math.floor(Math.random() * this.readDBs.length);
    return await this.readDBs[randomIndex].query(query, params);
  }
}
\`\`\`

#### Database Sharding
Partitioning data across multiple databases:

\`\`\`javascript
class ShardedDatabase {
  constructor(shards) {
    this.shards = shards;
  }
  
  getShardKey(userId) {
    return userId % this.shards.length;
  }
  
  async getUserData(userId) {
    const shardIndex = this.getShardKey(userId);
    return await this.shards[shardIndex].query(
      'SELECT * FROM users WHERE id = ?', 
      [userId]
    );
  }
}
\`\`\`

### 4. Caching Strategies

#### Multi-Level Caching
Implementing caching at different layers of the application:

\`\`\`
┌─────────────┐
│   Browser   │ ← HTTP Cache Headers
└─────────────┘
       │
┌─────────────┐
│     CDN     │ ← Static Assets, API Responses
└─────────────┘
       │
┌─────────────┐
│Load Balancer│ ← Connection Pooling
└─────────────┘
       │
┌─────────────┐
│Application  │ ← In-Memory Cache (Redis)
└─────────────┘
       │
┌─────────────┐
│  Database   │ ← Query Result Cache
└─────────────┘
\`\`\`

#### Cache Invalidation Strategies
\`\`\`javascript
class CacheManager {
  constructor() {
    this.cache = new Redis();
  }
  
  // Time-based expiration
  async setWithTTL(key, value, ttlSeconds) {
    await this.cache.setex(key, ttlSeconds, JSON.stringify(value));
  }
  
  // Tag-based invalidation
  async invalidateByTag(tag) {
    const keys = await this.cache.keys(\`*:\${tag}:*\`);
    if (keys.length > 0) {
      await this.cache.del(keys);
    }
  }
  
  // Write-through cache
  async updateUser(userId, userData) {
    await this.database.updateUser(userId, userData);
    await this.cache.del(\`user:\${userId}\`);
    return await this.getUser(userId); // Refresh cache
  }
}
\`\`\`

### 5. Load Balancing and Traffic Management

#### Load Balancing Algorithms
- **Round Robin**: Distribute requests evenly
- **Least Connections**: Route to server with fewest active connections
- **Weighted Round Robin**: Assign different weights to servers
- **IP Hash**: Route based on client IP for session affinity

#### Circuit Breaker Pattern
Preventing cascade failures in distributed systems:

\`\`\`javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
\`\`\`

### 6. Monitoring and Observability

#### The Three Pillars of Observability
1. **Metrics**: Quantitative measurements over time
2. **Logs**: Discrete events with context
3. **Traces**: Request flow through distributed systems

#### Implementation Example
\`\`\`javascript
const prometheus = require('prom-client');

// Metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

// Middleware for metrics collection
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});

// Distributed tracing
const opentelemetry = require('@opentelemetry/api');

function traceFunction(name, fn) {
  return async (...args) => {
    const span = opentelemetry.trace.getActiveTracer().startSpan(name);
    try {
      const result = await fn(...args);
      span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ 
        code: opentelemetry.SpanStatusCode.ERROR, 
        message: error.message 
      });
      throw error;
    } finally {
      span.end();
    }
  };
}
\`\`\`

## Key Takeaways

### 1. Start Simple, Scale Gradually
- Begin with a monolithic architecture
- Identify bottlenecks through monitoring
- Extract services when you have clear boundaries
- Don't over-engineer from the start

### 2. Design for Failure
- Assume components will fail
- Implement graceful degradation
- Use circuit breakers and timeouts
- Plan for disaster recovery

### 3. Monitor Everything
- Implement comprehensive logging
- Track key performance metrics
- Set up alerting for critical issues
- Use distributed tracing for complex flows

### 4. Optimize Based on Data
- Measure before optimizing
- Focus on actual bottlenecks
- Consider the cost of complexity
- Regular performance reviews

## Audience Feedback Highlights

> "Excellent presentation with practical examples that I can apply immediately to our current architecture challenges."

> "Great insights into microservices architecture. The circuit breaker pattern explanation was particularly valuable."

> "Very well structured and easy to follow. The real-world examples made complex concepts accessible."

## Resources and Further Reading
- **Books**: "Designing Data-Intensive Applications" by Martin Kleppmann
- **Tools**: Kubernetes, Docker, Redis, Prometheus, Grafana
- **Patterns**: Circuit Breaker, Bulkhead, Timeout, Retry
- **Monitoring**: ELK Stack, Jaeger, Zipkin

## Conclusion
Building scalable web applications requires careful consideration of architecture, infrastructure, and operational practices. The key is to start simple, measure everything, and scale gradually based on actual needs rather than anticipated requirements.

Success in scaling comes from understanding your specific constraints, choosing the right patterns for your use case, and maintaining a culture of continuous improvement and learning.`,

            7: `# React Performance Optimization Workshop

## Workshop Overview
This hands-on workshop was conducted for the React San Francisco meetup, focusing on practical techniques for optimizing React application performance. The session included live coding examples and interactive exercises.

## Workshop Agenda

### Part 1: Understanding React Performance (30 minutes)
- React rendering process
- Virtual DOM and reconciliation
- Common performance bottlenecks
- Profiling tools introduction

### Part 2: Optimization Techniques (60 minutes)
- Memoization strategies
- Code splitting and lazy loading
- Bundle optimization
- State management optimization

### Part 3: Hands-on Exercises (30 minutes)
- Performance audit of sample application
- Implementing optimizations
- Measuring improvements

## Key Concepts Covered

### React Rendering Process
Understanding how React renders components is crucial for optimization:

\`\`\`javascript
// React rendering phases
1. Trigger → 2. Render → 3. Commit

// Trigger phase: State change or props change
function App() {
  const [count, setCount] = useState(0);
  
  // This triggers a re-render
  const increment = () => setCount(count + 1);
  
  return <Counter count={count} onIncrement={increment} />;
}

// Render phase: React calls component functions
function Counter({ count, onIncrement }) {
  console.log('Counter rendering'); // This runs on every render
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>+</button>
    </div>
  );
}

// Commit phase: React applies changes to DOM
\`\`\`

### Profiling React Applications
Using React DevTools Profiler to identify performance issues:

\`\`\`javascript
// Wrap components with Profiler for detailed metrics
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log('Component:', id);
  console.log('Phase:', phase); // 'mount' or 'update'
  console.log('Actual duration:', actualDuration);
  console.log('Base duration:', baseDuration);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Header />
      <MainContent />
      <Footer />
    </Profiler>
  );
}
\`\`\`

## Optimization Techniques

### 1. Memoization with React.memo
Preventing unnecessary re-renders of functional components:

\`\`\`javascript
// Without memoization - re-renders on every parent update
function ExpensiveComponent({ data, filter }) {
  const processedData = data.filter(item => item.category === filter);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// With memoization - only re-renders when props change
const ExpensiveComponent = React.memo(({ data, filter }) => {
  const processedData = data.filter(item => item.category === filter);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

// Custom comparison function for complex props
const ExpensiveComponent = React.memo(({ data, filter }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return prevProps.filter === nextProps.filter && 
         prevProps.data.length === nextProps.data.length;
});
\`\`\`

### 2. useMemo for Expensive Calculations
Memoizing computed values to avoid recalculation:

\`\`\`javascript
function DataVisualization({ rawData, filters }) {
  // Expensive calculation - only runs when dependencies change
  const processedData = useMemo(() => {
    console.log('Processing data...'); // Only logs when recalculating
    
    return rawData
      .filter(item => filters.categories.includes(item.category))
      .filter(item => item.date >= filters.startDate && item.date <= filters.endDate)
      .sort((a, b) => b.value - a.value)
      .slice(0, 100); // Top 100 items
  }, [rawData, filters.categories, filters.startDate, filters.endDate]);

  // This calculation runs on every render - BAD
  const badExample = rawData.filter(item => item.active).length;
  
  // This calculation is memoized - GOOD
  const activeCount = useMemo(() => {
    return rawData.filter(item => item.active).length;
  }, [rawData]);

  return (
    <div>
      <h2>Data Visualization ({activeCount} active items)</h2>
      <Chart data={processedData} />
    </div>
  );
}
\`\`\`

### 3. useCallback for Function Memoization
Preventing function recreation on every render:

\`\`\`javascript
function TodoList({ todos, onToggle, onDelete }) {
  const [filter, setFilter] = useState('all');

  // Without useCallback - new function on every render
  const handleToggle = (id) => {
    onToggle(id);
  };

  // With useCallback - function only recreated when dependencies change
  const handleToggleOptimized = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);

  // Complex callback with multiple dependencies
  const handleFilteredAction = useCallback((action, id) => {
    if (filter === 'completed' && action === 'toggle') {
      // Special handling for completed items
      onToggle(id);
    } else if (action === 'delete') {
      onDelete(id);
    }
  }, [filter, onToggle, onDelete]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div>
      <FilterButtons filter={filter} onFilterChange={setFilter} />
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggleOptimized}
          onDelete={handleFilteredAction}
        />
      ))}
    </div>
  );
}

// Memoized child component
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  return (
    <div className={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete('delete', todo.id)}>Delete</button>
    </div>
  );
});
\`\`\`

### 4. Code Splitting and Lazy Loading
Reducing initial bundle size with dynamic imports:

\`\`\`javascript
import { lazy, Suspense } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const UserProfile = lazy(() => import('./UserProfile'));
const Analytics = lazy(() => import('./Analytics'));

// Route-based code splitting
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Component-based code splitting
function ConditionalComponent({ showAdvanced }) {
  const [AdvancedComponent, setAdvancedComponent] = useState(null);

  useEffect(() => {
    if (showAdvanced && !AdvancedComponent) {
      import('./AdvancedComponent').then(module => {
        setAdvancedComponent(() => module.default);
      });
    }
  }, [showAdvanced, AdvancedComponent]);

  return (
    <div>
      <BasicComponent />
      {showAdvanced && AdvancedComponent && (
        <Suspense fallback={<div>Loading advanced features...</div>}>
          <AdvancedComponent />
        </Suspense>
      )}
    </div>
  );
}
\`\`\`

### 5. Virtual Scrolling for Large Lists
Efficiently rendering large datasets:

\`\`\`javascript
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <div className="list-item">
        <h3>{items[index].title}</h3>
        <p>{items[index].description}</p>
      </div>
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </List>
  );
}

// Custom virtual scrolling implementation
function CustomVirtualList({ items, itemHeight = 50, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## Workshop Exercises

### Exercise 1: Performance Audit
Participants analyzed a sample React application with performance issues:

\`\`\`javascript
// Problematic component (before optimization)
function ProductList({ products, category, sortBy }) {
  // Problem: Expensive calculation on every render
  const filteredProducts = products
    .filter(p => p.category === category)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Problem: Inline function creation
  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => console.log('Clicked:', product.id)} // New function every render
        />
      ))}
    </div>
  );
}

// Optimized version
const ProductList = React.memo(({ products, category, sortBy }) => {
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.category === category)
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, category, sortBy]);

  const handleProductClick = useCallback((productId) => {
    console.log('Clicked:', productId);
  }, []);

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
});
\`\`\`

### Exercise 2: Bundle Analysis
Using webpack-bundle-analyzer to identify optimization opportunities:

\`\`\`bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add script to package.json
"analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"

# Run analysis
npm run analyze
\`\`\`

## Performance Measurement

### Before and After Metrics
Workshop participants measured improvements using:

- **React DevTools Profiler**: Component render times
- **Chrome DevTools**: JavaScript execution time
- **Lighthouse**: Overall performance scores
- **Bundle Analyzer**: JavaScript bundle sizes

### Typical Improvements Achieved
- **Render Time**: 40-60% reduction in component render times
- **Bundle Size**: 20-30% reduction through code splitting
- **Memory Usage**: 25% reduction through proper cleanup
- **User Experience**: Smoother interactions and faster page loads

## Key Takeaways

### 1. Measure First, Optimize Second
- Use profiling tools to identify actual bottlenecks
- Don't optimize based on assumptions
- Set performance budgets and monitor them

### 2. Optimize Strategically
- Focus on components that render frequently
- Optimize expensive calculations and large lists
- Consider the complexity cost of optimizations

### 3. Common Pitfalls to Avoid
- Over-memoizing simple components
- Creating new objects/functions in render
- Not cleaning up subscriptions and timers
- Ignoring bundle size and code splitting

## Workshop Feedback

> "Very hands-on and practical. The live coding examples helped me understand the concepts much better than just reading documentation."

> "Learned a lot about React optimization. The before/after comparisons with actual metrics were very convincing."

> "Great examples and exercises. I can immediately apply these techniques to our production application."

## Resources Provided
- **Code Repository**: Complete workshop examples and exercises
- **Performance Checklist**: Step-by-step optimization guide
- **Tool Recommendations**: Profiling and monitoring tools
- **Further Reading**: Advanced performance optimization resources

## Conclusion
React performance optimization is about understanding how React works, measuring actual performance issues, and applying the right techniques strategically. The workshop provided practical, hands-on experience with real-world optimization scenarios that participants could immediately apply to their own projects.`,

            8: `# From Monolith to Microservices - Lessons Learned

## Presentation Overview
This tech talk shared real-world experiences and lessons learned from migrating a large monolithic application to a microservices architecture. The presentation covered both the technical and organizational challenges encountered during the transformation.

## The Starting Point: Our Monolithic Application

### Application Overview
Our e-commerce platform started as a Ruby on Rails monolith serving 100,000+ daily active users:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Monolithic Application                    │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    User     │ │   Product   │ │    Order    │          │
│  │ Management  │ │   Catalog   │ │ Processing  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Payment   │ │  Inventory  │ │   Shipping  │          │
│  │ Processing  │ │ Management  │ │   & Tracking│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│              Shared Database & Codebase                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Pain Points That Drove the Migration
1. **Deployment Bottlenecks**: Single deployment pipeline for all features
2. **Scaling Challenges**: Entire application scaled together
3. **Technology Lock-in**: Stuck with Ruby/Rails for all components
4. **Team Dependencies**: Teams blocked by each other's changes
5. **Database Contention**: Single database becoming a bottleneck

## Migration Strategy

### Phase 1: Strangler Fig Pattern
We used the Strangler Fig pattern to gradually extract services:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Legacy Monolith                          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    User     │ │   Product   │ │    Order    │          │
│  │ Management  │ │   Catalog   │ │ Processing  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐                          │
│  │   Payment   │ │  Inventory  │     ┌─────────────┐      │
│  │ Processing  │ │ Management  │────▶│   Shipping  │      │
│  └─────────────┘ └─────────────┘     │   Service   │      │
│                                      │ (New Service)│      │
│                                      └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Service Extraction Process
1. **Identify Boundaries**: Domain-driven design principles
2. **Create New Service**: Build alongside existing functionality
3. **Dual Write**: Write to both old and new systems
4. **Migrate Reads**: Gradually shift read traffic
5. **Remove Old Code**: Clean up legacy implementation

### Example: Extracting the User Service
\`\`\`ruby
# Step 1: Create new User Service (Node.js/Express)
class UserService
  def create_user(user_data)
    # New service implementation
    response = HTTParty.post("#{USER_SERVICE_URL}/users", {
      body: user_data.to_json,
      headers: { 'Content-Type' => 'application/json' }
    })
    
    JSON.parse(response.body)
  end
end

# Step 2: Dual write in monolith
class UsersController < ApplicationController
  def create
    # Write to legacy system
    legacy_user = User.create(user_params)
    
    # Write to new service
    begin
      new_user = UserService.new.create_user(user_params)
      Rails.logger.info "User created in new service: #{new_user['id']}"
    rescue => e
      Rails.logger.error "Failed to create user in new service: #{e.message}"
      # Continue with legacy flow
    end
    
    render json: legacy_user
  end
end

# Step 3: Gradually migrate reads
class UsersController < ApplicationController
  def show
    if feature_flag_enabled?(:use_user_service)
      user = UserService.new.get_user(params[:id])
    else
      user = User.find(params[:id])
    end
    
    render json: user
  end
end
\`\`\`

## Technical Challenges and Solutions

### 1. Data Consistency
**Challenge**: Maintaining consistency across distributed services

**Solution**: Event-driven architecture with eventual consistency
\`\`\`javascript
// Event-driven data synchronization
class OrderService {
  async createOrder(orderData) {
    const order = await this.orderRepository.create(orderData);
    
    // Publish events for other services
    await this.eventBus.publish('order.created', {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      timestamp: new Date().toISOString()
    });
    
    return order;
  }
}

// Inventory service listens for order events
class InventoryService {
  async handleOrderCreated(event) {
    const { items } = event.data;
    
    try {
      await this.updateInventory(items);
      await this.eventBus.publish('inventory.updated', {
        orderId: event.data.orderId,
        items: items,
        status: 'success'
      });
    } catch (error) {
      await this.eventBus.publish('inventory.update.failed', {
        orderId: event.data.orderId,
        error: error.message
      });
    }
  }
}
\`\`\`

### 2. Service Communication
**Challenge**: Reliable communication between services

**Solution**: Circuit breakers and retry mechanisms
\`\`\`javascript
class ServiceClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.circuitBreaker = new CircuitBreaker(this.makeRequest.bind(this), {
      timeout: options.timeout || 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000
    });
  }
  
  async makeRequest(path, options) {
    const response = await fetch(\`\${this.baseUrl}\${path}\`, {
      timeout: 5000,
      ...options
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    return response.json();
  }
  
  async get(path) {
    return await this.circuitBreaker.fire(path, { method: 'GET' });
  }
  
  async post(path, data) {
    return await this.circuitBreaker.fire(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}
\`\`\`

### 3. Database Migration
**Challenge**: Splitting shared database without downtime

**Solution**: Database-per-service with gradual migration
\`\`\`sql
-- Phase 1: Create separate databases
CREATE DATABASE user_service_db;
CREATE DATABASE order_service_db;
CREATE DATABASE inventory_service_db;

-- Phase 2: Migrate data with zero downtime
-- Use database replication and sync tools
-- Example: AWS Database Migration Service

-- Phase 3: Update application connections
-- Gradually switch services to new databases
-- Monitor for data consistency issues
\`\`\`

## Organizational Challenges

### 1. Team Structure Changes
**Before**: Feature teams working across entire codebase
**After**: Service teams owning specific domains

\`\`\`
Before (Feature Teams):
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Team A    │ │   Team B    │ │   Team C    │
│ (Frontend)  │ │ (Backend)   │ │   (QA)      │
└─────────────┘ └─────────────┘ └─────────────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
              ┌─────────────────┐
              │    Monolith     │
              └─────────────────┘

After (Service Teams):
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ User Service│ │Order Service│ │Product Svc  │
│    Team     │ │    Team     │ │    Team     │
│             │ │             │ │             │
│ Full Stack  │ │ Full Stack  │ │ Full Stack  │
│   + DevOps  │ │   + DevOps  │ │   + DevOps  │
└─────────────┘ └─────────────┘ └─────────────┘
\`\`\`

### 2. Communication Overhead
**Challenge**: Increased coordination between teams
**Solution**: 
- Clear service contracts and APIs
- Regular architecture review meetings
- Shared documentation and standards
- Cross-team rotation programs

### 3. Operational Complexity
**Challenge**: Managing multiple services in production
**Solution**: Investment in DevOps tooling and practices

\`\`\`yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:v1.2.3
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
\`\`\`

## Lessons Learned

### What Went Well
1. **Improved Deployment Velocity**: Teams could deploy independently
2. **Better Scalability**: Services scaled based on actual demand
3. **Technology Diversity**: Teams chose appropriate technologies
4. **Fault Isolation**: Issues in one service didn't affect others
5. **Team Autonomy**: Reduced dependencies between teams

### What We Would Do Differently
1. **Start with Better Monitoring**: Implement observability from day one
2. **Invest in Tooling Earlier**: DevOps infrastructure should come first
3. **Define Contracts Upfront**: Clear API contracts prevent integration issues
4. **Plan for Data Migration**: Database splitting was more complex than expected
5. **Gradual Team Restructuring**: Organizational changes should follow technical changes

### Unexpected Challenges
1. **Distributed Debugging**: Tracing issues across services was difficult
2. **Testing Complexity**: Integration testing became more complex
3. **Network Latency**: Service-to-service calls added latency
4. **Configuration Management**: Managing configs across services
5. **Security Boundaries**: Implementing authentication/authorization

## Migration Timeline and Metrics

### Timeline
- **Month 1-2**: Planning and architecture design
- **Month 3-6**: First service extraction (User Service)
- **Month 7-12**: Core services migration (Order, Product, Inventory)
- **Month 13-18**: Supporting services and cleanup
- **Month 19-24**: Optimization and monitoring improvements

### Key Metrics
- **Deployment Frequency**: 2x per week → 10x per day
- **Lead Time**: 2 weeks → 2 days
- **Mean Time to Recovery**: 4 hours → 30 minutes
- **Service Availability**: 99.5% → 99.9%
- **Team Velocity**: 25% increase after initial learning curve

## Recommendations for Others

### When to Consider Microservices
- Team size > 8-10 developers
- Clear domain boundaries exist
- Independent scaling requirements
- Different technology needs
- Organizational readiness for complexity

### When to Stick with Monolith
- Small team (< 5 developers)
- Unclear domain boundaries
- Simple application requirements
- Limited operational expertise
- Early-stage product development

### Success Factors
1. **Strong DevOps Culture**: Essential for managing complexity
2. **Clear Service Boundaries**: Domain-driven design principles
3. **Comprehensive Monitoring**: Observability is non-negotiable
4. **Gradual Migration**: Avoid big-bang rewrites
5. **Team Buy-in**: Organizational alignment is crucial

## Conclusion
Migrating from monolith to microservices is a significant undertaking that requires careful planning, strong technical practices, and organizational commitment. While the benefits are substantial, the complexity should not be underestimated.

The key to success is treating it as an evolutionary process rather than a revolutionary change, investing heavily in tooling and monitoring, and ensuring your organization is ready for the increased operational complexity.

Our journey took 2 years and resulted in improved deployment velocity, better scalability, and increased team autonomy, but it required significant investment in infrastructure, tooling, and team education.`
        };

        return blogContent[blogId] || `# ${this.currentItem?.title || 'Blog Post'}

## Content Overview
This is a detailed description of the blog post or presentation. The content would include comprehensive information about the topic, key insights, and practical examples.

## Key Points
- Important concept 1
- Important concept 2
- Important concept 3

## Detailed Analysis
In-depth discussion of the topic with examples, code snippets, and practical applications.

## Conclusion
Summary of key takeaways and actionable insights for readers.`;
    }

    showError(message) {
        const container = document.getElementById('detail-content');
        container.innerHTML = `
            <div class="error-state">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="index.html" class="btn btn-primary">Back to Portfolio</a>
            </div>
        `;
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        }
    }
}

// Initialize the detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DetailPageManager();
});