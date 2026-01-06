/**
 * HotStack Quantum Nodes v4 Dashboard Integration
 * Real-time visualization of multi-chain quantum oracle data
 */

import React, { useEffect, useState } from 'react';
import type { AggregatedPulseData, PulseData } from '../../lib/oracles/multi-chain-aggregator';

export interface QuantumNodeStatus {
  chain: string;
  status: 'online' | 'offline' | 'degraded';
  lastPulse?: PulseData;
  latency: number;
}

export interface QuantumDashboardProps {
  refreshInterval?: number;
  showMetrics?: boolean;
  compactMode?: boolean;
}

/**
 * HotStack Quantum Nodes v4 Dashboard Component
 */
export const QuantumNodesDashboard: React.FC<QuantumDashboardProps> = ({
  refreshInterval = 9000, // 9 seconds
  showMetrics = true,
  compactMode = false
}) => {
  const [pulseData, setPulseData] = useState<AggregatedPulseData | null>(null);
  const [nodeStatuses, setNodeStatuses] = useState<QuantumNodeStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize connection to oracle aggregator
    const initializeConnection = async () => {
      try {
        // In production, this would connect to the actual aggregator
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to initialize quantum nodes:', error);
        setIsConnected(false);
      }
    };

    initializeConnection();

    // Set up pulse data polling
    const interval = setInterval(async () => {
      try {
        // Fetch aggregated pulse data
        // In production: const data = await aggregator.getAggregatedPulse();
        // Simulated for now
        const mockData: AggregatedPulseData = {
          timestamp: Date.now(),
          chains: {
            'ethereum-sepolia': {
              pulseId: Math.floor(Math.random() * 1000),
              timestamp: Date.now() / 1000,
              dataHash: '0x' + Math.random().toString(16).substring(2, 66),
              fidelityScore: 92,
              chain: 'ethereum-sepolia',
              isValid: true
            },
            'polygon-mumbai': {
              pulseId: Math.floor(Math.random() * 1000),
              timestamp: Date.now() / 1000,
              dataHash: '0x' + Math.random().toString(16).substring(2, 66),
              fidelityScore: 94,
              chain: 'polygon-mumbai',
              isValid: true
            },
            'solana-devnet': {
              pulseId: Math.floor(Math.random() * 1000),
              timestamp: Date.now() / 1000,
              dataHash: '0x' + Math.random().toString(16).substring(2, 66),
              fidelityScore: 93,
              chain: 'solana-devnet',
              isValid: true
            }
          },
          averageFidelity: 93,
          consensusReached: true
        };

        setPulseData(mockData);

        // Update node statuses
        const statuses: QuantumNodeStatus[] = Object.entries(mockData.chains).map(([chain, pulse]) => ({
          chain,
          status: pulse.isValid ? 'online' : 'degraded',
          lastPulse: pulse,
          latency: Math.random() * 100 + 50
        }));

        setNodeStatuses(statuses);
      } catch (error) {
        console.error('Error fetching pulse data:', error);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getChainDisplayName = (chain: string): string => {
    const names: Record<string, string> = {
      'ethereum-sepolia': 'Ethereum Sepolia',
      'polygon-mumbai': 'Polygon Mumbai',
      'solana-devnet': 'Solana Devnet'
    };
    return names[chain] || chain;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return '#00D9FF';
      case 'degraded': return '#FFB84D';
      case 'offline': return '#FF6B6B';
      default: return '#666';
    }
  };

  const getFidelityColor = (score: number): string => {
    if (score >= 90) return '#00D9FF';
    if (score >= 80) return '#4ECDC4';
    if (score >= 70) return '#FFB84D';
    return '#FF6B6B';
  };

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h3>⚠️ Quantum Nodes Offline</h3>
          <p>Unable to connect to multi-chain oracle network</p>
        </div>
      </div>
    );
  }

  return (
    <div style={compactMode ? styles.containerCompact : styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          ⚛️ HotStack Quantum Nodes v4
        </h2>
        <div style={styles.badge}>
          <span style={styles.pulseDot} />
          <span style={styles.badgeText}>9s Pulse Active</span>
        </div>
      </div>

      {showMetrics && pulseData && (
        <div style={styles.metricsRow}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Average Fidelity</div>
            <div style={{
              ...styles.metricValue,
              color: getFidelityColor(pulseData.averageFidelity)
            }}>
              {pulseData.averageFidelity.toFixed(1)}/94
            </div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Consensus</div>
            <div style={styles.metricValue}>
              {pulseData.consensusReached ? '✅' : '⏳'}
            </div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Active Chains</div>
            <div style={styles.metricValue}>
              {nodeStatuses.filter(n => n.status === 'online').length}/3
            </div>
          </div>
        </div>
      )}

      <div style={styles.nodesGrid}>
        {nodeStatuses.map((node) => (
          <div key={node.chain} style={styles.nodeCard}>
            <div style={styles.nodeHeader}>
              <span style={{
                ...styles.statusIndicator,
                backgroundColor: getStatusColor(node.status)
              }} />
              <span style={styles.nodeName}>
                {getChainDisplayName(node.chain)}
              </span>
            </div>
            
            {node.lastPulse && (
              <div style={styles.nodeDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Pulse ID:</span>
                  <span style={styles.detailValue}>#{node.lastPulse.pulseId}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Fidelity:</span>
                  <span style={{
                    ...styles.detailValue,
                    color: getFidelityColor(node.lastPulse.fidelityScore)
                  }}>
                    {node.lastPulse.fidelityScore}/94
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Latency:</span>
                  <span style={styles.detailValue}>
                    {node.latency.toFixed(0)}ms
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Hash:</span>
                  <span style={styles.detailValueMono}>
                    {node.lastPulse.dataHash.substring(0, 10)}...
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>
          Last Updated: {pulseData ? new Date(pulseData.timestamp).toLocaleTimeString() : '-'}
        </span>
        <span style={styles.footerText}>
          Chainlink Automation: ✅ Active
        </span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  containerCompact: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '16px',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '2px solid #333',
    paddingBottom: '16px'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00D9FF, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2a2a2a',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #00D9FF'
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00D9FF',
    animation: 'pulse 2s infinite'
  },
  badgeText: {
    fontSize: '14px',
    color: '#00D9FF',
    fontWeight: '500'
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  metricCard: {
    backgroundColor: '#2a2a2a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #333'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: '8px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00D9FF'
  },
  nodesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  nodeCard: {
    backgroundColor: '#2a2a2a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #333',
    transition: 'transform 0.2s, border-color 0.2s'
  },
  nodeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #333'
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0
  },
  nodeName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff'
  },
  nodeDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: '13px',
    color: '#999'
  },
  detailValue: {
    fontSize: '13px',
    color: '#fff',
    fontWeight: '500'
  },
  detailValueMono: {
    fontSize: '12px',
    color: '#00D9FF',
    fontFamily: 'monospace'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #333',
    fontSize: '12px',
    color: '#999'
  },
  footerText: {
    fontSize: '12px',
    color: '#999'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#FF6B6B'
  }
};

export default QuantumNodesDashboard;
