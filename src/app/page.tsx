'use client';

import type { ForecastSalesOutput } from '@/ai/flows/sales-forecast-prompt';
import type { PerformanceMetricsData } from '@/types';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { ForecastForm } from '@/components/forecast-form';
import { PerformanceMetrics } from '@/components/performance-metrics';
import { SalesChart } from '@/components/sales-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateForecastAction } from '@/lib/actions';
import * as React from 'react';

// Helper to generate mock performance metrics
function generateMockMetrics(version: number): PerformanceMetricsData {
  // Simple variation based on version
  const baseRmse = 130 + (version * 7) % 50;
  const baseMae = 100 + (version * 5) % 40;
  const baseMape = 6 + (version * 0.5) % 4;
  return {
    rmse: Math.round(baseRmse + Math.random() * 20),
    mae: Math.round(baseMae + Math.random() * 15),
    mape: `${(baseMape + Math.random() * 2).toFixed(1)}%`,
  };
}


export default function HomePage() {
  const [forecastResult, setForecastResult] = React.useState<ForecastSalesOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chartDataVersion, setChartDataVersion] = React.useState(0);
  const [currentMetrics, setCurrentMetrics] = React.useState<PerformanceMetricsData | null>(null);

  const { toast } = useToast();

  React.useEffect(() => {
    // Initialize with some metrics or update when chart data version changes
    setCurrentMetrics(generateMockMetrics(chartDataVersion));
  }, [chartDataVersion]);


  const handleForecastGeneration = async (descriptionWithDate: string) => {
    setIsLoading(true);
    setForecastResult(null); // Clear previous result

    const result = await generateForecastAction({ productDescription: descriptionWithDate });

    setIsLoading(false);

    if (result.success && result.data) {
      setForecastResult(result.data);
      setChartDataVersion((prev) => prev + 1); // Trigger chart and metrics update
      toast({
        title: 'Forecast Generated Successfully!',
        description: 'The sales forecast summary is now available.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Error Generating Forecast',
        description: result.error || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8">
        <section id="forecast-input" aria-labelledby="forecast-input-title">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-card">
              <CardTitle id="forecast-input-title" className="text-2xl">Create Sales Forecast</CardTitle>
              <CardDescription>
                Describe your product and current sales trends. Optionally, specify a date range to provide context for your description. The AI will generate a forecast summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ForecastForm onSubmit={handleForecastGeneration} isLoading={isLoading} />
            </CardContent>
          </Card>
        </section>

        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center gap-2 text-primary">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-medium">Generating forecast, please wait...</p>
            </div>
          </div>
        )}

        {forecastResult && !isLoading && (
          <section id="forecast-output" aria-labelledby="forecast-output-title">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle id="forecast-output-title" className="text-xl">AI Forecast Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{forecastResult.forecastSummary}</p>
              </CardContent>
            </Card>
          </section>
        )}

        <section id="visualizations" aria-labelledby="visualizations-title" className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
             <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle id="visualizations-title">Sales Trend Visualization</CardTitle>
                <CardDescription>Illustrative historical and forecasted sales data. This chart updates with mock data when a new forecast is generated.</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart dataVersion={chartDataVersion} />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <PerformanceMetrics metrics={currentMetrics} />
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
