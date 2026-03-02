import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { BottomNav } from '../BottomNav/BottomNav';
import { ROUTES } from '../../../constants/routes';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { pathname } = useLocation();
  const isNavHidden = pathname === ROUTES.CHECKOUT || pathname === ROUTES.TRANSACTION_STATUS || pathname.startsWith('/products/');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main 
        key={pathname} 
        className={`page-enter flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full ${
          isNavHidden ? 'pb-16 pb-[calc(1.5rem+env(safe-area-inset-bottom))]' : 'pb-24'
        } sm:pb-6`}
      >
        {children}
      </main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
