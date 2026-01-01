/**
 * Adaptive Knowledge Sync
 * Fetches latest ecosystem knowledge every pulse
 */

export interface KnowledgeSnapshot {
  timestamp: string;
  version: string;
  architecture: {
    repositories: Record<string, any>;
    brands: Record<string, any>;
    technologies: Record<string, any>;
  };
  guidelines: {
    deployment: string[];
    naming: string[];
    structure: string[];
  };
}

export class AdaptiveKnowledgeSync {
  private apiUrl: string;
  private lastFetch: number = 0;
  private cachedKnowledge: KnowledgeSnapshot | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetch latest knowledge from knowledge.seedwave.faa.zone
   */
  async fetchLatest(): Promise<KnowledgeSnapshot> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        console.warn(`Knowledge API returned ${response.status}, using cached data`);
        return this.cachedKnowledge || this.getDefaultKnowledge();
      }

      const data = await response.json() as KnowledgeSnapshot;
      this.cachedKnowledge = data;
      this.lastFetch = Date.now();
      return data;
    } catch (error) {
      console.warn('Failed to fetch knowledge, using cached data:', error);
      return this.cachedKnowledge || this.getDefaultKnowledge();
    }
  }

  /**
   * Merge latest knowledge with current research state
   */
  async syncWithResearch(currentState: any): Promise<any> {
    const latest = await this.fetchLatest();
    
    return {
      ...currentState,
      knowledgeVersion: latest.version,
      lastKnowledgeSync: latest.timestamp,
      availableRepos: Object.keys(latest.architecture.repositories || {}),
      availableBrands: Object.keys(latest.architecture.brands || {})
    };
  }

  /**
   * Verify if a decision aligns with latest architecture
   */
  async verifyAlignment(decision: any): Promise<boolean> {
    const knowledge = await this.fetchLatest();
    
    // Check if target repository exists
    if (decision.targetRepo && knowledge.architecture.repositories) {
      if (!knowledge.architecture.repositories[decision.targetRepo]) {
        return false;
      }
    }

    // Check if technology is supported
    if (decision.technology && knowledge.architecture.technologies) {
      if (!knowledge.architecture.technologies[decision.technology]) {
        console.warn(`Technology ${decision.technology} not in knowledge base`);
      }
    }

    // All checks passed
    return true;
  }

  /**
   * Get default knowledge when API is unavailable
   */
  private getDefaultKnowledge(): KnowledgeSnapshot {
    return {
      timestamp: new Date().toISOString(),
      version: '1.0.0-fallback',
      architecture: {
        repositories: {},
        brands: {},
        technologies: {}
      },
      guidelines: {
        deployment: ['Use Cloudflare Workers', 'Follow 180s HotStack protocol'],
        naming: ['Use kebab-case for files', 'PascalCase for classes'],
        structure: ['Group by feature', 'Separate concerns']
      }
    };
  }
}
