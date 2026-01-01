/**
 * Global Footer Component
 * Phase 2: Global Standardization Research System
 * 
 * Based on Phase 1 research findings:
 * - 87% similarity across repositories
 * - 3-column layout (most common pattern)
 * - Quick Links, Ecosystem Links, Social/Connect sections
 * - Care Loop indicator (15% → Banimal™)
 * - Pulse Status indicator (9s cycle)
 * - Treaty Grid™ compliance markers
 * - Ubuntu Protocol signature
 */

import React from 'react';
import type { FooterProps } from './types';

/**
 * Global Footer component with research-driven design
 * 
 * @param showCareLoop - Display Care Loop indicator (default: true)
 * @param showPulseStatus - Display Pulse Status indicator (default: true)
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <Footer showCareLoop={true} showPulseStatus={true} />
 * ```
 */
export const Footer: React.FC<FooterProps> = ({
  showCareLoop = true,
  showPulseStatus = true,
  className = ''
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`global-footer ${className}`} role="contentinfo">
      <div className="footer-container">
        {/* 3-Column Layout (87% of repos use this pattern) */}
        <div className="footer-grid">
          
          {/* Column 1: Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/docs">Documentation</a></li>
              </ul>
            </nav>
          </div>

          {/* Column 2: Ecosystem Links (Fractal Trinity) */}
          <div className="footer-column">
            <h3 className="footer-heading">Ecosystem</h3>
            <nav aria-label="Ecosystem navigation">
              <ul className="footer-links">
                <li>
                  <a href="https://omnigrid.faa.zone" target="_blank" rel="noopener noreferrer">
                    🌍 OmniGrid
                  </a>
                </li>
                <li>
                  <a href="https://hotstack.faa.zone" target="_blank" rel="noopener noreferrer">
                    🔥 HotStack
                  </a>
                </li>
                <li>
                  <a href="https://vaultmesh.faa.zone" target="_blank" rel="noopener noreferrer">
                    🔒 VaultMesh
                  </a>
                </li>
                <li>
                  <a href="https://buildnest.faa.zone" target="_blank" rel="noopener noreferrer">
                    🏗️ BuildNest
                  </a>
                </li>
                <li>
                  <a href="https://licensevault.faa.zone" target="_blank" rel="noopener noreferrer">
                    🏆 LicenseVault
                  </a>
                </li>
                <li>
                  <a href="https://seedwave.faa.zone" target="_blank" rel="noopener noreferrer">
                    🌱 SeedWave
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Connect & Social */}
          <div className="footer-column">
            <h3 className="footer-heading">Connect</h3>
            <nav aria-label="Social media links">
              <ul className="footer-links">
                <li>
                  <a href="https://github.com/heyns1000" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
                <li>
                  <a href="/support">Support</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Status Indicators */}
        {(showCareLoop || showPulseStatus) && (
          <div className="footer-indicators">
            {showCareLoop && (
              <div className="care-loop-indicator" title="15% of revenue allocated to Care Loop (Banimal™)">
                <span className="indicator-icon">🐾</span>
                <span className="indicator-text">Care Loop: 15% → Banimal™</span>
              </div>
            )}
            {showPulseStatus && (
              <div className="pulse-status-indicator" title="9-second pulse cycle active">
                <span className="pulse-dot"></span>
                <span className="indicator-text">Pulse Active (9s cycle)</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Bottom: Copyright & Compliance */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} Fruitful Holdings (Pty) Ltd. All rights reserved.
            </p>
            <p className="footer-treaty">
              Treaty Grid™ Compliant (OMNI-4321 §9.4.17)
            </p>
          </div>
          <div className="footer-signature">
            <p className="ubuntu-protocol">
              <em>Ubuntu Protocol: "I am because we are"</em>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
