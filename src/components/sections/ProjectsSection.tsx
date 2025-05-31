'use client';

import { useState, useMemo, useEffect } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilter from '@/components/projects/ProjectFilter';
import AddProjectForm from '@/components/projects/AddProjectForm';
import type { Project } from '@/lib/types';
import { mockProjects, allTags as initialAllTags } from '@/lib/data'; // Using mock data for now

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>(initialAllTags);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // In a real application, you would check the actual authentication status here.
    // For this demonstration, we'll simulate the user being authenticated.
    setIsAuthenticated(true); 
  }, []);


  const handleAddProject = (newProject: Project) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
    const updatedTags = Array.from(new Set([...allTags, ...newProject.tags])).sort();
    setAllTags(updatedTags);
  };

  const filteredProjects = useMemo(() => {
    if (!selectedTag) {
      return projects;
    }
    return projects.filter(project => project.tags.includes(selectedTag));
  }, [projects, selectedTag]);

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-4 sm:text-4xl">My Projects</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Here&apos;s a selection of projects I&apos;ve worked on. Feel free to explore and check out the code!
        </p>
        
        {isAuthenticated && (
          <div className="flex justify-center md:justify-start">
              <AddProjectForm onAddProject={handleAddProject} />
          </div>
        )}
        
        <ProjectFilter 
          tags={allTags} 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag} 
        />

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">
            No projects found for the selected tag. Try another filter or add a new project!
          </p>
        )}
      </div>
    </section>
  );
}
