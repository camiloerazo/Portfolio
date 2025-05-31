import type { Project, Experience } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    repoUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveUrl: 'https://ecommerce.example.com',
    summary: 'A full-featured e-commerce platform built with Next.js, Stripe, and PostgreSQL. Includes product listings, cart functionality, and user authentication.',
    tags: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    imageUrl: 'https://placehold.co/600x400.png',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Task Management App',
    repoUrl: 'https://github.com/yourusername/task-manager',
    summary: 'A collaborative task management application using Firebase for real-time updates and authentication. Features drag-and-drop boards and task assignments.',
    tags: ['React', 'Firebase', 'JavaScript', 'Material UI'],
    imageUrl: 'https://placehold.co/600x400.png',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Personal Portfolio Website',
    repoUrl: 'https://github.com/yourusername/portfolio-v2',
    liveUrl: 'https://portfolio.example.com',
    summary: 'This very portfolio website, designed to showcase my projects and skills. Built with Next.js and Tailwind CSS, focusing on a clean and modern UI.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    imageUrl: 'https://placehold.co/600x400.png',
    isFeatured: false, // This one won't show by default
  },
  {
    id: '4',
    name: 'AI Powered Blog Summarizer',
    repoUrl: 'https://github.com/yourusername/ai-blog-summarizer',
    summary: 'A tool that uses a large language model to generate concise summaries of blog posts from URLs. Built with Python, Flask, and a third-party AI API.',
    tags: ['Python', 'Flask', 'AI', 'NLP'],
    imageUrl: 'https://placehold.co/600x400.png',
    isFeatured: true,
  },
];

export const mockExperience: Experience[] = [
  {
    id: '1',
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    companyUrl: 'https://techsolutions.example.com',
    startDate: 'Jan 2021',
    endDate: 'Present',
    description: [
      'Led the development of a new client-facing dashboard, improving user engagement by 25%.',
      'Mentored junior developers and conducted code reviews to maintain high code quality standards.',
      'Collaborated with UX/UI designers and backend teams to deliver seamless and responsive web applications.',
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Agile Methodologies'],
  },
  {
    id: '2',
    role: 'Software Engineer',
    company: 'Innovatech Ltd.',
    companyUrl: 'https://innovatech.example.com',
    startDate: 'Jun 2018',
    endDate: 'Dec 2020',
    description: [
      'Developed and maintained features for a SaaS product used by over 10,000 customers.',
      'Participated in the full software development lifecycle, from requirements gathering to deployment.',
      'Optimized application performance, reducing load times by 15%.',
    ],
    skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB', 'REST APIs'],
  },
];

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/camiloerazo1',
  github: 'https://github.com/camiloerazo',
  phoneNumber: '+57-312-216-55-33',
};

// Re-calculate allTags based on all projects, not just featured ones initially loaded.
// This ensures the filter options remain comprehensive.
export const allTags = Array.from(new Set(mockProjects.flatMap(p => p.tags))).sort();
