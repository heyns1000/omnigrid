/**
 * Standards Analyzer - Analyzes patterns to determine global standards
 * Finds most common elements and generates canonical versions
 */

import type {
  PatternCollection,
  FooterPattern,
  HeaderPattern,
  NavigationPattern,
  GlobalStandards,
  ResearchConfig,
} from './types';

export class StandardsAnalyzer {
  private config: ResearchConfig;
  private allPatterns: PatternCollection[] = [];

  constructor(config: ResearchConfig) {
    this.config = config;
  }

  /**
   * Add patterns from a scan
   */
  addPatterns(patterns: PatternCollection): void {
    this.allPatterns.push(patterns);
  }

  /**
   * Analyze all collected patterns and generate global standards
   */
  analyzeGlobalStandards(): GlobalStandards {
    console.log('[StandardsAnalyzer] Analyzing global standards...');

    // Collect all patterns
    const allFooters: FooterPattern[] = [];
    const allHeaders: HeaderPattern[] = [];
    const allNavigations: NavigationPattern[] = [];
    const allHrefs: any[] = [];
    const allText: any[] = [];

    for (const patterns of this.allPatterns) {
      allFooters.push(...patterns.footers);
      allHeaders.push(...patterns.headers);
      allNavigations.push(...patterns.navigations);
      allHrefs.push(...patterns.hrefs);
      allText.push(...patterns.hardcodedText);
    }

    // Find canonical patterns
    const canonicalFooter = this.findCanonicalFooter(allFooters);
    const canonicalHeader = this.findCanonicalHeader(allHeaders);
    const canonicalNavigation = this.findCanonicalNavigation(allNavigations);
    
    // Build translation keys
    const translationKeys = this.buildTranslationKeys(allText);

    const standards: GlobalStandards = {
      canonicalFooter,
      canonicalHeader,
      canonicalNavigation,
      validatedHrefs: allHrefs,
      translationKeys,
      lastUpdated: new Date(),
      repositoriesScanned: this.allPatterns.length,
      patternsFound:
        allFooters.length +
        allHeaders.length +
        allNavigations.length +
        allHrefs.length +
        allText.length,
    };

    console.log('[StandardsAnalyzer] Standards analysis complete');
    console.log(`  - Footers: ${allFooters.length}, Canonical: ${canonicalFooter ? 'Found' : 'None'}`);
    console.log(`  - Headers: ${allHeaders.length}, Canonical: ${canonicalHeader ? 'Found' : 'None'}`);
    console.log(`  - Navigations: ${allNavigations.length}, Canonical: ${canonicalNavigation ? 'Found' : 'None'}`);
    console.log(`  - Translation keys: ${Object.keys(translationKeys).length}`);

    return standards;
  }

  /**
   * Find the most common footer pattern
   */
  private findCanonicalFooter(footers: FooterPattern[]): FooterPattern | null {
    if (footers.length === 0) return null;

    // Calculate commonality based on structural similarity
    for (const footer of footers) {
      footer.commonality = this.calculateFooterCommonality(footer, footers);
    }

    // Sort by commonality and pick the most common
    footers.sort((a, b) => b.commonality - a.commonality);

    return footers[0];
  }

  /**
   * Find the most common header pattern
   */
  private findCanonicalHeader(headers: HeaderPattern[]): HeaderPattern | null {
    if (headers.length === 0) return null;

    // Calculate commonality
    for (const header of headers) {
      header.commonality = this.calculateHeaderCommonality(header, headers);
    }

    // Sort by commonality
    headers.sort((a, b) => b.commonality - a.commonality);

    return headers[0];
  }

  /**
   * Find the most common navigation pattern
   */
  private findCanonicalNavigation(navigations: NavigationPattern[]): NavigationPattern | null {
    if (navigations.length === 0) return null;

    // Calculate commonality
    for (const nav of navigations) {
      nav.commonality = this.calculateNavCommonality(nav, navigations);
    }

    // Sort by commonality
    navigations.sort((a, b) => b.commonality - a.commonality);

    return navigations[0];
  }

  /**
   * Calculate footer commonality score
   */
  private calculateFooterCommonality(footer: FooterPattern, allFooters: FooterPattern[]): number {
    let score = 0;

    for (const other of allFooters) {
      if (footer === other) continue;

      // Compare structures
      if (footer.structure.hasLinks === other.structure.hasLinks) score += 1;
      if (footer.structure.hasCopyright === other.structure.hasCopyright) score += 1;
      if (footer.structure.hasSocial === other.structure.hasSocial) score += 1;
      if (Math.abs(footer.structure.columns - other.structure.columns) <= 1) score += 1;

      // Compare content similarity (simple approach)
      const similarity = this.calculateTextSimilarity(footer.content, other.content);
      score += similarity * 10;
    }

    return score;
  }

  /**
   * Calculate header commonality score
   */
  private calculateHeaderCommonality(header: HeaderPattern, allHeaders: HeaderPattern[]): number {
    let score = 0;

    for (const other of allHeaders) {
      if (header === other) continue;

      if (header.structure.hasLogo === other.structure.hasLogo) score += 1;
      if (header.structure.hasNav === other.structure.hasNav) score += 1;
      if (header.structure.hasSearch === other.structure.hasSearch) score += 1;
      if (header.structure.hasAuth === other.structure.hasAuth) score += 1;

      const similarity = this.calculateTextSimilarity(header.content, other.content);
      score += similarity * 10;
    }

    return score;
  }

  /**
   * Calculate navigation commonality score
   */
  private calculateNavCommonality(nav: NavigationPattern, allNavs: NavigationPattern[]): number {
    let score = 0;

    for (const other of allNavs) {
      if (nav === other) continue;

      if (nav.structure.type === other.structure.type) score += 2;
      if (nav.structure.levels === other.structure.levels) score += 1;

      // Compare items
      const commonItems = this.countCommonNavItems(nav.items, other.items);
      score += commonItems * 2;
    }

    return score;
  }

  /**
   * Calculate text similarity (simple Jaccard similarity)
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Count common navigation items
   */
  private countCommonNavItems(
    items1: Array<{ label: string; href: string }>,
    items2: Array<{ label: string; href: string }>
  ): number {
    let count = 0;

    for (const item1 of items1) {
      for (const item2 of items2) {
        if (
          item1.label.toLowerCase() === item2.label.toLowerCase() ||
          item1.href === item2.href
        ) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Build translation keys from all hardcoded text
   */
  private buildTranslationKeys(textStrings: any[]): Record<string, string> {
    const keys: Record<string, string> = {};

    for (const textString of textStrings) {
      if (textString.suggestedKey && !keys[textString.suggestedKey]) {
        keys[textString.suggestedKey] = textString.text;
      }
    }

    return keys;
  }

  /**
   * Generate component code from standards
   */
  generateComponentCode(standards: GlobalStandards): {
    footer: string;
    header: string;
    navigation: string;
  } {
    return {
      footer: this.generateFooterComponent(standards.canonicalFooter),
      header: this.generateHeaderComponent(standards.canonicalHeader),
      navigation: this.generateNavigationComponent(standards.canonicalNavigation),
    };
  }

  /**
   * Generate footer component code
   */
  private generateFooterComponent(footer: FooterPattern | null): string {
    if (!footer) {
      return `// No footer pattern found
export function Footer() {
  return null;
}`;
    }

    return `/**
 * Global Footer Component
 * Generated from: ${footer.source.repository}/${footer.source.file}
 * Commonality score: ${footer.commonality.toFixed(2)}
 */

export function Footer() {
  return (
    <footer className="global-footer">
      ${footer.content.substring(0, 1000)}
    </footer>
  );
}`;
  }

  /**
   * Generate header component code
   */
  private generateHeaderComponent(header: HeaderPattern | null): string {
    if (!header) {
      return `// No header pattern found
export function Header() {
  return null;
}`;
    }

    return `/**
 * Global Header Component
 * Generated from: ${header.source.repository}/${header.source.file}
 * Commonality score: ${header.commonality.toFixed(2)}
 */

export function Header() {
  return (
    <header className="global-header">
      ${header.content.substring(0, 1000)}
    </header>
  );
}`;
  }

  /**
   * Generate navigation component code
   */
  private generateNavigationComponent(nav: NavigationPattern | null): string {
    if (!nav) {
      return `// No navigation pattern found
export function Navigation() {
  return null;
}`;
    }

    const items = nav.items.map((item) => `    { label: "${item.label}", href: "${item.href}" },`).join('\n');

    return `/**
 * Global Navigation Component
 * Generated from: ${nav.source.repository}/${nav.source.file}
 * Commonality score: ${nav.commonality.toFixed(2)}
 * Type: ${nav.structure.type}
 */

const navItems = [
${items}
];

export function Navigation() {
  return (
    <nav className="global-navigation ${nav.structure.type}">
      {navItems.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}`;
  }

  /**
   * Reset collected patterns
   */
  reset(): void {
    this.allPatterns = [];
  }
}
