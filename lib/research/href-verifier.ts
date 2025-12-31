/**
 * Href Verifier - Validates all href links across repositories
 * Detects 404s, broken links, and generates fix recommendations
 */

import type { HrefLink, ResearchConfig } from './types';

export class HrefVerifier {
  private config: ResearchConfig;
  private verifiedCache: Map<string, { isValid: boolean; statusCode?: number; timestamp: Date }> = new Map();

  constructor(config: ResearchConfig) {
    this.config = config;
  }

  /**
   * Verify all hrefs in batch
   */
  async verifyHrefs(hrefs: HrefLink[]): Promise<HrefLink[]> {
    console.log(`[HrefVerifier] Verifying ${hrefs.length} links...`);

    const results: HrefLink[] = [];
    const batchSize = 10;

    for (let i = 0; i < hrefs.length; i += batchSize) {
      const batch = hrefs.slice(i, i + batchSize);
      const verifiedBatch = await Promise.all(
        batch.map((href) => this.verifyHref(href))
      );
      results.push(...verifiedBatch);

      // Small delay to avoid overwhelming servers
      if (i + batchSize < hrefs.length) {
        await this.delay(100);
      }
    }

    const valid = results.filter((h) => h.isValid).length;
    const invalid = results.filter((h) => !h.isValid).length;
    console.log(`[HrefVerifier] Verification complete: ${valid} valid, ${invalid} broken`);

    return results;
  }

  /**
   * Verify a single href
   */
  async verifyHref(href: HrefLink): Promise<HrefLink> {
    // Skip non-HTTP(S) links
    if (!href.href.startsWith('http://') && !href.href.startsWith('https://')) {
      // Internal links are considered valid
      href.isValid = true;
      return href;
    }

    // Check cache
    const cached = this.verifiedCache.get(href.href);
    if (cached) {
      const age = Date.now() - cached.timestamp.getTime();
      if (age < 3600000) { // 1 hour cache
        href.isValid = cached.isValid;
        href.statusCode = cached.statusCode;
        return href;
      }
    }

    // Validate URL before making request
    try {
      new URL(href.href); // Will throw if invalid
    } catch (urlError) {
      href.isValid = false;
      href.error = 'Malformed URL';
      this.verifiedCache.set(href.href, {
        isValid: false,
        timestamp: new Date(),
      });
      return href;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(href.href, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'OmniGrid-Research-System/1.0',
        },
      });

      clearTimeout(timeoutId);

      href.statusCode = response.status;
      href.isValid = response.status >= 200 && response.status < 400;

      // Cache result
      this.verifiedCache.set(href.href, {
        isValid: href.isValid,
        statusCode: href.statusCode,
        timestamp: new Date(),
      });
    } catch (error: any) {
      href.isValid = false;
      href.error = error.message;
      
      // Cache failure
      this.verifiedCache.set(href.href, {
        isValid: false,
        timestamp: new Date(),
      });
    }

    return href;
  }

  /**
   * Get broken links report
   */
  getBrokenLinksReport(hrefs: HrefLink[]): {
    total: number;
    broken: HrefLink[];
    byRepository: Record<string, HrefLink[]>;
  } {
    const broken = hrefs.filter((h) => h.isValid === false);

    const byRepository: Record<string, HrefLink[]> = {};
    for (const href of broken) {
      const repo = href.source.repository;
      if (!byRepository[repo]) {
        byRepository[repo] = [];
      }
      byRepository[repo].push(href);
    }

    return {
      total: broken.length,
      broken,
      byRepository,
    };
  }

  /**
   * Generate fix recommendations
   */
  generateFixRecommendations(brokenLinks: HrefLink[]): Array<{
    link: HrefLink;
    recommendation: string;
  }> {
    const recommendations: Array<{ link: HrefLink; recommendation: string }> = [];

    for (const link of brokenLinks) {
      let recommendation = '';

      if (link.statusCode === 404) {
        recommendation = 'Page not found. Check if the URL is correct or if the page has moved.';
      } else if (link.statusCode === 403) {
        recommendation = 'Access forbidden. Check authentication or permissions.';
      } else if (link.statusCode === 500) {
        recommendation = 'Server error. The target server may be down or misconfigured.';
      } else if (link.error) {
        if (link.error.includes('timeout')) {
          recommendation = 'Request timeout. The server may be slow or unreachable.';
        } else if (link.error.includes('ENOTFOUND') || link.error.includes('DNS')) {
          recommendation = 'Domain not found. The domain may not exist or DNS is not configured.';
        } else {
          recommendation = `Network error: ${link.error}`;
        }
      } else {
        recommendation = 'Unknown error. Manual verification recommended.';
      }

      recommendations.push({ link, recommendation });
    }

    return recommendations;
  }

  /**
   * Utility: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
