// Sales Data Summary Flow
// This flow summarizes key trends and anomalies from sales data using GenAI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesDataSummaryInputSchema = z.object({
  salesData: z.string().describe('Sales data in CSV format.'),
  dateRange: z.string().optional().describe('Optional date range to filter the sales data.'),
});

export type SalesDataSummaryInput = z.infer<typeof SalesDataSummaryInputSchema>;

const SalesDataSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of key trends and anomalies in the sales data.'),
});

export type SalesDataSummaryOutput = z.infer<typeof SalesDataSummaryOutputSchema>;

export async function summarizeSalesData(input: SalesDataSummaryInput): Promise<SalesDataSummaryOutput> {
  return salesDataSummaryFlow(input);
}

const salesDataSummaryPrompt = ai.definePrompt({
  name: 'salesDataSummaryPrompt',
  input: {schema: SalesDataSummaryInputSchema},
  output: {schema: SalesDataSummaryOutputSchema},
  prompt: `You are an expert data analyst. Summarize the key trends and anomalies from the following sales data. Be concise and focus on actionable insights.

Sales Data: {{{salesData}}}

Optional Date Range: {{{dateRange}}}
`,
});

const salesDataSummaryFlow = ai.defineFlow(
  {
    name: 'salesDataSummaryFlow',
    inputSchema: SalesDataSummaryInputSchema,
    outputSchema: SalesDataSummaryOutputSchema,
  },
  async input => {
    const {output} = await salesDataSummaryPrompt(input);
    return output!;
  }
);
