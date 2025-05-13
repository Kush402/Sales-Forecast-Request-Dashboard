// SalesForecastFromPrompt
'use server';
/**
 * @fileOverview An AI agent that forecasts sales based on a user-provided prompt.
 *
 * - forecastSalesFromPrompt - A function that handles the sales forecast generation process.
 * - ForecastSalesInput - The input type for the forecastSalesFromPrompt function.
 * - ForecastSalesOutput - The return type for the forecastSalesFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastSalesInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A description of the product and any observed sales trends.'),
});
export type ForecastSalesInput = z.infer<typeof ForecastSalesInputSchema>;

const ForecastSalesOutputSchema = z.object({
  forecastSummary: z.string().describe('A summary of the sales forecast.'),
});
export type ForecastSalesOutput = z.infer<typeof ForecastSalesOutputSchema>;

export async function forecastSalesFromPrompt(input: ForecastSalesInput): Promise<ForecastSalesOutput> {
  return forecastSalesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastSalesPrompt',
  input: {schema: ForecastSalesInputSchema},
  output: {schema: ForecastSalesOutputSchema},
  prompt: `You are a sales forecasting expert. Based on the following product description and sales trends, provide a sales forecast summary. Be brief and to the point.

Product Description and Sales Trends: {{{productDescription}}}`,
});

const forecastSalesFlow = ai.defineFlow(
  {
    name: 'forecastSalesFlow',
    inputSchema: ForecastSalesInputSchema,
    outputSchema: ForecastSalesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
