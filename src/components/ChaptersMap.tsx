"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { latLngBounds } from "leaflet";
import { useTheme } from "next-themes";
import { flag, ambassadorsUrl, kubestronautsUrl, type Chapter, type Country, type Kcd } from "@/lib/chapters";

export interface MapLabels {
  kubestronauts: string;
  ambassadors: string;
  upcoming: string;
  noEvents: string;
  viewChapter: string;
  kcd: string;
}

interface ChaptersMapProps {
  chapters: Chapter[];
  kcds: Kcd[];
  countries: Map<string, Country>;
  focus: [number, number][] | null;
  labels: MapLabels;
  formatDate: (iso: string) => string;
}

// Fits the map to the selected country's chapters.
function FocusBounds({ points }: { points: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    map.flyToBounds(latLngBounds(points).pad(0.4), { maxZoom: 7, duration: 0.8 });
  }, [map, points]);
  return null;
}

const PRIMARY = "hsl(199 89% 45%)";
const ACTIVE = "hsl(160 84% 39%)";
const KCD = "hsl(38 92% 50%)";

export default function ChaptersMap({ chapters, kcds, countries, focus, labels, formatDate }: ChaptersMapProps) {
  const { resolvedTheme } = useTheme();

  return (
    // OSM has no dark tiles; dark mode inverts them in globals.css. The wrapper carries the class
    // because MapContainer only reads className on mount.
    <div className={`h-full w-full ${resolvedTheme === "dark" ? "map-dark" : ""}`}>
    <MapContainer center={[20, 0]} zoom={2} minZoom={2} worldCopyJump scrollWheelZoom className="h-full w-full z-0">
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FocusBounds points={focus} />

      {chapters.map((c) =>
        c.lat === null || c.lng === null ? null : (
          <CircleMarker
            key={c.url}
            center={[c.lat, c.lng]}
            radius={c.events.length ? 8 : 5}
            pathOptions={{ color: "white", weight: 1.5, fillColor: c.events.length ? ACTIVE : PRIMARY, fillOpacity: 0.9 }}
          >
            <Popup>
              <div className="min-w-[220px] text-sm">
                <p className="font-semibold text-base leading-tight">
                  {flag(c.countryCode)} {c.name}
                </p>
                <p className="text-xs opacity-70 mt-0.5">{[c.location, c.region].filter(Boolean).join(" · ")}</p>
                {c.countryCode && countries.has(c.countryCode) && (
                  <p className="mt-2 text-xs flex gap-3">
                    <a href={kubestronautsUrl(c.countryCode)} target="_blank" rel="noopener noreferrer">
                      <strong>{countries.get(c.countryCode)!.kubestronauts}</strong> {labels.kubestronauts}
                    </a>
                    <a href={ambassadorsUrl(c.countryCode)} target="_blank" rel="noopener noreferrer">
                      <strong>{countries.get(c.countryCode)!.ambassadors}</strong> {labels.ambassadors}
                    </a>
                  </p>
                )}
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide opacity-70">{labels.upcoming}</p>
                {c.events.length ? (
                  <ul className="mt-1 space-y-1">
                    {c.events.slice(0, 3).map((e) => (
                      <li key={e.url}>
                        <a href={e.url} target="_blank" rel="noopener noreferrer">
                          {formatDate(e.start)} · {e.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs opacity-70">{labels.noEvents}</p>
                )}
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-medium">
                  {labels.viewChapter} →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        )
      )}

      {kcds.map((k) =>
        k.lat === null || k.lng === null ? null : (
          <CircleMarker
            key={k.url}
            center={[k.lat, k.lng]}
            radius={10}
            pathOptions={{ color: KCD, weight: 3, fillColor: KCD, fillOpacity: 0.25 }}
          >
            <Popup>
              <div className="min-w-[200px] text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: KCD }}>{labels.kcd}</p>
                <p className="font-semibold text-base leading-tight">
                  {flag(k.countryCode)} {k.name}
                </p>
                <p className="text-xs opacity-70 mt-0.5">
                  {formatDate(k.start)} · {k.city}
                </p>
                <a href={k.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-medium">
                  {labels.viewChapter} →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        )
      )}
    </MapContainer>
    </div>
  );
}
