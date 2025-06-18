import { Loader2 } from 'lucide-react';

export const FullPageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement en cours...</p>
      </div>
    </div>
  );
};
