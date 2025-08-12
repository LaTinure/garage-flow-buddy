import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Car,
  Paintbrush,
  Calculator,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Star,
  Users,
  Award,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

import UnifiedFooter from '@/components/UnifiedFooter';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Carrousel data avec vraies images de réparation auto
  const carouselItems = [
    {
      id: 1,
      title: "Garage Excellence Abidjan",
      description: "Votre partenaire de confiance pour tous vos besoins automobiles",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      color: "bg-blue-600"
    },
    {
      id: 2,
      title: "Diagnostic Professionnel",
      description: "Technologie de pointe pour diagnostics précis et réparations fiables",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      color: "bg-green-600"
    },
    {
      id: 3,
      title: "Service Premium",
      description: "Une équipe expérimentée au service de votre véhicule",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      color: "bg-purple-600"
    }
  ];

  // Auto-rotation du carrousel
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header simple pour la page d'accueil */}
      <header className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 shadow-2xl py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Garage Abidjan</h1>
              <p className="text-sm text-white/80">Excellence Automobile</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/auth">
              <Button className="bg-white text-black hover:bg-gray-100 font-bold shadow-lg">
                Espace Pro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section avec Carrousel */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute inset-0 ${item.color} opacity-80`} />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
              </div>
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white">
                      <h2 className="text-5xl font-bold mb-4 animate-fade-in">
                        {item.title}
                      </h2>
                      <p className="text-xl mb-8 opacity-90">
                        {item.description}
                      </p>
                      <div className="flex space-x-4">
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-gray-100 shadow-lg font-bold"
                          onClick={() => setShowDevisModal(true)}
                        >
                          <Calculator className="mr-2 w-5 h-5" />
                          Estimez votre devis
                        </Button>
                        <Link to="/auth">
                          <Button
                            size="lg"
                            className="bg-white text-black hover:bg-gray-100 shadow-lg font-bold"
                          >
                            Espace Pro
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="relative">
                        <div className="w-full h-80 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
                          <div className="text-center text-white">
                            <Car className="w-24 h-24 mx-auto mb-4 opacity-80" />
                            <p className="text-lg font-semibold">Service Premium</p>
                            <p className="text-sm opacity-80">Garage moderne et professionnel</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicateurs du carrousel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-16 transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Nos Services d'Excellence
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Découvrez notre gamme complète de services automobiles professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wrench,
                title: "Réparation Mécanique",
                description: "Diagnostic et réparation de tous systèmes mécaniques",
                features: ["Moteur", "Transmission", "Suspension", "Freinage"]
              },
              {
                icon: Car,
                title: "Diagnostic Électronique",
                description: "Technologie OBD pour diagnostics précis",
                features: ["Codes d'erreur", "Tests système", "Calibration", "Mise à jour"]
              },
              {
                icon: Paintbrush,
                title: "Carrosserie & Peinture",
                description: "Restauration complète de carrosserie",
                features: ["Réparation", "Peinture", "Polissage", "Protection"]
              }
            ].map((service, index) => (
              <Card key={index} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isDark ? 'bg-gray-700 border-gray-600' : ''
              }`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : ''}>{service.title}</CardTitle>
                  <CardDescription className={isDark ? 'text-gray-300' : ''}>
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-center">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "5000+", label: "Clients Satisfaits" },
              { icon: Car, value: "15000+", label: "Véhicules Réparés" },
              { icon: Award, value: "14", label: "Années d'Expérience" },
              { icon: Star, value: "4.9/5", label: "Note Moyenne" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className={`py-16 transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Prêt à nous faire confiance ?
              </h2>
              <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Rejoignez notre espace professionnel pour accéder à la gestion complète de votre garage.
                Suivi des clients, gestion des véhicules, planning des réparations et bien plus encore.
              </p>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-orange-500" />
                  <span>07 58 96 61 56</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                  <span>Abidjan, Côte d'Ivoire</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-orange-500" />
                  <span>Lun-Sam: 8h-18h</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Card className={`p-8 border-orange-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gradient-to-br from-orange-50 to-red-50'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Accès Espace Pro
                  </CardTitle>
                  <CardDescription className={`text-lg ${isDark ? 'text-gray-300' : ''}`}>
                    Gérez votre garage en toute simplicité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Gestion des clients et véhicules
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Planning des réparations
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Suivi des stocks et pièces
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Rapports et statistiques
                    </div>
                  </div>
                  <Link to="/auth" className="block">
                    <Button size="lg" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold text-white">
                      Commencer Maintenant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer unifié */}
      <UnifiedFooter />

      {/* Modal Devis (simplifiée) */}
      {showDevisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Estimation de Devis</h3>
            <p className="text-gray-600 mb-6">
              Pour obtenir un devis précis, veuillez nous contacter directement ou utiliser notre espace professionnel.
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowDevisModal(false)}
                variant="outline"
              >
                Fermer
              </Button>
              <Link to="/auth">
                <Button className="bg-green-600 hover:bg-green-700 font-bold text-white shadow-lg">
                  Espace Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
