import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Car, MapPin, Upload, Smartphone, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const availableServices = [
  'Vidange et entretien moteur',
  'Réparation freins',
  'Diagnostic électronique',
  'Climatisation automobile',
  'Carrosserie et peinture',
  'Pneumatiques',
  'Géométrie et parallélisme',
  'Contrôle technique'
];

export function GarageSetupStep() {
  const [garageData, setGarageData] = React.useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    smsCode: ''
  });
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [logo, setLogo] = React.useState<File | null>(null);
  const [step, setStep] = React.useState<'info' | 'services' | 'sms'>('info');
  const [isLoading, setIsLoading] = React.useState(false);
  const { goToNextStep } = useWorkflow();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setGarageData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleInfoSubmit = () => {
    if (garageData.name && garageData.address && garageData.city && garageData.phone) {
      setStep('services');
    }
  };

  const handleServicesSubmit = () => {
    if (selectedServices.length > 0) {
      // Simulate sending SMS
      toast({
        title: "SMS envoyé",
        description: `Code de validation envoyé au ${garageData.phone}`,
      });
      setStep('sms');
    }
  };

  const handleSmsSubmit = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (garageData.smsCode === '123456') {
        // Store garage data
        const completeGarageData = {
          ...garageData,
          services: selectedServices,
          logo: logo?.name || null
        };
        localStorage.setItem('garageData', JSON.stringify(completeGarageData));
        
        toast({
          title: "Configuration terminée",
          description: "Votre garage a été configuré avec succès",
        });
        
        setIsLoading(false);
        goToNextStep();
      } else {
        toast({
          title: "Code incorrect",
          description: "Le code de validation est incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  if (step === 'info') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Configuration du Garage</CardTitle>
          <CardDescription>
            Renseignez les informations de base de votre garage
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="garageName">Nom du garage</Label>
              <Input
                id="garageName"
                placeholder="Garage Central"
                value={garageData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo (optionnel)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  placeholder="123 Rue de la Paix"
                  value={garageData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Abidjan"
                  value={garageData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  placeholder="00225"
                  value={garageData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  placeholder="+225 07 12 34 56 78"
                  value={garageData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <Button onClick={handleInfoSubmit} className="w-full">
            Continuer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'services') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Services proposés</CardTitle>
          <CardDescription>
            Sélectionnez les services que votre garage propose
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {availableServices.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={selectedServices.includes(service)}
                  onCheckedChange={() => handleServiceToggle(service)}
                />
                <Label htmlFor={service} className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleServicesSubmit} 
            className="w-full"
            disabled={selectedServices.length === 0}
          >
            Envoyer le code de validation
            <Smartphone className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Validation SMS</CardTitle>
        <CardDescription>
          Entrez le code de validation reçu au {garageData.phone}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="smsCode">Code de validation</Label>
          <Input
            id="smsCode"
            placeholder="123456"
            value={garageData.smsCode}
            onChange={(e) => handleInputChange('smsCode', e.target.value)}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Code de démonstration: <strong>123456</strong></p>
        </div>
        
        <Button 
          onClick={handleSmsSubmit}
          className="w-full"
          disabled={garageData.smsCode.length !== 6 || isLoading}
        >
          {isLoading ? (
            <>
              <Smartphone className="w-4 h-4 mr-2 animate-pulse" />
              Validation...
            </>
          ) : (
            'Valider'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}