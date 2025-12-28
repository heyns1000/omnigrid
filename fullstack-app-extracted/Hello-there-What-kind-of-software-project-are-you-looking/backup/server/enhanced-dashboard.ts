import { readFileSync } from 'fs';
import { join } from 'path';

export function getEnhancedDashboard(): string {
  try {
    let dashboard = readFileSync(
      join(process.cwd(), 'attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-content-1753731844821_1753731844826.txt'),
      'utf8'
    );

    // Add business navigation buttons to YOUR authentic dashboard
    const businessNavigation = `
    <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px;">
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="/admin" style="background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">
          🏢 Business Admin
        </a>
        <a href="/admin/templates" style="background: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">
          📋 Templates
        </a>
        <a href="/admin/brands" style="background: #FF9800; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">
          🏷️ Brands
        </a>
        <a href="/admin/deployment" style="background: #9C27B0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">
          🚀 Deploy
        </a>
        <a href="/vaultmesh" style="background: #F44336; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">
          💳 VaultMesh
        </a>
      </div>
    </div>`;

    // Insert navigation right after the opening body tag
    dashboard = dashboard.replace(/<body[^>]*>/, '$&' + businessNavigation);

    return dashboard;
  } catch (error) {
    console.error('Error enhancing dashboard:', error);
    throw error;
  }
}