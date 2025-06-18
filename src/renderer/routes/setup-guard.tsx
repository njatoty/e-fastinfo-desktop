import { Navigate } from 'react-router-dom';
import { useSetupCheck } from '@/hooks/use-setup-check';

export const SetupGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isSetupComplete } = useSetupCheck();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!isSetupComplete) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};
