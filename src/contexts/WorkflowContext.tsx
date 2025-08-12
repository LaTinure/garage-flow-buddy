import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkflowContextType, WorkflowState, InitStep } from '@/types';

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const WORKFLOW_STEPS: InitStep[] = [
  'super-admin',
  'pricing', 
  'org-admin',
  'garage-setup',
  'finalization'
];

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<InitStep>('super-admin');
  const [state, setState] = useState<WorkflowState>('loading');

  useEffect(() => {
    // Simulate checking initialization state
    const timer = setTimeout(() => {
      setState('needs-init');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const setStep = (step: InitStep) => {
    setCurrentStep(step);
  };

  const goToNextStep = () => {
    const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
    if (currentIndex < WORKFLOW_STEPS.length - 1) {
      setCurrentStep(WORKFLOW_STEPS[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(WORKFLOW_STEPS[currentIndex - 1]);
    }
  };

  return (
    <WorkflowContext.Provider value={{
      currentStep,
      state,
      setStep,
      setState,
      goToNextStep,
      goToPreviousStep
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}