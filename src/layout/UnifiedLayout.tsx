import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedHeader from '@/components/UnifiedHeader';
import UnifiedFooter from '@/components/UnifiedFooter';
import PageNavigation from '@/components/PageNavigation';

interface UnifiedLayoutProps {
  children?: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-all duration-300">
      {/* Header avec effet de transparence */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <UnifiedHeader showUserMenu={true} showThemeToggle={true} />
      </header>
      
      {/* Navigation avec animations */}
      <div className="bg-card/50 border-b border-border/30">
        <PageNavigation />
      </div>
      
      {/* Contenu principal avec transitions fluides */}
      <main className="flex-1 relative overflow-hidden">
        <div className="container mx-auto px-4 py-3 space-y-4 animate-fade-in">
          {children || <Outlet />}
        </div>
      </main>
      
      {/* Footer avec design amélioré */}
      <footer className="mt-auto bg-card/30 border-t border-border/50">
        <UnifiedFooter />
      </footer>
    </div>
  );
};

export default UnifiedLayout;
