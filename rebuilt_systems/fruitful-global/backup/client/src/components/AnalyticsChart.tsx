import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  const { data: analytics = [] } = useQuery({
    queryKey: ["/api/analytics"],
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Dynamically import Chart.js to avoid SSR issues
    import('chart.js/auto').then((Chart) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Sample data - in production this would come from analytics
      const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Deployments',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: 'hsl(207, 90%, 54%)',
            backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Active Brands',
            data: [8, 12, 18, 20, 24, 28],
            borderColor: 'hsl(122, 39%, 49%)',
            backgroundColor: 'hsla(122, 39%, 49%, 0.1)',
            tension: 0.4,
            fill: true,
          }
        ]
      };

      const config = {
        type: 'line' as const,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            tooltip: {
              mode: 'index' as const,
              intersect: false,
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Month'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Count'
              },
              beginAtZero: true,
            }
          },
          interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
          },
        },
      };

      chartRef.current = new Chart.default(ctx, config);
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [analytics]);

  return (
    <div className="h-64 w-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
}
