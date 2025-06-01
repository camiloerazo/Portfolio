import { Octokit } from '@octokit/rest';
import type { Project } from './types';

// Initialize Octokit with your GitHub token
// You should store this in an environment variable
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  private: boolean;
}

/**
 * Fetches all public repositories for a given GitHub username
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const { data } = await octokit.repos.listForUser({
      username,
      sort: 'updated',
      direction: 'desc',
      per_page: 100, // Maximum allowed by GitHub API
    });

    // Filter for public repositories and ensure all required fields are present
    return data
      .filter(repo => !repo.private)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage || null,
        topics: repo.topics || [],
        language: repo.language || null,
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        created_at: repo.created_at || new Date().toISOString(),
        updated_at: repo.updated_at || new Date().toISOString(),
        private: repo.private,
      }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
}

/**
 * Converts a GitHub repository to a Project type
 */
export function convertRepoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.id.toString(),
    name: repo.name,
    repoUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    summary: repo.description || 'No description provided.',
    tags: [
      ...repo.topics,
      ...(repo.language ? [repo.language] : []),
    ],
    imageUrl: `https://placehold.co/600x400.png`, // You might want to generate a better image
    isFeatured: true, // Always show all public repositories
  };
}

/**
 * Fetches and processes all repositories for a given username
 */
export async function fetchAndProcessRepos(username: string): Promise<Project[]> {
  const repos = await fetchGitHubRepos(username);
  return repos.map(convertRepoToProject);
}

/**
 * Fetches the README content of a repository
 */
export async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getReadme({
      owner,
      repo,
    });

    // The content is base64 encoded
    const content = Buffer.from(data.content, 'base64').toString();
    return content;
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Fetches the main language files of a repository
 * This is a simplified version that gets the first few files from the root
 */
export async function fetchRepoMainFiles(owner: string, repo: string): Promise<string[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: '',
    });

    if (Array.isArray(data)) {
      // Filter for common code files and get their contents
      const codeFiles = data.filter(file => 
        !file.name.startsWith('.') && // Ignore hidden files
        ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.go'].some(ext => 
          file.name.endsWith(ext)
        )
      ).slice(0, 5); // Limit to first 5 files

      const fileContents = await Promise.all(
        codeFiles.map(async file => {
          if ('download_url' in file && file.download_url) {
            const response = await fetch(file.download_url);
            return response.text();
          }
          return null;
        })
      );

      return fileContents.filter((content): content is string => content !== null);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching files for ${owner}/${repo}:`, error);
    return [];
  }
} 