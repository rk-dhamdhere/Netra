"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface Hotspot {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  intensity: number; // 0 to 1
  radius: number; // in meters
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  pings: number;
  details: string;
}

const defaultHotspots: Hotspot[] = [];

export default function LiveHeatmap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeSector, setActiveSector] = useState<"MUMBAI" | "DELHI" | "ALL">("MUMBAI");
  const [showHeatCircles, setShowHeatCircles] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [mapTheme, setMapTheme] = useState<"ESRI_DARK" | "OSM_NIGHT">("ESRI_DARK");
  const layersRef = useRef<{ esri: any; esriLabels: any; osmNight: any }>({ esri: null, esriLabels: null, osmNight: null });

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Dynamically import Leaflet so SSR doesn't fail
      const L = await import("leaflet");

      if (!isMounted) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Clear previous map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map with dark theme
      const map = L.map(mapContainerRef.current, {
        center: [19.1136, 72.8697],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // 1. Esri World Dark Gray Canvas (Official high-res tactical basemap, ZERO watermark)
      const esriLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      });

      // 1b. Esri Dark Gray Reference (city names, district labels, roads — overlays on top of base)
      const esriLabelsLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
        attribution: "Labels &copy; Esri",
      });

      // 2. OpenStreetMap Night Mode (100% free, zero watermarks, inverted night vision filter)
      const osmNightLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        className: "osm-tactical-night-tile",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      layersRef.current = { esri: esriLayer, esriLabels: esriLabelsLayer, osmNight: osmNightLayer };
      esriLayer.addTo(map);
      esriLabelsLayer.addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Render Heat Circles and Markers
      defaultHotspots.forEach((spot) => {
        const color =
          spot.riskLevel === "CRITICAL"
            ? "#ef4444"
            : spot.riskLevel === "HIGH"
            ? "#f59e0b"
            : "#06b6d4";

        // Outer Heat Diffusion Circle
        const circle = L.circle([spot.lat, spot.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 1.5,
          radius: spot.radius,
        }).addTo(map);

        // Core Pulse Marker
        const customIcon = L.divIcon({
          className: "custom-tactical-marker",
          html: `
            <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="position: relative; width: 12px; height: 12px; border-radius: 9999px; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};"></span>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4; color: #0f172a; padding: 4px; min-width: 180px;">
            <div style="font-weight: 800; color: #0f172a; font-size: 12px; margin-bottom: 2px;">${spot.name}</div>
            <div style="color: ${color}; font-weight: 700; font-size: 10px; margin-bottom: 4px;">${spot.riskLevel} RISK · ${spot.category}</div>
            <div style="color: #475569; font-size: 10px; margin-bottom: 6px;">${spot.details}</div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 4px; display: flex; justify-content: space-between; font-size: 9px; font-family: monospace; color: #64748b;">
              <span>PINGS: ${spot.pings.toLocaleString()}</span>
              <span>${spot.lat.toFixed(4)}°N, ${spot.lng.toFixed(4)}°E</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        circle.bindPopup(popupContent);

        marker.on("click", () => {
          setSelectedHotspot(spot);
        });
      });

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Sector Changes
  const setSectorView = (sector: "MUMBAI" | "DELHI" | "ALL") => {
    setActiveSector(sector);
    if (!mapInstanceRef.current) return;

    if (sector === "MUMBAI") {
      mapInstanceRef.current.flyTo([19.1136, 72.8697], 12, { duration: 1.2 });
    } else if (sector === "DELHI") {
      mapInstanceRef.current.flyTo([28.6139, 77.2090], 11, { duration: 1.2 });
    } else {
      mapInstanceRef.current.flyTo([23.8, 75.0], 5, { duration: 1.4 });
    }
  };

  const switchTheme = (theme: "ESRI_DARK" | "OSM_NIGHT") => {
    setMapTheme(theme);
    const map = mapInstanceRef.current;
    if (!map) return;
    const { esri, esriLabels, osmNight } = layersRef.current;
    if (theme === "ESRI_DARK") {
      if (osmNight && map.hasLayer(osmNight)) map.removeLayer(osmNight);
      if (esri && !map.hasLayer(esri)) esri.addTo(map);
      if (esriLabels && !map.hasLayer(esriLabels)) esriLabels.addTo(map);
    } else {
      if (esriLabels && map.hasLayer(esriLabels)) map.removeLayer(esriLabels);
      if (esri && map.hasLayer(esri)) map.removeLayer(esri);
      if (osmNight && !map.hasLayer(osmNight)) osmNight.addTo(map);
    }
  };

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-[#0a0f1d] relative flex flex-col shadow-inner select-none">
      
      {/* Tactical Header Controls Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 flex-wrap pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/80 shadow-md flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] font-bold text-white tracking-wider">LIVE RF HEATMAP</span>
          <span className="text-[10px] text-slate-400 font-mono">| {defaultHotspots.length} SECTORS</span>
        </div>

        {/* Sector Quick Jump */}
        <div className="bg-slate-900/90 backdrop-blur-md p-0.5 rounded-md border border-slate-700/80 shadow-md flex items-center text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setSectorView("MUMBAI")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              activeSector === "MUMBAI" ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Mumbai Hub
          </button>
          <button
            type="button"
            onClick={() => setSectorView("DELHI")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              activeSector === "DELHI" ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            Delhi NCR
          </button>
          <button
            type="button"
            onClick={() => setSectorView("ALL")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              activeSector === "ALL" ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:text-white"
            }`}
          >
            All India
          </button>
        </div>

        {/* Basemap Engine Toggle */}
        <div className="bg-slate-900/90 backdrop-blur-md p-0.5 rounded-md border border-slate-700/80 shadow-md flex items-center text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => switchTheme("ESRI_DARK")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              mapTheme === "ESRI_DARK" ? "bg-slate-800 text-white font-bold border border-slate-600" : "text-slate-400 hover:text-white"
            }`}
          >
            Esri Dark Canvas
          </button>
          <button
            type="button"
            onClick={() => switchTheme("OSM_NIGHT")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              mapTheme === "OSM_NIGHT" ? "bg-slate-800 text-white font-bold border border-slate-600" : "text-slate-400 hover:text-white"
            }`}
          >
            OSM Tactical Night
          </button>
        </div>
      </div>

      {/* Selected Target HUD (Bottom Left) */}
      {selectedHotspot && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700/80 shadow-xl max-w-[280px] pointer-events-auto text-xs">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">ACTIVE HOTSPOT</span>
            <span className={`font-bold ${selectedHotspot.riskLevel === "CRITICAL" ? "text-red-400" : "text-amber-400"}`}>
              {selectedHotspot.riskLevel}
            </span>
          </div>
          <div className="font-bold text-white text-xs truncate">{selectedHotspot.name}</div>
          <div className="text-[10px] text-slate-300 mt-0.5">{selectedHotspot.details}</div>
          <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex justify-between font-mono text-[9px] text-slate-400">
            <span>PINGS: {selectedHotspot.pings.toLocaleString()}</span>
            <span>{selectedHotspot.lat.toFixed(3)}°N, {selectedHotspot.lng.toFixed(3)}°E</span>
          </div>
        </div>
      )}

      {/* Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/80 shadow-xl pointer-events-auto text-[9px] font-mono text-slate-300 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Critical Nexus</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Active Transit</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Terminal Hub</span>
        </div>
      </div>

      {/* Leaflet DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Embedded CSS for Dark Tactical OSM Filter */}
      <style jsx global>{`
        .osm-tactical-night-tile {
          filter: invert(100%) hue-rotate(180deg) brightness(92%) contrast(90%) !important;
        }
      `}</style>
    </div>
  );
}
