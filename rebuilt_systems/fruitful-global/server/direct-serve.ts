import { readFileSync } from 'fs';
import { join } from 'path';

// Direct file serving for YOUR authentic templates
export class DirectTemplateServer {
  private sectorIndexContent: string | null = null;
  private vaultMeshContent: string | null = null;

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    try {
      // Load YOUR authentic Sector Index Dashboard
      this.sectorIndexContent = readFileSync(
        join(process.cwd(), 'attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-content-1753731844821_1753731844826.txt'),
        'utf8'
      );
      console.log('✅ Loaded YOUR authentic Sector Index Dashboard (215,987 chars)');

      // Load YOUR authentic VaultMesh Banimal Loop Checkout exactly as you created it
      this.vaultMeshContent = readFileSync(
        join(process.cwd(), 'attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-content-1753734635359_1753734635360.txt'),
        'utf8'
      );
      console.log('✅ Loaded YOUR authentic VaultMesh Banimal Loop Checkout (1471 lines)');
    } catch (error) {
      console.error('❌ Error loading YOUR authentic templates:', error);
    }
  }

  getSectorIndexDashboard(): string {
    if (!this.sectorIndexContent) {
      throw new Error('YOUR authentic Sector Index Dashboard is not loaded');
    }
    return this.sectorIndexContent;
  }

  getVaultMeshCheckout(): string {
    if (!this.vaultMeshContent) {
      throw new Error('YOUR authentic VaultMesh Checkout is not loaded');
    }
    return this.vaultMeshContent;
  }
}

export const directServer = new DirectTemplateServer();