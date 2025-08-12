import React from 'react';
import { Car, Loader2 } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto transform transition-transform animate-pulse">
            <Car className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-garage-success rounded-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">GarageFlow</h1>
          <p className="text-muted-foreground">Initialisation de votre système...</p>
        </div>
        
        <div className="w-64 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-garage-success rounded-full animate-pulse w-3/4 transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}