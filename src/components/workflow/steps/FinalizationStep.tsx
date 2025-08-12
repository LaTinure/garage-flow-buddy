import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { CheckCircle, Car, Building2, Users, ArrowRight } from 'lucide-react';

export function FinalizationStep() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { setState } = useWorkflow();

  const handleFinalize = () => {
    setIsLoading(true);
    
    // Simulate final setup and user creation
    setTimeout(() => {
      // In a real app, this would:
      // 1. Create default roles (Mechanic, Manager, etc.)
      // 2. Send welcome emails
      // 3. Initialize dashboard data
      
      setState('ready');
      setIsLoading(false);
    }, 2000);
  };

  const completedSteps = [
    {
      icon: <Building2 className="w-5 h-5" />,
      title: 'Organisation créée',
      description: 'Votre organisation et compte administrateur sont configurés'
    },
    {
      icon: <Car className="w-5 h-5" />,
      title: 'Garage configuré',
      description: 'Informations et services de votre garage enregistrés'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Rôles définis',
      description: 'Mécanicien, Gérant et autres rôles seront créés'
    }
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-garage-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-garage-success" />
        </div>
        <CardTitle className="text-2xl">Configuration Terminée</CardTitle>
        <CardDescription>
          Votre système GarageFlow est prêt à être utilisé
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {completedSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-garage-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-garage-success flex-shrink-0 mt-2" />
            </div>
          ))}
        </div>
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-primary mb-2">Prochaines étapes</h3>
          <ul className="text-sm text-foreground space-y-1">
            <li>• Connexion à votre tableau de bord administrateur</li>
            <li>• Création des comptes utilisateurs (mécaniciens, gérants)</li>
            <li>• Configuration des premiers rendez-vous</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleFinalize}
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 animate-pulse" />
              Finalisation en cours...
            </>
          ) : (
            <>
              Accéder au tableau de bord
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}