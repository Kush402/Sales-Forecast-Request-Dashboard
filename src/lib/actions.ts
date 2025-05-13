'use server';

import { forecastSalesFromPrompt, type ForecastSalesInput, type ForecastSalesOutput } from '@/ai/flows/sales-forecast-prompt';
import { z } from 'zod';

const GenerateForecastActionInputSchema = z.object({
  productDescription: z.string().min(10, "Product description must be at least 10 characters long."),
});

export async function generateForecastAction(
  input: z.infer<typeof GenerateForecastActionInputSchema>
): Promise<{ success: boolean; data?: ForecastSalesOutput; error?: string }> {
  try {
    const validatedInput = GenerateForecastActionInputSchema.parse(input);
    const forecastInput: ForecastSalesInput = {
      productDescription: validatedInput.productDescription,
    };
    const result = await forecastSalesFromPrompt(forecastInput);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error generating forecast:', error);
    return { success: false, error: 'Failed to generate forecast. Please try again.' };
  }
}
