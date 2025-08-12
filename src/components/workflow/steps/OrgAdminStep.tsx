import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Building2, User, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function OrgAdminStep() {
  const [orgData, setOrgData] = React.useState({
    orgName: '',
    rccm: '',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { goToNextStep } = useWorkflow();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to create organization and admin
    setTimeout(() => {
      // Store organization data (in real app, would call Supabase function)
      localStorage.setItem('organizationData', JSON.stringify(orgData));
      
      toast({
        title: "Organisation créée",
        description: "Organisation et administrateur créés avec succès",
      });
      
      setIsLoading(false);
      goToNextStep();
    }, 2000);
  };

  const isFormValid = Object.values(orgData).every(value => value.trim() !== '');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Organisation & Administrateur</CardTitle>
        <CardDescription>
          Créez votre organisation et configurez le compte administrateur
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Organisation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Informations Organisation</h3>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Nom de l'organisation</Label>
                <Input
                  id="orgName"
                  placeholder="Garage Central SARL"
                  value={orgData.orgName}
                  onChange={(e) => handleInputChange('orgName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rccm">Numéro RCCM</Label>
                <Input
                  id="rccm"
                  placeholder="CI-ABJ-2024-B-12345"
                  value={orgData.rccm}
                  onChange={(e) => handleInputChange('rccm', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section Administrateur */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Compte Administrateur</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminFirstName">Prénom</Label>
                <Input
                  id="adminFirstName"
                  placeholder="Jean"
                  value={orgData.adminFirstName}
                  onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminLastName">Nom</Label>
                <Input
                  id="adminLastName"
                  placeholder="Dupont"
                  value={orgData.adminLastName}
                  onChange={(e) => handleInputChange('adminLastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email administrateur</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@garagecentral.com"
                value={orgData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Mot de passe</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="••••••••"
                value={orgData.adminPassword}
                onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Building2 className="w-4 h-4 mr-2 animate-pulse" />
                Création en cours...
              </>
            ) : (
              <>
                Créer l'organisation
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}