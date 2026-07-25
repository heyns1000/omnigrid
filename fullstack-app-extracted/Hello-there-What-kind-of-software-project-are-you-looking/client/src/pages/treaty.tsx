/**
 * Treaty System™ — adapted from fruitful/frontend/src/pages/Treaty.tsx
 *
 * Explains the Treaty System™ / TreatyCommerce™ governance model that underpins
 * the FAA.ZONE™ ecosystem.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

const TREATY_PILLARS = [
  {
    emoji: "🦍",
    title: "Gorilla Holds the Flame",
    description:
      "Symbol of strength, wisdom, and protection in our governance model.",
  },
  {
    emoji: "⚖️",
    title: "Aligned Governance",
    description: "Ensuring ethical operations and collective impact across the ecosystem.",
  },
  {
    emoji: "🤝",
    title: "TreatyCommerce™",
    description: "Commerce built on alignment, trust, and intention — not mere transaction.",
  },
  {
    emoji: "🛡️",
    title: "Trust & Transparency",
    description: "Immutable contracts and verified interactions at every layer.",
  },
] as const;

export default function TreatySystem() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="py-14 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <ScrollText className="h-8 w-8" />
          <div>
            <h1 className="text-4xl font-bold">📜 Treaty System™</h1>
            <p className="text-purple-100 mt-1">Binding Interface to Intention</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What is the Treaty System™?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Treaty System™ is the foundational layer of FAA.ZONE™ that binds interface
                to intention, ensuring unwavering alignment across all ecosystem interactions.
              </p>
              <p>
                Unlike traditional eCommerce, TreatyCommerce™ is built on principles of
                alignment, transparency, and mutual benefit — placing community and ecosystem
                health above short-term transactional gain.
              </p>
            </CardContent>
          </Card>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TREATY_PILLARS.map((pillar) => (
              <Card key={pillar.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-5xl">{pillar.emoji}</div>
                  <h3 className="text-xl font-bold">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
