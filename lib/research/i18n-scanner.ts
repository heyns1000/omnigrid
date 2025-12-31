/**
 * i18n Scanner - Detects hardcoded text and builds translation keys
 * Supports 111 languages globally
 */

import type { TextString, ResearchConfig } from './types';

export class I18nScanner {
  private config: ResearchConfig;
  private translationKeys: Map<string, Set<string>> = new Map();

  constructor(config: ResearchConfig) {
    this.config = config;
  }

  /**
   * Process hardcoded text and build translation database
   */
  processHardcodedText(textStrings: TextString[]): {
    keys: Record<string, string>;
    coverage: {
      totalStrings: number;
      translatable: number;
      byRepository: Record<string, number>;
    };
  } {
    console.log(`[I18nScanner] Processing ${textStrings.length} text strings...`);

    const keys: Record<string, string> = {};
    const byRepository: Record<string, number> = {};
    let translatable = 0;

    for (const textString of textStrings) {
      if (!textString.isTranslatable) continue;

      translatable++;

      // Count by repository
      const repo = textString.source.repository;
      byRepository[repo] = (byRepository[repo] || 0) + 1;

      // Add to keys
      if (textString.suggestedKey) {
        // If key exists, add repository to tracking
        if (!this.translationKeys.has(textString.suggestedKey)) {
          this.translationKeys.set(textString.suggestedKey, new Set());
        }
        this.translationKeys.get(textString.suggestedKey)!.add(repo);

        // Use the text from first occurrence
        if (!keys[textString.suggestedKey]) {
          keys[textString.suggestedKey] = textString.text;
        }
      }
    }

    console.log(`[I18nScanner] Found ${Object.keys(keys).length} unique translation keys`);

    return {
      keys,
      coverage: {
        totalStrings: textStrings.length,
        translatable,
        byRepository,
      },
    };
  }

  /**
   * Generate translation files for target languages
   */
  generateTranslationFiles(
    keys: Record<string, string>
  ): Record<string, Record<string, string>> {
    const files: Record<string, Record<string, string>> = {};

    // Generate for primary languages (actual translations would need AI/API)
    for (const lang of this.config.i18n.primary_languages) {
      files[lang] = { ...keys };
      
      // Mark as needing translation (except for 'en')
      if (lang !== 'en') {
        for (const key in files[lang]) {
          files[lang][key] = `[${lang.toUpperCase()}] ${files[lang][key]}`;
        }
      }
    }

    // Placeholder for other languages
    files['_placeholder'] = {
      note: `Translation files needed for ${this.config.i18n.target_languages} languages total`,
      keys_count: Object.keys(keys).length.toString(),
      primary_languages: this.config.i18n.primary_languages.join(', '),
    };

    return files;
  }

  /**
   * Get translation coverage report
   */
  getCoverageReport(): {
    totalKeys: number;
    keysByRepository: Array<{ key: string; repositories: string[] }>;
    mostCommonKeys: Array<{ key: string; count: number }>;
  } {
    const keysByRepository: Array<{ key: string; repositories: string[] }> = [];
    const keyCounts: Map<string, number> = new Map();

    for (const [key, repos] of this.translationKeys.entries()) {
      keysByRepository.push({
        key,
        repositories: Array.from(repos),
      });
      keyCounts.set(key, repos.size);
    }

    // Sort by count
    const mostCommon = Array.from(keyCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([key, count]) => ({ key, count }));

    return {
      totalKeys: this.translationKeys.size,
      keysByRepository,
      mostCommonKeys: mostCommon,
    };
  }

  /**
   * Detect missing translations in a file
   */
  detectMissingTranslations(content: string, existingKeys: Set<string>): Array<{
    text: string;
    line: number;
    suggestedKey: string;
  }> {
    const missing: Array<{ text: string; line: number; suggestedKey: string }> = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for hardcoded strings
      const stringMatches = line.matchAll(/["']([^"']{5,})["']/g);
      
      for (const match of stringMatches) {
        const text = match[1];
        const suggestedKey = this.generateKey(text);
        
        // Check if this key exists
        if (!existingKeys.has(suggestedKey)) {
          // Check if it looks like translatable text
          if (this.isTranslatableText(text)) {
            missing.push({
              text,
              line: i + 1,
              suggestedKey,
            });
          }
        }
      }
    }

    return missing;
  }

  /**
   * Check if text is translatable
   */
  private isTranslatableText(text: string): boolean {
    // Skip if looks like code
    if (text.includes('=') || text.includes(';') || text.includes('()')) {
      return false;
    }

    // Skip if all numbers
    if (/^\d+$/.test(text)) {
      return false;
    }

    // Skip if looks like a path or URL
    if (text.startsWith('/') || text.includes('://')) {
      return false;
    }

    // Skip if too short
    if (text.length < 3) {
      return false;
    }

    // Should have some letters
    if (!/[a-zA-Z]/.test(text)) {
      return false;
    }

    return true;
  }

  /**
   * Generate translation key from text
   */
  private generateKey(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);
  }
}
