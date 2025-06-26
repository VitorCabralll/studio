'use server';
/**
 * @fileOverview A Genkit flow for intelligent document generation with user-provided attachments.
 *
 * - contextualDocumentGeneration - A function that handles the document generation process.
 * - ContextualDocumentGenerationInput - The input type for the contextualDocumentGeneration function.
 * - ContextualDocumentGenerationOutput - The return type for the contextualDocumentGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualDocumentGenerationInputSchema = z.object({
  instructions: z.string().describe('Instructions for generating the document.'),
  attachmentDataUris: z
    .array(z.string())
    .describe(
      "An array of attachments as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});
export type ContextualDocumentGenerationInput = z.infer<
  typeof ContextualDocumentGenerationInputSchema
>;

const ContextualDocumentGenerationOutputSchema = z.object({
  document: z.string().describe('The generated document.'),
});
export type ContextualDocumentGenerationOutput = z.infer<
  typeof ContextualDocumentGenerationOutputSchema
>;

export async function contextualDocumentGeneration(
  input: ContextualDocumentGenerationInput
): Promise<ContextualDocumentGenerationOutput> {
  return contextualDocumentGenerationFlow(input);
}

const generateDocumentPrompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: {schema: ContextualDocumentGenerationInputSchema},
  output: {schema: ContextualDocumentGenerationOutputSchema},
  prompt: `You are an AI document generator. Your task is to generate a document based on the user's instructions and any provided attachments.

Carefully review the instructions. If attachments are provided, analyze their content and incorporate them into the final document only if they are relevant to the user's request. Do not include information from an attachment if it does not support the instructions.

Instructions: {{{instructions}}}

{{#if attachmentDataUris}}
Attachments:
{{#each attachmentDataUris}}
- Attachment: {{media url=this}}
{{/each}}
{{/if}}

Generated Document:
`,
});

const contextualDocumentGenerationFlow = ai.defineFlow(
  {
    name: 'contextualDocumentGenerationFlow',
    inputSchema: ContextualDocumentGenerationInputSchema,
    outputSchema: ContextualDocumentGenerationOutputSchema,
  },
  async input => {
    const {output} = await generateDocumentPrompt(input);
    return output!;
  }
);
