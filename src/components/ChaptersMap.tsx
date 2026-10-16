"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
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
  ourPeople: string;
  kubecon: string;
  aaif: string;
  loading: string;
  soldOut: string;
}

export interface Conference {
  name: string;
  start: string;
  url: string;
  city: string;
  kind: "kubecon" | "aaif";
  lat: number | null;
  lng: number | null;
}

interface ChaptersMapProps {
  chapters: Chapter[];
  kcds: Kcd[];
  conferences: Conference[];
  countries: Map<string, Country>;
  focus: [number, number][] | null;
  /** The countries panel covers the right of the map on wide screens when open. */
  panelOpen: boolean;
  labels: MapLabels;
  formatDate: (iso: string) => string;
}

// Fits the map to the selected country's chapters.
type LiveEvent = { title: string; url: string; date: string; location?: string; soldOut?: boolean };

// Loads the chapter's upcoming events from its ocgroups.dev page when the popup opens;
// shows the events from the map feed until then (or if that request fails).
function ChapterEvents({ chapter, labels, formatDate }: { chapter: Chapter; labels: MapLabels; formatDate: (iso: string) => string }) {
  const [live, setLive] = useState<LiveEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const slug = chapter.url.split("/").pop() ?? "";

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/chapters/${slug}/events`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && d && setLive(d.events))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const events: LiveEvent[] =
    live ?? chapter.events.map((e) => ({ title: e.name, url: e.url, date: formatDate(e.start) }));

  if (!events.length) return <p className="text-xs opacity-70">{loading ? labels.loading : labels.noEvents}</p>;
  return (
    <ul className="mt-1 space-y-1.5 max-h-48 overflow-y-auto">
      {events.slice(0, 5).map((e) => (
        <li key={e.url}>
          <a href={e.url} target="_blank" rel="noopener noreferrer" className="block">
            <span className="font-medium">{e.title}</span>
            <span className="block text-xs opacity-70">
              {e.date}
              {e.location ? ` · ${e.location}` : ""}
              {e.soldOut ? ` · ${labels.soldOut}` : ""}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// null means the whole world.
function FocusBounds({ points, panelOpen }: { points: [number, number][] | null; panelOpen: boolean }) {
  const map = useMap();
  useEffect(() => {
    // On wide screens an open countries panel covers the right 340px of the map; keep the focus clear of it.
    const panel: [number, number] = panelOpen && window.innerWidth >= 1024 ? [360, 0] : [0, 0];
    if (points?.length) map.flyToBounds(latLngBounds(points).pad(0.4), { maxZoom: 7, duration: 0.8, paddingBottomRight: panel });
    else map.flyTo([20, 0], 2, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refocus on selection only, not when the panel toggles
  }, [map, points]);
  return null;
}

const PRIMARY = "hsl(199 89% 45%)";
const ACTIVE = "hsl(160 84% 39%)";
const KCD = "hsl(38 92% 50%)";
const CONFERENCE_COLOR = { kubecon: "hsl(262 83% 58%)", aaif: "hsl(330 81% 60%)" };

export default function ChaptersMap({ chapters, kcds, conferences, countries, focus, panelOpen, labels, formatDate }: ChaptersMapProps) {
  const { resolvedTheme } = useTheme();

  return (
    // OSM has no dark tiles; dark mode inverts them in globals.css. The wrapper carries the class
    // because MapContainer only reads className on mount.
    <div className={`h-full w-full ${resolvedTheme === "dark" ? "map-dark" : ""}`}>
    <MapContainer center={[18.7, -70.2]} zoom={7} minZoom={2} worldCopyJump scrollWheelZoom className="h-full w-full z-0">
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FocusBounds points={focus} panelOpen={panelOpen} />

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
                <ChapterEvents chapter={c} labels={labels} formatDate={formatDate} />
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-medium">
                  {labels.viewChapter} →
                </a>
                {c.countryCode === "do" && (
                  <a href="/team#kubestronauts" className="block mt-1 font-medium">
                    {labels.ourPeople} →
                  </a>
                )}
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
      {conferences.map((c) =>
        c.lat === null || c.lng === null ? null : (
          <CircleMarker
            key={c.url + c.start}
            center={[c.lat, c.lng]}
            radius={13}
            pathOptions={{ color: CONFERENCE_COLOR[c.kind], weight: 3, fillColor: CONFERENCE_COLOR[c.kind], fillOpacity: 0.2 }}
          >
            <Popup>
              <div className="min-w-[200px] text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: CONFERENCE_COLOR[c.kind] }}>
                  {labels[c.kind]}
                </p>
                <p className="font-semibold text-base leading-tight">{c.name}</p>
                <p className="text-xs opacity-70 mt-0.5">
                  {formatDate(c.start)} · {c.city}
                </p>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-medium">
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
