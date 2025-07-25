// Portfolio data - centralized data management
window.portfolioData = {
    // Personal information
    personal: {
        name: "Vijay Raja",
        title: "Full Stack Developer",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "I'm a passionate full-stack developer who loves creating beautiful, functional web applications. I specialize in modern JavaScript frameworks and have a keen eye for user experience design.",
        social: {
            github: "https://github.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
            twitter: "https://twitter.com/johndoe",
            portfolio: "https://johndoe.dev"
        }
    },

    // Professional journey timeline
    journey: [
        {
            year: "2024",
            title: "Senior Full Stack Developer",
            description: "Leading development of scalable web applications using modern technologies and mentoring junior developers."
        },
        {
            year: "2022",
            title: "Full Stack Developer",
            description: "Developed and maintained multiple client projects, specializing in React and Node.js applications."
        },
        {
            year: "2021",
            title: "Frontend Developer",
            description: "Started my professional journey focusing on creating responsive and interactive user interfaces."
        },
        {
            year: "2020",
            title: "Computer Science Graduate",
            description: "Graduated with honors and began exploring web development technologies and frameworks."
        },
        {
            year: "2018",
            title: "Started Coding Journey",
            description: "Wrote my first 'Hello World' program and fell in love with programming and problem-solving."
        }
    ],

    // Projects portfolio
    projects: [
        {
            id: 1,
            title: "E-Commerce Platform",
            description: "A full-featured e-commerce platform with user authentication, payment integration, and admin dashboard. Built with React, Node.js, and MongoDB.",
            image: "/images/ecommerce-project.jpg",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express", "JWT"],
            category: "featured",
            liveUrl: "https://ecommerce-demo.johndoe.dev",
            githubUrl: "https://github.com/johndoe/ecommerce-platform",
            featured: true,
            completedAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Task Management App",
            description: "A collaborative task management application with real-time updates, team collaboration features, and intuitive drag-and-drop interface.",
            image: "/images/taskapp-project.jpg",
            technologies: ["Vue.js", "Socket.io", "PostgreSQL", "Docker", "AWS"],
            category: "featured",
            liveUrl: "https://taskapp-demo.johndoe.dev",
            githubUrl: "https://github.com/johndoe/task-management",
            featured: true,
            completedAt: "2023-11-20"
        },
        {
            id: 3,
            title: "Weather Dashboard",
            description: "A responsive weather dashboard that provides current weather conditions, forecasts, and weather maps using multiple APIs.",
            image: "/images/weather-project.jpg",
            technologies: ["JavaScript", "HTML5", "CSS3", "OpenWeather API", "Chart.js"],
            category: "opensource",
            liveUrl: "https://weather-dashboard.johndoe.dev",
            githubUrl: "https://github.com/johndoe/weather-dashboard",
            featured: false,
            completedAt: "2023-08-10"
        },
        {
            id: 4,
            title: "Personal Blog Engine",
            description: "A custom-built blog engine with markdown support, SEO optimization, and content management system for technical writing.",
            image: "/images/blog-project.jpg",
            technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel", "CMS"],
            category: "opensource",
            liveUrl: "https://blog.johndoe.dev",
            githubUrl: "https://github.com/johndoe/blog-engine",
            featured: false,
            completedAt: "2023-06-05"
        },
        {
            id: 5,
            title: "Portfolio Website",
            description: "My personal portfolio website showcasing my projects, skills, and professional journey. Built with modern web technologies.",
            image: "/images/portfolio-project.jpg",
            technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Responsive Design"],
            category: "featured",
            liveUrl: "https://johndoe.dev",
            githubUrl: "https://github.com/johndoe/portfolio",
            featured: true,
            completedAt: "2024-02-28"
        },
        {
            id: 6,
            title: "API Rate Limiter",
            description: "A flexible and efficient rate limiting middleware for Node.js applications with support for multiple storage backends.",
            image: "/images/ratelimiter-project.jpg",
            technologies: ["Node.js", "Redis", "Express", "TypeScript", "Testing"],
            category: "opensource",
            liveUrl: null,
            githubUrl: "https://github.com/johndoe/api-rate-limiter",
            featured: false,
            completedAt: "2023-04-15"
        }
    ],

    // Technical skills organized by categories
    skills: {
        "Cyber Security Researching": [
            "Penetration Testing",
            "Vulnerability Assessment",
            "Security Auditing",
            "Threat Analysis"
        ],
        "DataBase Management": [
            "Microsoft SQL Server",
            "MySQL",
            "PostgreSQL"
        ],
        "Programming Languages": [
            "C",
            "C++",
            ".Net and C#",
            "Java",
            "Python",
            "PHP",
            "Flutter",
            "Bash",
            "Joget",
            "Markdown",
            "KaTeX"
        ],
        "UI/UX": [
            "HTML 5",
            "CSS 3",
            "Bootstrap",
            "Dart",
            "Figma",
            "Illustrator"
        ],
        "Methodology": [
            "Agile",
            "Waterfall",
            "Kanban"
        ],
        "Tools & Operating Systems": [
            "Git",
            "Docker",
            "Linux"
        ],
        "Soft Skills": [
            "Problem Solving",
            "Team Leadership",
            "Communication"
        ]
    },

    // Educational background
    education: [
        {
            degree: "Upto HSLC",
            institution: "Government higher secondary school, Irumeni",
            duration: "2016 - 2023",
            description: ""  
        },
        {
             degree: "Bachelor of Science",
            institution: "SRMV College of arts and science, Coimbatore",
            duration: "2023 - 2026",
            description: "Specialization in Computer Science",
        }
    ],

    // Professional experience
    experience: [
        {
            position: "Senior Full Stack Developer",
            company: "TechFlow Solutions",
            location: "San Francisco, CA",
            duration: "Jan 2023 - Present",
            description: "Leading a team of 5 developers in building scalable web applications for enterprise clients. Responsible for architecture decisions, code reviews, and mentoring junior developers.",
            responsibilities: [
                "Architect and develop scalable web applications using React, Node.js, and AWS",
                "Lead code reviews and implement best practices for development workflow",
                "Mentor junior developers and conduct technical interviews",
                "Collaborate with product managers and designers to deliver user-centric solutions",
                "Optimize application performance and implement automated testing strategies",
                "Manage CI/CD pipelines and deployment processes"
            ],
            technologies: ["React", "Node.js", "AWS", "Docker", "PostgreSQL", "GraphQL", "TypeScript"],
            achievements: [
                "Reduced application load time by 40% through performance optimizations",
                "Led migration of legacy system to modern tech stack",
                "Increased team productivity by 25% through process improvements"
            ]
        },
        {
            position: "Full Stack Developer",
            company: "Digital Innovations Inc",
            location: "San Francisco, CA",
            duration: "Mar 2021 - Dec 2022",
            description: "Developed and maintained multiple client projects, specializing in React and Node.js applications. Worked closely with clients to understand requirements and deliver solutions.",
            responsibilities: [
                "Built responsive web applications using React, Vue.js, and Node.js",
                "Developed RESTful APIs and integrated third-party services",
                "Collaborated with UI/UX designers to implement pixel-perfect designs",
                "Participated in agile development process and sprint planning",
                "Maintained and updated legacy codebases",
                "Provided technical support and bug fixes for production applications"
            ],
            technologies: ["React", "Vue.js", "Node.js", "MongoDB", "Express", "Socket.io", "Sass"],
            achievements: [
                "Successfully delivered 8+ client projects on time and within budget",
                "Implemented real-time features that improved user engagement by 30%",
                "Reduced client reported bugs by 50% through improved testing practices"
            ]
        },
        {
            position: "Frontend Developer",
            company: "StartupXYZ",
            location: "San Francisco, CA",
            duration: "Jun 2020 - Feb 2021",
            description: "My first professional role focused on creating responsive and interactive user interfaces. Gained valuable experience in modern frontend development practices.",
            responsibilities: [
                "Developed responsive user interfaces using HTML5, CSS3, and JavaScript",
                "Converted design mockups into functional web pages",
                "Optimized web applications for maximum speed and scalability",
                "Collaborated with backend developers to integrate APIs",
                "Participated in user testing sessions and implemented feedback",
                "Maintained cross-browser compatibility and accessibility standards"
            ],
            technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "jQuery", "Webpack"],
            achievements: [
                "Improved website accessibility score from 72 to 95",
                "Reduced page load time by 35% through code optimization",
                "Successfully launched 3 major product features"
            ]
        }
    ],

    // Blog posts and presentations
    blogs: [
        {
            title: "Building Scalable React Applications: Best Practices and Patterns",
            excerpt: "A comprehensive guide to building maintainable and scalable React applications with modern patterns and best practices.",
            date: "2024-02-15",
            readTime: 12,
            url: "https://blog.johndoe.dev/scalable-react-applications",
            tags: ["React", "JavaScript", "Architecture", "Best Practices"],
            type: "blog",
            featured: true
        },
        {
            title: "The Future of Web Development: Trends to Watch in 2024",
            excerpt: "Exploring emerging trends in web development including AI integration, WebAssembly, and progressive web apps.",
            date: "2024-01-20",
            readTime: 8,
            url: "https://blog.johndoe.dev/web-development-trends-2024",
            tags: ["Web Development", "Trends", "AI", "PWA"],
            type: "blog",
            featured: true
        },
        {
            title: "Optimizing Node.js Performance: Tips and Techniques",
            excerpt: "Learn how to identify performance bottlenecks and optimize your Node.js applications for better speed and efficiency.",
            date: "2023-12-10",
            readTime: 15,
            url: "https://blog.johndoe.dev/nodejs-performance-optimization",
            tags: ["Node.js", "Performance", "Backend", "Optimization"],
            type: "blog",
            featured: false
        },
        {
            title: "Introduction to GraphQL for REST API Developers",
            excerpt: "A practical guide for developers transitioning from REST APIs to GraphQL, covering key concepts and implementation strategies.",
            date: "2023-11-05",
            readTime: 10,
            url: "https://blog.johndoe.dev/graphql-for-rest-developers",
            tags: ["GraphQL", "APIs", "Backend", "Tutorial"],
            type: "blog",
            featured: false
        },
        {
            title: "Modern Frontend Development with React and TypeScript",
            excerpt: "Best practices for combining React with TypeScript to build type-safe and maintainable frontend applications.",
            date: "2023-09-15",
            readTime: 14,
            url: "https://blog.johndoe.dev/react-typescript-best-practices",
            tags: ["React", "TypeScript", "Frontend", "Development"],
            type: "blog",
            featured: true
        },
        {
            title: "Building Scalable Web Applications - Tech Talk at DevConf 2024",
            excerpt: "Presented architectural patterns and strategies for building scalable web applications to an audience of 200+ developers.",
            date: "2024-03-10",
            audience: 200,
            url: "https://slides.com/johndoe/scalable-web-apps-devconf2024",
            venue: "DevConf 2024, San Francisco",
            tags: ["Architecture", "Scalability", "Web Development", "Speaking"],
            type: "presentation",
            featured: true
        },
        {
            title: "React Performance Optimization - Workshop at ReactMeetup",
            excerpt: "Conducted a hands-on workshop on React performance optimization techniques for the local React developer community.",
            date: "2023-10-25",
            audience: 50,
            url: "https://slides.com/johndoe/react-performance-workshop",
            venue: "React Meetup SF",
            tags: ["React", "Performance", "Workshop", "Community"],
            type: "presentation",
            featured: false
        },
        {
            title: "From Monolith to Microservices - Lessons Learned",
            excerpt: "Shared experiences and lessons learned from migrating a monolithic application to a microservices architecture.",
            date: "2023-08-20",
            audience: 150,
            url: "https://slides.com/johndoe/monolith-to-microservices",
            venue: "TechTalk San Francisco",
            tags: ["Microservices", "Architecture", "Migration", "Lessons"],
            type: "presentation",
            featured: false
        }
    ],

    // Testimonials and recommendations
    testimonials: [
        {
            name: "Sarah Johnson",
            position: "Product Manager at TechFlow Solutions",
            content: "John is an exceptional developer who consistently delivers high-quality solutions. His ability to translate complex requirements into elegant code is remarkable.",
            image: "/images/testimonials/sarah.jpg",
            rating: 5
        },
        {
            name: "Mike Chen",
            position: "Senior Developer at Digital Innovations",
            content: "Working with John was a pleasure. He has a deep understanding of modern web technologies and always helps the team achieve their goals.",
            image: "/images/testimonials/mike.jpg",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            position: "UI/UX Designer",
            content: "John's attention to detail in implementing designs is outstanding. He understands both the technical and user experience aspects perfectly.",
            image: "/images/testimonials/emily.jpg",
            rating: 5
        }
    ],

    // Achievements and certifications
    achievements: [
        {
            title: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023-05-15",
            credentialId: "AWS-SA-2023-12345",
            url: "https://aws.amazon.com/verification/AWS-SA-2023-12345"
        },
        {
            title: "Google Cloud Professional Developer",
            issuer: "Google Cloud",
            date: "2022-11-20",
            credentialId: "GCP-DEV-2022-67890",
            url: "https://cloud.google.com/certification/verify/GCP-DEV-2022-67890"
        },
        {
            title: "Certified Scrum Master",
            issuer: "Scrum Alliance",
            date: "2022-03-10",
            credentialId: "CSM-2022-54321",
            url: "https://scrumalliance.org/verify/CSM-2022-54321"
        }
    ]
};

// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.portfolioData;
}