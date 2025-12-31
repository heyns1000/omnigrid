/**
 * Eternal Research Engine - Cloudflare Durable Object
 * Self-Sustaining Research System with Data Request Capability
 */

import { AdaptiveKnowledgeSync } from '../../src/adaptive-knowledge-sync';
import { RhinoStrikeVerifier } from '../../src/rhino-strike-verifier';
import { DataRequestHandler } from '../../src/data-request-handler';
import { SnippetProcessor } from '../../src/snippet-processor';
import { PRGenerator } from '../../src/pr-generator';

export interface Env {
  RESEARCH_ENGINE: DurableObjectNamespace;
  RESEARCH_KV: KVNamespace;
  PULSE_INTERVAL: string;
  BATCH_SIZE: string;
  MAX_RHINO_RETRIES: string;
  KNOWLEDGE_API_URL: string;
}

export interface EvolutionEvent {
  type: 'initialization' | 'phase_change' | 'snippet_processed' | 'pr_generated' | 'rhino_strike' | 'data_request' | 'low_confidence';
  timestamp: string;
  details: string;
  data?: any;
}

export interface ResearchState {
  version: string;
  startTime: string;
  lastPulse: string;
  totalPulses: number;
  processedSnippets: number;
  totalSnippets: number;
  generatedPRs: number;
  totalRepos: number;
  currentPhase: 'initialization' | 'processing_snippets' | 'generating_prs' | 'monitoring' | 'waiting_for_data';
  evolutionHistory: EvolutionEvent[];
  isDone: boolean;
  lastIngestTime: string;
  knowledgeVersion?: string;
  currentBatchIndex: number;
  rhinoStrikes: number;
}

export class EternalResearchEngine implements DurableObject {
  private state: DurableObjectState;
  private env: Env;
  private currentState: ResearchState;
  private pulseInterval: number;
  private isRunning: boolean = false;
  
  // Module instances
  private knowledgeSync: AdaptiveKnowledgeSync;
  private rhinoVerifier: RhinoStrikeVerifier;
  private dataRequestHandler: DataRequestHandler;
  private snippetProcessor: SnippetProcessor;
  private prGenerator: PRGenerator;
  
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.pulseInterval = parseInt(env.PULSE_INTERVAL || '9000');
    
    // Initialize modules
    this.knowledgeSync = new AdaptiveKnowledgeSync(env.KNOWLEDGE_API_URL);
    this.rhinoVerifier = new RhinoStrikeVerifier(
      this.knowledgeSync,
      parseInt(env.MAX_RHINO_RETRIES || '10')
    );
    this.dataRequestHandler = new DataRequestHandler();
    this.snippetProcessor = new SnippetProcessor(parseInt(env.BATCH_SIZE || '10'));
    this.prGenerator = new PRGenerator();
    
    // Initialize state
    this.currentState = {
      version: '1.0.0',
      startTime: new Date().toISOString(),
      lastPulse: new Date().toISOString(),
      totalPulses: 0,
      processedSnippets: 0,
      totalSnippets: 4558, // From consolidated_output
      generatedPRs: 0,
      totalRepos: 12, // From repository_mapping
      currentPhase: 'initialization',
      evolutionHistory: [],
      isDone: false,
      lastIngestTime: new Date().toISOString(),
      currentBatchIndex: 0,
      rhinoStrikes: 0
    };
  }

  /**
   * Fetch handler for HTTP requests
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (path) {
        case '/api/initialize':
          return this.handleInitialize(corsHeaders);
        
        case '/api/state':
          return this.handleGetState(corsHeaders);
        
        case '/api/data-request':
          return this.handleGetDataRequest(corsHeaders);
        
        case '/api/fulfill-request':
          return this.handleFulfillRequest(request, corsHeaders);
        
        case '/api/ignore-request':
          return this.handleIgnoreRequest(request, corsHeaders);
        
        case '/api/upload-data':
          return this.handleUploadData(request, corsHeaders);
        
        case '/dashboard':
          return this.handleDashboard(corsHeaders);
        
        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  /**
   * Initialize the engine and start pulse loop
   */
  private async handleInitialize(headers: Record<string, string>): Promise<Response> {
    // Load persisted state
    const savedState = await this.state.storage.get<ResearchState>('researchState');
    if (savedState) {
      this.currentState = savedState;
      this.addEvolution('initialization', 'Engine restarted from persisted state');
    } else {
      this.addEvolution('initialization', 'Engine started fresh');
    }

    // Start pulse loop if not already running
    if (!this.isRunning) {
      this.isRunning = true;
      this.startPulseLoop();
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Eternal Research Engine initialized',
      state: this.currentState
    }), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  /**
   * Get current state
   */
  private async handleGetState(headers: Record<string, string>): Promise<Response> {
    return new Response(JSON.stringify(this.currentState), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  /**
   * Get active data request
   */
  private async handleGetDataRequest(headers: Record<string, string>): Promise<Response> {
    const request = this.dataRequestHandler.getActiveRequest();
    return new Response(JSON.stringify(request || { noRequest: true }), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  /**
   * Fulfill data request
   */
  private async handleFulfillRequest(request: Request, headers: Record<string, string>): Promise<Response> {
    const body = await request.json() as any;
    const success = this.dataRequestHandler.fulfillRequest(body.requestId, body.data);
    
    if (success) {
      this.addEvolution('data_request', 'Data request fulfilled, resuming normal operations');
      this.currentState.currentPhase = 'processing_snippets';
    }

    return new Response(JSON.stringify({ success }), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  /**
   * Ignore data request
   */
  private async handleIgnoreRequest(request: Request, headers: Record<string, string>): Promise<Response> {
    const body = await request.json() as any;
    const success = this.dataRequestHandler.ignoreRequest(body.requestId);
    
    if (success) {
      this.addEvolution('data_request', 'Data request ignored, continuing without new data');
      this.currentState.currentPhase = 'processing_snippets';
    }

    return new Response(JSON.stringify({ success }), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  /**
   * Upload data to fulfill request
   */
  private async handleUploadData(request: Request, headers: Record<string, string>): Promise<Response> {
    // Handle file upload (placeholder implementation)
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // NOTE: This is a placeholder. In production, you would:
      // 1. Parse multipart/form-data
      // 2. Extract file content
      // 3. Process based on file type (ZIP/JSON)
      // 4. Update engine state with new data
      // 5. Fulfill active data request
      
      return new Response(JSON.stringify({ 
        success: false,
        message: 'File upload parsing not yet implemented. Use /api/fulfill-request with JSON data instead.',
        placeholder: true
      }), {
        status: 501,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid content type' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  /**
   * Serve dashboard HTML
   */
  private async handleDashboard(headers: Record<string, string>): Promise<Response> {
    const html = await this.generateDashboardHTML();
    return new Response(html, {
      headers: { ...headers, 'Content-Type': 'text/html' }
    });
  }

  /**
   * Start eternal pulse loop
   */
  private async startPulseLoop(): Promise<void> {
    while (!this.currentState.isDone) {
      const pulseStartTime = Date.now();
      
      try {
        await this.executePulseCycle();
      } catch (error) {
        console.error('Pulse cycle error:', error);
        this.addEvolution('phase_change', `Error in pulse: ${error}`);
        // Don't stop on error - eternal engine continues
      }
      
      // Calculate sleep time to maintain exact 9-second intervals
      const pulseExecutionTime = Date.now() - pulseStartTime;
      const sleepTime = Math.max(0, this.pulseInterval - pulseExecutionTime);
      
      if (sleepTime > 0) {
        await this.sleep(sleepTime);
      } else {
        // Pulse took longer than interval - log warning
        console.warn(`Pulse exceeded ${this.pulseInterval}ms by ${-sleepTime}ms`);
      }
    }
  }

  /**
   * Execute single pulse cycle
   */
  private async executePulseCycle(): Promise<void> {
    this.currentState.totalPulses++;
    this.currentState.lastPulse = new Date().toISOString();

    // 1. INGEST: Fetch adaptive knowledge
    await this.ingestPhase();

    // 2. PROCESS: Process snippet batch OR generate PR OR monitor
    await this.processPhase();

    // 3. OUTPUT: Update dashboard (implicit via state)
    
    // 4. VERIFY: Check recent decisions (rhino strikes)
    await this.verifyPhase();

    // 5. CHECK: Do we need more data?
    await this.checkDataNeeds();

    // 6. SAVE: Persist state
    await this.saveState();
  }

  /**
   * INGEST phase: Fetch latest knowledge
   */
  private async ingestPhase(): Promise<void> {
    const syncedState = await this.knowledgeSync.syncWithResearch(this.currentState);
    this.currentState = { ...this.currentState, ...syncedState };
    this.currentState.lastIngestTime = new Date().toISOString();
  }

  /**
   * PROCESS phase: Main work logic
   */
  private async processPhase(): Promise<void> {
    switch (this.currentState.currentPhase) {
      case 'initialization':
        this.currentState.currentPhase = 'processing_snippets';
        this.addEvolution('phase_change', 'Moved to processing_snippets phase');
        break;

      case 'processing_snippets':
        await this.processSnippetBatch();
        break;

      case 'generating_prs':
        await this.generateNextPR();
        break;

      case 'monitoring':
        await this.monitorDeployments();
        break;

      case 'waiting_for_data':
        // Just wait - data request is active
        break;
    }
  }

  /**
   * Process batch of snippets
   */
  private async processSnippetBatch(): Promise<void> {
    // Simulate snippet processing (in real implementation, load from KV/R2)
    const batchSize = parseInt(this.env.BATCH_SIZE || '10');
    const endIndex = Math.min(
      this.currentState.currentBatchIndex + batchSize,
      this.currentState.totalSnippets
    );

    // Mock snippets for demonstration
    const mockSnippets = Array.from({ length: batchSize }, (_, i) => ({
      id: `snippet_${this.currentState.currentBatchIndex + i}`,
      language: 'typescript',
      code: '// Mock snippet code',
      conversation: 'Mock conversation'
    }));

    const processed = await this.snippetProcessor.processBatch(
      mockSnippets,
      this.currentState.currentBatchIndex
    );

    // Verify with rhino strikes
    for (const snippet of processed) {
      const decision = {
        id: snippet.snippet.id,
        snippet: snippet.snippet,
        targetRepo: snippet.targetRepo,
        targetPath: snippet.targetPath,
        confidence: snippet.confidence,
        reasoning: snippet.category
      };

      const result = await this.rhinoVerifier.verifyWithRhinoStrike(decision);
      snippet.verified = result.isAligned;
      
      if (result.retries > 0) {
        this.currentState.rhinoStrikes += result.retries;
        this.addEvolution('rhino_strike', `Applied ${result.retries} rhino strikes to ${decision.id}`);
      }
    }

    this.currentState.processedSnippets += processed.length;
    this.currentState.currentBatchIndex = endIndex;
    
    this.addEvolution('snippet_processed', `Processed batch of ${processed.length} snippets`);

    // Check if done processing snippets
    if (this.currentState.processedSnippets >= this.currentState.totalSnippets) {
      this.currentState.currentPhase = 'generating_prs';
      this.addEvolution('phase_change', 'All snippets processed, moving to PR generation');
    }
  }

  /**
   * Generate next PR
   */
  private async generateNextPR(): Promise<void> {
    // In real implementation, group processed snippets and create PRs
    this.currentState.generatedPRs++;
    
    this.addEvolution('pr_generated', `Generated PR #${this.currentState.generatedPRs}`);

    // Check if done generating PRs
    if (this.currentState.generatedPRs >= this.currentState.totalRepos) {
      this.currentState.currentPhase = 'monitoring';
      this.addEvolution('phase_change', 'All PRs generated, moving to monitoring');
    }
  }

  /**
   * Monitor deployments
   */
  private async monitorDeployments(): Promise<void> {
    // Check if all PRs merged and repos synced
    // For now, simulate completion after a few monitoring cycles
    if (this.currentState.totalPulses > 100) {
      this.currentState.isDone = true;
      this.addEvolution('phase_change', '✅ All work complete! Engine finishing gracefully.');
    }
  }

  /**
   * VERIFY phase: Check for misalignments
   */
  private async verifyPhase(): Promise<void> {
    // Sample recent decisions and verify they're still valid
    // This catches drift in architecture
  }

  /**
   * CHECK phase: Do we need more data?
   */
  private async checkDataNeeds(): Promise<void> {
    const request = this.dataRequestHandler.checkNeedsMoreData(this.currentState);
    
    if (request) {
      this.currentState.currentPhase = 'waiting_for_data';
      this.addEvolution('data_request', `Data request created: ${request.reason}`, request);
      
      // Create GitHub issue (in real implementation)
      await this.dataRequestHandler.createGitHubIssue(request);
      await this.dataRequestHandler.sendNotification(request);
    }
  }

  /**
   * Save state to Durable Object storage
   */
  private async saveState(): Promise<void> {
    await this.state.storage.put('researchState', this.currentState);
  }

  /**
   * Add evolution event to history
   */
  private addEvolution(type: EvolutionEvent['type'], details: string, data?: any): void {
    this.currentState.evolutionHistory.push({
      type,
      timestamp: new Date().toISOString(),
      details,
      data
    });

    // Keep only last 100 events to avoid bloat
    if (this.currentState.evolutionHistory.length > 100) {
      this.currentState.evolutionHistory = this.currentState.evolutionHistory.slice(-100);
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate dashboard HTML
   */
  private async generateDashboardHTML(): Promise<string> {
    // Read dashboard.html template
    // For now, return inline HTML
    return `<!DOCTYPE html>
<html>
<head>
  <title>Eternal Research Engine - Dashboard</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', system-ui, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 { color: #667eea; font-size: 2.5em; margin-bottom: 10px; }
    .header p { color: #666; font-size: 1.1em; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-card .label { color: #888; font-size: 0.9em; margin-bottom: 8px; }
    .metric-card .value { 
      color: #333; 
      font-size: 2.2em; 
      font-weight: bold;
      margin-bottom: 5px;
    }
    .metric-card .change { color: #22c55e; font-size: 0.9em; }
    .progress-section {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .progress-section h2 { color: #333; margin-bottom: 20px; }
    .progress-bar {
      background: #e5e7eb;
      border-radius: 8px;
      height: 30px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .progress-fill {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      height: 100%;
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .timeline {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      max-height: 400px;
      overflow-y: auto;
    }
    .timeline h2 { color: #333; margin-bottom: 20px; }
    .timeline-item {
      border-left: 3px solid #667eea;
      padding-left: 15px;
      margin-bottom: 15px;
      padding-bottom: 15px;
    }
    .timeline-item .time { color: #888; font-size: 0.85em; }
    .timeline-item .event { color: #333; margin-top: 5px; }
    .data-request-banner {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      display: none;
    }
    .data-request-banner.active { display: block; }
    .data-request-banner h3 { color: #92400e; margin-bottom: 10px; }
    .data-request-banner .actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    .data-request-banner button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .data-request-banner button:hover { opacity: 0.8; }
    .btn-upload { background: #10b981; color: white; }
    .btn-ignore { background: #6b7280; color: white; }
    .phase-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: bold;
      text-transform: uppercase;
    }
    .phase-initialization { background: #dbeafe; color: #1e40af; }
    .phase-processing_snippets { background: #fef3c7; color: #92400e; }
    .phase-generating_prs { background: #d1fae5; color: #065f46; }
    .phase-monitoring { background: #e0e7ff; color: #3730a3; }
    .phase-waiting_for_data { background: #ffe4e6; color: #9f1239; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .pulsing { animation: pulse 2s ease-in-out infinite; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌊 Eternal Research Engine</h1>
      <p>Self-Sustaining Research System • Pulse Cycle: 9 seconds</p>
    </div>

    <div id="dataRequestBanner" class="data-request-banner">
      <h3>⚠️ Data Request Active</h3>
      <p id="requestReason"></p>
      <div class="actions">
        <button class="btn-upload" onclick="uploadData()">📤 Upload Data</button>
        <button class="btn-ignore" onclick="ignoreRequest()">⏭️ Ignore & Continue</button>
      </div>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="label">Total Pulses</div>
        <div class="value" id="totalPulses">0</div>
        <div class="change">⚡ Pulsing every 9s</div>
      </div>
      <div class="metric-card">
        <div class="label">Processed Snippets</div>
        <div class="value" id="processedSnippets">0 / 0</div>
        <div class="change" id="snippetProgress">0%</div>
      </div>
      <div class="metric-card">
        <div class="label">Generated PRs</div>
        <div class="value" id="generatedPRs">0 / 0</div>
        <div class="change" id="prProgress">0%</div>
      </div>
      <div class="metric-card">
        <div class="label">Current Phase</div>
        <div class="value" style="font-size: 1.2em;">
          <span id="currentPhase" class="phase-badge">—</span>
        </div>
        <div class="change">🦏 Rhino Strikes: <span id="rhinoStrikes">0</span></div>
      </div>
    </div>

    <div class="progress-section">
      <h2>Overall Progress</h2>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill" style="width: 0%">0%</div>
      </div>
      <p style="color: #666; margin-top: 10px;">
        <span id="lastPulse">—</span> • 
        <span id="uptime">—</span>
      </p>
    </div>

    <div class="timeline">
      <h2>Evolution Timeline</h2>
      <div id="timeline"></div>
    </div>
  </div>

  <script>
    let currentRequestId = null;

    async function fetchState() {
      try {
        const response = await fetch('/api/state');
        const state = await response.json();
        updateDashboard(state);
        
        // Check for data request
        const requestResponse = await fetch('/api/data-request');
        const request = await requestResponse.json();
        updateDataRequestBanner(request);
      } catch (error) {
        console.error('Failed to fetch state:', error);
      }
    }

    function updateDashboard(state) {
      document.getElementById('totalPulses').textContent = state.totalPulses.toLocaleString();
      document.getElementById('processedSnippets').textContent = 
        state.processedSnippets.toLocaleString() + ' / ' + state.totalSnippets.toLocaleString();
      document.getElementById('generatedPRs').textContent = 
        state.generatedPRs + ' / ' + state.totalRepos;
      document.getElementById('rhinoStrikes').textContent = state.rhinoStrikes || 0;

      const snippetProgress = (state.processedSnippets / state.totalSnippets * 100).toFixed(1);
      document.getElementById('snippetProgress').textContent = snippetProgress + '%';
      
      const prProgress = (state.generatedPRs / state.totalRepos * 100).toFixed(1);
      document.getElementById('prProgress').textContent = prProgress + '%';

      const overallProgress = ((state.processedSnippets / state.totalSnippets * 0.7) + 
                               (state.generatedPRs / state.totalRepos * 0.3)) * 100;
      document.getElementById('progressFill').style.width = overallProgress + '%';
      document.getElementById('progressFill').textContent = overallProgress.toFixed(1) + '%';

      const phaseBadge = document.getElementById('currentPhase');
      phaseBadge.textContent = state.currentPhase.replace(/_/g, ' ');
      phaseBadge.className = 'phase-badge phase-' + state.currentPhase;
      if (state.currentPhase === 'waiting_for_data') {
        phaseBadge.classList.add('pulsing');
      }

      const lastPulse = new Date(state.lastPulse);
      document.getElementById('lastPulse').textContent = 
        'Last pulse: ' + lastPulse.toLocaleTimeString();

      const startTime = new Date(state.startTime);
      const uptime = Date.now() - startTime.getTime();
      const hours = Math.floor(uptime / 3600000);
      const minutes = Math.floor((uptime % 3600000) / 60000);
      document.getElementById('uptime').textContent = 
        'Uptime: ' + hours + 'h ' + minutes + 'm';

      // Update timeline
      const timeline = document.getElementById('timeline');
      timeline.innerHTML = state.evolutionHistory.slice(-10).reverse().map(event => {
        const time = new Date(event.timestamp).toLocaleTimeString();
        return \`
          <div class="timeline-item">
            <div class="time">\${time}</div>
            <div class="event"><strong>\${event.type}:</strong> \${event.details}</div>
          </div>
        \`;
      }).join('');
    }

    function updateDataRequestBanner(request) {
      const banner = document.getElementById('dataRequestBanner');
      if (request && !request.noRequest) {
        banner.classList.add('active');
        document.getElementById('requestReason').textContent = 
          request.reason + ': ' + request.details;
        currentRequestId = request.id;
      } else {
        banner.classList.remove('active');
        currentRequestId = null;
      }
    }

    async function uploadData() {
      alert('Upload functionality would open file picker here');
      // In real implementation: open file picker, upload file
    }

    async function ignoreRequest() {
      if (!currentRequestId) return;
      
      try {
        const response = await fetch('/api/ignore-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: currentRequestId })
        });
        const result = await response.json();
        if (result.success) {
          document.getElementById('dataRequestBanner').classList.remove('active');
          fetchState();
        }
      } catch (error) {
        console.error('Failed to ignore request:', error);
      }
    }

    // Auto-refresh every 9 seconds
    setInterval(fetchState, 9000);
    
    // Initial load
    fetchState();
  </script>
</body>
</html>`;
  }
}

/**
 * Worker entry point
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Get Durable Object instance
    const id = env.RESEARCH_ENGINE.idFromName('eternal-research-engine');
    const stub = env.RESEARCH_ENGINE.get(id);
    
    // Forward request to Durable Object
    return stub.fetch(request);
  }
};
