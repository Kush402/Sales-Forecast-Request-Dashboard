import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <TrendingUp className="h-8 w-8" />
          <h1 className="text-2xl font-bold">ForecastView</h1>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
