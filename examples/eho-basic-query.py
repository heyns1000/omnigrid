#!/usr/bin/env python3
"""
EHO Basic Query Example
=======================

Demonstrates basic usage of Elephant Herding Optimization
for memory retrieval with VaultMesh.
"""

import sys
import os

# Add lib directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from lib.eho_memory import ElephantHerdingMemory


def main():
    print("=" * 70)
    print("🐘 EHO Basic Query Example")
    print("=" * 70)
    print()

    # Initialize EHO memory system
    print("📦 Initializing EHO Memory System...")
    eho = ElephantHerdingMemory(
        num_clans=5,
        elephants_per_clan=20,
        dimensions=40,
        max_iterations=50  # Reduced for demo
    )
    print("✅ Initialized: 5 clans × 20 elephants × 40D")
    print()

    # Example 1: Single brand query
    print("-" * 70)
    print("Example 1: Single Brand Query")
    print("-" * 70)
    
    brand_id = "monster-omni-001"
    print(f"🔍 Optimizing memory retrieval for: {brand_id}")
    
    result = eho.optimize_brand_query(brand_id)
    
    print()
    print("📊 Results:")
    print(f"   Brand ID: {result['brand_id']}")
    print(f"   Best Latency: {result['best_fitness_ms']:.2f}ms")
    print(f"   Convergence Quality: {result['convergence_quality']:.1%}")
    print(f"   Total Time: {result['total_time_s']:.2f}s")
    print(f"   Clans: {result['clans']}")
    print(f"   Total Elephants: {result['total_elephants']}")
    
    if result['best_fitness_ms'] < 50:
        print(f"   ✅ Target met: {result['best_fitness_ms']:.2f}ms < 50ms")
    else:
        print(f"   ⚠️  Target exceeded: {result['best_fitness_ms']:.2f}ms >= 50ms")
    
    print()

    # Example 2: Multiple brand queries
    print("-" * 70)
    print("Example 2: Multiple Brand Queries")
    print("-" * 70)
    
    brands = [
        "nest-cortex-042",
        "omni-trace-137",
        "node-rite-256",
        "vault-mesh-511"
    ]
    
    print(f"🔍 Optimizing memory retrieval for {len(brands)} brands...")
    print()
    
    results = []
    for brand_id in brands:
        print(f"   Processing: {brand_id}...", end=" ")
        result = eho.optimize_brand_query(brand_id)
        results.append(result)
        print(f"{result['best_fitness_ms']:.2f}ms ✓")
    
    print()
    print("📊 Summary:")
    
    avg_latency = sum(r['best_fitness_ms'] for r in results) / len(results)
    avg_convergence = sum(r['convergence_quality'] for r in results) / len(results)
    total_time = sum(r['total_time_s'] for r in results)
    
    print(f"   Brands Processed: {len(brands)}")
    print(f"   Average Latency: {avg_latency:.2f}ms")
    print(f"   Average Convergence: {avg_convergence:.1%}")
    print(f"   Total Time: {total_time:.2f}s")
    
    if avg_latency < 50:
        print(f"   ✅ All queries within target: {avg_latency:.2f}ms < 50ms")
    
    print()

    # Example 3: Custom hyperparameters
    print("-" * 70)
    print("Example 3: Custom Hyperparameters")
    print("-" * 70)
    
    print("🔧 Initializing EHO with custom settings...")
    custom_eho = ElephantHerdingMemory(
        num_clans=3,           # Fewer clans for speed
        elephants_per_clan=10, # Fewer elephants
        dimensions=40,
        alpha=0.6,             # More exploitation
        beta=0.15,             # More exploration
        max_iterations=30      # Faster convergence
    )
    print("✅ Custom EHO: 3 clans × 10 elephants")
    print()
    
    brand_id = "high-priority-brand"
    print(f"🔍 Fast optimization for: {brand_id}")
    
    result = custom_eho.optimize_brand_query(brand_id)
    
    print()
    print("📊 Results:")
    print(f"   Best Latency: {result['best_fitness_ms']:.2f}ms")
    print(f"   Convergence: {result['convergence_quality']:.1%}")
    print(f"   Total Time: {result['total_time_s']:.2f}s")
    print(f"   Speed Gain: ~{(total_time / result['total_time_s']):.1f}x faster")
    
    print()
    print("=" * 70)
    print("✅ Examples Complete!")
    print("=" * 70)
    print()
    print("Next Steps:")
    print("  • Review docs/eho-quickstart.md for more examples")
    print("  • Run tests/eho-performance.spec.ts for benchmarks")
    print("  • Check docs/ADR-01-eho-algorithm.md for details")


if __name__ == "__main__":
    main()
