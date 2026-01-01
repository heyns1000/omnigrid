/**
 * Global Header Component
 * Phase 2: Global Standardization Research System
 * 
 * Based on Phase 1 research findings:
 * - 82% similarity across repositories
 * - Logo section (92% of repos)
 * - Main navigation (88% of repos)
 * - Optional search bar (45% of repos)
 * - Auth buttons (67% of repos)
 * - Mobile menu toggle
 */

import React, { useState } from 'react';
import type { HeaderProps } from './types';

/**
 * Global Header component with research-driven design
 * 
 * @param showSearch - Display search bar (default: false, found in 45% of repos)
 * @param showAuth - Display auth buttons (default: true, found in 67% of repos)
 * @param logoText - Custom logo text (default: "OmniGrid™")
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <Header showSearch={true} showAuth={true} logoText="My Brand" />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  showAuth = true,
  logoText = 'OmniGrid™',
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search implementation would go here
    console.log('Search query:', searchQuery);
  };

  return (
    <header className={`global-header ${className}`} role="banner">
      <div className="header-container">
        
        {/* Logo Section (found in 92% of repos) */}
        <div className="header-logo">
          <a href="/" aria-label="Home">
            <span className="logo-icon">🌍</span>
            <span className="logo-text">{logoText}</span>
          </a>
        </div>

        {/* Main Navigation (found in 88% of repos) */}
        <nav className="header-nav" aria-label="Main navigation">
          <ul className="nav-links desktop-nav">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/ecosystem">Ecosystem</a></li>
            <li><a href="/docs">Documentation</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        {/* Optional Search Bar (found in 45% of repos) */}
        {showSearch && (
          <div className="header-search">
            <form onSubmit={handleSearch} role="search">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
                className="search-input"
              />
              <button type="submit" aria-label="Submit search" className="search-button">
                🔍
              </button>
            </form>
          </div>
        )}

        {/* Auth Buttons (found in 67% of repos) */}
        {showAuth && (
          <div className="header-auth">
            <a href="/login" className="auth-button login-button">
              Log In
            </a>
            <a href="/signup" className="auth-button signup-button">
              Sign Up
            </a>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon">
            {mobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Mobile navigation">
            <ul className="mobile-nav-links">
              <li><a href="/" onClick={toggleMobileMenu}>Home</a></li>
              <li><a href="/about" onClick={toggleMobileMenu}>About</a></li>
              <li><a href="/products" onClick={toggleMobileMenu}>Products</a></li>
              <li><a href="/services" onClick={toggleMobileMenu}>Services</a></li>
              <li><a href="/ecosystem" onClick={toggleMobileMenu}>Ecosystem</a></li>
              <li><a href="/docs" onClick={toggleMobileMenu}>Documentation</a></li>
              <li><a href="/contact" onClick={toggleMobileMenu}>Contact</a></li>
              
              {showAuth && (
                <>
                  <li className="mobile-auth-divider"></li>
                  <li>
                    <a href="/login" className="mobile-auth-link" onClick={toggleMobileMenu}>
                      Log In
                    </a>
                  </li>
                  <li>
                    <a href="/signup" className="mobile-auth-link" onClick={toggleMobileMenu}>
                      Sign Up
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
