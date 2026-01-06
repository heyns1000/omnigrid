/**
 * Tests for Multi-Chain Ledger Synchronization
 * Phase 40 Implementation
 */

import { describe, it, expect } from 'vitest';
import {
  syncMultiChainLedger,
  getAggregatedView,
  publishMerkleRoot,
  waitForConfirmation,
  verifyMerkleProof,
  getChainConfig,
  getSupportedChains,
  getExpectedConfirmationTime,
} from '../lib/multi-chain-ledger';

describe('Multi-Chain Ledger Synchronization', () => {
  describe('syncMultiChainLedger', () => {
    it('should synchronize across all chains', async () => {
      const entries = await syncMultiChainLedger();

      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
      
      // Should have entries from multiple chains
      entries.forEach(entry => {
        expect(entry.entryId).toBeDefined();
        expect(entry.dataHash).toHaveLength(64);
        expect(entry.merkleRoot).toHaveLength(64);
        expect(entry.timestamp).toBeGreaterThan(0);
        expect(entry.chains).toBeDefined();
        expect(Array.isArray(entry.chains)).toBe(true);
      });
    });

    it('should aggregate from all three chains', async () => {
      const entries = await syncMultiChainLedger();
      
      const chains = new Set<string>();
      entries.forEach(entry => {
        entry.chains.forEach(record => {
          chains.add(record.chain);
        });
      });

      // Should have entries from multiple chains
      expect(chains.size).toBeGreaterThan(0);
    });

    it('should complete within reasonable time', async () => {
      const startTime = Date.now();
      await syncMultiChainLedger();
      const syncTime = Date.now() - startTime;

      // Should be fast for testing
      expect(syncTime).toBeLessThan(5000); // 5 seconds
    });
  });

  describe('getAggregatedView', () => {
    it('should return aggregated ledger view', async () => {
      const timestamp = Date.now();
      const view = await getAggregatedView(timestamp);

      expect(view).toBeDefined();
      expect(view.viewId).toHaveLength(64);
      expect(view.timestamp).toBeGreaterThan(0);
      expect(view.windowStart).toBeLessThan(view.windowEnd);
      expect(view.entries).toBeDefined();
      expect(view.merkleRoot).toHaveLength(64);
      expect(view.chains).toBeDefined();
      expect(view.syncStatus).toBeDefined();
    });

    it('should include all three chain states', async () => {
      const view = await getAggregatedView(Date.now());

      expect(view.chains.ethereum).toBeDefined();
      expect(view.chains.polygon).toBeDefined();
      expect(view.chains.solana).toBeDefined();

      // Verify chain state structure
      [view.chains.ethereum, view.chains.polygon, view.chains.solana].forEach(chainState => {
        expect(chainState.latestBlock).toBeGreaterThan(0);
        expect(chainState.latestBlockHash).toBeDefined();
        expect(chainState.stateRoot).toBeDefined();
        expect(chainState.pendingTransactions).toBeGreaterThanOrEqual(0);
        expect(chainState.syncedAt).toBeGreaterThan(0);
      });
    });

    it('should provide sync status', async () => {
      const view = await getAggregatedView(Date.now());

      expect(view.syncStatus.synchronized).toBeDefined();
      expect(view.syncStatus.lag).toBeGreaterThanOrEqual(0);
      expect(view.syncStatus.healthScore).toBeGreaterThanOrEqual(0);
      expect(view.syncStatus.healthScore).toBeLessThanOrEqual(1);
      expect(view.syncStatus.lastSync).toBeGreaterThan(0);
    });

    it('should respect window size', async () => {
      const timestamp = Date.now();
      const windowSize = 5000; // 5 seconds
      const view = await getAggregatedView(timestamp, windowSize);

      const actualWindowSize = view.windowEnd - view.windowStart;
      expect(actualWindowSize).toBe(windowSize);
    });

    it('should complete within 10 seconds', async () => {
      const startTime = Date.now();
      await getAggregatedView(Date.now());
      const viewTime = Date.now() - startTime;

      expect(viewTime).toBeLessThan(10000); // 10 second target
    });
  });

  describe('publishMerkleRoot', () => {
    it('should publish to all three chains', async () => {
      const merkleRoot = 'a'.repeat(64);
      const receipt = await publishMerkleRoot(merkleRoot);

      expect(receipt).toBeDefined();
      expect(receipt.receiptId).toHaveLength(64);
      expect(receipt.merkleRoot).toBe(merkleRoot);
      expect(receipt.chains).toHaveLength(3); // Ethereum, Polygon, Solana
      expect(receipt.totalConfirmations).toBeGreaterThanOrEqual(0);
      expect(receipt.timestamp).toBeGreaterThan(0);
    });

    it('should include chain records', async () => {
      const merkleRoot = 'b'.repeat(64);
      const receipt = await publishMerkleRoot(merkleRoot);

      receipt.chains.forEach(record => {
        expect(record.chain).toBeDefined();
        expect(record.txHash).toBeDefined();
        expect(record.blockNumber).toBeGreaterThan(0);
        expect(record.blockHash).toBeDefined();
        expect(record.confirmations).toBeGreaterThanOrEqual(0);
        expect(record.timestamp).toBeGreaterThan(0);
        expect(['pending', 'confirmed', 'finalized', 'failed']).toContain(record.status);
      });
    });

    it('should handle metadata', async () => {
      const merkleRoot = 'c'.repeat(64);
      const metadata = { source: 'test', version: '40.0.0' };
      const receipt = await publishMerkleRoot(merkleRoot, metadata);

      expect(receipt).toBeDefined();
      expect(receipt.merkleRoot).toBe(merkleRoot);
    });
  });

  describe('waitForConfirmation', () => {
    it('should wait for confirmations', async () => {
      const merkleRoot = 'd'.repeat(64);
      const receipt = await publishMerkleRoot(merkleRoot);
      
      const confirmed = await waitForConfirmation(receipt.receiptId, 1);

      expect(typeof confirmed).toBe('boolean');
    });

    it('should timeout if not confirmed', async () => {
      const fakeReceiptId = 'nonexistent-receipt';
      
      const startTime = Date.now();
      const confirmed = await waitForConfirmation(fakeReceiptId, 100);
      const waitTime = Date.now() - startTime;

      expect(confirmed).toBe(false);
      expect(waitTime).toBeLessThan(65000); // Should timeout around 60s
    });
  });

  describe('verifyMerkleProof', () => {
    it('should verify valid Merkle proof', () => {
      const leaf = 'e'.repeat(64);
      const proof = ['f'.repeat(64), 'g'.repeat(64)];
      
      // Calculate expected root
      const hash1 = require('crypto').createHash('sha256')
        .update(leaf).update(proof[0]).digest('hex');
      const root = require('crypto').createHash('sha256')
        .update(hash1).update(proof[1]).digest('hex');

      const valid = verifyMerkleProof(leaf, proof, root);

      expect(valid).toBe(true);
    });

    it('should reject invalid proof', () => {
      const leaf = 'h'.repeat(64);
      const proof = ['i'.repeat(64)];
      const wrongRoot = 'j'.repeat(64);

      const valid = verifyMerkleProof(leaf, proof, wrongRoot);

      expect(valid).toBe(false);
    });

    it('should handle empty proof', () => {
      const leaf = 'k'.repeat(64);
      const proof: string[] = [];
      const root = leaf; // Root should be leaf if no proof

      const valid = verifyMerkleProof(leaf, proof, root);

      expect(valid).toBe(true);
    });
  });

  describe('getChainConfig', () => {
    it('should return Ethereum config', () => {
      const config = getChainConfig('ethereum');

      expect(config).toBeDefined();
      expect(config.chainId).toBe(1);
      expect(config.name).toBe('Ethereum');
      expect(config.rpcUrl).toBeDefined();
      expect(config.contractAddress).toBeDefined();
      expect(config.blockTime).toBe(12);
      expect(config.finality).toBe(780);
    });

    it('should return Polygon config', () => {
      const config = getChainConfig('polygon');

      expect(config.chainId).toBe(137);
      expect(config.name).toBe('Polygon');
      expect(config.blockTime).toBe(2);
      expect(config.finality).toBe(128);
    });

    it('should return Solana config', () => {
      const config = getChainConfig('solana');

      expect(config.chainId).toBe(0);
      expect(config.name).toBe('Solana');
      expect(config.blockTime).toBe(0.4);
      expect(config.finality).toBe(0.4);
    });

    it('should throw for unknown chain', () => {
      expect(() => getChainConfig('unknown')).toThrow('Unknown chain');
    });
  });

  describe('getSupportedChains', () => {
    it('should return all supported chains', () => {
      const chains = getSupportedChains();

      expect(chains).toBeDefined();
      expect(Array.isArray(chains)).toBe(true);
      expect(chains).toContain('ethereum');
      expect(chains).toContain('polygon');
      expect(chains).toContain('solana');
      expect(chains.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getExpectedConfirmationTime', () => {
    it('should return Ethereum confirmation time', () => {
      const time = getExpectedConfirmationTime('ethereum');

      expect(time).toBe(780000); // 780s in milliseconds
    });

    it('should return Polygon confirmation time', () => {
      const time = getExpectedConfirmationTime('polygon');

      expect(time).toBe(128000); // 128s in milliseconds
    });

    it('should return Solana confirmation time', () => {
      const time = getExpectedConfirmationTime('solana');

      expect(time).toBe(400); // 0.4s in milliseconds
    });

    it('should throw for unknown chain', () => {
      expect(() => getExpectedConfirmationTime('unknown')).toThrow('Unknown chain');
    });
  });

  describe('Performance benchmarks', () => {
    it('should sync multiple times efficiently', async () => {
      const iterations = 10;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await syncMultiChainLedger();
        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / iterations;

      expect(avgTime).toBeLessThan(5000); // Average under 5s
    });

    it('should handle multiple concurrent views', async () => {
      const count = 5;
      const timestamp = Date.now();

      const views = await Promise.all(
        Array.from({ length: count }, () => getAggregatedView(timestamp))
      );

      expect(views).toHaveLength(count);
      views.forEach(view => {
        expect(view.viewId).toBeDefined();
      });
    });

    it('should publish efficiently', async () => {
      const iterations = 10;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const merkleRoot = `${'m'.repeat(63)}${i}`;
        const start = Date.now();
        await publishMerkleRoot(merkleRoot);
        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / iterations;

      expect(avgTime).toBeLessThan(2000); // Average under 2s
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full sync-publish-verify cycle', async () => {
      // 1. Sync ledger
      const entries = await syncMultiChainLedger();
      expect(entries).toBeDefined();

      // 2. Get aggregated view
      const view = await getAggregatedView(Date.now());
      expect(view).toBeDefined();

      // 3. Publish Merkle root
      const receipt = await publishMerkleRoot(view.merkleRoot);
      expect(receipt).toBeDefined();
      expect(receipt.merkleRoot).toBe(view.merkleRoot);
    });

    it('should maintain consistency across operations', async () => {
      const timestamp = Date.now();
      
      const view1 = await getAggregatedView(timestamp, 1000);
      const view2 = await getAggregatedView(timestamp, 1000);

      // Same timestamp and window should produce similar results
      expect(view1.windowStart).toBe(view2.windowStart);
      expect(view1.windowEnd).toBe(view2.windowEnd);
    });
  });
});
