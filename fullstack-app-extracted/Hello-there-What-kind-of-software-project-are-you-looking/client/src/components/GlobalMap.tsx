import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function GlobalMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ["/api/brands"],
  });

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        
        // Import Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

      // Create map if it doesn't exist
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add sample deployment locations
        const deploymentLocations = [
          { lat: 40.7128, lng: -74.0060, brand: 'Fruitful Global™ HQ' },
          { lat: 37.7749, lng: -122.4194, brand: 'Seedwave™ West Coast' },
          { lat: 51.5074, lng: -0.1278, brand: 'VaultMesh™ Europe' },
          { lat: 35.6762, lng: 139.6503, brand: 'Banimal™ Asia Pacific' },
          { lat: 52.5200, lng: 13.4050, brand: 'Template Hub Berlin' },
          { lat: 1.3521, lng: 103.8198, brand: 'Analytics Center Singapore' },
        ];

        deploymentLocations.forEach(location => {
          L.marker([location.lat, location.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`<strong>${location.brand}</strong><br/>Active deployment`);
        });
        
        setMapLoaded(true);
        setIsLoading(false);
      }
      } catch (error) {
        console.error('Error loading map:', error);
        setIsLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [brands]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-80 w-full rounded-lg border border-border bg-muted"
        style={{ minHeight: '320px', display: mapLoaded ? 'block' : 'none' }}
      />
      {isLoading && (
        <div className="h-80 w-full rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading global deployment map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
