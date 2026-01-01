/**
 * Global Components Barrel Export
 * Phase 2: Global Standardization Research System
 * 
 * Centralized export for all global components and types
 */

// Components
export { Footer } from './Footer';
export { Header } from './Header';
export { Navigation, defaultNavItems } from './Navigation';

// Types
export type {
  NavItem,
  Route,
  ValidatedHref,
  FooterProps,
  HeaderProps,
  NavigationType,
  NavigationProps,
  I18nMetadata,
  TranslationDict
} from './types';

// Re-export default components
export { default as DefaultFooter } from './Footer';
export { default as DefaultHeader } from './Header';
export { default as DefaultNavigation } from './Navigation';
