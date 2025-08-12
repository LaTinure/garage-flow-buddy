import React, { useState, useEffect } from 'react';
import { Car, Wrench, Zap, Sun, Moon, Bell, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import UserMenu from './UserMenu';
import NotificationCenter from './NotificationCenter';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface UnifiedHeaderProps {
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  showUserMenu = true,
  showThemeToggle = true
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [garageData, setGarageData] = useState<any>({});
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const stored = localStorage.getItem('garageData');
    if (stored) {
      setGarageData(JSON.parse(stored));
    }
  }, []);

  // Charger le nombre de notifications non lues
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      const unreadCount = notifications.filter((n: any) => !n.read).length;
      setUnreadNotifications(unreadCount);
    }
  }, [isNotificationOpen]); // Recharger quand le modal se ferme

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [isMobileMenuOpen]);

  return (
    <header className={`w-full shadow-2xl animate-fade-in sticky top-0 z-40 transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800'
        : 'bg-gradient-to-r from-green-600 via-green-700 to-green-800'
    }`}>
      {/* Fond animé subtil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-ping" />
        <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-pulse" />
        <div className="absolute bottom-8 left-1/3 w-12 h-12 bg-white/8 rounded-full animate-bounce" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et informations garage */}
          <div className="flex items-center space-x-6">
            {/* Logo animé */}
            <div className="relative group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border transition-all duration-500 hover:scale-110 hover:rotate-3 ${
                isDark
                  ? 'bg-white/10 backdrop-blur-md border-white/20'
                  : 'bg-white/25 backdrop-blur-md border-white/40'
              }`}>
                <div className="relative">
                  <Car className="w-8 h-8 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1">
                    <Wrench className="w-5 h-5 text-yellow-300 animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2">
                <Zap className="w-4 h-4 text-yellow-400 animate-ping" />
              </div>
            </div>

            {/* Informations du garage */}
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg transition-all duration-300 hover:scale-105">
                {garageData.name || 'Garage Abidjan'}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                <span className="text-sm text-white/90 font-medium">
                  Excellence Automobile
                </span>
              </div>
            </div>
          </div>

          {/* Navigation centrale */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
               
                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isDark ? 'text-white hover:text-green-300' : 'text-black font-bold hover:text-green-700'} transition-colors`}>
                      Tableau de bord
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isDark ? 'text-white hover:text-green-300' : 'text-black font-bold hover:text-green-700'} transition-colors`}>
                        Clients
                      </NavigationMenuLink>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <Link to="/clients/liste">
                        <DropdownMenuItem>Liste des clients</DropdownMenuItem>
                      </Link>
                      <Link to="/clients/ajouter">
                        <DropdownMenuItem>Ajouter un client</DropdownMenuItem>
                      </Link>
                      <Link to="/clients/historique">
                        <DropdownMenuItem>Historique</DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/vehicules">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isDark ? 'text-white hover:text-green-300' : 'text-black font-bold hover:text-green-700'} transition-colors`}>
                      Véhicules
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/reparations">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isDark ? 'text-white hover:text-green-300' : 'text-black font-bold hover:text-green-700'} transition-colors`}>
                      Réparations
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/stock">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isDark ? 'text-white hover:text-green-300' : 'text-black font-bold hover:text-green-700'} transition-colors`}>
                      Stock
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Menu mobile */}
          <div className="lg:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-16 bg-opacity-95 backdrop-blur-md max-w-md mx-auto">
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/dashboard" 
                    className="text-lg font-medium px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <div className="flex flex-col space-y-2 px-4">
                    <span className="text-lg font-medium">Clients</span>
                    <Link 
                      to="/clients/liste" 
                      className="pl-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Liste des clients
                    </Link>
                    <Link 
                      to="/clients/ajouter" 
                      className="pl-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Ajouter un client
                    </Link>
                  </div>
                  <Link 
                    to="/vehicules" 
                    className="text-lg font-medium px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Véhicules
                  </Link>
                  <Link 
                    to="/reparations" 
                    className="text-lg font-medium px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Réparations
                  </Link>
                  <Link 
                    to="/stock" 
                    className="text-lg font-medium px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Stock
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Contrôles */}
          <div className="flex items-center space-x-4">
            {/* Bouton notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(true)}
                className={`p-2 rounded-lg transition-colors duration-300 relative ${
                  isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white/25 text-white hover:bg-white/35 shadow-lg'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </Badge>
                )}
              </button>
            </div>

            {/* Toggle de thème */}
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDark
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-white/25 text-white hover:bg-white/35 shadow-lg'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Menu utilisateur */}
            {showUserMenu && <UserMenu />}
          </div>
        </div>
      </div>

      {/* Centre de notifications */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </header>
  );
};

export default UnifiedHeader;
