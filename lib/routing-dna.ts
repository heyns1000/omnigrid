/**
 * Routing DNA - Single Source of Truth for All Routes
 * Phase 2: Global Standardization Research System
 * 
 * Consolidated routing configuration for 94 repositories across the ecosystem
 * Integrates with:
 * - Fractal Trinity (HotStack/LicenseVault/BuildNest)
 * - 40D Hypercube (D0-D39)
 * - Treaty Grid™ (OMNI-4321 §9.4.17)
 */

import type { Route } from '../components/global/types';

/**
 * Core Routes - 12 Primary Systems
 * These are the foundational platforms of the ecosystem
 */
export const coreRoutes: Route[] = [
  {
    path: '/',
    title: 'OmniGrid Hub',
    description: 'Central orchestration platform for the entire ecosystem',
    ecosystem: 'omnigrid',
    dimension: 'D0',
    treaty: 'OMNI-4321'
  },
  {
    path: '/hotstack',
    title: 'HotStack',
    description: 'Rapid deployment platform - 180s deployment guarantee',
    ecosystem: 'hotstack',
    dimension: 'D1',
    treaty: 'OMNI-4321'
  },
  {
    path: '/licensevault',
    title: 'LicenseVault',
    description: 'Brand and license management - 13,713+ brands',
    ecosystem: 'licensevault',
    dimension: 'D2',
    treaty: 'OMNI-4321'
  },
  {
    path: '/buildnest',
    title: 'BuildNest',
    description: 'Automated build and CI/CD orchestration',
    ecosystem: 'buildnest',
    dimension: 'D3',
    treaty: 'OMNI-4321'
  },
  {
    path: '/vaultmesh',
    title: 'VaultMesh',
    description: 'Secure data mesh with 9s pulse synchronization',
    ecosystem: 'vaultmesh',
    dimension: 'D4',
    treaty: 'OMNI-4321'
  },
  {
    path: '/seedwave',
    title: 'SeedWave',
    description: 'Data seeding and analytics platform',
    ecosystem: 'seedwave',
    dimension: 'D5',
    treaty: 'OMNI-4321'
  },
  {
    path: '/banimal',
    title: 'Banimal™',
    description: 'Care Loop recipient - 15% revenue allocation',
    dimension: 'D6',
    treaty: 'OMNI-4321'
  },
  {
    path: '/codenest',
    title: 'CodeNest',
    description: 'Code repository management and analysis',
    dimension: 'D7',
    treaty: 'OMNI-4321'
  },
  {
    path: '/nexus',
    title: 'Nexus AI',
    description: 'AI orchestration and intelligence platform',
    dimension: 'D8',
    treaty: 'OMNI-4321'
  },
  {
    path: '/faa',
    title: 'FAA Zone',
    description: 'Fruitful Application Architecture management',
    dimension: 'D9',
    treaty: 'OMNI-4321'
  },
  {
    path: '/toynest',
    title: 'ToyNest',
    description: 'Three.js visualization and interactive platform',
    dimension: 'D10',
    treaty: 'OMNI-4321'
  },
  {
    path: '/bushportal',
    title: 'BushPortal',
    description: 'Community signup and onboarding portal',
    dimension: 'D11',
    treaty: 'OMNI-4321'
  }
];

/**
 * Sector Routes - 32 Sector Hubs
 * Industry-specific platforms and verticals
 */
export const sectorRoutes: Route[] = [
  { path: '/sectors/agriculture', title: 'Agriculture Hub', dimension: 'D12', treaty: 'SECT-AG-001' },
  { path: '/sectors/automotive', title: 'Automotive Hub', dimension: 'D12', treaty: 'SECT-AUTO-001' },
  { path: '/sectors/banking', title: 'Banking & Finance Hub', dimension: 'D13', treaty: 'SECT-FIN-001' },
  { path: '/sectors/construction', title: 'Construction Hub', dimension: 'D14', treaty: 'SECT-CON-001' },
  { path: '/sectors/creative', title: 'Creative Industries Hub', dimension: 'D15', treaty: 'SECT-CRE-001' },
  { path: '/sectors/education', title: 'Education Hub', dimension: 'D16', treaty: 'SECT-EDU-001' },
  { path: '/sectors/energy', title: 'Energy & Utilities Hub', dimension: 'D17', treaty: 'SECT-ENE-001' },
  { path: '/sectors/entertainment', title: 'Entertainment Hub', dimension: 'D18', treaty: 'SECT-ENT-001' },
  { path: '/sectors/fashion', title: 'Fashion & Apparel Hub', dimension: 'D19', treaty: 'SECT-FAS-001' },
  { path: '/sectors/food', title: 'Food & Beverage Hub', dimension: 'D19', treaty: 'SECT-FOO-001' },
  { path: '/sectors/government', title: 'Government Services Hub', dimension: 'D20', treaty: 'SECT-GOV-001' },
  { path: '/sectors/healthcare', title: 'Healthcare Hub', dimension: 'D21', treaty: 'SECT-HEA-001' },
  { path: '/sectors/hospitality', title: 'Hospitality & Tourism Hub', dimension: 'D22', treaty: 'SECT-HOS-001' },
  { path: '/sectors/insurance', title: 'Insurance Hub', dimension: 'D23', treaty: 'SECT-INS-001' },
  { path: '/sectors/legal', title: 'Legal Services Hub', dimension: 'D24', treaty: 'SECT-LEG-001' },
  { path: '/sectors/logistics', title: 'Logistics & Supply Chain Hub', dimension: 'D25', treaty: 'SECT-LOG-001' },
  { path: '/sectors/manufacturing', title: 'Manufacturing Hub', dimension: 'D26', treaty: 'SECT-MAN-001' },
  { path: '/sectors/media', title: 'Media & Publishing Hub', dimension: 'D27', treaty: 'SECT-MED-001' },
  { path: '/sectors/mining', title: 'Mining & Resources Hub', dimension: 'D28', treaty: 'SECT-MIN-001' },
  { path: '/sectors/nonprofit', title: 'Non-Profit Hub', dimension: 'D28', treaty: 'SECT-NPO-001' },
  { path: '/sectors/pharmaceutical', title: 'Pharmaceutical Hub', dimension: 'D29', treaty: 'SECT-PHA-001' },
  { path: '/sectors/real-estate', title: 'Real Estate Hub', dimension: 'D30', treaty: 'SECT-REA-001' },
  { path: '/sectors/retail', title: 'Retail Hub', dimension: 'D31', treaty: 'SECT-RET-001' },
  { path: '/sectors/security', title: 'Security Services Hub', dimension: 'D32', treaty: 'SECT-SEC-001' },
  { path: '/sectors/sports', title: 'Sports & Recreation Hub', dimension: 'D33', treaty: 'SECT-SPO-001' },
  { path: '/sectors/technology', title: 'Technology Hub', dimension: 'D34', treaty: 'SECT-TEC-001' },
  { path: '/sectors/telecommunications', title: 'Telecommunications Hub', dimension: 'D35', treaty: 'SECT-TEL-001' },
  { path: '/sectors/transportation', title: 'Transportation Hub', dimension: 'D36', treaty: 'SECT-TRA-001' },
  { path: '/sectors/waste', title: 'Waste Management Hub', dimension: 'D37', treaty: 'SECT-WAS-001' },
  { path: '/sectors/water', title: 'Water Services Hub', dimension: 'D38', treaty: 'SECT-WAT-001' },
  { path: '/sectors/wholesale', title: 'Wholesale & Distribution Hub', dimension: 'D38', treaty: 'SECT-WHO-001' },
  { path: '/sectors/other', title: 'Other Sectors Hub', dimension: 'D39', treaty: 'SECT-OTH-001' }
];

/**
 * Common Routes - Found in 80%+ of Repositories
 * Standard pages present across most platforms
 */
export const commonRoutes: Route[] = [
  { path: '/about', title: 'About Us', description: 'Learn about our mission and values' },
  { path: '/contact', title: 'Contact', description: 'Get in touch with our team' },
  { path: '/privacy', title: 'Privacy Policy', description: 'Our privacy and data protection policy' },
  { path: '/terms', title: 'Terms of Service', description: 'Terms and conditions of use' },
  { path: '/products', title: 'Products', description: 'Browse our product catalog' },
  { path: '/services', title: 'Services', description: 'Explore our services' },
  { path: '/docs', title: 'Documentation', description: 'Technical documentation and guides' },
  { path: '/support', title: 'Support', description: 'Get help and customer support' },
  { path: '/pricing', title: 'Pricing', description: 'View pricing and plans' },
  { path: '/blog', title: 'Blog', description: 'Latest news and updates' },
  { path: '/careers', title: 'Careers', description: 'Join our team' },
  { path: '/partners', title: 'Partners', description: 'Our partner ecosystem' },
  { path: '/ecosystem', title: 'Ecosystem', description: 'Explore the complete ecosystem' }
];

/**
 * Authentication Routes
 * User authentication and account management
 */
export const authRoutes: Route[] = [
  { path: '/login', title: 'Log In', auth: false },
  { path: '/signup', title: 'Sign Up', auth: false },
  { path: '/logout', title: 'Log Out', auth: true },
  { path: '/profile', title: 'Profile', auth: true, description: 'Manage your profile' },
  { path: '/settings', title: 'Settings', auth: true, description: 'Account settings' },
  { path: '/password/reset', title: 'Reset Password', auth: false },
  { path: '/password/change', title: 'Change Password', auth: true },
  { path: '/verify-email', title: 'Verify Email', auth: false }
];

/**
 * API Routes
 * Backend API endpoints
 */
export const apiRoutes: Route[] = [
  { path: '/api/health', title: 'Health Check', description: 'System health status' },
  { path: '/api/status', title: 'System Status', description: 'Detailed system status' },
  { path: '/api/pulse', title: 'Pulse Status', description: '9s pulse cycle status' },
  { path: '/api/brands', title: 'Brands API', description: 'Brand registry API' },
  { path: '/api/deploy', title: 'Deployment API', description: 'Deployment endpoints' },
  { path: '/api/auth', title: 'Authentication API', description: 'Auth endpoints' },
  { path: '/api/webhooks', title: 'Webhooks', description: 'Webhook endpoints' }
];

/**
 * All Routes Combined
 * Complete route registry for the entire ecosystem
 */
export const allRoutes: Route[] = [
  ...coreRoutes,
  ...sectorRoutes,
  ...commonRoutes,
  ...authRoutes,
  ...apiRoutes
];

/**
 * Helper Functions
 */

/**
 * Get route by exact path match
 * @param path - The route path to search for
 * @returns Route object or undefined
 */
export function getRouteByPath(path: string): Route | undefined {
  return allRoutes.find(route => route.path === path);
}

/**
 * Get all routes for a specific ecosystem
 * @param ecosystem - Ecosystem identifier
 * @returns Array of routes in that ecosystem
 */
export function getRoutesByEcosystem(
  ecosystem: 'hotstack' | 'licensevault' | 'buildnest' | 'omnigrid' | 'vaultmesh' | 'seedwave'
): Route[] {
  return allRoutes.filter(route => route.ecosystem === ecosystem);
}

/**
 * Get all routes for a specific dimension (40D Hypercube)
 * @param dimension - Dimension identifier (D0-D39)
 * @returns Array of routes in that dimension
 */
export function getRoutesByDimension(dimension: string): Route[] {
  return allRoutes.filter(route => route.dimension === dimension);
}

/**
 * Get all routes that require authentication
 * @returns Array of protected routes
 */
export function getProtectedRoutes(): Route[] {
  return allRoutes.filter(route => route.auth === true);
}

/**
 * Get all public routes (no authentication required)
 * @returns Array of public routes
 */
export function getPublicRoutes(): Route[] {
  return allRoutes.filter(route => route.auth !== true);
}

/**
 * Check if a path requires authentication
 * @param path - The route path to check
 * @returns Boolean indicating if auth is required
 */
export function requiresAuth(path: string): boolean {
  const route = getRouteByPath(path);
  return route?.auth === true;
}

/**
 * Get routes by treaty classification
 * @param treaty - Treaty Grid™ classification
 * @returns Array of routes with that treaty classification
 */
export function getRoutesByTreaty(treaty: string): Route[] {
  return allRoutes.filter(route => route.treaty === treaty);
}

/**
 * Route Statistics
 */
export const routeStats = {
  total: allRoutes.length,
  core: coreRoutes.length,
  sectors: sectorRoutes.length,
  common: commonRoutes.length,
  auth: authRoutes.length,
  api: apiRoutes.length,
  protected: getProtectedRoutes().length,
  public: getPublicRoutes().length
};

export default {
  coreRoutes,
  sectorRoutes,
  commonRoutes,
  authRoutes,
  apiRoutes,
  allRoutes,
  getRouteByPath,
  getRoutesByEcosystem,
  getRoutesByDimension,
  getProtectedRoutes,
  getPublicRoutes,
  requiresAuth,
  getRoutesByTreaty,
  routeStats
};
