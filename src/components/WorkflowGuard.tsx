import React from 'react';
import { useWorkflowCheck } from '@/hooks/useWorkflowCheck';
import { Loader2 } from 'lucide-react';

export const WorkflowGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isChecking } = useWorkflowCheck();

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

