import { useEffect, useState } from 'react';
import { staffService } from '@/components/services/staff.service';

export function useSetupCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await staffService.findStaffs({ role: 'admin' });
        const hasAdmins = Array.isArray(res.data) && res.data.length > 0;
        setIsSetupComplete(hasAdmins);
      } catch (error) {
        console.error('Failed to fetch admin staff:', error);
        setIsSetupComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetup();
  }, []);

  return { isLoading, isSetupComplete };
}
