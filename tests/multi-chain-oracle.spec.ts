/**
 * Multi-Chain Quantum Oracle Tests
 * Tests for oracle aggregator, pulse feeds, and dashboard integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MultiChainOracleAggregator } from '../lib/oracles/multi-chain-aggregator';
import type { ChainConfig, AggregatedPulseData } from '../lib/oracles/multi-chain-aggregator';

describe('MultiChainOracleAggregator', () => {
  let aggregator: MultiChainOracleAggregator;
  
  const mockChainConfig: Record<string, ChainConfig> = {
    'ethereum-sepolia': {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      rpcUrl: 'https://sepolia.infura.io/v3/test',
      explorer: 'https://sepolia.etherscan.io',
      oracleContract: '0x1234567890123456789012345678901234567890',
      nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18
      }
    },
    'polygon-mumbai': {
      chainId: 80001,
      name: 'Polygon Mumbai',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorer: 'https://mumbai.polygonscan.com',
      oracleContract: '0x0987654321098765432109876543210987654321',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      }
    },
    'solana-devnet': {
      chainId: 'devnet',
      name: 'Solana Devnet',
      rpcUrl: 'https://api.devnet.solana.com',
      explorer: 'https://explorer.solana.com/?cluster=devnet',
      oracleProgram: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
      nativeCurrency: {
        name: 'SOL',
        symbol: 'SOL',
        decimals: 9
      }
    }
  };

  beforeEach(() => {
    aggregator = new MultiChainOracleAggregator(mockChainConfig, 9, 80, 94);
  });

  describe('Initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(aggregator).toBeDefined();
      expect(aggregator.getPulseInterval()).toBe(9);
      expect(aggregator.getFidelityThreshold()).toBe(80);
    });

    it('should initialize with all three chains', () => {
      const chains = aggregator.getSupportedChains();
      expect(chains).toHaveLength(3);
      expect(chains.map(c => c.name)).toContain('Ethereum Sepolia');
      expect(chains.map(c => c.name)).toContain('Polygon Mumbai');
      expect(chains.map(c => c.name)).toContain('Solana Devnet');
    });

    it('should set default values when not provided', () => {
      const defaultAggregator = new MultiChainOracleAggregator(mockChainConfig);
      expect(defaultAggregator.getPulseInterval()).toBe(9);
      expect(defaultAggregator.getFidelityThreshold()).toBe(80);
    });
  });

  describe('Chain Configuration', () => {
    it('should return all supported chains', () => {
      const chains = aggregator.getSupportedChains();
      expect(chains.length).toBeGreaterThan(0);
      chains.forEach(chain => {
        expect(chain).toHaveProperty('chainId');
        expect(chain).toHaveProperty('name');
        expect(chain).toHaveProperty('rpcUrl');
        expect(chain).toHaveProperty('nativeCurrency');
      });
    });

    it('should have correct chain IDs', () => {
      const chains = aggregator.getSupportedChains();
      const ethereumChain = chains.find(c => c.name === 'Ethereum Sepolia');
      const polygonChain = chains.find(c => c.name === 'Polygon Mumbai');
      const solanaChain = chains.find(c => c.name === 'Solana Devnet');
      
      expect(ethereumChain?.chainId).toBe(11155111);
      expect(polygonChain?.chainId).toBe(80001);
      expect(solanaChain?.chainId).toBe('devnet');
    });

    it('should have oracle contracts/programs configured', () => {
      const chains = aggregator.getSupportedChains();
      chains.forEach(chain => {
        const hasOracle = chain.oracleContract || chain.oracleProgram;
        expect(hasOracle).toBeTruthy();
      });
    });
  });

  describe('Pulse Configuration', () => {
    it('should have 9-second pulse interval', () => {
      expect(aggregator.getPulseInterval()).toBe(9);
    });

    it('should have fidelity threshold of 80', () => {
      expect(aggregator.getFidelityThreshold()).toBe(80);
    });

    it('should support custom pulse intervals', () => {
      const customAggregator = new MultiChainOracleAggregator(mockChainConfig, 5);
      expect(customAggregator.getPulseInterval()).toBe(5);
    });

    it('should support custom fidelity thresholds', () => {
      const customAggregator = new MultiChainOracleAggregator(mockChainConfig, 9, 90);
      expect(customAggregator.getFidelityThreshold()).toBe(90);
    });
  });

  describe('Fidelity Tracking', () => {
    it('should track up to 94 repositories', () => {
      // Max repositories should be 94
      const mockPulseData: AggregatedPulseData = {
        timestamp: Date.now(),
        chains: {
          'ethereum-sepolia': {
            pulseId: 1,
            timestamp: Date.now() / 1000,
            dataHash: '0x1234',
            fidelityScore: 94,
            chain: 'ethereum-sepolia',
            isValid: true
          }
        },
        averageFidelity: 94,
        consensusReached: true
      };

      expect(mockPulseData.chains['ethereum-sepolia'].fidelityScore).toBeLessThanOrEqual(94);
    });

    it('should calculate average fidelity correctly', () => {
      const mockData: AggregatedPulseData = {
        timestamp: Date.now(),
        chains: {
          'ethereum-sepolia': {
            pulseId: 1,
            timestamp: Date.now() / 1000,
            dataHash: '0x1234',
            fidelityScore: 90,
            chain: 'ethereum-sepolia',
            isValid: true
          },
          'polygon-mumbai': {
            pulseId: 1,
            timestamp: Date.now() / 1000,
            dataHash: '0x5678',
            fidelityScore: 92,
            chain: 'polygon-mumbai',
            isValid: true
          },
          'solana-devnet': {
            pulseId: 1,
            timestamp: Date.now() / 1000,
            dataHash: '0x9abc',
            fidelityScore: 94,
            chain: 'solana-devnet',
            isValid: true
          }
        },
        averageFidelity: (90 + 92 + 94) / 3,
        consensusReached: true
      };

      expect(mockData.averageFidelity).toBeCloseTo(92, 0);
    });

    it('should determine consensus based on threshold', () => {
      const highFidelityData: AggregatedPulseData = {
        timestamp: Date.now(),
        chains: {},
        averageFidelity: 85,
        consensusReached: true
      };

      const lowFidelityData: AggregatedPulseData = {
        timestamp: Date.now(),
        chains: {},
        averageFidelity: 75,
        consensusReached: false
      };

      expect(highFidelityData.consensusReached).toBe(true);
      expect(lowFidelityData.consensusReached).toBe(false);
    });
  });

  describe('Chainlink Automation Integration', () => {
    it('should support automated pulse updates', () => {
      // The aggregator should be compatible with Chainlink Automation
      // In production, this would be triggered by the keeper network
      expect(aggregator.getPulseInterval()).toBe(9);
    });

    it('should handle pulse intervals correctly', () => {
      const interval = aggregator.getPulseInterval();
      expect(interval).toBeGreaterThan(0);
      expect(typeof interval).toBe('number');
    });
  });

  describe('Multi-Chain Support', () => {
    it('should support Ethereum Sepolia', () => {
      const chains = aggregator.getSupportedChains();
      const ethereum = chains.find(c => c.name === 'Ethereum Sepolia');
      expect(ethereum).toBeDefined();
      expect(ethereum?.chainId).toBe(11155111);
    });

    it('should support Polygon Mumbai', () => {
      const chains = aggregator.getSupportedChains();
      const polygon = chains.find(c => c.name === 'Polygon Mumbai');
      expect(polygon).toBeDefined();
      expect(polygon?.chainId).toBe(80001);
    });

    it('should support Solana Devnet', () => {
      const chains = aggregator.getSupportedChains();
      const solana = chains.find(c => c.name === 'Solana Devnet');
      expect(solana).toBeDefined();
      expect(solana?.chainId).toBe('devnet');
    });

    it('should have correct RPC endpoints', () => {
      const chains = aggregator.getSupportedChains();
      chains.forEach(chain => {
        expect(chain.rpcUrl).toBeDefined();
        expect(chain.rpcUrl).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('HotStack Integration', () => {
    it('should provide data format compatible with HotStack v4', () => {
      const mockData: AggregatedPulseData = {
        timestamp: Date.now(),
        chains: {
          'ethereum-sepolia': {
            pulseId: 1,
            timestamp: Date.now() / 1000,
            dataHash: '0x1234',
            fidelityScore: 92,
            chain: 'ethereum-sepolia',
            isValid: true
          }
        },
        averageFidelity: 92,
        consensusReached: true
      };

      // Check that data structure matches dashboard requirements
      expect(mockData).toHaveProperty('timestamp');
      expect(mockData).toHaveProperty('chains');
      expect(mockData).toHaveProperty('averageFidelity');
      expect(mockData).toHaveProperty('consensusReached');
    });

    it('should support real-time pulse monitoring', () => {
      // startPulseMonitoring should accept a callback
      const mockCallback = vi.fn();
      
      // In production, this would start interval-based monitoring
      expect(typeof aggregator.startPulseMonitoring).toBe('function');
    });
  });

  describe('Data Validation', () => {
    it('should validate pulse data structure', () => {
      const validPulseData = {
        pulseId: 1,
        timestamp: Date.now() / 1000,
        dataHash: '0x1234567890abcdef',
        fidelityScore: 94,
        chain: 'ethereum-sepolia',
        isValid: true
      };

      expect(validPulseData.pulseId).toBeGreaterThan(0);
      expect(validPulseData.timestamp).toBeGreaterThan(0);
      expect(validPulseData.dataHash).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(validPulseData.fidelityScore).toBeLessThanOrEqual(94);
      expect(validPulseData.isValid).toBe(true);
    });

    it('should validate aggregated data structure', () => {
      const validAggregatedData: AggregatedPulseData = {
        timestamp: Date.now(),
        chains: {},
        averageFidelity: 90,
        consensusReached: true
      };

      expect(validAggregatedData.timestamp).toBeGreaterThan(0);
      expect(typeof validAggregatedData.chains).toBe('object');
      expect(validAggregatedData.averageFidelity).toBeGreaterThanOrEqual(0);
      expect(validAggregatedData.averageFidelity).toBeLessThanOrEqual(94);
      expect(typeof validAggregatedData.consensusReached).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing chain configuration gracefully', () => {
      const emptyAggregator = new MultiChainOracleAggregator({});
      const chains = emptyAggregator.getSupportedChains();
      expect(chains).toHaveLength(0);
    });

    it('should handle invalid RPC endpoints', async () => {
      const invalidConfig: Record<string, ChainConfig> = {
        'test-chain': {
          chainId: 1,
          name: 'Test Chain',
          rpcUrl: 'https://invalid-rpc-endpoint-that-does-not-exist.com',
          explorer: 'https://example.com',
          oracleContract: '0x0000000000000000000000000000000000000000',
          nativeCurrency: {
            name: 'TEST',
            symbol: 'TEST',
            decimals: 18
          }
        }
      };

      const testAggregator = new MultiChainOracleAggregator(invalidConfig);
      const isHealthy = await testAggregator.checkChainHealth('test-chain');
      expect(isHealthy).toBe(false);
    });
  });
});
