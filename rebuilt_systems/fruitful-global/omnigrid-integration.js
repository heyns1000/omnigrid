/**
 * OmniGrid™ Integration Module for Fruitful Global Platform
 * Connects the fullstack app to OmniGrid's consolidated ecosystem
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class OmniGridIntegration {
  constructor() {
    this.omnigridRoot = join(__dirname, '../..');
    this.consolidatedData = null;
    this.loadConsolidatedData();
  }

  /**
   * Load all consolidated data from OmniGrid
   */
  loadConsolidatedData() {
    try {
      const brandRegistry = JSON.parse(
        readFileSync(join(this.omnigridRoot, 'consolidated_output/brand_registry.json'), 'utf-8')
      );

      const repoMapping = JSON.parse(
        readFileSync(join(this.omnigridRoot, 'consolidated_output/repository_mapping.json'), 'utf-8')
      );

      const techStack = JSON.parse(
        readFileSync(join(this.omnigridRoot, 'consolidated_output/technology_stack.json'), 'utf-8')
      );

      const systems = JSON.parse(
        readFileSync(join(this.omnigridRoot, 'consolidated_output/system_architectures.json'), 'utf-8')
      );

      this.consolidatedData = {
        brands: brandRegistry.brands || [],
        repositories: repoMapping.repositories || [],
        technologies: techStack.technologies || [],
        systems: systems.systems || [],
        totalBrands: brandRegistry.brands?.length || 0,
        totalRepos: repoMapping.repositories?.length || 0,
        totalTechs: techStack.technologies?.length || 0,
        totalSystems: systems.systems?.length || 0
      };

      console.log('✅ OmniGrid consolidated data loaded successfully');
      console.log(`📊 Stats: ${this.consolidatedData.totalBrands} brands, ${this.consolidatedData.totalRepos} repos, ${this.consolidatedData.totalSystems} systems`);

      return this.consolidatedData;
    } catch (error) {
      console.error('❌ Error loading OmniGrid data:', error.message);
      this.consolidatedData = {
        brands: [],
        repositories: [],
        technologies: [],
        systems: [],
        totalBrands: 0,
        totalRepos: 0,
        totalTechs: 0,
        totalSystems: 0
      };
      return this.consolidatedData;
    }
  }

  /**
   * Get all brands for brand management page
   */
  getBrands() {
    return this.consolidatedData.brands;
  }

  /**
   * Get brand by ID
   */
  getBrand(brandId) {
    return this.consolidatedData.brands.find(b => b.id === brandId || b.name === brandId);
  }

  /**
   * Get all repositories
   */
  getRepositories() {
    return this.consolidatedData.repositories;
  }

  /**
   * Get all systems for deployment control
   */
  getSystems() {
    return this.consolidatedData.systems;
  }

  /**
   * Get deployment status for all systems
   */
  getDeploymentStatus() {
    return this.consolidatedData.systems.map(system => ({
      name: system.name,
      status: 'active', // This would be dynamic in production
      url: system.url || null,
      lastDeployed: new Date().toISOString(),
      health: 'healthy'
    }));
  }

  /**
   * Get analytics data
   */
  getAnalytics() {
    return {
      totalBrands: this.consolidatedData.totalBrands,
      totalRepos: this.consolidatedData.totalRepos,
      totalSystems: this.consolidatedData.totalSystems,
      totalTechnologies: this.consolidatedData.totalTechs,
      activeDeployments: this.consolidatedData.systems.filter(s => s.status === 'active').length,
      brandsByCategory: this.groupBrandsByFamily(),
      systemsHealth: this.getSystemsHealth()
    };
  }

  /**
   * Group brands by family (Vault™, Stack™, Grid™, etc.)
   */
  groupBrandsByFamily() {
    const families = {
      'Vault': [],
      'Stack': [],
      'Grid': [],
      'FAA': [],
      'Commerce': [],
      'Other': []
    };

    this.consolidatedData.brands.forEach(brand => {
      if (brand.name.includes('Vault')) families.Vault.push(brand);
      else if (brand.name.includes('Stack') || brand.name.includes('Nest')) families.Stack.push(brand);
      else if (brand.name.includes('Grid')) families.Grid.push(brand);
      else if (brand.name.includes('FAA') || brand.name.includes('Seedwave')) families.FAA.push(brand);
      else if (brand.name.includes('Banimal') || brand.name.includes('Cart')) families.Commerce.push(brand);
      else families.Other.push(brand);
    });

    return families;
  }

  /**
   * Get health status of all systems
   */
  getSystemsHealth() {
    return this.consolidatedData.systems.map(system => ({
      name: system.name,
      status: 'healthy',
      uptime: '99.9%',
      responseTime: Math.floor(Math.random() * 100) + 50 // Mock data
    }));
  }

  /**
   * Trigger deployment to a system
   */
  async deployToSystem(systemName, config = {}) {
    console.log(`🚀 Deploying to ${systemName} with config:`, config);

    // This would integrate with HotStack™ deployment engine
    // For now, return success
    return {
      success: true,
      system: systemName,
      deploymentId: `deploy-${Date.now()}`,
      status: 'pending',
      message: `Deployment to ${systemName} initiated via OmniGrid integration`
    };
  }

  /**
   * Get consolidated code snippets for a technology
   */
  getCodeSnippets(technology) {
    try {
      const codeLibPath = join(this.omnigridRoot, `consolidated_output/code_library/${technology}_code.json`);
      const snippets = JSON.parse(readFileSync(codeLibPath, 'utf-8'));
      return snippets;
    } catch (error) {
      return [];
    }
  }

  /**
   * Export data for CodeNest™ distribution
   */
  exportForCodeNest() {
    return {
      timestamp: new Date().toISOString(),
      source: 'Fruitful Global Platform',
      data: {
        brands: this.consolidatedData.brands,
        repositories: this.consolidatedData.repositories,
        systems: this.consolidatedData.systems,
        technologies: this.consolidatedData.technologies
      },
      stats: {
        totalBrands: this.consolidatedData.totalBrands,
        totalRepos: this.consolidatedData.totalRepos,
        totalSystems: this.consolidatedData.totalSystems,
        totalTechs: this.consolidatedData.totalTechs
      }
    };
  }
}

export default OmniGridIntegration;
