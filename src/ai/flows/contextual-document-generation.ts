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

const shouldIncludeAttachmentTool = ai.defineTool({
  name: 'shouldIncludeAttachment',
  description: 'Determines whether an attachment is relevant and should be included in the document based on the instructions.',
  inputSchema: z.object({
    attachmentDataUri: z
      .string()
      .describe(
        "An attachment as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    instructions: z.string().describe('The instructions for generating the document.'),
  }),
  outputSchema: z.boolean().describe('Whether the attachment should be included.'),
}, async (input) => {
  // Implement the logic to determine if the attachment is relevant.
  // This is a placeholder implementation.  A real implementation would
  // use an LLM or other AI technique to determine relevance.
  // For now, we just return true if the instructions contain the word "include".
  return input.instructions.toLowerCase().includes('include');
});

const generateDocumentPrompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: {schema: ContextualDocumentGenerationInputSchema},
  output: {schema: ContextualDocumentGenerationOutputSchema},
  tools: [shouldIncludeAttachmentTool],
  prompt: `You are an AI document generator.  Follow the instructions to generate a document.

Instructions: {{{instructions}}}

{{#if attachmentDataUris}}
The following attachments are available.  Decide whether to include each attachment based on the instructions.  If the instructions do not refer to the content of the attachment, do not include it.

{{#each attachmentDataUris}}
{{#if (shouldIncludeAttachment attachmentDataUri=this instructions=../instructions)}}
Attachment: {{media url=this}}
{{/if}}
{{/each}}
{{/if}}
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
