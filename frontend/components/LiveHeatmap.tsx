"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Hotspot {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  radius: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  pings: number;
  details: string;
}

interface LocationItem {
  id?: string;
  name?: string;
  latitude?: number | string;
  longitude?: number | string;
  lat?: number | string;
  lng?: number | string;
}

interface ExtractedDataPayload {
  locations?: LocationItem[];
}

export default function LiveHeatmap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [mapTheme, setMapTheme] = useState<"ESRI_DARK" | "SATELLITE" | "OSM_NIGHT">("ESRI_DARK");
  
  const layersRef = useRef<{ 
    esri: TileLayer | null; 
    esriLabels: TileLayer | null; 
    satellite: TileLayer | null; 
    osmNight: TileLayer | null 
  }>({
    esri: null,
    esriLabels: null,
    satellite: null,
    osmNight: null,
  });

  const [hotspots] = useState<Hotspot[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const cached = sessionStorage.getItem("netra_extracted_data");
      if (cached) {
        const parsed = JSON.parse(cached) as ExtractedDataPayload;
        if (parsed.locations && Array.isArray(parsed.locations) && parsed.locations.length > 0) {
          return parsed.locations.map((loc: LocationItem, idx: number) => ({
            id: loc.id || `L-${idx + 1}`,
            name: loc.name || "Target Location",
            category: "AI Extracted Intelligence",
            lat: Number(loc.latitude ?? loc.lat) || 0.0,
            lng: Number(loc.longitude ?? loc.lng) || 0.0,
            radius: 400,
            riskLevel: idx === 0 ? "CRITICAL" : "HIGH",
            pings: 1250,
            details: `Dynamic geofence mapped for location: ${loc.name || "Target Location"}.`,
          }));
        }
      }
    } catch {
      // Fallback
    }

    return [];
  });

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = await import("leaflet");
      if (!isMounted) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      let centerCoord: [number, number] = [19.1860, 72.9759]; // Default city fallback (Mumbai)
      if (hotspots.length > 0) {
        const firstValidHotspot = hotspots.find(h => h.lat !== 0.0 || h.lng !== 0.0);
        if (firstValidHotspot) {
          centerCoord = [firstValidHotspot.lat, firstValidHotspot.lng];
        }
      }

      const map = L.map(mapContainerRef.current, {
        center: centerCoord,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      const esriLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 });
      const esriLabelsLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 });
      const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 });
      const osmNightLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: "osm-tactical-night-tile" });

      layersRef.current = { esri: esriLayer, esriLabels: esriLabelsLayer, satellite: satelliteLayer, osmNight: osmNightLayer };
      
      if (mapTheme === "SATELLITE") {
        satelliteLayer.addTo(map);
      } else if (mapTheme === "OSM_NIGHT") {
        osmNightLayer.addTo(map);
      } else {
        esriLayer.addTo(map);
        esriLabelsLayer.addTo(map);
      }

      L.control.zoom({ position: "topright" }).addTo(map);

      hotspots.forEach((spot) => {
        const color = spot.riskLevel === "CRITICAL" ? "#ef4444" : spot.riskLevel === "HIGH" ? "#f59e0b" : "#06b6d4";
        L.circle([spot.lat, spot.lng], { color, fillColor: color, fillOpacity: 0.3, weight: 1.5, radius: spot.radius }).addTo(map);
        
        const customIcon = L.divIcon({
          className: "custom-tactical-marker",
          html: `
            <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="position: relative; width: 12px; height: 12px; border-radius: 9999px; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};"></span>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);
        marker.on("click", () => setSelectedHotspot(spot));
      });

      mapInstanceRef.current = map;
    }

    void initMap();
    return () => { 
      isMounted = false; 
    };
  }, [hotspots, mapTheme]);

  const switchTheme = (theme: "ESRI_DARK" | "SATELLITE" | "OSM_NIGHT") => {
    setMapTheme(theme);
    const map = mapInstanceRef.current;
    if (!map) return;
    const { esri, esriLabels, satellite, osmNight } = layersRef.current;

    if (esri && map.hasLayer(esri)) map.removeLayer(esri);
    if (esriLabels && map.hasLayer(esriLabels)) map.removeLayer(esriLabels);
    if (satellite && map.hasLayer(satellite)) map.removeLayer(satellite);
    if (osmNight && map.hasLayer(osmNight)) map.removeLayer(osmNight);

    if (theme === "ESRI_DARK") {
      if (esri) esri.addTo(map);
      if (esriLabels) esriLabels.addTo(map);
    } else if (theme === "SATELLITE") {
      if (satellite) satellite.addTo(map);
    } else if (theme === "OSM_NIGHT") {
      if (osmNight) osmNight.addTo(map);
    }
  };

  return (
    <div className="w-full h-95 rounded-xl overflow-hidden border border-slate-800 bg-[#0a0f1d] relative flex flex-col shadow-inner select-none">
      <div className="absolute top-3 left-3 z-1000 flex items-center gap-2 flex-wrap pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/80 shadow-md flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] font-bold text-white tracking-wider">DYNAMIC CASE MAP</span>
          <span className="text-[10px] text-slate-400 font-mono">| {hotspots.length} LOCATIONS</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-0.5 rounded-md border border-slate-700/80 shadow-md flex items-center text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => switchTheme("ESRI_DARK")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              mapTheme === "ESRI_DARK" ? "bg-slate-800 text-white font-bold border border-slate-600" : "text-slate-400 hover:text-white"
            }`}
          >
            Dark Canvas
          </button>
          <button
            type="button"
            onClick={() => switchTheme("SATELLITE")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              mapTheme === "SATELLITE" ? "bg-slate-800 text-white font-bold border border-slate-600" : "text-slate-400 hover:text-white"
            }`}
          >
            Satellite View
          </button>
          <button
            type="button"
            onClick={() => switchTheme("OSM_NIGHT")}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              mapTheme === "OSM_NIGHT" ? "bg-slate-800 text-white font-bold border border-slate-600" : "text-slate-400 hover:text-white"
            }`}
          >
            OSM Night
          </button>
        </div>
      </div>

      {selectedHotspot && (
        <div className="absolute bottom-3 left-3 z-1000 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700/80 shadow-xl max-w-70 pointer-events-auto text-xs">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">AI EXTRACTED ENTITY</span>
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

      <div ref={mapContainerRef} className="w-full h-full z-0" />

      <style jsx global>{`
        .osm-tactical-night-tile {
          filter: invert(100%) hue-rotate(180deg) brightness(92%) contrast(90%) !important;
        }
      `}</style>
    </div>
  );
}