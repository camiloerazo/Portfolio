import { CodeXml } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-center gap-2 py-8 text-center md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CodeXml className="h-5 w-5 text-primary" />
          <span>Code Showcase &copy; {currentYear}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Designed with <span className="text-red-500">&hearts;</span> by Camilo Erazo
        </p>
      </div>
    </footer>
  );
}
