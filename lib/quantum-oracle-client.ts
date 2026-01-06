/**
 * Phase 37: Ethers.js Integration for Quantum Fidelity Oracle
 * 
 * Provides real-time metrics updates using Ethers.js to query Chainlink feeds
 * and interact with the QuantumFidelityOracle contract on Ethereum Sepolia testnet.
 */

import { ethers } from 'ethers';

// Configuration
export interface OracleConfig {
  providerUrl: string;
  contractAddress: string;
  chainlinkFeedAddress: string;
  privateKey?: string;
}

// Types
export interface FidelityProof {
  timestamp: bigint;
  fidelityScore: bigint;
  tensorHash: string;
  verifier: string;
  verified: boolean;
  qubitCount: number;
  signature: string;
}

export interface ChainlinkMetrics {
  roundId: bigint;
  price: bigint;
  startedAt: bigint;
  updatedAt: bigint;
  answeredInRound: bigint;
}

/**
 * QuantumFidelityOracleClient - Ethers.js client for interacting with the oracle
 */
export class QuantumFidelityOracleClient {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private signer?: ethers.Signer;

  // Contract ABI (essential functions only)
  private static readonly ABI = [
    'function submitFidelityProof(bytes32 tensorHash, uint256 fidelityScore, bytes signature) external returns (bytes32)',
    'function verifyFidelityProof(bytes32 proofId) external returns (bool)',
    'function getChainlinkMetrics() external view returns (uint80, int256, uint256, uint256, uint80)',
    'function getProof(bytes32 proofId) external view returns (tuple(uint256 timestamp, uint256 fidelityScore, bytes32 tensorHash, address verifier, bool verified, uint8 qubitCount, bytes signature))',
    'function isProofValid(bytes32 proofId) external view returns (bool)',
    'function setVerifierAuthorization(address verifier, bool authorized) external',
    'function updateChainlinkFeed(address newFeed) external',
    'function setPaused(bool paused) external',
    'event ProofSubmitted(bytes32 indexed proofId, address indexed verifier, uint256 fidelityScore, uint256 timestamp)',
    'event ProofVerified(bytes32 indexed proofId, bool success, uint256 timestamp)',
    'event VerifierAuthorized(address indexed verifier, bool authorized)',
  ];

  constructor(config: OracleConfig) {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(config.providerUrl);

    // Initialize contract
    this.contract = new ethers.Contract(
      config.contractAddress,
      QuantumFidelityOracleClient.ABI,
      this.provider
    );

    // Initialize signer if private key provided
    if (config.privateKey) {
      this.signer = new ethers.Wallet(config.privateKey, this.provider);
      this.contract = this.contract.connect(this.signer) as ethers.Contract;
    }
  }

  /**
   * Submit a 50-qubit fidelity proof to the oracle
   */
  async submitFidelityProof(
    tensorHash: string,
    fidelityScore: number,
    signature: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for submitting proofs');
    }

    // Convert fidelity score to basis points (e.g., 95.5% -> 9550)
    const fidelityBasisPoints = Math.floor(fidelityScore * 100);

    // Convert tensor hash to bytes32
    const tensorHashBytes32 = ethers.id(tensorHash);

    // Convert signature to bytes
    const signatureBytes = ethers.toUtf8Bytes(signature);

    // Submit proof
    const tx = await this.contract.submitFidelityProof(
      tensorHashBytes32,
      fidelityBasisPoints,
      signatureBytes
    );

    const receipt = await tx.wait();

    // Extract proof ID from event
    const event = receipt.logs.find(
      (log: any) => log.fragment?.name === 'ProofSubmitted'
    );

    if (event) {
      return event.args[0]; // proofId
    }

    throw new Error('Failed to extract proof ID from transaction');
  }

  /**
   * Verify a submitted fidelity proof
   */
  async verifyFidelityProof(proofId: string): Promise<boolean> {
    if (!this.signer) {
      throw new Error('Signer required for verifying proofs');
    }

    const tx = await this.contract.verifyFidelityProof(proofId);
    const receipt = await tx.wait();

    // Check for ProofVerified event
    const event = receipt.logs.find(
      (log: any) => log.fragment?.name === 'ProofVerified'
    );

    return event ? event.args[1] : false;
  }

  /**
   * Get real-time metrics from Chainlink price feed
   */
  async getChainlinkMetrics(): Promise<ChainlinkMetrics> {
    const [roundId, price, startedAt, updatedAt, answeredInRound] =
      await this.contract.getChainlinkMetrics();

    return {
      roundId,
      price,
      startedAt,
      updatedAt,
      answeredInRound,
    };
  }

  /**
   * Get proof details by ID
   */
  async getProof(proofId: string): Promise<FidelityProof> {
    const proof = await this.contract.getProof(proofId);

    return {
      timestamp: proof[0],
      fidelityScore: proof[1],
      tensorHash: proof[2],
      verifier: proof[3],
      verified: proof[4],
      qubitCount: proof[5],
      signature: ethers.hexlify(proof[6]),
    };
  }

  /**
   * Check if a proof is valid and verified
   */
  async isProofValid(proofId: string): Promise<boolean> {
    return await this.contract.isProofValid(proofId);
  }

  /**
   * Subscribe to proof submission events
   */
  onProofSubmitted(
    callback: (proofId: string, verifier: string, fidelityScore: bigint, timestamp: bigint) => void
  ): void {
    this.contract.on('ProofSubmitted', callback);
  }

  /**
   * Subscribe to proof verification events
   */
  onProofVerified(
    callback: (proofId: string, success: boolean, timestamp: bigint) => void
  ): void {
    this.contract.on('ProofVerified', callback);
  }

  /**
   * Unsubscribe from all events
   */
  removeAllListeners(): void {
    this.contract.removeAllListeners();
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.contract.target as string;
  }

  /**
   * Get provider
   */
  getProvider(): ethers.Provider {
    return this.provider;
  }
}

/**
 * MetricsAggregator - Real-time metrics updates from Chainlink feeds
 */
export class MetricsAggregator {
  private clients: Map<string, QuantumFidelityOracleClient> = new Map();
  private updateInterval?: NodeJS.Timeout;
  private metricsCache: Map<string, ChainlinkMetrics> = new Map();

  /**
   * Add oracle client for metrics aggregation
   */
  addClient(name: string, client: QuantumFidelityOracleClient): void {
    this.clients.set(name, client);
  }

  /**
   * Start real-time metrics updates
   */
  startRealTimeUpdates(intervalMs: number = 9000): void {
    this.updateInterval = setInterval(async () => {
      await this.updateAllMetrics();
    }, intervalMs);
  }

  /**
   * Stop real-time metrics updates
   */
  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
  }

  /**
   * Update metrics from all clients
   */
  async updateAllMetrics(): Promise<void> {
    const updatePromises = Array.from(this.clients.entries()).map(
      async ([name, client]) => {
        try {
          const metrics = await client.getChainlinkMetrics();
          this.metricsCache.set(name, metrics);
        } catch (error) {
          console.error(`Failed to update metrics for ${name}:`, error);
        }
      }
    );

    await Promise.all(updatePromises);
  }

  /**
   * Get cached metrics for a client
   */
  getMetrics(name: string): ChainlinkMetrics | undefined {
    return this.metricsCache.get(name);
  }

  /**
   * Get all cached metrics
   */
  getAllMetrics(): Map<string, ChainlinkMetrics> {
    return new Map(this.metricsCache);
  }
}

/**
 * Helper function to create a configured oracle client
 */
export function createOracleClient(config: OracleConfig): QuantumFidelityOracleClient {
  return new QuantumFidelityOracleClient(config);
}

/**
 * Default configuration for Sepolia testnet
 */
export const SEPOLIA_CONFIG: Partial<OracleConfig> = {
  providerUrl: 'https://rpc.sepolia.org',
  // Chainlink ETH/USD Price Feed on Sepolia
  chainlinkFeedAddress: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
};
