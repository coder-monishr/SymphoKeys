// src/ai/flows/preset-configuration-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting instrument and scale presets based on a description of the type of music the user wants to create.
 *
 * - suggestPresetConfigurations - A function that takes a description of the desired music type and returns suggested instrument and scale presets.
 * - SuggestPresetConfigurationsInput - The input type for the suggestPresetConfigurations function.
 * - SuggestPresetConfigurationsOutput - The return type for the suggestPresetConfigurations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPresetConfigurationsInputSchema = z.object({
  musicTypeDescription: z.string().describe('A description of the type of music the user wants to create.'),
});
export type SuggestPresetConfigurationsInput = z.infer<typeof SuggestPresetConfigurationsInputSchema>;

const SuggestPresetConfigurationsOutputSchema = z.object({
  instrument: z.string().describe('The suggested instrument preset.'),
  scale: z.string().describe('The suggested scale preset.'),
  reasoning: z.string().describe('The reasoning behind the suggested presets.'),
});
export type SuggestPresetConfigurationsOutput = z.infer<typeof SuggestPresetConfigurationsOutputSchema>;

export async function suggestPresetConfigurations(input: SuggestPresetConfigurationsInput): Promise<SuggestPresetConfigurationsOutput> {
  return suggestPresetConfigurationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPresetConfigurationsPrompt',
  input: {schema: SuggestPresetConfigurationsInputSchema},
  output: {schema: SuggestPresetConfigurationsOutputSchema},
  prompt: `You are a music expert. The user will provide a description of the type of music they want to create.
  You will suggest an instrument and a scale that would be suitable for that type of music.
  Also provide a brief explanation of why you chose that instrument and scale.

  Music type description: {{{musicTypeDescription}}}
  `,
});

const suggestPresetConfigurationsFlow = ai.defineFlow(
  {
    name: 'suggestPresetConfigurationsFlow',
    inputSchema: SuggestPresetConfigurationsInputSchema,
    outputSchema: SuggestPresetConfigurationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
