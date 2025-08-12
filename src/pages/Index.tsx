import React from 'react';
import { WorkflowProvider } from '@/contexts/WorkflowContext';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { WorkflowGuard } from '@/components/workflow/WorkflowGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const Index = () => {
  const initAnalytics = () => {
    console.log('Analytics initialized for GarageFlow');
  };

  return (
    <WorkflowProvider>
      <UnifiedLayout>
        <WorkflowGuard 
          onComplete={initAnalytics}
        >
          <DashboardLayout />
        </WorkflowGuard>
      </UnifiedLayout>
    </WorkflowProvider>
  );
};

export default Index;
