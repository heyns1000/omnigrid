/**
 * Tests for Quantum Fidelity Simulator
 * Phase 40 Implementation
 */

import { describe, it, expect } from 'vitest';
import {
  generateQuantumEntropy,
  generateQuantumRandomNumbers,
  validateWithQuantum,
  batchValidateWithQuantum,
  getQuantumFidelity,
  applySurfaceCode,
  estimateLogicalErrorRate,
  meetsTargetFidelity,
  getQuantumSpecs,
} from '../lib/quantum-fidelity';

describe('Quantum Fidelity Simulator', () => {
  describe('generateQuantumEntropy', () => {
    it('should generate quantum entropy', async () => {
      const entropy = await generateQuantumEntropy();

      expect(entropy).toBeDefined();
      expect(entropy.entropyId).toHaveLength(64);
      expect(entropy.qubits).toBe(50);
      expect(entropy.entropyBits).toBeDefined();
      expect(entropy.fidelity).toBeGreaterThan(0.99);
      expect(entropy.measurements).toBe(256);
      expect(entropy.coherenceTime).toBeGreaterThan(0);
    });

    it('should generate entropy with custom qubit count', async () => {
      const entropy = await generateQuantumEntropy(25, 128);

      expect(entropy.qubits).toBe(25);
      expect(entropy.measurements).toBe(128);
    });

    it('should reject qubit count exceeding capacity', async () => {
      await expect(
        generateQuantumEntropy(51)
      ).rejects.toThrow('exceeds available');
    });

    it('should produce high-quality entropy', async () => {
      const entropy = await generateQuantumEntropy();

      // Check entropy is hex string
      expect(entropy.entropyBits).toMatch(/^[0-9a-f]+$/);
      
      // Check fidelity is within expected range
      expect(entropy.fidelity).toBeGreaterThanOrEqual(0.9950);
      expect(entropy.fidelity).toBeLessThanOrEqual(0.9999);
    });

    it('should generate unique entropy each time', async () => {
      const entropy1 = await generateQuantumEntropy();
      const entropy2 = await generateQuantumEntropy();

      expect(entropy1.entropyBits).not.toBe(entropy2.entropyBits);
      expect(entropy1.entropyId).not.toBe(entropy2.entropyId);
    });
  });

  describe('generateQuantumRandomNumbers', () => {
    it('should generate quantum random numbers', async () => {
      const count = 100;
      const numbers = await generateQuantumRandomNumbers(count);

      expect(numbers).toHaveLength(count);
      
      // Check all numbers are in 0-1 range
      for (const num of numbers) {
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(1);
      }
    });

    it('should produce uniform distribution', async () => {
      const count = 1000;
      const numbers = await generateQuantumRandomNumbers(count);

      // Calculate mean (should be close to 0.5)
      const mean = numbers.reduce((sum, n) => sum + n, 0) / count;
      
      expect(mean).toBeGreaterThan(0.4);
      expect(mean).toBeLessThan(0.6);
    });

    it('should generate different numbers each time', async () => {
      const numbers1 = await generateQuantumRandomNumbers(10);
      const numbers2 = await generateQuantumRandomNumbers(10);

      // Should not be identical
      const identical = numbers1.every((n, i) => n === numbers2[i]);
      expect(identical).toBe(false);
    });
  });

  describe('validateWithQuantum', () => {
    it('should validate data with quantum fidelity', async () => {
      const data = Buffer.from('test data for quantum validation');
      const validation = await validateWithQuantum(data);

      expect(validation).toBeDefined();
      expect(validation.validationId).toHaveLength(64);
      expect(validation.dataHash).toHaveLength(64);
      expect(validation.quantumEntropy).toBeDefined();
      expect(validation.fidelityScore).toBeGreaterThan(0.99);
      expect(validation.validated).toBe(true);
      expect(validation.errorRate).toBeLessThan(0.01);
      expect(validation.validationTime).toBeGreaterThan(0);
    });

    it('should validate string data', async () => {
      const data = 'a'.repeat(64);
      const validation = await validateWithQuantum(data);

      expect(validation.dataHash).toBe(data);
      expect(validation.validated).toBe(true);
    });

    it('should complete within target time', async () => {
      const data = Buffer.from('fast validation test');
      const validation = await validateWithQuantum(data);

      expect(validation.validationTime).toBeLessThan(100); // 100ms target
    });

    it('should have high fidelity score', async () => {
      const data = Buffer.from('high fidelity test data');
      const validation = await validateWithQuantum(data);

      expect(validation.fidelityScore).toBeGreaterThanOrEqual(0.9950);
    });
  });

  describe('batchValidateWithQuantum', () => {
    it('should validate multiple data items', async () => {
      const dataItems = [
        Buffer.from('data1'),
        Buffer.from('data2'),
        Buffer.from('data3'),
      ];

      const validations = await batchValidateWithQuantum(dataItems);

      expect(validations).toHaveLength(3);
      validations.forEach(v => {
        expect(v.validated).toBe(true);
        expect(v.fidelityScore).toBeGreaterThan(0.99);
      });
    });

    it('should handle large batches', async () => {
      const dataItems = Array.from({ length: 50 }, (_, i) =>
        Buffer.from(`batch-data-${i}`)
      );

      const validations = await batchValidateWithQuantum(dataItems);

      expect(validations).toHaveLength(50);
    });
  });

  describe('getQuantumFidelity', () => {
    it('should return comprehensive fidelity metrics', async () => {
      const metrics = await getQuantumFidelity();

      expect(metrics).toBeDefined();
      expect(metrics.singleQubitGateFidelity).toBeGreaterThan(0.999);
      expect(metrics.twoQubitGateFidelity).toBeGreaterThan(0.99);
      expect(metrics.measurementFidelity).toBeGreaterThan(0.998);
      expect(metrics.statePreparationFidelity).toBeGreaterThan(0.998);
      expect(metrics.overallSystemFidelity).toBeGreaterThan(0.997);
      expect(metrics.decoherenceTime).toBe(100);
      expect(metrics.gateOperationTime).toBe(50);
    });

    it('should meet target fidelities', async () => {
      const metrics = await getQuantumFidelity();

      expect(metrics.singleQubitGateFidelity).toBeGreaterThanOrEqual(0.9995);
      expect(metrics.twoQubitGateFidelity).toBeGreaterThanOrEqual(0.9950);
      expect(metrics.measurementFidelity).toBeGreaterThanOrEqual(0.9990);
      expect(metrics.statePreparationFidelity).toBeGreaterThanOrEqual(0.9985);
    });

    it('should have consistent measurements', async () => {
      const metrics1 = await getQuantumFidelity();
      const metrics2 = await getQuantumFidelity();

      // Should be in similar ranges
      expect(Math.abs(metrics1.overallSystemFidelity - metrics2.overallSystemFidelity))
        .toBeLessThan(0.01);
    });
  });

  describe('applySurfaceCode', () => {
    it('should apply surface code error correction', () => {
      const result = applySurfaceCode(50);

      expect(result.logicalQubits).toBe(5); // 50 physical → 5 logical
      expect(result.errorRate).toBeLessThan(0.0001);
    });

    it('should reduce error rate significantly', () => {
      const result = applySurfaceCode(50);
      const targetFidelity = 0.9997;
      const physicalErrorRate = 1 - targetFidelity;

      expect(result.errorRate).toBeLessThan(physicalErrorRate);
    });

    it('should handle different qubit counts', () => {
      const result20 = applySurfaceCode(20);
      const result50 = applySurfaceCode(50);

      expect(result20.logicalQubits).toBe(2);
      expect(result50.logicalQubits).toBe(5);
      expect(result50.errorRate).toBeLessThan(result20.errorRate);
    });
  });

  describe('estimateLogicalErrorRate', () => {
    it('should estimate logical error rate', () => {
      const physicalFidelity = 0.9997;
      const codeDistance = 5;

      const logicalErrorRate = estimateLogicalErrorRate(physicalFidelity, codeDistance);

      expect(logicalErrorRate).toBeGreaterThan(0);
      expect(logicalErrorRate).toBeLessThan(1);
    });

    it('should decrease with higher code distance', () => {
      const physicalFidelity = 0.9997;
      
      const error3 = estimateLogicalErrorRate(physicalFidelity, 3);
      const error5 = estimateLogicalErrorRate(physicalFidelity, 5);
      const error7 = estimateLogicalErrorRate(physicalFidelity, 7);

      expect(error3).toBeGreaterThan(error5);
      expect(error5).toBeGreaterThan(error7);
    });

    it('should improve with higher physical fidelity', () => {
      const codeDistance = 5;
      
      const error995 = estimateLogicalErrorRate(0.9950, codeDistance);
      const error997 = estimateLogicalErrorRate(0.9970, codeDistance);
      const error999 = estimateLogicalErrorRate(0.9990, codeDistance);

      expect(error995).toBeGreaterThan(error997);
      expect(error997).toBeGreaterThan(error999);
    });
  });

  describe('meetsTargetFidelity', () => {
    it('should accept high fidelity', () => {
      expect(meetsTargetFidelity(0.9998)).toBe(true);
      expect(meetsTargetFidelity(0.9997)).toBe(true);
    });

    it('should reject low fidelity', () => {
      expect(meetsTargetFidelity(0.9996)).toBe(false);
      expect(meetsTargetFidelity(0.9900)).toBe(false);
    });

    it('should handle edge case', () => {
      expect(meetsTargetFidelity(0.9997)).toBe(true);
    });
  });

  describe('getQuantumSpecs', () => {
    it('should return quantum processor specifications', () => {
      const specs = getQuantumSpecs();

      expect(specs).toBeDefined();
      expect(specs.qubitCount).toBe(50);
      expect(specs.targetFidelity).toBeCloseTo(0.9997);
      expect(specs.decoherenceTime).toBe(100);
      expect(specs.gateOperationTime).toBe(50);
      expect(specs.targetSingleQubitFidelity).toBeCloseTo(0.9995);
      expect(specs.targetTwoQubitFidelity).toBeCloseTo(0.9950);
    });
  });

  describe('Performance benchmarks', () => {
    it('should generate entropy efficiently', async () => {
      const startTime = Date.now();
      const count = 100;

      for (let i = 0; i < count; i++) {
        await generateQuantumEntropy(10, 32); // Smaller for speed
      }

      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / count;

      expect(avgTime).toBeLessThan(50); // Should be fast
    });

    it('should validate efficiently', async () => {
      const startTime = Date.now();
      const count = 50;

      for (let i = 0; i < count; i++) {
        await validateWithQuantum(Buffer.from(`test-${i}`));
      }

      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / count;

      expect(avgTime).toBeLessThan(100); // 100ms per validation
    });
  });

  describe('Statistical properties', () => {
    it('should generate statistically random entropy', async () => {
      const entropy = await generateQuantumEntropy(50, 1000);
      const entropyBuffer = Buffer.from(entropy.entropyBits, 'hex');

      // Count bit occurrences
      let onesCount = 0;
      for (const byte of entropyBuffer) {
        for (let i = 0; i < 8; i++) {
          if (byte & (1 << i)) onesCount++;
        }
      }

      const totalBits = entropyBuffer.length * 8;
      const onesRatio = onesCount / totalBits;

      // Should be close to 0.5 for good randomness
      expect(onesRatio).toBeGreaterThan(0.45);
      expect(onesRatio).toBeLessThan(0.55);
    });

    it('should have high entropy distribution', async () => {
      const entropy = await generateQuantumEntropy(50, 1000);
      const entropyBuffer = Buffer.from(entropy.entropyBits, 'hex');

      // Count unique bytes
      const uniqueBytes = new Set(entropyBuffer).size;
      const uniquenessRatio = uniqueBytes / Math.min(256, entropyBuffer.length);

      // Should have good distribution
      expect(uniquenessRatio).toBeGreaterThan(0.5);
    });
  });
});
