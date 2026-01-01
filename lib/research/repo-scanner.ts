/**
 * Repository Scanner - Continuous 9-second pulse scanning of all repositories
 * Detects changes, extracts file contents, builds diff maps
 */

import type {
  Repository,
  ScanResult,
  FileChange,
  ResearchConfig,
  CacheEntry,
  RateLimitInfo,
} from './types';

export class RepoScanner {
  private config: ResearchConfig;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private rateLimitInfo: RateLimitInfo = {
    limit: 5000,
    remaining: 5000,
    reset: new Date(Date.now() + 3600000),
  };
  private githubToken: string | undefined;

  constructor(config: ResearchConfig) {
    this.config = config;
    this.githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  }

  /**
   * Scan all repositories in parallel with rate limiting
   */
  async scanAllRepos(): Promise<ScanResult[]> {
    const allRepos = [
      ...this.config.repositories.core_systems,
      ...this.config.repositories.sector_hubs,
    ];

    const repositories: Repository[] = allRepos.map((fullName) => ({
      owner: fullName.split('/')[0],
      name: fullName.split('/')[1],
      fullName,
    }));

    // Batch repositories to respect rate limits
    const batchSize = this.config.research.max_parallel_requests;
    const results: ScanResult[] = [];

    for (let i = 0; i < repositories.length; i += batchSize) {
      const batch = repositories.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((repo) => this.scanRepository(repo))
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Failed to scan repository:`, result.reason);
        }
      }

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < repositories.length) {
        await this.delay(100);
      }
    }

    return results;
  }

  /**
   * Scan a single repository for changes
   */
  async scanRepository(repo: Repository): Promise<ScanResult> {
    console.log(`[RepoScanner] Scanning ${repo.fullName}...`);

    try {
      // Check cache first
      const cachedResult = this.getFromCache<ScanResult>(`scan:${repo.fullName}`);
      if (cachedResult) {
        console.log(`[RepoScanner] Using cached result for ${repo.fullName}`);
        return cachedResult;
      }

      // Fetch latest commit
      const latestCommit = await this.fetchLatestCommit(repo);
      
      // Check if we've seen this commit before
      if (repo.lastCommitSha && repo.lastCommitSha === latestCommit.sha) {
        console.log(`[RepoScanner] No changes in ${repo.fullName}`);
        return {
          repository: repo,
          timestamp: new Date(),
          changes: [],
          patterns: {
            footers: [],
            headers: [],
            navigations: [],
            hrefs: [],
            hardcodedText: [],
          },
        };
      }

      // Fetch repository tree
      const files = await this.fetchRepoFiles(repo);
      
      // Filter relevant files
      const relevantFiles = files.filter((file) =>
        this.config.patterns.file_extensions.some((ext) => file.path.endsWith(ext))
      );

      // Fetch file contents
      const changes: FileChange[] = await this.fetchFileContents(repo, relevantFiles);

      const result: ScanResult = {
        repository: { ...repo, lastCommitSha: latestCommit.sha, lastScanTime: new Date() },
        timestamp: new Date(),
        changes,
        patterns: {
          footers: [],
          headers: [],
          navigations: [],
          hrefs: [],
          hardcodedText: [],
        },
      };

      // Cache the result
      this.setInCache(`scan:${repo.fullName}`, result);

      return result;
    } catch (error: any) {
      console.error(`[RepoScanner] Error scanning ${repo.fullName}:`, error.message);
      return {
        repository: repo,
        timestamp: new Date(),
        changes: [],
        patterns: {
          footers: [],
          headers: [],
          navigations: [],
          hrefs: [],
          hardcodedText: [],
        },
        errors: [error.message],
      };
    }
  }

  /**
   * Fetch latest commit from repository
   */
  private async fetchLatestCommit(repo: Repository): Promise<{ sha: string; message: string }> {
    const url = `https://api.github.com/repos/${repo.fullName}/commits?per_page=1`;
    const response = await this.githubApiRequest(url);
    
    if (!response.ok) {
      // If repo doesn't exist or is private, return empty commit
      if (response.status === 404 || response.status === 403) {
        return { sha: 'not-found', message: 'Repository not accessible' };
      }
      throw new Error(`Failed to fetch commits: ${response.statusText}`);
    }

    const commits = await response.json();
    if (!commits || commits.length === 0) {
      return { sha: 'empty', message: 'No commits' };
    }

    return {
      sha: commits[0].sha,
      message: commits[0].commit.message,
    };
  }

  /**
   * Fetch repository file tree
   */
  async fetchRepoFiles(repo: Repository): Promise<Array<{ path: string; sha: string; type: string }>> {
    const url = `https://api.github.com/repos/${repo.fullName}/git/trees/main?recursive=1`;
    const response = await this.githubApiRequest(url);

    if (!response.ok) {
      // Try 'master' branch if 'main' doesn't exist
      const masterUrl = `https://api.github.com/repos/${repo.fullName}/git/trees/master?recursive=1`;
      const masterResponse = await this.githubApiRequest(masterUrl);
      
      if (!masterResponse.ok) {
        console.warn(`[RepoScanner] Could not fetch tree for ${repo.fullName}`);
        return [];
      }
      
      const data = await masterResponse.json();
      return data.tree || [];
    }

    const data = await response.json();
    return data.tree || [];
  }

  /**
   * Fetch contents of specific files
   */
  private async fetchFileContents(
    repo: Repository,
    files: Array<{ path: string; sha: string }>
  ): Promise<FileChange[]> {
    const changes: FileChange[] = [];
    const maxFiles = 50; // Limit to prevent rate limiting

    for (const file of files.slice(0, maxFiles)) {
      try {
        const url = `https://api.github.com/repos/${repo.fullName}/contents/${file.path}`;
        const response = await this.githubApiRequest(url);

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const content = data.content
          ? Buffer.from(data.content, 'base64').toString('utf-8')
          : '';

        changes.push({
          path: file.path,
          status: 'modified',
          content,
          sha: file.sha,
        });
      } catch (error) {
        console.warn(`[RepoScanner] Could not fetch ${file.path} from ${repo.fullName}`);
      }
    }

    return changes;
  }

  /**
   * Make GitHub API request with rate limiting
   */
  private async githubApiRequest(url: string): Promise<Response> {
    // Check rate limit
    if (this.rateLimitInfo.remaining < 10) {
      const now = new Date();
      if (now < this.rateLimitInfo.reset) {
        const waitTime = this.rateLimitInfo.reset.getTime() - now.getTime();
        console.warn(`[RepoScanner] Rate limit reached. Waiting ${waitTime}ms...`);
        await this.delay(waitTime);
      }
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OmniGrid-Research-System',
    };

    if (this.githubToken) {
      headers['Authorization'] = `Bearer ${this.githubToken}`;
    }

    const response = await fetch(url, { headers });

    // Update rate limit info
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');

    if (remaining) {
      this.rateLimitInfo.remaining = parseInt(remaining, 10);
    }
    if (reset) {
      this.rateLimitInfo.reset = new Date(parseInt(reset, 10) * 1000);
    }

    return response;
  }

  /**
   * Cache management
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = new Date();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setInCache<T>(key: string, data: T): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.research.cache_duration_seconds * 1000);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  /**
   * Utility: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current rate limit status
   */
  getRateLimitInfo(): RateLimitInfo {
    return { ...this.rateLimitInfo };
  }
}
