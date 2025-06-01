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
      
      // Set all projects directly without featured filtering
      const projects: Project[] = data.map((project: any) => ({
        id: project.id.toString(),
        name: project.name,
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        summary: project.summary,
        tags: project.tags || [],
        imageUrl: project.imageUrl,
      }));

      setAllProjects(projects);
      
      // Extract unique tags from all projects
      const tags = Array.from(new Set(
        projects.flatMap((project: Project) => project.tags)
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
  }, [toast]);

  // Filtered projects to display: only by selected tag
  const displayedProjects = useMemo(() => {
    if (selectedTag) {
      return allProjects.filter(project => project.tags.includes(selectedTag));
    }
    return allProjects;
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
        <h2 className="text-3xl font-headline font-bold text-center mb-4 sm:text-4xl">My Projects</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          A collection of my public GitHub repositories, showcasing my work and experience in software development.
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
