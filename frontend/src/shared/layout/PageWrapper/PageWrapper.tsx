import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { BottomNav } from '../BottomNav/BottomNav';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main key={pathname} className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6">
        {children}
      </main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
