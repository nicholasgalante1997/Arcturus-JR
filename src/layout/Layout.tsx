import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import withProviders from './withProviders';

interface LayoutProps extends React.PropsWithChildren {}

function Layout({ children }: LayoutProps) {
  return (
    <React.Fragment>
      <Header />
      <main id="app" className="container">
        {children}
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default withProviders(React.memo(Layout));
