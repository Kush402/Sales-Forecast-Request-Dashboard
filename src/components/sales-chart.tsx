'use client';

import type { SalesDataPoint } from '@/types';
import { BarChart, LineChart as LucideLineChart } from 'lucide-react'; // Renamed to avoid conflict
import * as React from 'react';
import { Bar, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"


// Helper to generate more varied mock data
function generateMockSalesData(version: number): SalesDataPoint[] {
  const data: SalesDataPoint[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const historicalYears = 2;
  const forecastMonths = 6;

  let lastHistoricalSales = 50 + (version * 5) % 50; // Base sales vary with version

  // Generate historical data
  for (let y = historicalYears - 1; y >= 0; y--) {
    for (let m = 0; m < 12; m++) {
      const monthName = months[m];
      const yearSuffix = (currentYear - y).toString().slice(-2);
      lastHistoricalSales += (Math.random() - 0.45 + (version % 3)*0.05) * 20 * (1 + m/12); // Trend + seasonality + version effect
      lastHistoricalSales = Math.max(20, lastHistoricalSales); // Ensure sales are not too low
      data.push({
        name: `${monthName} '${yearSuffix}`,
        historical: Math.round(lastHistoricalSales),
      });
    }
  }
  
  // Generate forecast data
  let lastForecastSales = data[data.length - 1].historical || lastHistoricalSales;
  for (let i = 1; i <= forecastMonths; i++) {
    const date = new Date(currentYear + historicalYears -1 , 11 + i, 1); // Start forecasting from next month
    const monthName = months[date.getMonth()];
    const yearSuffix = date.getFullYear().toString().slice(-2);
    lastForecastSales += (Math.random() - 0.4 + (version % 4)*0.06) * 25; // Forecast trend + version effect
    lastForecastSales = Math.max(30, lastForecastSales);
    data.push({
      name: `${monthName} '${yearSuffix} (F)`,
      forecast: Math.round(lastForecastSales),
    });
  }

  return data;
}


const chartConfig = {
  historical: {
    label: "Historical Sales",
    color: "hsl(var(--chart-1))",
    icon: BarChart,
  },
  forecast: {
    label: "Forecasted Sales",
    color: "hsl(var(--chart-2))",
    icon: LucideLineChart,
  },
}

interface SalesChartProps {
  dataVersion: number; // Used to trigger re-generation of mock data
}

export function SalesChart({ dataVersion }: SalesChartProps) {
  const [chartData, setChartData] = React.useState<SalesDataPoint[]>([]);

  React.useEffect(() => {
    setChartData(generateMockSalesData(dataVersion));
  }, [dataVersion]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-96 text-muted-foreground">Loading chart data...</div>;
  }
  
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 7)} // Shorten labels if needed
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${value/1000}k`}
          />
          <Tooltip
            cursor={true}
            content={<ChartTooltipContent indicator="dot" hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="historical"
            fill="var(--color-historical)"
            radius={4}
            barSize={20}
            name="Historical Sales"
          />
          <Line
            dataKey="forecast"
            type="monotone"
            stroke="var(--color-forecast)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--color-forecast)", strokeWidth:0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Forecasted Sales"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
