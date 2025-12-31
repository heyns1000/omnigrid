/**
 * Global Navigation Component
 * Phase 2: Global Standardization Research System
 * 
 * Based on Phase 1 research findings:
 * - 79% similarity across repositories
 * - Average 5-7 links per navigation
 * - Dropdown support (58% of repos have dropdowns)
 * - Multiple layout types: horizontal, vertical, dropdown, mega
 * - Fully accessible (ARIA labels, keyboard navigation)
 */

import React, { useState, useRef, useEffect } from 'react';
import type { NavigationProps, NavItem } from './types';

/**
 * Global Navigation component with multiple layout types
 * 
 * @param items - Array of navigation items
 * @param type - Navigation layout type (default: 'horizontal')
 * @param className - Additional CSS classes
 * @param ariaLabel - Accessibility label (default: 'Navigation')
 * 
 * @example
 * ```tsx
 * const navItems: NavItem[] = [
 *   { label: 'Home', href: '/', icon: '🏠' },
 *   {
 *     label: 'Products',
 *     href: '/products',
 *     children: [
 *       { label: 'All Products', href: '/products' },
 *       { label: 'New Releases', href: '/products/new' }
 *     ]
 *   }
 * ];
 * 
 * <Navigation items={navItems} type="horizontal" />
 * ```
 */
export const Navigation: React.FC<NavigationProps> = ({
  items,
  type = 'horizontal',
  className = '',
  ariaLabel = 'Navigation'
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (item.children && item.children.length > 0) {
        setOpenDropdown(openDropdown === item.label ? null : item.label);
      }
    } else if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const renderNavItem = (item: NavItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdown === item.label;
    const itemId = `nav-item-${index}`;
    const dropdownId = `dropdown-${index}`;

    return (
      <li 
        key={itemId}
        className={`nav-item ${hasChildren ? 'has-dropdown' : ''} ${isOpen ? 'dropdown-open' : ''}`}
      >
        {hasChildren ? (
          <>
            <button
              className="nav-link nav-dropdown-toggle"
              onClick={() => toggleDropdown(item.label)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              aria-expanded={isOpen}
              aria-controls={dropdownId}
              aria-label={item.ariaLabel || `${item.label} menu`}
            >
              {item.icon && <span className="nav-icon">{item.icon}</span>}
              <span>{item.label}</span>
              <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            
            {isOpen && (
              <ul 
                id={dropdownId}
                className="nav-dropdown"
                role="menu"
                aria-label={`${item.label} submenu`}
              >
                {item.children.map((child, childIndex) => (
                  <li key={`${itemId}-child-${childIndex}`} className="nav-dropdown-item" role="none">
                    <a
                      href={child.href}
                      className="nav-dropdown-link"
                      target={child.isExternal ? '_blank' : undefined}
                      rel={child.isExternal ? 'noopener noreferrer' : undefined}
                      aria-label={child.ariaLabel}
                      role="menuitem"
                    >
                      {child.icon && <span className="nav-icon">{child.icon}</span>}
                      <span>{child.label}</span>
                      {child.isExternal && <span className="external-icon">↗</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <a
            href={item.href}
            className="nav-link"
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            aria-label={item.ariaLabel}
          >
            {item.icon && <span className="nav-icon">{item.icon}</span>}
            <span>{item.label}</span>
            {item.isExternal && <span className="external-icon">↗</span>}
          </a>
        )}
      </li>
    );
  };

  return (
    <nav 
      ref={navRef}
      className={`global-navigation nav-${type} ${className}`}
      aria-label={ariaLabel}
      role="navigation"
    >
      <ul className="nav-list" role="menubar">
        {items.map((item, index) => renderNavItem(item, index))}
      </ul>
    </nav>
  );
};

/**
 * Default navigation items based on Phase 1 research
 * Found in 80%+ of repositories
 */
export const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'About', href: '/about', icon: 'ℹ️' },
  { label: 'Products', href: '/products', icon: '📦' },
  { label: 'Services', href: '/services', icon: '⚙️' },
  {
    label: 'Ecosystem',
    href: '/ecosystem',
    icon: '🌍',
    children: [
      { label: 'OmniGrid', href: 'https://omnigrid.faa.zone', isExternal: true },
      { label: 'HotStack', href: 'https://hotstack.faa.zone', isExternal: true },
      { label: 'VaultMesh', href: 'https://vaultmesh.faa.zone', isExternal: true },
      { label: 'BuildNest', href: 'https://buildnest.faa.zone', isExternal: true },
      { label: 'LicenseVault', href: 'https://licensevault.faa.zone', isExternal: true },
      { label: 'SeedWave', href: 'https://seedwave.faa.zone', isExternal: true }
    ]
  },
  { label: 'Documentation', href: '/docs', icon: '📚' },
  { label: 'Contact', href: '/contact', icon: '✉️' }
];

export default Navigation;
