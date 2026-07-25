/**
 * Baobab Terminal — adapted from fruitful/frontend/src/pages/BaobabTerminal.tsx
 *
 * Security & threat-intelligence dashboard surface.  All status values are
 * wired to the /api/health endpoint for a real liveness signal; operational
 * metrics are currently static until a dedicated backend endpoint is added.
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface HealthStatus {
  status: string;
  timestamp: string;
}

export default function BaobabTerminal() {
  const { data: health, isLoading } = useQuery<HealthStatus>({
    queryKey: ["/api/health"],
    refetchInterval: 30_000,
  });

  const isOperational = !isLoading && health?.status === "healthy";

  const statusCards = [
    {
      emoji: "🛡️",
      title: "Security Status",
      label: isLoading ? "Checking…" : isOperational ? "Operational" : "Degraded",
      variant: (isOperational ? "default" : "destructive") as "default" | "destructive",
    },
    {
      emoji: "⚡",
      title: "Pulse Monitoring",
      label: "9s Interval",
      variant: "secondary" as const,
    },
    {
      emoji: "🔍",
      title: "Threat Detection",
      label: isOperational ? "Active" : "Standby",
      variant: "default" as const,
    },
  ];

  const metrics = [
    { label: "Quantum Lock Resonance", value: "99.9%" },
    { label: "Seedwave Alignment", value: "Aligned" },
    { label: "Deployment Velocity", value: "×10.5 Multiplier" },
    { label: "Dimensional Transit", value: "Operational" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="py-14 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Activity className="h-8 w-8" />
          <div>
            <h1 className="text-4xl font-bold">🌳 Baobab Terminal</h1>
            <p className="text-purple-100 mt-1">Threat Intelligence &amp; Security Orchestration</p>
          </div>
        </div>
      </section>

      {/* Status cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">{card.emoji}</div>
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <Badge variant={card.variant}>{card.label}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Orchestration Engine */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Baobab Orchestration Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                The Baobab Portal Orchestration Engine provides real-time security monitoring,
                threat intelligence, and automated response capabilities across the FAA.ZONE™
                ecosystem.
              </p>

              <div className="space-y-1 divide-y divide-border">
                {metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">{m.label}</span>
                    <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-300">
                      {m.value}
                    </Badge>
                  </div>
                ))}
              </div>

              {health && (
                <p className="text-xs text-muted-foreground mt-6">
                  Last health check: {new Date(health.timestamp).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
