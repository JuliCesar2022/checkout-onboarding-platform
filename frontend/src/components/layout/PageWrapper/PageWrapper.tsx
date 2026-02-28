import React from 'react';
import { Navigation } from '../Navigation';
import { Header } from '../Header';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
