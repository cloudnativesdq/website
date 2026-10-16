"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsGrid, { type GridEvent } from "@/components/EventsGrid";
import { useLanguage } from "@/hooks/use-language";
import { flag, type MapData } from "@/lib/chapters";
import type { LfEvents } from "@/lib/cncf-resources";
import Link from "next/link";
import { ArrowRight, Globe2, Search, X } from "lucide-react";

// Leaflet touches `window`, so the map only renders in the browser.
const ChaptersMap = dynamic(() => import("@/components/ChaptersMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});


export default function MapView({ data, lfEvents }: { data: MapData; lfEvents: LfEvents }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("do"); // open on the Dominican Republic
  const [panelOpen, setPanelOpen] = useState(false); // countries panel, closed by default

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
    [language]
  );
  const formatDate = (iso: string) => fmt.format(new Date(iso));

  // KubeCon and AAIF events have only a city; pin them on a chapter in that city when there is one.
  const conferences = useMemo(() => {
    const pin = (city: string) => data.chapters.find((c) => c.lat !== null && city && c.location.toLowerCase().startsWith(city.toLowerCase()));
    return [
      ...lfEvents.kubecons.map((e) => ({ ...e, kind: "kubecon" as const })),
      ...lfEvents.aaif.map((e) => ({ ...e, kind: "aaif" as const })),
    ].map((e) => {
      const near = pin(e.city);
      return { name: e.title, start: e.start, url: e.url, city: e.city, kind: e.kind, lat: near?.lat ?? null, lng: near?.lng ?? null };
    });
  }, [data.chapters, lfEvents]);

  // Every upcoming event on the page, as cards grouped by organizer.
  const gridEvents = useMemo<GridEvent[]>(() => {
    // KubeCon/AAIF only give a city; borrow the country of a chapter in that city.
    const cityCountry = (city: string) =>
      (city && data.chapters.find((c) => c.countryCode && c.location.toLowerCase().startsWith(city.toLowerCase()))?.countryCode) || null;
    return [
      ...data.chapters.flatMap((c) =>
        c.events.map((e) => ({
          title: e.name,
          start: e.start,
          url: e.url,
          image: e.image ?? null,
          kind: "chapter" as const,
          place: c.location,
          countryCode: c.countryCode,
          organizer: c.name,
          region: c.region,
        }))
      ),
      ...data.kcds.map((e) => ({ title: e.name, start: e.start, url: e.url, image: null, kind: "kcd" as const, place: e.city, countryCode: e.countryCode })),
      ...data.cloudNativeDays.map((e) => ({
        title: e.name,
        start: e.start,
        url: e.url,
        image: e.image ?? null,
        kind: "cnd" as const,
        place: "",
        countryCode: e.countryCode,
      })),
      ...lfEvents.kubecons.map((e) => ({ title: e.title, start: e.start, url: e.url, image: e.image ?? null, kind: "kubecon" as const, place: e.city, countryCode: cityCountry(e.city) })),
      ...lfEvents.aaif.map((e) => ({ title: e.title, start: e.start, url: e.url, image: e.image ?? null, kind: "aaif" as const, place: e.city, countryCode: cityCountry(e.city) })),
    ];
  }, [data, lfEvents]);

  const countryNames = useMemo(() => new Map(data.countries.map((c) => [c.code, c.name])), [data.countries]);

  const countryByCode = useMemo(() => new Map(data.countries.map((c) => [c.code, c])), [data.countries]);

  // One row per country that has chapters or Kubestronauts.
  const countries = useMemo(() => {
    const rows = new Map<string, { code: string; name: string; chapters: number; kubestronauts: number; ambassadors: number }>();
    for (const c of data.countries) rows.set(c.code, { ...c, chapters: 0 });
    for (const ch of data.chapters) {
      if (!ch.countryCode) continue;
      const row = rows.get(ch.countryCode) ?? { code: ch.countryCode, name: ch.countryCode.toUpperCase(), chapters: 0, kubestronauts: 0, ambassadors: 0 };
      row.chapters++;
      rows.set(ch.countryCode, row);
    }
    return Array.from(rows.values()).sort((a, b) => b.kubestronauts - a.kubestronauts || b.chapters - a.chapters);
  }, [data]);

  const visibleCountries = countries.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  const focus = useMemo(() => {
    if (!selected) return null;
    const pts = data.chapters
      .filter((c) => c.countryCode === selected && c.lat !== null && c.lng !== null)
      .map((c) => [c.lat, c.lng] as [number, number]);
    return pts.length ? pts : null;
  }, [selected, data.chapters]);

  const totalKubestronauts = data.countries.reduce((n, c) => n + c.kubestronauts, 0);
  const totalAmbassadors = data.countries.reduce((n, c) => n + c.ambassadors, 0);
  const upcomingCount = data.chapters.reduce((n, c) => n + c.events.length, 0) + data.kcds.length + data.cloudNativeDays.length + lfEvents.kubecons.length + lfEvents.aaif.length;
  const countryCount = new Set(data.chapters.map((c) => c.countryCode).filter(Boolean)).size;

  const stats = [
    { value: data.chapters.length, label: t.mapChapters },
    { value: countryCount, label: t.mapCountries },
    { value: totalKubestronauts, label: t.mapKubestronauts },
    { value: totalAmbassadors, label: t.mapAmbassadors },
    { value: upcomingCount, label: t.mapUpcoming.toLowerCase() },
  ];


  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-20 md:pt-24 pb-16">
        <div className="container px-4 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-3">{t.mapTitle}</h1>
            {/* Key numbers as one readable line instead of a block of big figures. */}
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-base md:text-lg">
              {stats.map((s) => (
                <span key={s.label} className="whitespace-nowrap">
                  <strong className="font-semibold text-foreground tabular-nums">{s.value.toLocaleString(language === "es" ? "es-DO" : "en-US")}</strong> {s.label}
                </span>
              ))}
            </p>
            <Link href="/start-a-chapter" className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline">
              {t.chapterGuide.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </header>

          {/* World events first, then the map. */}
          <EventsGrid events={gridEvents} countryNames={countryNames} />

          {/* Full-width map; the countries list floats over it behind a toggle, closed by default. */}
          <h2 id="map-title" className="text-2xl md:text-3xl font-heading font-bold mt-12 mb-4">{t.mapSectionTitle}</h2>
          <div className="relative isolate h-[calc(100svh-12.5rem)] md:h-[calc(100svh-10rem)] min-h-[380px] max-h-[780px] rounded-3xl overflow-hidden border border-foreground/10">
            <div className="absolute inset-0" data-testid="chapters-map">
                <ChaptersMap
                  chapters={data.chapters}
                  kcds={data.kcds}
                  conferences={conferences}
                  countries={countryByCode}
                  panelOpen={panelOpen}
                  focus={focus}
                  formatDate={formatDate}
                  labels={{
                    kubestronauts: t.mapKubestronauts,
                    ambassadors: t.mapAmbassadors,
                    upcoming: t.mapUpcoming,
                    noEvents: t.mapNoEvents,
                    viewChapter: t.mapViewChapter,
                    kcd: t.mapKcd,
                    ourPeople: t.mapOurPeople,
                    kubecon: "KubeCon",
                    aaif: "AAIF",
                    loading: t.mapLoadingEvents,
                    soldOut: t.mapSoldOut,
                  }}
                />
            </div>

            <button
              onClick={() => setPanelOpen((o) => !o)}
              aria-expanded={panelOpen}
              aria-controls="countries-panel"
              className="absolute top-3 right-3 z-[1001] inline-flex items-center gap-2 h-10 px-4 rounded-full bg-background/95 backdrop-blur border border-foreground/10 shadow text-sm font-semibold"
            >
              {panelOpen ? <X className="w-4 h-4" /> : <Globe2 className="w-4 h-4 text-primary" />}
              {t.mapCountriesTitle}
            </button>

            {/* Countries */}
            <div
              id="countries-panel"
              className={`${panelOpen ? "flex" : "hidden"} flex-col absolute z-[1000] top-16 left-3 right-3 bottom-3 lg:left-auto lg:w-[340px] p-4 rounded-2xl bg-background/95 backdrop-blur border border-foreground/10 shadow-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 font-heading font-bold text-lg">
                  <Globe2 className="w-5 h-5 text-primary" />
                  {t.mapCountriesTitle}
                </h2>
                {selected && (
                  <button onClick={() => setSelected(null)} className="text-xs text-primary hover:underline">
                    {t.mapAllCountries}
                  </button>
                )}
              </div>
              <label className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.mapSearchCountry}
                  aria-label={t.mapSearchCountry}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-background border border-foreground/10 text-sm focus:outline-none focus:border-primary/60"
                />
              </label>
              <div className="flex gap-2 text-[11px] uppercase tracking-wider text-muted-foreground px-2 pb-1">
                <span className="flex-1" />
                <span className="w-10 text-right tracking-normal" title={t.mapChapters}>{t.mapChaptersShort}</span>
                <span className="w-16 text-right tracking-normal" title={t.mapKubestronauts}>Kubestr.</span>
                <span className="w-10 text-right tracking-normal" title={t.mapAmbassadors}>Amb.</span>
              </div>
              <ul className="flex-1 min-h-0 overflow-y-auto -mx-1" data-testid="country-list">
                {visibleCountries.map((c) => (
                  <li key={c.code}>
                    <button
                      onClick={() => {
                        setSelected(c.code);
                        setPanelOpen(false);
                      }}
                      disabled={!c.chapters}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors disabled:opacity-60 disabled:cursor-default enabled:hover:bg-foreground/5 ${selected === c.code ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <span className="flex-1 min-w-0 truncate">{flag(c.code)} {c.name}</span>
                      <span className="w-10 text-right tabular-nums">{c.chapters || "–"}</span>
                      <span className="w-16 text-right tabular-nums font-semibold">{c.kubestronauts || "–"}</span>
                      <span className="w-10 text-right tabular-nums">{c.ambassadors || "–"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legend, inside the map so it is read together with the markers */}
            <div className="absolute left-3 bottom-3 z-[1000] flex flex-wrap gap-x-3 gap-y-1 max-w-[calc(100%-1.5rem)] sm:max-w-md px-3 py-2 rounded-xl bg-background/90 backdrop-blur border border-foreground/10 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[hsl(199_89%_45%)]" />{t.mapLegendChapter}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[hsl(160_84%_39%)]" />{t.mapLegendActive}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-[hsl(38_92%_50%)]" />{t.mapKcd}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-[hsl(262_83%_58%)]" />KubeCon</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-[hsl(330_81%_60%)]" />AAIF</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
