/**
 * Tests for ZK-Proof Constructor
 * Phase 40 Implementation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  generateCrossVaultProof,
  verifyCrossVaultProof,
  aggregateProofs,
  createRecursiveProof,
  getPerformanceMetrics,
  validateProofParams,
  type ZKProofParams,
  type ZKProof,
} from '../lib/zk-proof-constructor';

describe('ZK-Proof Constructor', () => {
  describe('generateCrossVaultProof', () => {
    it('should generate valid ZK proof', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-a',
        targetVault: 'vault-b',
        dataHash: 'a'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);

      expect(proof).toBeDefined();
      expect(proof.proofId).toHaveLength(64);
      expect(proof.params).toEqual(expect.objectContaining({
        sourceVault: params.sourceVault,
        targetVault: params.targetVault,
        dataHash: params.dataHash,
      }));
      expect(proof.proof.protocol).toBe('groth16');
      expect(proof.proof.curve).toBe('bn128');
      expect(proof.generationTime).toBeGreaterThan(0);
      expect(proof.quantumFidelity).toBeGreaterThan(0.99);
    });

    it('should generate proof within target time', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-x',
        targetVault: 'vault-y',
        dataHash: 'b'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);

      expect(proof.generationTime).toBeLessThan(500); // 500ms target
    });

    it('should include quantum entropy', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-1',
        targetVault: 'vault-2',
        dataHash: 'c'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);

      expect(proof.params.quantumEntropy).toBeDefined();
      expect(proof.params.quantumEntropy).toHaveLength(64);
    });

    it('should have high quantum fidelity', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-alpha',
        targetVault: 'vault-beta',
        dataHash: 'd'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);

      expect(proof.quantumFidelity).toBeGreaterThanOrEqual(0.9950);
      expect(proof.quantumFidelity).toBeLessThanOrEqual(0.9999);
    });
  });

  describe('verifyCrossVaultProof', () => {
    it('should verify valid proof', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-a',
        targetVault: 'vault-b',
        dataHash: 'e'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);
      const verification = await verifyCrossVaultProof(proof);

      expect(verification.valid).toBe(true);
      expect(verification.proofHash).toBe(proof.proofHash);
      expect(verification.verificationTime).toBeLessThan(10); // 10ms target
    });

    it('should reject invalid proof hash', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-1',
        targetVault: 'vault-2',
        dataHash: 'f'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);
      
      // Tamper with proof hash
      proof.proofHash = 'invalid-hash';

      const verification = await verifyCrossVaultProof(proof);

      expect(verification.valid).toBe(false);
      expect(verification.errorMessage).toBeDefined();
    });

    it('should verify within target time', async () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-fast',
        targetVault: 'vault-verify',
        dataHash: 'g'.repeat(64),
        timestamp: Date.now(),
      };

      const proof = await generateCrossVaultProof(params);
      const verification = await verifyCrossVaultProof(proof);

      expect(verification.verificationTime).toBeLessThan(5); // 5ms target
    });
  });

  describe('aggregateProofs', () => {
    it('should aggregate multiple proofs', async () => {
      const proofs: ZKProof[] = [];

      // Generate 5 proofs
      for (let i = 0; i < 5; i++) {
        const params: ZKProofParams = {
          sourceVault: `vault-${i}`,
          targetVault: 'vault-target',
          dataHash: `${'h'.repeat(63)}${i}`,
          timestamp: Date.now(),
        };
        const proof = await generateCrossVaultProof(params);
        proofs.push(proof);
      }

      const aggregated = await aggregateProofs(proofs);

      expect(aggregated).toBeDefined();
      expect(aggregated.proofs).toHaveLength(5);
      expect(aggregated.merkleRoot).toHaveLength(64);
      expect(aggregated.aggregatedProofHash).toHaveLength(64);
      expect(aggregated.aggregationTime).toBeGreaterThan(0);
    });

    it('should aggregate within target time', async () => {
      const proofs: ZKProof[] = [];

      // Generate 10 proofs for batch test
      for (let i = 0; i < 10; i++) {
        const params: ZKProofParams = {
          sourceVault: `batch-vault-${i}`,
          targetVault: 'batch-target',
          dataHash: `${'i'.repeat(63)}${i}`,
          timestamp: Date.now(),
        };
        const proof = await generateCrossVaultProof(params);
        proofs.push(proof);
      }

      const aggregated = await aggregateProofs(proofs);

      expect(aggregated.aggregationTime).toBeLessThan(1000); // 1s for 10 proofs
    });

    it('should handle empty proof array', async () => {
      const aggregated = await aggregateProofs([]);

      expect(aggregated).toBeDefined();
      expect(aggregated.proofs).toHaveLength(0);
      expect(aggregated.merkleRoot).toBeDefined();
    });
  });

  describe('createRecursiveProof', () => {
    it('should create recursive proof', async () => {
      const baseParams: ZKProofParams = {
        sourceVault: 'recursive-base',
        targetVault: 'recursive-target',
        dataHash: 'j'.repeat(64),
        timestamp: Date.now(),
      };

      const baseProof = await generateCrossVaultProof(baseParams);
      const recursive = await createRecursiveProof(baseProof, 3);

      expect(recursive).toBeDefined();
      expect(recursive.depth).toBe(3);
      expect(recursive.recursiveProofs).toHaveLength(3);
      expect(recursive.finalProofHash).toHaveLength(64);
    });

    it('should enforce maximum recursion depth', async () => {
      const baseParams: ZKProofParams = {
        sourceVault: 'deep-vault',
        targetVault: 'deep-target',
        dataHash: 'k'.repeat(64),
        timestamp: Date.now(),
      };

      const baseProof = await generateCrossVaultProof(baseParams);

      await expect(
        createRecursiveProof(baseProof, 11)
      ).rejects.toThrow('Maximum recursive depth');
    });

    it('should chain proofs correctly', async () => {
      const baseParams: ZKProofParams = {
        sourceVault: 'chain-vault',
        targetVault: 'chain-target',
        dataHash: 'l'.repeat(64),
        timestamp: Date.now(),
      };

      const baseProof = await generateCrossVaultProof(baseParams);
      const recursive = await createRecursiveProof(baseProof, 2);

      // Each recursive proof should reference previous proof's hash
      expect(recursive.recursiveProofs[0].params.dataHash).toBe(baseProof.proofHash);
      expect(recursive.recursiveProofs[1].params.dataHash).toBe(
        recursive.recursiveProofs[0].proofHash
      );
    });
  });

  describe('validateProofParams', () => {
    it('should validate correct params', () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-a',
        targetVault: 'vault-b',
        dataHash: 'm'.repeat(64),
        timestamp: Date.now(),
      };

      expect(validateProofParams(params)).toBe(true);
    });

    it('should reject missing vaults', () => {
      const params: ZKProofParams = {
        sourceVault: '',
        targetVault: 'vault-b',
        dataHash: 'n'.repeat(64),
        timestamp: Date.now(),
      };

      expect(validateProofParams(params)).toBe(false);
    });

    it('should reject invalid dataHash length', () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-a',
        targetVault: 'vault-b',
        dataHash: 'short',
        timestamp: Date.now(),
      };

      expect(validateProofParams(params)).toBe(false);
    });

    it('should reject invalid timestamp', () => {
      const params: ZKProofParams = {
        sourceVault: 'vault-a',
        targetVault: 'vault-b',
        dataHash: 'o'.repeat(64),
        timestamp: -1,
      };

      expect(validateProofParams(params)).toBe(false);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', () => {
      const metrics = getPerformanceMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.targetProofGeneration).toBe(500);
      expect(metrics.targetVerification).toBe(5);
      expect(metrics.quantumFidelityTarget).toBeCloseTo(0.9997);
      expect(metrics.maxRecursiveDepth).toBe(10);
      expect(metrics.protocol).toBe('groth16');
      expect(metrics.curve).toBe('bn128');
    });
  });

  describe('Performance benchmarks', () => {
    it('should handle 100 proof generations', async () => {
      const startTime = Date.now();
      const proofs: ZKProof[] = [];

      for (let i = 0; i < 100; i++) {
        const params: ZKProofParams = {
          sourceVault: `bench-vault-${i}`,
          targetVault: 'bench-target',
          dataHash: `${'p'.repeat(63)}${i % 10}`,
          timestamp: Date.now(),
        };
        const proof = await generateCrossVaultProof(params);
        proofs.push(proof);
      }

      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / 100;

      expect(proofs).toHaveLength(100);
      expect(avgTime).toBeLessThan(500); // Average should be under 500ms
    });

    it('should handle 100 proof verifications', async () => {
      // First generate proofs
      const proofs: ZKProof[] = [];
      for (let i = 0; i < 100; i++) {
        const params: ZKProofParams = {
          sourceVault: `verify-bench-${i}`,
          targetVault: 'verify-target',
          dataHash: `${'q'.repeat(63)}${i % 10}`,
          timestamp: Date.now(),
        };
        const proof = await generateCrossVaultProof(params);
        proofs.push(proof);
      }

      // Now verify them
      const startTime = Date.now();
      for (const proof of proofs) {
        await verifyCrossVaultProof(proof);
      }
      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / 100;

      expect(avgTime).toBeLessThan(5); // Average verification under 5ms
    });
  });
});
