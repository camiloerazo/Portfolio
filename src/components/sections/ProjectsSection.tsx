'use client';

import { useState, useMemo, useEffect } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilter from '@/components/projects/ProjectFilter';
import AddProjectForm from '@/components/projects/AddProjectForm';
import type { Project } from '@/lib/types';
import { mockProjects, allTags as initialAllTags } from '@/lib/data'; 

export default function ProjectsSection() {
  // Initialize with all projects from mockData
  const [allProjects, setAllProjects] = useState<Project[]>(mockProjects);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // Tags for filtering should come from all projects, not just featured ones
  const [availableTags, setAvailableTags] = useState<string[]>(initialAllTags); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication
    setIsAuthenticated(true); 
  }, []);

  const handleAddProject = (newProject: Project) => {
    setAllProjects(prevProjects => [newProject, ...prevProjects]);
    // Update available tags if the new project introduces new ones
    const updatedTags = Array.from(new Set([...availableTags, ...newProject.tags])).sort();
    setAvailableTags(updatedTags);
  };

  // Filtered projects to display: first by featured, then by selected tag
  const displayedProjects = useMemo(() => {
    let projectsToShow = allProjects.filter(project => project.isFeatured);
    if (selectedTag) {
      projectsToShow = projectsToShow.filter(project => project.tags.includes(selectedTag));
    }
    return projectsToShow;
  }, [allProjects, selectedTag]);

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-4 sm:text-4xl">My Featured Projects</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Here's a selection of my key projects. Feel free to explore and check out the code!
        </p>
        
        {isAuthenticated && (
          <div className="flex justify-center md:justify-start">
              <AddProjectForm onAddProject={handleAddProject} />
          </div>
        )}
        
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
            No featured projects found {selectedTag ? `for the tag "${selectedTag}"` : ''}. 
            {isAuthenticated ? ' Try adding a new featured project or adjust filters!' : 'Check back later!'}
          </p>
        )}
      </div>
    </section>
  );
}
