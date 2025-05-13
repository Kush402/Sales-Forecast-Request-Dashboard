'use client';

import type { PerformanceMetricsData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsData | null;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  if (!metrics) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Illustrative metrics for a typical quantitative forecast model.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Metrics will be displayed here once a forecast is generated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Illustrative metrics for a typical quantitative forecast model.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
          <div>
            <p className="text-sm font-medium text-muted-foreground">RMSE (Root Mean Square Error)</p>
            <p className="text-2xl font-semibold text-foreground">${metrics.rmse.toLocaleString()}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
          <div>
            <p className="text-sm font-medium text-muted-foreground">MAE (Mean Absolute Error)</p>
            <p className="text-2xl font-semibold text-foreground">${metrics.mae.toLocaleString()}</p>
          </div>
           <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
          <div>
            <p className="text-sm font-medium text-muted-foreground">MAPE (Mean Absolute Percentage Error)</p>
            <p className="text-2xl font-semibold text-foreground">{metrics.mape}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>
         <p className="text-xs text-muted-foreground pt-2">
            Note: These are illustrative metrics. The AI provides a qualitative forecast summary.
          </p>
      </CardContent>
    </Card>
  );
}
