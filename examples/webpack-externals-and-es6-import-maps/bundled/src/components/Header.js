import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initialize GSAP animations
    const loadGSAP = async () => {
      gsap.from('.logo', {
        opacity: 0,
        x: -20,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.nav-links li', {
        opacity: 0,
        y: -10,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
    };

    loadGSAP();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <div className="logo-text">PokeGrade</div>
        </div>

        <nav>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#featured">Featured Cards</a>
            </li>
            <li>
              <a href="#process">Our Process</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#testimonials">Reviews</a>
            </li>
            <li>
              <a href="#contact" className="btn btn-primary">
                Get Started
              </a>
            </li>
          </ul>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
