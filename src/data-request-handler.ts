/**
 * Data Request Handler
 * Manages data requests when engine needs more data
 */

export interface DataRequest {
  id: string;
  type: 'conversations' | 'snippets' | 'repositories' | 'clarification';
  reason: string;
  details: string;
  status: 'pending' | 'fulfilled' | 'ignored';
  createdAt: string;
  fulfilledAt?: string;
  githubIssueUrl?: string;
}

export class DataRequestHandler {
  private activeRequest: DataRequest | null = null;

  /**
   * Check if engine needs more data
   */
  checkNeedsMoreData(state: any): DataRequest | null {
    // Condition 1: All snippets processed but PRs incomplete
    if (state.processedSnippets >= state.totalSnippets && state.generatedPRs < state.totalSnippets / 10) {
      return this.createRequest(
        'repositories',
        'All snippets processed but not enough repositories to generate PRs',
        `Processed ${state.processedSnippets} snippets but only have ${state.generatedPRs} repos for PRs`
      );
    }

    // Condition 2: Too many low-confidence decisions
    const lowConfidenceCount = state.evolutionHistory?.filter(
      (e: any) => e.type === 'low_confidence'
    ).length || 0;
    
    if (lowConfidenceCount > 100) {
      return this.createRequest(
        'clarification',
        'Too many low-confidence decisions piling up',
        `${lowConfidenceCount} decisions have low confidence, need more context`
      );
    }

    // Condition 3: No new data ingested in 1+ hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const lastIngestTime = state.lastIngestTime ? new Date(state.lastIngestTime).getTime() : 0;
    
    if (lastIngestTime && lastIngestTime < oneHourAgo && state.processedSnippets < state.totalSnippets) {
      return this.createRequest(
        'snippets',
        'No new data ingested in over 1 hour',
        'Processing has stalled, may need additional snippet data'
      );
    }

    // Condition 4: Stuck in same phase for 1+ hour
    const phaseHistory = state.evolutionHistory?.filter(
      (e: any) => e.type === 'phase_change'
    ) || [];
    
    if (phaseHistory.length > 0) {
      const lastPhaseChange = new Date(phaseHistory[phaseHistory.length - 1].timestamp).getTime();
      if (Date.now() - lastPhaseChange > oneHourAgo) {
        return this.createRequest(
          'conversations',
          'Stuck in same phase for over 1 hour',
          `Current phase: ${state.currentPhase}, no progress detected`
        );
      }
    }

    return null;
  }

  /**
   * Create a new data request
   */
  private createRequest(
    type: DataRequest['type'],
    reason: string,
    details: string
  ): DataRequest {
    const request: DataRequest = {
      id: `req_${Date.now()}`,
      type,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.activeRequest = request;
    return request;
  }

  /**
   * Get active data request
   */
  getActiveRequest(): DataRequest | null {
    return this.activeRequest;
  }

  /**
   * Fulfill data request with new data
   */
  fulfillRequest(requestId: string, newData: any): boolean {
    if (!this.activeRequest || this.activeRequest.id !== requestId) {
      return false;
    }

    this.activeRequest.status = 'fulfilled';
    this.activeRequest.fulfilledAt = new Date().toISOString();
    
    console.log(`✅ Data request ${requestId} fulfilled`);
    this.activeRequest = null;
    return true;
  }

  /**
   * Ignore data request and continue without new data
   */
  ignoreRequest(requestId: string): boolean {
    if (!this.activeRequest || this.activeRequest.id !== requestId) {
      return false;
    }

    this.activeRequest.status = 'ignored';
    this.activeRequest.fulfilledAt = new Date().toISOString();
    
    console.log(`⚠️ Data request ${requestId} ignored, continuing without new data`);
    this.activeRequest = null;
    return true;
  }

  /**
   * Create GitHub issue for data request
   */
  async createGitHubIssue(request: DataRequest): Promise<string | null> {
    // This would integrate with GitHub API
    // For now, return a placeholder URL
    const issueUrl = `https://github.com/heyns1000/omnigrid/issues/new?title=${encodeURIComponent(`[Data Request] ${request.reason}`)}&body=${encodeURIComponent(request.details)}`;
    
    if (this.activeRequest) {
      this.activeRequest.githubIssueUrl = issueUrl;
    }
    
    return issueUrl;
  }

  /**
   * Send notification for data request
   */
  async sendNotification(request: DataRequest): Promise<void> {
    console.log('📩 Data Request Notification:');
    console.log(`   Type: ${request.type}`);
    console.log(`   Reason: ${request.reason}`);
    console.log(`   Details: ${request.details}`);
    console.log(`   Created: ${request.createdAt}`);
    
    // Could integrate with email, webhook, etc.
  }
}
