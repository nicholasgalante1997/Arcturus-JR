import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const cardStackRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const loadAnimations = async () => {
      try {

        // Text animation
        gsap.from('.hero-title', {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        });

        gsap.from('.hero-subtitle', {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out'
        });

        gsap.from('.hero-buttons .btn', {
          opacity: 0,
          y: 20,
          stagger: 0.2,
          duration: 0.8,
          delay: 0.6,
          ease: 'power3.out'
        });

        // Card animation
        if (cardStackRef.current) {
          // Initial card rotation
          gsap.set('.card-container', {
            rotateY: 15,
            rotateX: -10
          });

          // Floating animation
          gsap.to('.card-container', {
            y: 20,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut'
          });

          // 3D hover effect
          const cardContainer = cardStackRef.current;

          const handleMouseMove = (e) => {
            const rect = cardContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            gsap.to('.card-container', {
              rotateY: -5 + x * 10,
              rotateX: 5 - y * 10,
              ease: 'power2.out',
              duration: 0.5
            });
          };

          const handleMouseLeave = () => {
            gsap.to('.card-container', {
              rotateY: 0,
              rotateX: 0,
              ease: 'power2.out',
              duration: 0.5
            });
          };

          cardContainer.addEventListener('mousemove', handleMouseMove);
          cardContainer.addEventListener('mouseleave', handleMouseLeave);

          // Clean up
          return () => {
            cardContainer.removeEventListener('mousemove', handleMouseMove);
            cardContainer.removeEventListener('mouseleave', handleMouseLeave);
          };
        }

        // Create particles
        if (particlesRef.current) {
          const particlesContainer = particlesRef.current;
          const numParticles = 20;

          for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random positioning
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 15 + 5;
            const duration = Math.random() * 20 + 10;

            gsap.set(particle, {
              x: `${x}%`,
              y: `${y}%`,
              width: size,
              height: size
            });

            particlesContainer.appendChild(particle);

            // Floating animation
            gsap.to(particle, {
              y: `${y + (Math.random() * 20 - 10)}%`,
              x: `${x + (Math.random() * 20 - 10)}%`,
              opacity: Math.random() * 0.5,
              duration: duration,
              repeat: -1,
              yoyo: true,
              ease: 'power1.inOut'
            });
          }
        }
      } catch (error) {
        console.error('Failed to load GSAP animations:', error);
      }
    };

    loadAnimations();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Professional <span className="highlight">Pokémon Card</span> Grading Services
          </h1>
          <p className="hero-subtitle">
            Maximize the value of your collection with our expert grading services. Fast, reliable, and
            trusted by collectors worldwide.
          </p>
          <div className="hero-buttons">
            <a href="#pricing" className="btn btn-primary">
              Start Grading
            </a>
            <a href="#process" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="card-stack" ref={cardStackRef}>
            <div className="card-container">
              <div className="card-element">
                <img src="https://images.pokemontcg.io/swsh1/1_hires.png" alt="Celebi V" />
                <div className="grade-badge">10</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="floating-particles" ref={particlesRef}></div>
    </section>
  );
};

export default Hero;
