/**
 * Global Standardization Research System - Type Definitions
 * Phase 1: Discovery
 */

export interface ResearchConfig {
  research: {
    pulse_interval_seconds: number;
    github_api_rate_limit: number;
    cache_duration_seconds: number;
    max_parallel_requests: number;
    supported_languages: number;
  };
  repositories: {
    core_systems: string[];
    sector_hubs: string[];
  };
  patterns: {
    file_extensions: string[];
    extract_elements: string[];
    verify_hrefs: boolean;
    detect_hardcoded_text: boolean;
  };
  i18n: {
    target_languages: number;
    primary_languages: string[];
    extract_patterns: string[];
  };
  output: {
    cache_directory: string;
    standards_directory: string;
    components_directory: string;
    dashboard_file: string;
  };
}

export interface Repository {
  owner: string;
  name: string;
  fullName: string;
  lastScanTime?: Date;
  lastCommitSha?: string;
}

export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  content?: string;
  sha?: string;
}

export interface ScanResult {
  repository: Repository;
  timestamp: Date;
  changes: FileChange[];
  patterns: PatternCollection;
  errors?: string[];
}

export interface PatternCollection {
  footers: FooterPattern[];
  headers: HeaderPattern[];
  navigations: NavigationPattern[];
  hrefs: HrefLink[];
  hardcodedText: TextString[];
}

export interface FooterPattern {
  source: {
    repository: string;
    file: string;
  };
  content: string;
  structure: {
    hasLinks: boolean;
    hasCopyright: boolean;
    hasSocial: boolean;
    columns: number;
  };
  commonality: number;
}

export interface HeaderPattern {
  source: {
    repository: string;
    file: string;
  };
  content: string;
  structure: {
    hasLogo: boolean;
    hasNav: boolean;
    hasSearch: boolean;
    hasAuth: boolean;
  };
  commonality: number;
}

export interface NavigationPattern {
  source: {
    repository: string;
    file: string;
  };
  items: NavItem[];
  structure: {
    type: 'horizontal' | 'vertical' | 'mega' | 'dropdown';
    levels: number;
  };
  commonality: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HrefLink {
  source: {
    repository: string;
    file: string;
    line: number;
  };
  href: string;
  text: string;
  isExternal: boolean;
  isValid?: boolean;
  statusCode?: number;
  error?: string;
}

export interface TextString {
  source: {
    repository: string;
    file: string;
    line: number;
  };
  text: string;
  context: string;
  isTranslatable: boolean;
  suggestedKey?: string;
}

export interface GlobalStandards {
  canonicalFooter: FooterPattern | null;
  canonicalHeader: HeaderPattern | null;
  canonicalNavigation: NavigationPattern | null;
  validatedHrefs: HrefLink[];
  translationKeys: Record<string, string>;
  lastUpdated: Date;
  repositoriesScanned: number;
  patternsFound: number;
}

export interface ResearchDashboardData {
  status: {
    isRunning: boolean;
    currentPulse: number;
    lastPulseTime: Date;
    nextPulseTime: Date;
  };
  repositories: {
    total: number;
    scanned: number;
    pending: number;
    errors: number;
  };
  patterns: {
    footers: number;
    headers: number;
    navigations: number;
    hrefs: number;
    brokenLinks: number;
    hardcodedStrings: number;
  };
  standards: GlobalStandards;
  recentActivity: {
    timestamp: Date;
    repository: string;
    action: string;
    details: string;
  }[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  expiresAt: Date;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}
