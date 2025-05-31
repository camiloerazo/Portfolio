'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a concise summary of a GitHub project
 * by analyzing its README file. It includes the flow definition, input/output schemas,
 * and a wrapper function to call the flow.
 *
 * @module src/ai/flows/generate-project-summary
 *
 * @interface GenerateProjectSummaryInput - Defines the input schema for the generateProjectSummary function.
 * @interface GenerateProjectSummaryOutput - Defines the output schema for the generateProjectSummary function.
 * @function generateProjectSummary - The exported function to call the generateProjectSummaryFlow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the generateProjectSummary flow.
 * @typedef {object} GenerateProjectSummaryInput
 * @property {string} repoUrl - The URL of the GitHub repository.
 */
const GenerateProjectSummaryInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
});
export type GenerateProjectSummaryInput = z.infer<
  typeof GenerateProjectSummaryInputSchema
>;

/**
 * Output schema for the generateProjectSummary flow.
 * @typedef {object} GenerateProjectSummaryOutput
 * @property {string} summary - A concise summary of the GitHub project.
 */
const GenerateProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the GitHub project.'),
});
export type GenerateProjectSummaryOutput = z.infer<
  typeof GenerateProjectSummaryOutputSchema
>;

/**
 * Wrapper function to call the generateProjectSummaryFlow.
 * @async
 * @function generateProjectSummary
 * @param {GenerateProjectSummaryInput} input - The input for the flow.
 * @returns {Promise<GenerateProjectSummaryOutput>} The output of the flow.
 */
export async function generateProjectSummary(
  input: GenerateProjectSummaryInput
): Promise<GenerateProjectSummaryOutput> {
  return generateProjectSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectSummaryPrompt',
  input: {schema: GenerateProjectSummaryInputSchema},
  output: {schema: GenerateProjectSummaryOutputSchema},
  prompt: `You are a seasoned software developer tasked with summarizing GitHub repositories.

  Given the URL of a GitHub repository, analyze the README file (if available) and other relevant information to generate a concise and informative summary of the project.

  The summary should highlight the project's purpose, key features, and any notable technologies used.

  Repository URL: {{{repoUrl}}}

  Summary:
  `,
});

const generateProjectSummaryFlow = ai.defineFlow(
  {
    name: 'generateProjectSummaryFlow',
    inputSchema: GenerateProjectSummaryInputSchema,
    outputSchema: GenerateProjectSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
