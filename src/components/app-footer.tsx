export function AppFooter() {
  return (
    <footer className="bg-card border-t border-border py-8 text-center">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ForecastView. Powered by Firebase Studio & Genkit.
        </p>
      </div>
    </footer>
  );
}
