import React from 'react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { SplashScreen } from './SplashScreen';
import { InitializationFlow } from './InitializationFlow';

interface WorkflowGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onComplete?: () => void;
}

export function WorkflowGuard({ children, fallback, onComplete }: WorkflowGuardProps) {
  const { state } = useWorkflow();

  React.useEffect(() => {
    if (state === 'ready' && onComplete) {
      onComplete();
    }
  }, [state, onComplete]);

  if (state === 'loading') {
    return fallback || <SplashScreen />;
  }

  if (state === 'needs-init' || state === 'needs-auth') {
    return <InitializationFlow />;
  }

  return <>{children}</>;
}