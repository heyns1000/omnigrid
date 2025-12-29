#!/usr/bin/env node
/**
 * Test OmniGrid Integration - Verify data loading from consolidated_output
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing OmniGrid Integration...\n');

const omnigridRoot = join(__dirname, '../..');

try {
  // Test 1: Load brand registry
  console.log('📊 Test 1: Loading brand registry...');
  const brandData = JSON.parse(
    readFileSync(join(omnigridRoot, 'consolidated_output/brand_registry.json'), 'utf-8')
  );
  console.log(`   ✅ Loaded ${brandData.brands?.length || 0} brands`);

  // Test 2: Load system architectures
  console.log('🔧 Test 2: Loading system architectures...');
  const systemsData = JSON.parse(
    readFileSync(join(omnigridRoot, 'consolidated_output/system_architectures.json'), 'utf-8')
  );
  const systemsArray = Object.keys(systemsData);
  console.log(`   ✅ Loaded ${systemsArray.length} systems`);

  // Test 3: Load technology stack
  console.log('📦 Test 3: Loading technology stack...');
  const techData = JSON.parse(
    readFileSync(join(omnigridRoot, 'consolidated_output/technology_stack.json'), 'utf-8')
  );
  console.log(`   ✅ Loaded ${techData.technologies?.length || 0} technologies`);

  // Test 4: Load repository mapping
  console.log('🗂️  Test 4: Loading repository mapping...');
  const repoData = JSON.parse(
    readFileSync(join(omnigridRoot, 'consolidated_output/repository_mapping.json'), 'utf-8')
  );
  console.log(`   ✅ Loaded ${repoData.repositories?.length || 0} repositories`);

  console.log('\n🎉 All OmniGrid Integration Tests Passed!');
  console.log('\n📊 Summary:');
  console.log(`   Brands: ${brandData.brands?.length || 0}`);
  console.log(`   Systems: ${systemsArray.length}`);
  console.log(`   Technologies: ${techData.technologies?.length || 0}`);
  console.log(`   Repositories: ${repoData.repositories?.length || 0}`);
  console.log('\n✅ Fruitful Global is successfully connected to OmniGrid!');

  process.exit(0);
} catch (error) {
  console.error('\n❌ Test Failed:', error.message);
  console.error('\nPath tested:', omnigridRoot);
  process.exit(1);
}
