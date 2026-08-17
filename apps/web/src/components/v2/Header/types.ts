import { type ThemePreference } from '@/types/theme';

export { type ThemePreference };

export interface V2HeaderProps {
  /** Whether header should start transparent (for hero pages) */
  transparent?: boolean;
  /** Custom className for additional styling */
  className?: string;
}
export interface V2HeaderViewProps extends V2HeaderProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  theme: ThemePreference;
  onCycleTheme: () => void;
}
