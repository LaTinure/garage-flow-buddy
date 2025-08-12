import React from 'react';
import { AnimatedHeader } from './AnimatedHeader';
import { InteractiveFooter } from './InteractiveFooter';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function UnifiedLayout({ children, showHeader = true, showFooter = true }: UnifiedLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col transition-all duration-300">
      {showHeader && <AnimatedHeader />}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {showFooter && <InteractiveFooter />}
    </div>
  );
}