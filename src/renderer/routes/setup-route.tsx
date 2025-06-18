import { Navigate } from 'react-router-dom';
import { FullPageSkeleton } from '@/components/loading/FullPageSkeleton';
import { useSetupCheck } from '@/hooks/use-setup-check';
import { SetupPage } from '@/pages/setup';

export const SetupRoute = () => {
  const { isLoading, isSetupComplete } = useSetupCheck();

  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (isSetupComplete) return <Navigate to="/" replace />;

  return <SetupPage />;
};
