import React, { useCallback, useEffect, useState } from 'react';

import { pipeline } from '@/utils/pipeline';

import V2HeaderView from './View';

import type { V2HeaderProps } from './types';

const SCROLL_THRESHOLD = 20;

/**
 * V2 Header component with responsive navigation
 *
 * Features:
 * - Fixed position with blur effect on scroll
 * - Desktop navigation links
 * - Mobile hamburger menu with slide-down animation
 * - Active link highlighting via React Router
 *
 * @example
 * // Standard header
 * <V2Header />
 *
 * @example
 * // Transparent header for hero sections
 * <V2Header transparent />
 */
function V2Header(props: V2HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > SCROLL_THRESHOLD);
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <V2HeaderView
      {...props}
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      onToggleMobileMenu={handleToggleMobileMenu}
    />
  );
}

export default pipeline(React.memo)(V2Header) as React.MemoExoticComponent<typeof V2Header>;
