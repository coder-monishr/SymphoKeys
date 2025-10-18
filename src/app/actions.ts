'use server';

import { suggestPresetConfigurations, SuggestPresetConfigurationsOutput } from '@/ai/flows/preset-configuration-recommendations';

export async function getAiPresets(musicTypeDescription: string): Promise<SuggestPresetConfigurationsOutput> {
  try {
    const result = await suggestPresetConfigurations({ musicTypeDescription });
    return result;
  } catch (error) {
    console.error('Error getting AI presets:', error);
    throw new Error('Failed to get recommendations from AI.');
  }
}
