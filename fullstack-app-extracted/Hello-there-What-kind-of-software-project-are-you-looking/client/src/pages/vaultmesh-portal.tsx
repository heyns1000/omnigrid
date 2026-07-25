/**
 * VaultMesh Portal — adapted from fruitful/frontend/src/pages/VaultMesh.tsx
 *
 * Displays VaultMesh™ framework overview and live pulse status from
 * /api/pulse.  Falls back gracefully when the endpoint is unavailable.
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, RefreshCw, AlertCircle } from "lucide-react";

interface PulseStatus {
  status: string;
  pulse: string;
  timestamp: string;
  metrics: {
    requestsPerSecond: number;
    activeConnections: number;
    uptime: number;
  };
}

const VAULT_PILLARS = [
  { emoji: "🔐", title: "VaultDNA™", subtitle: "Immutable Identifiers" },
  { emoji: "📜", title: "ScrollClaims™", subtitle: "Enforceable Contracts" },
  { emoji: "🔄", title: "PulseGrid™", subtitle: "Real-time Sync" },
] as const;

export default function VaultMeshPortal() {
  const { data: pulse, isLoading, isError } = useQuery<PulseStatus>({
    queryKey: ["/api/pulse"],
    refetchInterval: 30_000,
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="py-14 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Lock className="h-8 w-8" />
          <div>
            <h1 className="text-4xl font-bold">🔐 VaultMesh™</h1>
            <p className="text-purple-100 mt-1">Intelligent Data Orchestration Framework</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                VaultMesh™ is an intelligent data orchestration framework designed for
                segmentation, synchronization, and secure deployment of high-value digital
                assets — referred to as scrolls — across decentralised networks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {VAULT_PILLARS.map((p) => (
                  <div
                    key={p.title}
                    className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                  >
                    <div className="text-3xl mb-2">{p.emoji}</div>
                    <div className="font-bold text-sm">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.subtitle}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Pulse Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                Live Pulse Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                </div>
              )}

              {isError && (
                <div className="flex items-center gap-3 text-destructive py-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Pulse endpoint unavailable. Sync will resume automatically when the
                    backend is reachable.
                  </p>
                </div>
              )}

              {pulse && !isLoading && (
                <div className="space-y-1 divide-y divide-border">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-300">
                      {pulse.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Pulse Interval</span>
                    <span className="font-bold">{pulse.pulse}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Requests / Second</span>
                    <span className="font-bold">{pulse.metrics.requestsPerSecond}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Active Connections</span>
                    <span className="font-bold">{pulse.metrics.activeConnections}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(pulse.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
