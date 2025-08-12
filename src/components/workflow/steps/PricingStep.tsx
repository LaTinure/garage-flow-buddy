import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { PricingPlan } from '@/types';

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: [
      'Jusqu\'à 2 garages',
      'Gestion des RDV',
      'Facturation simple',
      'Support email',
      'Stockage 5GB'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 59,
    features: [
      'Jusqu\'à 10 garages',
      'Gestion avancée des RDV',
      'Facturation automatisée',
      'Support prioritaire',
      'Stockage 50GB',
      'Analytics avancés',
      'API Access'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: [
      'Garages illimités',
      'Fonctionnalités complètes',
      'Intégrations sur mesure',
      'Support dédié 24/7',
      'Stockage illimité',
      'White label',
      'Formation incluse'
    ]
  }
];

export function PricingStep() {
  const [selectedPlan, setSelectedPlan] = React.useState<string>('professional');
  const { goToNextStep } = useWorkflow();

  const handleContinue = () => {
    // Store selected plan (in real app, would save to backend)
    localStorage.setItem('selectedPlan', selectedPlan);
    goToNextStep();
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Zap className="w-6 h-6" />;
      case 'professional': return <Star className="w-6 h-6" />;
      case 'enterprise': return <Crown className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choisissez votre plan</h2>
        <p className="text-muted-foreground">Sélectionnez le plan qui correspond le mieux à vos besoins</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            } ${plan.isPopular ? 'border-primary' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Populaire
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                plan.isPopular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
              }`}>
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">
                {plan.price}€
                <span className="text-sm font-normal text-muted-foreground">/mois</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-garage-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleContinue}
          size="lg"
          className="px-8"
        >
          Continuer avec {plans.find(p => p.id === selectedPlan)?.name}
        </Button>
      </div>
    </div>
  );
}