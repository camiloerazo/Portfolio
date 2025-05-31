'use client';

import { useState, useMemo, useEffect } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilter from '@/components/projects/ProjectFilter';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ProjectsSection() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/github?username=camiloerazo&enhanced=true');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      
      // Get featured projects from localStorage
      const featuredProjectIds = JSON.parse(
        localStorage.getItem('portfolio_featured_projects') || '[]'
      ) as string[];

      // Set featured status based on localStorage
      const projectsWithFeatured: Project[] = data.map((project: any) => ({
        id: project.id.toString(),
        name: project.name,
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        summary: project.summary,
        tags: project.tags || [],
        imageUrl: project.imageUrl,
        isFeatured: featuredProjectIds.includes(project.id.toString()),
      }));

      setAllProjects(projectsWithFeatured);
      
      // Extract unique tags from all projects
      const tags = Array.from(new Set(
        projectsWithFeatured.flatMap((project: Project) => project.tags)
      )).sort();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error Loading Projects',
        description: 'Failed to load projects from GitHub. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Listen for featured projects updates
    const handleFeaturedUpdate = () => {
      fetchProjects();
    };

    window.addEventListener('featuredProjectsUpdated', handleFeaturedUpdate);
    return () => {
      window.removeEventListener('featuredProjectsUpdated', handleFeaturedUpdate);
    };
  }, [toast]);

  // Filtered projects to display: by featured status and selected tag
  const displayedProjects = useMemo(() => {
    let projectsToShow = allProjects.filter(project => project.isFeatured);
    if (selectedTag) {
      projectsToShow = projectsToShow.filter(project => project.tags.includes(selectedTag));
    }
    return projectsToShow;
  }, [allProjects, selectedTag]);

  if (isLoading) {
    return (
      <section id="projects" className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-headline font-bold mb-4 sm:text-4xl">Loading Projects...</h2>
          <p className="text-muted-foreground">Fetching your GitHub repositories...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-4 sm:text-4xl">Selected Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          A curated collection of my best projects, showcasing my skills and experience in software development.
        </p>
        
        <ProjectFilter 
          tags={availableTags} 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag} 
        />

        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">
            {selectedTag 
              ? `No projects found for "${selectedTag}".` 
              : 'No projects available at the moment.'}
          </p>
        )}
      </div>
    </section>
  );
}
