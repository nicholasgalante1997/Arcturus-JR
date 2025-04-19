import React, { useEffect } from 'react';
import gsapModule from 'gsap';
import scrollTriggerModule from 'gsap/ScrollTrigger';
import Header from './components/Header';
import Hero from './components/Hero';

function App() {
  // Preload GSAP
  useEffect(() => {
    // Dynamic import to load GSAP only when needed
    const loadGSAP = async () => {
      try {

        const gsap = gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.default;

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Now GSAP is loaded and available
        console.log('GSAP loaded successfully');
      } catch (error) {
        console.error('Failed to load GSAP:', error);
      }
    };

    loadGSAP();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;
