import { NextResponse } from 'next/server';
import { fetchAndProcessRepos, fetchRepoReadme, fetchRepoMainFiles } from '@/lib/github';
import { generateEnhancedProjectSummary } from '@/ai/flows/generate-project-summary';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.warn('UNSPLASH_ACCESS_KEY is not set in environment variables. Images will fall back to placeholders.');
}

/**
 * Generates an Unsplash search query based on project data
 */
function generateUnsplashQuery(project: any): string {
  const relevantTags = project.tags.filter((tag: string) => 
    // Filter for common and relevant tech/project terms
    ['javascript', 'typescript', 'react', 'next.js', 'python', 'flask', 'django', 'node', 'sql', 'database', 'frontend', 'backend', 'fullstack', 'mobile', 'web development', 'ai', 'machine learning', 'data science', 'game development', 'mobile app'].includes(tag.toLowerCase())
  );

  // Start with the project name
  let query = project.name;

  // Add up to two relevant tags
  if (relevantTags.length > 0) {
    query += ' ' + relevantTags[0];
  }
  if (relevantTags.length > 1) {
    query += ' ' + relevantTags[1];
  }

  // Add a general creative/tech term to encourage visually interesting results
  query += ' technology abstract creative';

  // Replace hyphens with spaces for better search results
  query = query.replace(/-/g, ' ');

  // Limit query length and trim whitespace
  return query.slice(0, 100).trim();
}

/**
 * Fetches an image URL from Unsplash based on a query
 */
async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY || !query) {
    // Don't fetch if API key is missing or query is empty
    return null; 
  }

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`);
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error(`Unsplash API error: ${res.status} ${res.statusText} - ${errorData}`);
      return null;
    }

    const data = await res.json();
    // Get a random image from the first few results for more variety
    const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5)); // Get up to 5 results
    const imageUrl = data.results[randomIndex]?.urls?.regular || null;
    
    if (!imageUrl) {
      console.warn(`No image URL found for the query: "${query}". API Response had ${data.results.length} results.`);
    }

    return imageUrl;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const enhanced = searchParams.get('enhanced') === 'true';

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch basic repository information
    const projects = await fetchAndProcessRepos(username);

    if (enhanced) {
      // Use Promise.allSettled to allow some image fetches to fail without stopping others
      const enhancedProjects = await Promise.allSettled(
        projects.map(async (project) => {
          const [owner, repo] = project.repoUrl
            .replace('https://github.com/', '')
            .split('/');

          const [readme, codeFiles] = await Promise.all([
            fetchRepoReadme(owner, repo),
            fetchRepoMainFiles(owner, repo),
          ]);

          const repoInfo = {
            name: project.name,
            description: project.summary,
            language: project.tags.find(tag => 
              ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go'].includes(tag)
            ) || null,
            topics: project.tags.filter(tag => 
              !['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go'].includes(tag)
            ),
            stargazers_count: 0,
            forks_count: 0,
          };

          const enhancedSummary = await generateEnhancedProjectSummary({
            repoUrl: project.repoUrl,
            readme: readme || undefined,
            codeFiles: codeFiles.length > 0 ? codeFiles : undefined,
            repoInfo,
          });

          // Generate Unsplash query and fetch image
          const unsplashQuery = generateUnsplashQuery(project);
          const unsplashImageUrl = await fetchUnsplashImage(unsplashQuery);

          return {
            ...project,
            summary: enhancedSummary.summary,
            keyFeatures: enhancedSummary.keyFeatures,
            technologies: enhancedSummary.technologies,
            complexity: enhancedSummary.complexity,
            imageUrl: unsplashImageUrl || project.imageUrl, 
          };
        })
      );

      // Handle results from Promise.allSettled
      const fulfilledProjects = enhancedProjects
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);

      return NextResponse.json(fulfilledProjects);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error processing GitHub repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
} 