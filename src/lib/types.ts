export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl?: string;
  summary: string;
  tags: string[];
  imageUrl?: string;
  isFeatured?: boolean; // Added for featuring projects
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate?: string; // Or "Present"
  description: string[];
  skills: string[];
}
