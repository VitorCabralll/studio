// src/ai/flows/generate-document-outline.ts
'use server';

/**
 * @fileOverview Generates a legal document outline or full draft based on user instructions.
 *
 * - generateDocumentOutline - A function that generates the document.
 * - GenerateDocumentOutlineInput - The input type for the generateDocumentOutline function.
 * - GenerateDocumentOutlineOutput - The return type for the generateDocumentOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentOutlineInputSchema = z.object({
  instructions: z
    .string()
    .describe('Instructions for generating the legal document.'),
  attachments: z
    .array(z.string())
    .optional()
    .describe(
      'Optional attachments, as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  format: z.enum(['outline', 'full']).default('outline').describe('The desired format of the document: outline or full draft.'),
});
export type GenerateDocumentOutlineInput = z.infer<
  typeof GenerateDocumentOutlineInputSchema
>;

const GenerateDocumentOutlineOutputSchema = z.object({
  document: z.string().describe('The generated document outline or full draft.'),
});
export type GenerateDocumentOutlineOutput = z.infer<
  typeof GenerateDocumentOutlineOutputSchema
>;

export async function generateDocumentOutline(
  input: GenerateDocumentOutlineInput
): Promise<GenerateDocumentOutlineOutput> {
  return generateDocumentOutlineFlow(input);
}

const generateDocumentOutlinePrompt = ai.definePrompt({
  name: 'generateDocumentOutlinePrompt',
  input: {schema: GenerateDocumentOutlineInputSchema},
  output: {schema: GenerateDocumentOutlineOutputSchema},
  prompt: `You are an AI legal assistant. Your task is to generate a legal document outline or a full draft based on the user's instructions.

Instructions: {{{instructions}}}

Format: {{{format}}}

{{#if attachments}}
Attachments:
{{#each attachments}}
{{media url=this}}
{{/each}}
{{/if}}

Output:
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateDocumentOutlineFlow = ai.defineFlow(
  {
    name: 'generateDocumentOutlineFlow',
    inputSchema: GenerateDocumentOutlineInputSchema,
    outputSchema: GenerateDocumentOutlineOutputSchema,
  },
  async input => {
    const {output} = await generateDocumentOutlinePrompt(input);
    return output!;
  }
);
