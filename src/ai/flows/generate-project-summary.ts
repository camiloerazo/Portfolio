'use server';

import type { GenerateProjectSummaryInput, GenerateProjectSummaryOutput } from '@/lib/schemas';

/**
 * Generates a project summary based on repository information
 * This is a simplified version that creates a summary from available data
 */
export async function generateEnhancedProjectSummary(
  input: GenerateProjectSummaryInput
): Promise<GenerateProjectSummaryOutput> {
  const { repoInfo, readme, codeFiles } = input;

  // Extract technologies from topics and language
  const technologies = [
    ...repoInfo.topics,
    ...(repoInfo.language ? [repoInfo.language] : []),
  ].filter((tech, index, self) => self.indexOf(tech) === index); // Remove duplicates

  // Generate a basic summary from available information
  const summary = [
    repoInfo.description || `A ${repoInfo.language || 'software'} project`,
    readme ? 'Includes detailed documentation.' : 'Documentation available in the repository.',
    `Built with ${technologies.join(', ')}.`,
    repoInfo.stargazers_count > 0 ? `Has ${repoInfo.stargazers_count} stars on GitHub.` : '',
  ].filter(Boolean).join(' ');

  // Extract key features from README if available
  const keyFeatures = readme
    ? extractFeaturesFromReadme(readme)
    : ['Repository available on GitHub', 'Source code accessible'];

  // Determine complexity based on available information
  const complexity = determineComplexity(repoInfo, codeFiles);

  return {
    summary,
    keyFeatures,
    technologies,
    complexity,
  };
}

/**
 * Extracts key features from README content
 */
function extractFeaturesFromReadme(readme: string): string[] {
  const features: string[] = [];
  
  // Look for common README sections that might contain features
  const featureSections = [
    /## Features\n([\s\S]*?)(?=##|$)/i,
    /## Key Features\n([\s\S]*?)(?=##|$)/i,
    /### Features\n([\s\S]*?)(?=###|$)/i,
    /### Key Features\n([\s\S]*?)(?=###|$)/i,
  ];

  for (const pattern of featureSections) {
    const match = readme.match(pattern);
    if (match && match[1]) {
      // Split by bullet points or numbers
      const items = match[1]
        .split(/[-*]\s|^\d+\.\s/gm)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      features.push(...items);
    }
  }

  // If no features found, return some basic information
  if (features.length === 0) {
    features.push(
      'Documentation available in README',
      'Source code accessible on GitHub'
    );
  }

  return features.slice(0, 5); // Limit to 5 key features
}

/**
 * Determines project complexity based on available information
 */
function determineComplexity(
  repoInfo: GenerateProjectSummaryInput['repoInfo'],
  codeFiles: string[] | undefined
): 'beginner' | 'intermediate' | 'advanced' {
  // Simple heuristic based on available information
  const factors = [
    // More stars might indicate a more complex project
    repoInfo.stargazers_count > 100 ? 2 : 1,
    // More topics might indicate more technologies used
    repoInfo.topics.length > 5 ? 2 : 1,
    // More code files might indicate more complexity
    codeFiles && codeFiles.length > 10 ? 2 : 1,
  ];

  const complexityScore = factors.reduce((sum, factor) => sum + factor, 0);

  if (complexityScore >= 5) return 'advanced';
  if (complexityScore >= 3) return 'intermediate';
  return 'beginner';
}
