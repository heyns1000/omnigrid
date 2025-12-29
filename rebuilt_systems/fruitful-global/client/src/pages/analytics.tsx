import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Globe, Activity, Target, Zap, DollarSign, Award } from 'lucide-react';

interface BrandPerformance {
  id: string;
  brandId: string;
  deploymentCount: number;
  activeTemplates: number;
  sectorCoverage: number;
  conversionRate: number;
  revenueGenerated: number;
  userEngagement: number;
  lastUpdated: string;
}

interface SectorInsights {
  id: string;
  sectorId: string;
  totalDeployments: number;
  activeBrands: number;
  growthRate: number;
  marketPenetration: number;
  averagePerformance: number;
  competitiveIndex: number;
  lastUpdated: string;
}

interface CrossBrandAnalytics {
  id: string;
  metric: string;
  seedwaveValue: number;
  vaultmeshValue: number;
  banimalValue: number;
  fruitfulValue: number;
  totalValue: number;
  timestamp: string;
}

interface AdvancedAnalytics {
  brandPerformance: BrandPerformance[];
  sectorInsights: SectorInsights[];
  crossBrandMetrics: CrossBrandAnalytics[];
  consolidatedData: {
    totalDeployments: number;
    activeBrands: number;
    activeSectors: number;
    timestamp: string;
  };
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  icon: string;
  primaryColor: string;
}

interface Sector {
  id: string;
  name: string;
  slug: string;
  icon: string;
  ciColor: string;
}

export default function Analytics() {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');

  // Fetch brands and sectors for context
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
  });

  // Fetch advanced analytics
  const { data: advancedAnalytics, isLoading: isLoadingAdvanced } = useQuery<AdvancedAnalytics>({
    queryKey: ['/api/analytics/advanced'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Create brand lookup for display names
  const brandLookup = brands.reduce((acc, brand) => {
    acc[brand.id] = brand;
    return acc;
  }, {} as Record<string, Brand>);

  const sectorLookup = sectors.reduce((acc, sector) => {
    acc[sector.id] = sector;
    return acc;
  }, {} as Record<string, Sector>);

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value / 100).toFixed(1)}%`;
  };

  if (isLoadingAdvanced) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Advanced Analytics Consolidation</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Comprehensive analytics across all brand deployments with real-time insights, 
          performance metrics, and cross-brand intelligence for Seedwave™, VaultMesh™, Banimal™, and Fruitful Global™.
        </p>
      </div>

      {/* Overview Cards */}
      {advancedAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advancedAnalytics.consolidatedData.totalDeployments}</div>
              <p className="text-xs text-muted-foreground">
                Across {advancedAnalytics.consolidatedData.activeSectors} sectors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advancedAnalytics.consolidatedData.activeBrands}</div>
              <p className="text-xs text-muted-foreground">
                Multi-brand orchestration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  advancedAnalytics.brandPerformance
                    .filter(bp => bp !== null)
                    .reduce((sum, bp) => sum + (bp?.revenueGenerated || 0), 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Combined brand revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const validPerformance = advancedAnalytics.brandPerformance.filter(bp => bp !== null);
                  if (validPerformance.length === 0) return "0.0%";
                  return formatPercentage(
                    validPerformance.reduce((sum, bp) => sum + (bp?.conversionRate || 0), 0) / 
                    validPerformance.length
                  );
                })()}
              </div>
              <p className="text-xs text-muted-foreground">
                Cross-brand average
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="brand-performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brand-performance">Brand Performance</TabsTrigger>
          <TabsTrigger value="sector-insights">Sector Insights</TabsTrigger>
          <TabsTrigger value="cross-brand">Cross-Brand</TabsTrigger>
          <TabsTrigger value="consolidated">Consolidated</TabsTrigger>
        </TabsList>

        {/* Brand Performance Tab */}
        <TabsContent value="brand-performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {advancedAnalytics?.brandPerformance
              .filter(performance => performance !== null)
              .map((performance) => {
                const brand = brandLookup[performance.brandId];
                if (!brand || !performance) return null;

              return (
                <Card key={performance.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{brand.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{brand.name}</CardTitle>
                        <CardDescription>Performance Metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">Deployments</span>
                        </div>
                        <div className="text-2xl font-bold">{performance.deploymentCount}</div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">Templates</span>
                        </div>
                        <div className="text-2xl font-bold">{performance.activeTemplates}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Conversion Rate</span>
                          <span>{formatPercentage(performance.conversionRate)}</span>
                        </div>
                        <Progress value={performance.conversionRate / 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>User Engagement</span>
                          <span>{(performance.userEngagement / 100).toFixed(0)}/100</span>
                        </div>
                        <Progress value={performance.userEngagement / 100} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue Generated</span>
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(performance.revenueGenerated)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Sector Coverage</span>
                        <Badge variant="secondary">{performance.sectorCoverage} sectors</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Sector Insights Tab */}
        <TabsContent value="sector-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {advancedAnalytics?.sectorInsights
              .filter(insights => insights !== null)
              .slice(0, 12)
              .map((insights) => {
                const sector = sectorLookup[insights.sectorId];
                if (!sector || !insights) return null;

              return (
                <Card key={insights.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{sector.icon}</span>
                      <div>
                        <CardTitle className="text-base">{sector.name}</CardTitle>
                        <CardDescription>Sector Performance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Deployments</span>
                        <div className="text-lg font-semibold">{insights.totalDeployments}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Brands</span>
                        <div className="text-lg font-semibold">{insights.activeBrands}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Growth Rate</span>
                        <span className="text-green-600">+{formatPercentage(insights.growthRate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Penetration</span>
                        <span>{formatPercentage(insights.marketPenetration)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Performance Score</span>
                        <span>{(insights.averagePerformance / 100).toFixed(0)}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Competitive Index</span>
                        <span>{(insights.competitiveIndex / 100).toFixed(0)}/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Cross-Brand Analytics Tab */}
        <TabsContent value="cross-brand" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {advancedAnalytics?.crossBrandMetrics
              .filter(metric => metric !== null)
              .map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="capitalize">{metric.metric.replace('_', ' ')}</span>
                  </CardTitle>
                  <CardDescription>Cross-brand comparison</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🌱</span>
                        <span>Seedwave™</span>
                      </div>
                      <span className="font-semibold">{metric.seedwaveValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🔒</span>
                        <span>VaultMesh™</span>
                      </div>
                      <span className="font-semibold">{metric.vaultmeshValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🎯</span>
                        <span>Banimal™</span>
                      </div>
                      <span className="font-semibold">{metric.banimalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🌐</span>
                        <span>Fruitful Global™</span>
                      </div>
                      <span className="font-semibold">{metric.fruitfulValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        {metric.totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Consolidated Tab */}
        <TabsContent value="consolidated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-6 w-6" />
                <span>Global Analytics Overview</span>
              </CardTitle>
              <CardDescription>
                Real-time consolidated analytics across all brands and sectors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {advancedAnalytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      {advancedAnalytics.consolidatedData.totalDeployments}
                    </div>
                    <div className="text-sm text-gray-600">Total Deployments</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                      {advancedAnalytics.consolidatedData.activeBrands}
                    </div>
                    <div className="text-sm text-gray-600">Active Brands</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-purple-600">
                      {advancedAnalytics.consolidatedData.activeSectors}
                    </div>
                    <div className="text-sm text-gray-600">Active Sectors</div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Top Performing Brand</h4>
                    {(() => {
                      const validPerformance = advancedAnalytics?.brandPerformance.filter(bp => bp !== null) || [];
                      const topBrand = validPerformance.length > 0 ? validPerformance[0] : null;
                      return topBrand ? (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <span className="text-xl">
                            {brandLookup[topBrand.brandId]?.icon}
                          </span>
                          <div>
                            <div className="font-semibold">
                              {brandLookup[topBrand.brandId]?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatCurrency(topBrand.revenueGenerated)} revenue
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No performance data available</div>
                      );
                    })()}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Fastest Growing Sector</h4>
                    {(() => {
                      const validInsights = advancedAnalytics?.sectorInsights.filter(si => si !== null) || [];
                      const topSector = validInsights.length > 0 ? validInsights[0] : null;
                      return topSector ? (
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-xl">
                            {sectorLookup[topSector.sectorId]?.icon}
                          </span>
                          <div>
                            <div className="font-semibold">
                              {sectorLookup[topSector.sectorId]?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              +{formatPercentage(topSector.growthRate)} growth
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No sector data available</div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-right">
                Last updated: {advancedAnalytics?.consolidatedData.timestamp && 
                  new Date(advancedAnalytics.consolidatedData.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}