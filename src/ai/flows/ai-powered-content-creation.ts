'use server';
/**
 * @fileOverview An AI-powered content creation tool for suggesting filters or designing backgrounds for posts and stories.
 *
 * - aiPoweredContentCreation - A function that handles the content creation process.
 * - AIPoweredContentCreationInput - The input type for the aiPoweredContentCreation function.
 * - AIPoweredContentCreationOutput - The return type for the aiPoweredContentCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AIPoweredContentCreationInputSchema = z.object({
  postDescription: z
    .string()
    .describe('The description of the post or story.'),
  imageType: z.enum(['filter', 'background']).describe('The type of content to generate: filter or background.'),
  imageToEditDataUri: z
    .string()
    .optional()
    .describe(
      "An image to edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIPoweredContentCreationInput = z.infer<typeof AIPoweredContentCreationInputSchema>;

const AIPoweredContentCreationOutputSchema = z.object({
  generatedImageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type AIPoweredContentCreationOutput = z.infer<typeof AIPoweredContentCreationOutputSchema>;

export async function aiPoweredContentCreation(input: AIPoweredContentCreationInput): Promise<AIPoweredContentCreationOutput> {
  return aiPoweredContentCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredContentCreationPrompt',
  input: {schema: AIPoweredContentCreationInputSchema},
  output: {schema: AIPoweredContentCreationOutputSchema},
  prompt: `You are an AI assistant designed to help users create visually appealing content for their social media posts and stories. Based on the user's description of their post and the desired image type (filter or background), you will generate an image that enhances their content.

Description: {{{postDescription}}}
ImageType: {{{imageType}}}

{{#if imageToEditDataUri}}
Base image: {{media url=imageToEditDataUri}}
{{/if}}

Based on the description, generate an image as a data URI that can be used as a filter or background for the post. The image should be visually appealing and relevant to the post's content. If the user has provided an image to edit, incorporate it into the generated image. If the imageType is 'filter', generate a filter that can be applied to an existing image. If the imageType is 'background', generate a background that complements the post's content.`, 
});

const aiPoweredContentCreationFlow = ai.defineFlow(
  {
    name: 'aiPoweredContentCreationFlow',
    inputSchema: AIPoweredContentCreationInputSchema,
    outputSchema: AIPoweredContentCreationOutputSchema,
  },
  async input => {
    let model = 'googleai/imagen-4.0-fast-generate-001';

    if (input.imageToEditDataUri) {
      model = 'googleai/gemini-2.5-flash-image-preview';
    }

    const {media} = await ai.generate({
      model: model,
      prompt: input.imageToEditDataUri ? [
        {media: {url: input.imageToEditDataUri}},
        {text: await prompt(input).then(res => res.text)},
      ] : await prompt(input).then(res => res.text),
      config: {
        responseModalities: input.imageToEditDataUri ? ['TEXT', 'IMAGE'] : ['IMAGE'],
      },
    });

    return {
      generatedImageDataUri: media!.url,
    };
  }
);
