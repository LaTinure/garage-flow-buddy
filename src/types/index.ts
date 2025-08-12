// Types pour le système de gestion de garages

export type WorkflowState = 'loading' | 'needs-init' | 'needs-auth' | 'ready';
export type InitStep = 'super-admin' | 'pricing' | 'org-admin' | 'garage-setup' | 'finalization';
export type UserRole = 'super-admin' | 'admin' | 'manager' | 'mechanic';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  organizationId?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  rccm: string;
  subscriptionPlan: 'basic' | 'professional' | 'enterprise';
  createdAt: string;
  adminId: string;
}

export interface Garage {
  id: string;
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  services: string[];
  organizationId: string;
  isActive: boolean;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export interface WorkflowContextType {
  currentStep: InitStep;
  state: WorkflowState;
  setStep: (step: InitStep) => void;
  setState: (state: WorkflowState) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}