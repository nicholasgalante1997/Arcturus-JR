import React from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

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

export default React.memo(Layout);
