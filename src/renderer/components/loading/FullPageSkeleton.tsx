import { Skeleton } from '@/components/ui/skeleton';

export const FullPageSkeleton = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="space-y-4 w-[300px]">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};
