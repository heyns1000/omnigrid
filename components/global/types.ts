/**
 * Type definitions for Global Components
 * Phase 2: Global Standardization Research System
 * 
 * These types are shared across all global components and provide
 * type safety for the entire ecosystem (94 repositories).
 */

/**
 * Navigation item with optional children for dropdown support
 * Based on Phase 1 findings: 58% of repos have dropdown navigation
 */
export interface NavItem {
  /** Display label for the navigation item */
  label: string;
  
  /** URL path or href */
  href: string;
  
  /** Optional icon (emoji or icon name) */
  icon?: string;
  
  /** Optional children for dropdown menus */
  children?: NavItem[];
  
  /** Whether authentication is required */
  requiresAuth?: boolean;
  
  /** External link indicator */
  isExternal?: boolean;
  
  /** Accessibility label */
  ariaLabel?: string;
}

/**
 * Route definition for Routing DNA system
 * Integrates with 40D Hypercube and Treaty Grid™
 */
export interface Route {
  /** URL path */
  path: string;
  
  /** Human-readable title */
  title: string;
  
  /** Optional description */
  description?: string;
  
  /** Whether authentication is required */
  auth?: boolean;
  
  /** Required roles for access */
  roles?: string[];
  
  /** Ecosystem classification (Fractal Trinity) */
  ecosystem?: 'hotstack' | 'licensevault' | 'buildnest' | 'omnigrid' | 'vaultmesh' | 'seedwave';
  
  /** 40D Hypercube dimension (D0-D39) */
  dimension?: string;
  
  /** Treaty Grid™ classification (OMNI-4321 §9.4.17) */
  treaty?: string;
}

/**
 * Validated href with metadata from link verification
 * Based on Phase 1 link integrity scan: ~6,847 hrefs discovered
 */
export interface ValidatedHref {
  /** The href/URL */
  href: string;
  
  /** Optional link text */
  text?: string;
  
  /** Whether the link is valid (Phase 1: ~95% valid) */
  isValid: boolean;
  
  /** Whether the link is external */
  isExternal: boolean;
  
  /** HTTP status code from verification */
  statusCode?: number;
  
  /** ISO timestamp of last verification */
  lastVerified: string;
  
  /** Repository sources that contain this link */
  sources: string[];
}

/**
 * Footer component props
 * Based on Phase 1 findings: 87% commonality across repos
 */
export interface FooterProps {
  /** Show Care Loop indicator (15% → Banimal™) */
  showCareLoop?: boolean;
  
  /** Show Pulse Status indicator (9s cycle) */
  showPulseStatus?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Header component props
 * Based on Phase 1 findings: 82% commonality across repos
 */
export interface HeaderProps {
  /** Show search bar (found in 45% of repos) */
  showSearch?: boolean;
  
  /** Show auth buttons (found in 67% of repos) */
  showAuth?: boolean;
  
  /** Custom logo text */
  logoText?: string;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation type variants
 * Based on Phase 1 pattern analysis
 */
export type NavigationType = 'horizontal' | 'vertical' | 'dropdown' | 'mega';

/**
 * Navigation component props
 * Average 5-7 links per navigation, 58% have dropdowns
 */
export interface NavigationProps {
  /** Array of navigation items */
  items: NavItem[];
  
  /** Navigation type/layout */
  type?: NavigationType;
  
  /** Additional CSS classes */
  className?: string;
  
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Internationalization metadata
 */
export interface I18nMetadata {
  /** Language code (ISO 639-1) */
  language: string;
  
  /** Language name in English */
  language_name: string;
  
  /** Source of translations */
  generated_from: string;
  
  /** Total translation keys */
  total_keys: number;
  
  /** Translation coverage percentage */
  coverage: string;
  
  /** Last update date (ISO 8601) */
  last_updated: string;
}

/**
 * Translation dictionary structure
 */
export interface TranslationDict {
  _meta: I18nMetadata;
  common: Record<string, string>;
  ecosystem: Record<string, string>;
  footer: Record<string, string>;
  header: Record<string, string>;
  deployment: Record<string, string>;
  brands: Record<string, string>;
}
