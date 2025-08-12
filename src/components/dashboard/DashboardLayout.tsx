import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Users, Calendar, TrendingUp, Plus, Settings, Bell } from 'lucide-react';

export function DashboardLayout() {
  const stats = [
    {
      title: 'Garages actifs',
      value: '3',
      description: '+1 ce mois',
      icon: <Car className="w-4 h-4" />,
      trend: 'up'
    },
    {
      title: 'Utilisateurs',
      value: '12',
      description: '8 mécaniciens, 4 gérants',
      icon: <Users className="w-4 h-4" />,
      trend: 'stable'
    },
    {
      title: 'RDV aujourd\'hui',
      value: '24',
      description: '18 confirmés, 6 en attente',
      icon: <Calendar className="w-4 h-4" />,
      trend: 'up'
    },
    {
      title: 'Revenus ce mois',
      value: '€15,420',
      description: '+12% vs mois dernier',
      icon: <TrendingUp className="w-4 h-4" />,
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-primary-foreground/80">
                Bienvenue sur votre système de gestion GarageFlow
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Raccourcis vers les fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Nouveau RDV</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Ajouter utilisateur</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Car className="w-6 h-6" />
                  <span className="text-sm">Nouveau garage</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de données</span>
                <Badge variant="secondary" className="bg-garage-success/10 text-garage-success">
                  Opérationnel
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentification</span>
                <Badge variant="secondary" className="bg-garage-success/10 text-garage-success">
                  Actif
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications SMS</span>
                <Badge variant="secondary" className="bg-garage-warning/10 text-garage-warning">
                  En attente
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions dans votre système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nouveau RDV programmé', time: 'Il y a 5 min', user: 'Mécanicien Jean' },
                { action: 'Utilisateur créé', time: 'Il y a 15 min', user: 'Admin Système' },
                { action: 'Garage configuré', time: 'Il y a 1h', user: 'Super Admin' },
                { action: 'Plan Professional activé', time: 'Il y a 2h', user: 'Système' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">Par {activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}