import { readFileSync } from 'fs';
import { join } from 'path';

export function getEnhancedVaultMesh(): string {
  try {
    let vaultmesh = readFileSync(
      join(process.cwd(), 'attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-content-1753730797853_1753730797855.txt'),
      'utf8'
    );

    // Add navigation overlay to YOUR VaultMesh template
    const navigationOverlay = `
    <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; background: rgba(0,0,0,0.9); padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="display: flex; flex-direction: column; gap: 12px; min-width: 200px;">
        <h3 style="color: white; margin: 0 0 15px 0; font-size: 16px; font-weight: bold; text-align: center; border-bottom: 1px solid #444; padding-bottom: 10px;">Business Navigation</h3>
        
        <a href="/admin" style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 14px 18px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; transition: all 0.3s ease; border: none; display: block;">
          🏢 Admin Dashboard
        </a>
        
        <a href="/admin/templates" style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 14px 18px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; transition: all 0.3s ease; border: none; display: block;">
          📋 Template Manager
        </a>
        
        <a href="/admin/brands" style="background: linear-gradient(135deg, #FF9800, #F57C00); color: white; padding: 14px 18px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; transition: all 0.3s ease; border: none; display: block;">
          🏷️ Brand Control
        </a>
        
        <a href="/admin/deployment" style="background: linear-gradient(135deg, #9C27B0, #7B1FA2); color: white; padding: 14px 18px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; transition: all 0.3s ease; border: none; display: block;">
          🚀 Deploy System
        </a>
        
        <a href="/sector-dashboard" style="background: linear-gradient(135deg, #607D8B, #455A64); color: white; padding: 14px 18px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; transition: all 0.3s ease; border: none; display: block;">
          📊 Sector Analytics
        </a>
        
        <a href="/admin/securesign" style="background: linear-gradient(135deg, #795548, #5D4037); color: white; padding: 14px 18px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; transition: all 0.3s ease; border: none; display: block;">
          🔒 SecureSign Portal
        </a>
      </div>
      
      <style>
        a:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          filter: brightness(1.1);
        }
      </style>
    </div>`;

    // Insert navigation right after the opening body tag
    vaultmesh = vaultmesh.replace(/<body[^>]*>/, '$&' + navigationOverlay);

    return vaultmesh;
  } catch (error) {
    console.error('Error enhancing VaultMesh:', error);
    throw error;
  }
}