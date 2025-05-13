export type SalesDataPoint = {
  name: string; // Typically month and year, e.g., "Jan '23"
  historical?: number | null;
  forecast?: number | null;
};

export type PerformanceMetricsData = {
  rmse: number;
  mae: number;
  mape: string; // e.g., "8%"
};

// For react-day-picker DateRange
export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};
