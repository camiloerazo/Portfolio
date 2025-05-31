import { z } from 'zod';

// Input schema for the project summary generation
export const GenerateProjectSummaryInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readme: z.string().optional().describe('The content of the repository README file.'),
  codeFiles: z.array(z.string()).optional().describe('Contents of main code files.'),
  repoInfo: z.object({
    name: z.string(),
    description: z.string().nullable(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    stargazers_count: z.number(),
    forks_count: z.number(),
  }),
});

export type GenerateProjectSummaryInput = z.infer<typeof GenerateProjectSummaryInputSchema>;

// Output schema for the project summary generation
export const GenerateProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the project.'),
  keyFeatures: z.array(z.string()).describe('Key features and capabilities of the project.'),
  technologies: z.array(z.string()).describe('Technologies and tools used in the project.'),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).describe('Project complexity level.'),
});

export type GenerateProjectSummaryOutput = z.infer<typeof GenerateProjectSummaryOutputSchema>; 