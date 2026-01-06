/**
 * Multi-Chain Quantum Oracle Aggregator
 * Aggregates oracle data from Ethereum Sepolia, Polygon Mumbai, and Solana Devnet
 * Implements 9-second pulse feeds with 94-repository fidelity tracking
 */

import { ethers } from 'ethers';
import * as solanaWeb3 from '@solana/web3.js';

export interface ChainConfig {
  chainId: string | number;
  name: string;
  rpcUrl: string;
  explorer: string;
  oracleContract?: string;
  oracleProgram?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface PulseData {
  pulseId: number;
  timestamp: number;
  dataHash: string;
  fidelityScore: number;
  chain: string;
  isValid: boolean;
}

export interface AggregatedPulseData {
  timestamp: number;
  chains: {
    [chainName: string]: PulseData;
  };
  averageFidelity: number;
  consensusReached: boolean;
}

/**
 * Multi-Chain Oracle Aggregator
 */
export class MultiChainOracleAggregator {
  private chains: Map<string, ChainConfig>;
  private evmProviders: Map<string, ethers.Provider>;
  private solanaConnection?: solanaWeb3.Connection;
  private pulseInterval: number;
  private fidelityThreshold: number;
  private maxRepositories: number;

  constructor(
    chainsConfig: Record<string, ChainConfig>,
    pulseInterval: number = 9,
    fidelityThreshold: number = 80,
    maxRepositories: number = 94
  ) {
    this.chains = new Map(Object.entries(chainsConfig));
    this.evmProviders = new Map();
    this.pulseInterval = pulseInterval;
    this.fidelityThreshold = fidelityThreshold;
    this.maxRepositories = maxRepositories;
    
    this.initializeProviders();
  }

  /**
   * Initialize blockchain providers
   */
  private initializeProviders(): void {
    for (const [chainName, config] of this.chains) {
      if (chainName.includes('solana')) {
        this.solanaConnection = new solanaWeb3.Connection(config.rpcUrl, 'confirmed');
      } else {
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        this.evmProviders.set(chainName, provider);
      }
    }
  }

  /**
   * Get latest pulse from Ethereum/Polygon
   */
  private async getEVMPulse(chainName: string, contractAddress: string): Promise<PulseData> {
    const provider = this.evmProviders.get(chainName);
    if (!provider) {
      throw new Error(`Provider not found for chain: ${chainName}`);
    }

    const oracleABI = [
      'function getLatestPulse() external view returns (tuple(uint256 timestamp, bytes32 dataHash, uint256 fidelityScore, bool isValid))',
      'function pulseCount() external view returns (uint256)'
    ];

    const contract = new ethers.Contract(contractAddress, oracleABI, provider);
    
    try {
      const latestPulse = await contract.getLatestPulse();
      const pulseCount = await contract.pulseCount();

      return {
        pulseId: Number(pulseCount),
        timestamp: Number(latestPulse.timestamp),
        dataHash: latestPulse.dataHash,
        fidelityScore: Number(latestPulse.fidelityScore),
        chain: chainName,
        isValid: latestPulse.isValid
      };
    } catch (error) {
      console.error(`Error fetching pulse from ${chainName}:`, error);
      throw error;
    }
  }

  /**
   * Get latest pulse from Solana
   */
  private async getSolanaPulse(programId: string): Promise<PulseData> {
    if (!this.solanaConnection) {
      throw new Error('Solana connection not initialized');
    }

    try {
      // In a real implementation, this would fetch from the Solana program account
      // For now, we'll simulate the data structure
      const oraclePubkey = new solanaWeb3.PublicKey(programId);
      const accountInfo = await this.solanaConnection.getAccountInfo(oraclePubkey);

      if (!accountInfo) {
        throw new Error('Oracle account not found');
      }

      // Parse account data (simplified)
      // In production, use Anchor's IDL for proper deserialization
      const data = accountInfo.data;
      
      return {
        pulseId: 0, // Would be parsed from account data
        timestamp: Date.now() / 1000,
        dataHash: '0x' + Buffer.from(data.slice(0, 32)).toString('hex'),
        fidelityScore: 94,
        chain: 'solana-devnet',
        isValid: true
      };
    } catch (error) {
      console.error('Error fetching Solana pulse:', error);
      throw error;
    }
  }

  /**
   * Get aggregated pulse data from all chains
   */
  async getAggregatedPulse(): Promise<AggregatedPulseData> {
    const pulsePromises: Promise<[string, PulseData]>[] = [];

    for (const [chainName, config] of this.chains) {
      if (chainName.includes('solana') && config.oracleProgram) {
        pulsePromises.push(
          this.getSolanaPulse(config.oracleProgram)
            .then(pulse => [chainName, pulse] as [string, PulseData])
        );
      } else if (config.oracleContract) {
        pulsePromises.push(
          this.getEVMPulse(chainName, config.oracleContract)
            .then(pulse => [chainName, pulse] as [string, PulseData])
        );
      }
    }

    const results = await Promise.allSettled(pulsePromises);
    const chains: { [key: string]: PulseData } = {};
    let totalFidelity = 0;
    let validCount = 0;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const [chainName, pulse] = result.value;
        chains[chainName] = pulse;
        if (pulse.isValid) {
          totalFidelity += pulse.fidelityScore;
          validCount++;
        }
      }
    }

    const averageFidelity = validCount > 0 ? totalFidelity / validCount : 0;
    const consensusReached = averageFidelity >= this.fidelityThreshold;

    return {
      timestamp: Date.now(),
      chains,
      averageFidelity,
      consensusReached
    };
  }

  /**
   * Start continuous pulse monitoring
   */
  async startPulseMonitoring(callback: (data: AggregatedPulseData) => void): Promise<void> {
    const monitor = async () => {
      try {
        const aggregatedData = await this.getAggregatedPulse();
        callback(aggregatedData);
      } catch (error) {
        console.error('Error in pulse monitoring:', error);
      }
    };

    // Initial pulse
    await monitor();

    // Set up interval for 9-second pulses
    setInterval(monitor, this.pulseInterval * 1000);
  }

  /**
   * Get pulse interval
   */
  getPulseInterval(): number {
    return this.pulseInterval;
  }

  /**
   * Get fidelity threshold
   */
  getFidelityThreshold(): number {
    return this.fidelityThreshold;
  }

  /**
   * Check if a chain is healthy
   */
  async checkChainHealth(chainName: string): Promise<boolean> {
    try {
      if (chainName.includes('solana')) {
        if (!this.solanaConnection) return false;
        const version = await this.solanaConnection.getVersion();
        return !!version;
      } else {
        const provider = this.evmProviders.get(chainName);
        if (!provider) return false;
        const blockNumber = await provider.getBlockNumber();
        return blockNumber > 0;
      }
    } catch (error) {
      console.error(`Health check failed for ${chainName}:`, error);
      return false;
    }
  }

  /**
   * Get all supported chains
   */
  getSupportedChains(): ChainConfig[] {
    return Array.from(this.chains.values());
  }
}

/**
 * Factory function to create aggregator from config file
 */
export async function createOracleAggregatorFromConfig(
  configPath: string
): Promise<MultiChainOracleAggregator> {
  const config = await import(configPath);
  
  return new MultiChainOracleAggregator(
    config.chains,
    config.pulseConfig.intervalSeconds,
    config.pulseConfig.fidelityThreshold,
    config.pulseConfig.maxRepositories
  );
}
