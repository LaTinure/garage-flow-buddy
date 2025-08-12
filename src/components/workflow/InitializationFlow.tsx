import React from 'react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { SuperAdminStep } from './steps/SuperAdminStep';
import { PricingStep } from './steps/PricingStep';
import { OrgAdminStep } from './steps/OrgAdminStep';
import { GarageSetupStep } from './steps/GarageSetupStep';
import { FinalizationStep } from './steps/FinalizationStep';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function InitializationFlow() {
  const { currentStep } = useWorkflow();

  const steps = [
    { id: 'super-admin', label: 'Super Admin', component: SuperAdminStep },
    { id: 'pricing', label: 'Plan tarifaire', component: PricingStep },
    { id: 'org-admin', label: 'Organisation', component: OrgAdminStep },
    { id: 'garage-setup', label: 'Configuration', component: GarageSetupStep },
    { id: 'finalization', label: 'Finalisation', component: FinalizationStep },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStepIndex]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Configuration initiale</h2>
              <span className="text-sm text-muted-foreground">
                Étape {currentStepIndex + 1} sur {steps.length}
              </span>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between text-sm">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-1 ${
                    index <= currentStepIndex 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < currentStepIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : index === currentStepIndex
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs text-center">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Current Step Content */}
        {CurrentStepComponent && <CurrentStepComponent />}
      </div>
    </div>
  );
}