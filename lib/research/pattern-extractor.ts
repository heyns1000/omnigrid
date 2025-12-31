/**
 * Pattern Extractor - Extracts UI patterns from scanned files
 * Finds footers, headers, navigation, hrefs, and hardcoded text
 */

import type {
  ScanResult,
  PatternCollection,
  FooterPattern,
  HeaderPattern,
  NavigationPattern,
  HrefLink,
  TextString,
  ResearchConfig,
} from './types';

export class PatternExtractor {
  private config: ResearchConfig;

  constructor(config: ResearchConfig) {
    this.config = config;
  }

  /**
   * Extract all patterns from scan results
   */
  extractPatterns(scanResult: ScanResult): PatternCollection {
    const patterns: PatternCollection = {
      footers: [],
      headers: [],
      navigations: [],
      hrefs: [],
      hardcodedText: [],
    };

    for (const change of scanResult.changes) {
      if (!change.content) continue;

      // Extract different pattern types
      patterns.footers.push(...this.extractFooters(scanResult, change));
      patterns.headers.push(...this.extractHeaders(scanResult, change));
      patterns.navigations.push(...this.extractNavigations(scanResult, change));
      patterns.hrefs.push(...this.extractHrefs(scanResult, change));
      
      if (this.config.patterns.detect_hardcoded_text) {
        patterns.hardcodedText.push(...this.extractHardcodedText(scanResult, change));
      }
    }

    // Update scan result with patterns
    scanResult.patterns = patterns;

    return patterns;
  }

  /**
   * Extract footer patterns
   */
  private extractFooters(
    scanResult: ScanResult,
    change: { path: string; content: string }
  ): FooterPattern[] {
    const footers: FooterPattern[] = [];
    const content = change.content;

    // Match footer tags and components
    const footerPatterns = [
      /<footer[^>]*>([\s\S]*?)<\/footer>/gi,
      /<div[^>]*class="[^"]*footer[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      /const\s+Footer\s*=\s*\([^)]*\)\s*=>\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);?\s*}/gi,
      /function\s+Footer\s*\([^)]*\)\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);?\s*}/gi,
    ];

    for (const pattern of footerPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const footerContent = match[1] || match[2] || match[0];
        
        footers.push({
          source: {
            repository: scanResult.repository.fullName,
            file: change.path,
          },
          content: footerContent.trim().substring(0, 5000), // Limit content size
          structure: this.analyzeFooterStructure(footerContent),
          commonality: 0, // Will be calculated later
        });
      }
    }

    return footers;
  }

  /**
   * Extract header patterns
   */
  private extractHeaders(
    scanResult: ScanResult,
    change: { path: string; content: string }
  ): HeaderPattern[] {
    const headers: HeaderPattern[] = [];
    const content = change.content;

    // Match header tags and components
    const headerPatterns = [
      /<header[^>]*>([\s\S]*?)<\/header>/gi,
      /<div[^>]*class="[^"]*header[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      /const\s+Header\s*=\s*\([^)]*\)\s*=>\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);?\s*}/gi,
      /function\s+Header\s*\([^)]*\)\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);?\s*}/gi,
    ];

    for (const pattern of headerPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const headerContent = match[1] || match[2] || match[0];
        
        headers.push({
          source: {
            repository: scanResult.repository.fullName,
            file: change.path,
          },
          content: headerContent.trim().substring(0, 5000),
          structure: this.analyzeHeaderStructure(headerContent),
          commonality: 0,
        });
      }
    }

    return headers;
  }

  /**
   * Extract navigation patterns
   */
  private extractNavigations(
    scanResult: ScanResult,
    change: { path: string; content: string }
  ): NavigationPattern[] {
    const navigations: NavigationPattern[] = [];
    const content = change.content;

    // Match nav tags and components
    const navPatterns = [
      /<nav[^>]*>([\s\S]*?)<\/nav>/gi,
      /<div[^>]*class="[^"]*nav[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      /const\s+Navigation\s*=\s*\([^)]*\)\s*=>\s*{([\s\S]*?)return\s*\(([\s\S]*?)\);?\s*}/gi,
    ];

    for (const pattern of navPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const navContent = match[1] || match[2] || match[0];
        const items = this.extractNavItems(navContent);
        
        navigations.push({
          source: {
            repository: scanResult.repository.fullName,
            file: change.path,
          },
          items,
          structure: this.analyzeNavStructure(navContent, items),
          commonality: 0,
        });
      }
    }

    return navigations;
  }

  /**
   * Extract href links
   */
  private extractHrefs(
    scanResult: ScanResult,
    change: { path: string; content: string }
  ): HrefLink[] {
    const hrefs: HrefLink[] = [];
    const content = change.content;
    const lines = content.split('\n');

    // Match anchor tags with href attributes
    const hrefPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

    let match;
    while ((match = hrefPattern.exec(content)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim(); // Strip HTML tags
      
      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length;

      hrefs.push({
        source: {
          repository: scanResult.repository.fullName,
          file: change.path,
          line: lineNumber,
        },
        href,
        text,
        isExternal: this.isExternalLink(href),
        isValid: undefined, // Will be verified later
      });
    }

    // Also match href in JSX/TSX (href={...})
    const jsxHrefPattern = /href=\{["']([^"']+)["']\}/gi;
    while ((match = jsxHrefPattern.exec(content)) !== null) {
      const href = match[1];
      const lineNumber = content.substring(0, match.index).split('\n').length;

      hrefs.push({
        source: {
          repository: scanResult.repository.fullName,
          file: change.path,
          line: lineNumber,
        },
        href,
        text: '',
        isExternal: this.isExternalLink(href),
        isValid: undefined,
      });
    }

    return hrefs;
  }

  /**
   * Extract hardcoded text for i18n
   */
  private extractHardcodedText(
    scanResult: ScanResult,
    change: { path: string; content: string }
  ): TextString[] {
    const textStrings: TextString[] = [];
    const content = change.content;

    // Match text in JSX/HTML tags (simple approach)
    const textPattern = />([^<>{}\n]{3,})</g;
    
    let match;
    while ((match = textPattern.exec(content)) !== null) {
      const text = match[1].trim();
      
      // Skip if it looks like code or contains special characters
      if (
        text.includes('=') ||
        text.includes(';') ||
        text.includes('()') ||
        /^\d+$/.test(text) ||
        text.length < 3
      ) {
        continue;
      }

      const lineNumber = content.substring(0, match.index).split('\n').length;
      const suggestedKey = this.generateI18nKey(text);

      textStrings.push({
        source: {
          repository: scanResult.repository.fullName,
          file: change.path,
          line: lineNumber,
        },
        text,
        context: this.extractContext(content, match.index),
        isTranslatable: true,
        suggestedKey,
      });
    }

    return textStrings;
  }

  /**
   * Analyze footer structure
   */
  private analyzeFooterStructure(content: string): {
    hasLinks: boolean;
    hasCopyright: boolean;
    hasSocial: boolean;
    columns: number;
  } {
    return {
      hasLinks: /<a\s+href/i.test(content),
      hasCopyright: /copyright|©|&copy;/i.test(content),
      hasSocial: /facebook|twitter|linkedin|instagram|github/i.test(content),
      columns: (content.match(/<div[^>]*class="[^"]*col[^"]*"/gi) || []).length || 1,
    };
  }

  /**
   * Analyze header structure
   */
  private analyzeHeaderStructure(content: string): {
    hasLogo: boolean;
    hasNav: boolean;
    hasSearch: boolean;
    hasAuth: boolean;
  } {
    return {
      hasLogo: /logo|brand/i.test(content),
      hasNav: /<nav|navigation/i.test(content),
      hasSearch: /search|input.*type="search"/i.test(content),
      hasAuth: /login|signup|sign in|register|logout/i.test(content),
    };
  }

  /**
   * Extract navigation items
   */
  private extractNavItems(content: string): Array<{ label: string; href: string }> {
    const items: Array<{ label: string; href: string }> = [];
    const linkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

    let match;
    while ((match = linkPattern.exec(content)) !== null) {
      const href = match[1];
      const label = match[2].replace(/<[^>]*>/g, '').trim();
      
      if (label) {
        items.push({ label, href });
      }
    }

    return items;
  }

  /**
   * Analyze navigation structure
   */
  private analyzeNavStructure(
    content: string,
    items: Array<{ label: string; href: string }>
  ): {
    type: 'horizontal' | 'vertical' | 'mega' | 'dropdown';
    levels: number;
  } {
    const hasDropdown = /dropdown|submenu/i.test(content);
    const hasMega = /mega-menu|mega-nav/i.test(content);
    
    return {
      type: hasMega ? 'mega' : hasDropdown ? 'dropdown' : 'horizontal',
      levels: hasDropdown ? 2 : 1,
    };
  }

  /**
   * Check if link is external
   */
  private isExternalLink(href: string): boolean {
    return /^https?:\/\//i.test(href) && !href.includes('faa.zone') && !href.includes('localhost');
  }

  /**
   * Generate i18n key from text
   */
  private generateI18nKey(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);
  }

  /**
   * Extract context around text
   */
  private extractContext(content: string, index: number): string {
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 50);
    return content.substring(start, end).replace(/\s+/g, ' ').trim();
  }
}
