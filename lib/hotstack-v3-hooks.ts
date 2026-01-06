/**
 * Phase 37: HotStack v3 Hooks for Decentralized Dashboard Syncing
 * 
 * Provides hooks for syncing quantum metrics with the decentralized dashboard,
 * integrating with GraphDB stacking and multipoint propagation.
 */

import { QuantumFidelityOracleClient, ChainlinkMetrics, FidelityProof } from './quantum-oracle-client';

// Types
export interface DashboardState {
  proofs: Map<string, FidelityProof>;
  metrics: ChainlinkMetrics | null;
  lastUpdate: number;
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface GraphDBNode {
  id: string;
  type: 'proof' | 'metric' | 'verification';
  timestamp: number;
  data: any;
  edges: string[];
}

export interface PropagationConfig {
  endpoints: string[];
  retryCount: number;
  timeout: number;
}

/**
 * HotStackV3DashboardHook - Main hook for dashboard synchronization
 */
export class HotStackV3DashboardHook {
  private oracleClient: QuantumFidelityOracleClient;
  private dashboardState: DashboardState;
  private graphDB: Map<string, GraphDBNode> = new Map();
  private syncInterval?: NodeJS.Timeout;
  private propagationConfig: PropagationConfig;

  constructor(
    oracleClient: QuantumFidelityOracleClient,
    propagationConfig: PropagationConfig
  ) {
    this.oracleClient = oracleClient;
    this.propagationConfig = propagationConfig;
    this.dashboardState = {
      proofs: new Map(),
      metrics: null,
      lastUpdate: 0,
      syncStatus: 'idle',
    };
  }

  /**
   * Initialize dashboard hooks with event listeners
   */
  initialize(): void {
    // Subscribe to proof submission events
    this.oracleClient.onProofSubmitted(
      async (proofId, verifier, fidelityScore, timestamp) => {
        await this.handleProofSubmitted(proofId, verifier, fidelityScore, timestamp);
      }
    );

    // Subscribe to proof verification events
    this.oracleClient.onProofVerified(
      async (proofId, success, timestamp) => {
        await this.handleProofVerified(proofId, success, timestamp);
      }
    );
  }

  /**
   * Start real-time dashboard syncing
   */
  startSync(intervalMs: number = 9000): void {
    this.syncInterval = setInterval(async () => {
      await this.syncDashboard();
    }, intervalMs);
  }

  /**
   * Stop dashboard syncing
   */
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
    this.oracleClient.removeAllListeners();
  }

  /**
   * Sync dashboard state with blockchain
   */
  async syncDashboard(): Promise<void> {
    this.dashboardState.syncStatus = 'syncing';

    try {
      // Update Chainlink metrics
      const metrics = await this.oracleClient.getChainlinkMetrics();
      this.dashboardState.metrics = metrics;

      // Update GraphDB
      await this.updateGraphDB('metric', metrics);

      // Propagate to multipoint endpoints
      await this.propagateUpdates();

      this.dashboardState.lastUpdate = Date.now();
      this.dashboardState.syncStatus = 'idle';
    } catch (error) {
      console.error('Dashboard sync error:', error);
      this.dashboardState.syncStatus = 'error';
    }
  }

  /**
   * Handle proof submission event
   */
  private async handleProofSubmitted(
    proofId: string,
    verifier: string,
    fidelityScore: bigint,
    timestamp: bigint
  ): Promise<void> {
    try {
      // Fetch full proof details
      const proof = await this.oracleClient.getProof(proofId);
      this.dashboardState.proofs.set(proofId, proof);

      // Update GraphDB
      await this.updateGraphDB('proof', {
        proofId,
        verifier,
        fidelityScore: Number(fidelityScore) / 100, // Convert from basis points
        timestamp: Number(timestamp),
      });

      // Trigger immediate sync
      await this.syncDashboard();
    } catch (error) {
      console.error('Error handling proof submission:', error);
    }
  }

  /**
   * Handle proof verification event
   */
  private async handleProofVerified(
    proofId: string,
    success: boolean,
    timestamp: bigint
  ): Promise<void> {
    try {
      // Update proof in state
      const proof = this.dashboardState.proofs.get(proofId);
      if (proof) {
        proof.verified = success;
        this.dashboardState.proofs.set(proofId, proof);
      }

      // Update GraphDB
      await this.updateGraphDB('verification', {
        proofId,
        success,
        timestamp: Number(timestamp),
      });

      // Trigger immediate sync
      await this.syncDashboard();
    } catch (error) {
      console.error('Error handling proof verification:', error);
    }
  }

  /**
   * Update GraphDB with stacking logic
   */
  private async updateGraphDB(type: string, data: any): Promise<void> {
    const node: GraphDBNode = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      timestamp: Date.now(),
      data,
      edges: [],
    };

    // Stack nodes by connecting to previous nodes of same type
    const previousNodes = Array.from(this.graphDB.values())
      .filter((n) => n.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3); // Connect to last 3 nodes

    node.edges = previousNodes.map((n) => n.id);

    this.graphDB.set(node.id, node);

    // Maintain GraphDB size (keep last 1000 nodes)
    if (this.graphDB.size > 1000) {
      const oldestNodes = Array.from(this.graphDB.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, this.graphDB.size - 1000);

      oldestNodes.forEach(([id]) => this.graphDB.delete(id));
    }
  }

  /**
   * Propagate updates to multipoint endpoints
   */
  private async propagateUpdates(): Promise<void> {
    const payload = {
      metrics: this.dashboardState.metrics,
      proofCount: this.dashboardState.proofs.size,
      lastUpdate: this.dashboardState.lastUpdate,
      graphDBSize: this.graphDB.size,
    };

    const propagationPromises = this.propagationConfig.endpoints.map(
      async (endpoint) => {
        let retries = 0;
        while (retries < this.propagationConfig.retryCount) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
              () => controller.abort(),
              this.propagationConfig.timeout
            );

            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
              return;
            }
          } catch (error) {
            retries++;
            if (retries >= this.propagationConfig.retryCount) {
              console.error(`Failed to propagate to ${endpoint}:`, error);
            }
          }
        }
      }
    );

    await Promise.allSettled(propagationPromises);
  }

  /**
   * Get current dashboard state
   */
  getDashboardState(): DashboardState {
    return { ...this.dashboardState };
  }

  /**
   * Get GraphDB snapshot
   */
  getGraphDBSnapshot(): GraphDBNode[] {
    return Array.from(this.graphDB.values());
  }

  /**
   * Query GraphDB by type
   */
  queryGraphDB(type: string, limit: number = 10): GraphDBNode[] {
    return Array.from(this.graphDB.values())
      .filter((node) => node.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Export dashboard data for Netlify workflow integration
   */
  exportForNetlify(): any {
    return {
      timestamp: Date.now(),
      metrics: this.dashboardState.metrics,
      proofs: Array.from(this.dashboardState.proofs.entries()).map(([id, proof]) => ({
        id,
        fidelityScore: Number(proof.fidelityScore) / 100,
        verified: proof.verified,
        timestamp: Number(proof.timestamp),
        qubitCount: proof.qubitCount,
      })),
      graphDB: {
        size: this.graphDB.size,
        recentNodes: this.getGraphDBSnapshot().slice(0, 50),
      },
      syncStatus: this.dashboardState.syncStatus,
      lastUpdate: this.dashboardState.lastUpdate,
    };
  }
}

/**
 * Helper function to create HotStack v3 hooks
 */
export function createHotStackV3Hook(
  oracleClient: QuantumFidelityOracleClient,
  propagationConfig: PropagationConfig
): HotStackV3DashboardHook {
  return new HotStackV3DashboardHook(oracleClient, propagationConfig);
}

/**
 * Default propagation configuration
 */
export const DEFAULT_PROPAGATION_CONFIG: PropagationConfig = {
  endpoints: [
    'https://hotstack.faa.zone/api/sync',
    'https://omnigrid.faa.zone/api/metrics',
  ],
  retryCount: 3,
  timeout: 5000,
};
