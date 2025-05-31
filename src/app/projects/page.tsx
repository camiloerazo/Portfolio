'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ProjectCard from '@/components/projects/ProjectCard';
import type { Project } from '@/lib/types';

// This is a simple password - in a real app, you'd want something more secure
const ADMIN_PASSWORD = 'portfolio2024';

export default function ProjectsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('portfolio_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchProjects();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/github?username=camiloerazo&enhanced=true');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();

      // Get featured projects from localStorage
      const featuredProjectIds = JSON.parse(
        localStorage.getItem('portfolio_featured_projects') || '[]'
      ) as string[];

      // Set featured status based on localStorage
      const projectsWithFeatured = data.map((project: any) => ({
        id: project.id.toString(),
        name: project.name,
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        summary: project.summary,
        tags: project.tags || [],
        imageUrl: project.imageUrl,
        isFeatured: featuredProjectIds.includes(project.id.toString()),
      }));

      setProjects(projectsWithFeatured);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error Loading Projects',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('portfolio_admin_auth', 'true');
      setIsAuthenticated(true);
      fetchProjects();
      toast({
        title: 'Welcome!',
        description: 'You are now logged in as admin.',
      });
    } else {
      toast({
        title: 'Invalid Password',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_auth');
    setIsAuthenticated(false);
    router.push('/');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  const handleToggleFeatured = (projectId: string) => {
    // Update local state
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, isFeatured: !project.isFeatured }
        : project
    );
    setProjects(updatedProjects);

    // Save to localStorage
    const featuredIds = updatedProjects
      .filter(p => p.isFeatured)
      .map(p => p.id);
    localStorage.setItem('portfolio_featured_projects', JSON.stringify(featuredIds));

    // Dispatch a custom event to notify the main page
    window.dispatchEvent(new CustomEvent('featuredProjectsUpdated'));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="relative">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFeatured(project.id)}
                className={project.isFeatured ? 'text-yellow-500' : 'text-muted-foreground'}
              >
                {project.isFeatured ? '★ Featured' : '☆ Not Featured'}
              </Button>
            </div>
            <CardContent className="pt-16">
              <h3 className="font-bold text-xl mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.summary}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 