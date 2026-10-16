"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsGrid, { type GridEvent } from "@/components/EventsGrid";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage } from "@/hooks/use-language";
import { flag, type MapData } from "@/lib/chapters";
import type { DominicanCncfPeople } from "@/lib/cncf-people";
import type { LfEvents } from "@/lib/cncf-resources";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, Search, X } from "lucide-react";

// Leaflet touches `window`, so the map only renders in the browser.
const ChaptersMap = dynamic(() => import("@/components/ChaptersMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

const card = "p-6 rounded-3xl bg-card/60 border border-foreground/10";

export default function MapView({ data, people, lfEvents }: { data: MapData; people: DominicanCncfPeople; lfEvents: LfEvents }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("do"); // open on the Dominican Republic
  const [panelOpen, setPanelOpen] = useState(false); // countries panel on small screens

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
  const gridEvents = useMemo<GridEvent[]>(
    () => [
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
      ...lfEvents.kubecons.map((e) => ({ title: e.title, start: e.start, url: e.url, image: e.image ?? null, kind: "kubecon" as const, place: e.city, countryCode: null })),
      ...lfEvents.aaif.map((e) => ({ title: e.title, start: e.start, url: e.url, image: e.image ?? null, kind: "aaif" as const, place: e.city, countryCode: null })),
    ],
    [data, lfEvents]
  );

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
    { value: upcomingCount, label: t.mapUpcoming },
  ];

  const dr = selected === "do" && (people.kubestronauts.length > 0 || people.ambassadors.length > 0);
  // Ambassadors first; someone who is both appears once.
  const drPeople = [...people.ambassadors, ...people.kubestronauts.filter((k) => !people.ambassadors.some((a) => a.name === k.name))];

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-20 md:pt-24 pb-16">
        <div className="container px-4 sm:px-6">
          <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 mb-3">
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-heading font-bold">
              <BrandLogo src="cncg.svg" size={36} className="w-8 h-8 md:w-9 md:h-9" />
              {t.mapTitle}
            </h1>
            <Link href="/start-a-chapter" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {t.chapterGuide.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </header>

          {/* Full-width map with the countries list floating over it (a toggle on small screens). */}
          <div className="relative h-[calc(100svh-12.5rem)] md:h-[calc(100svh-10rem)] min-h-[380px] max-h-[780px] rounded-3xl overflow-hidden border border-foreground/10">
            <div className="absolute inset-0" data-testid="chapters-map">
                <ChaptersMap
                  chapters={data.chapters}
                  kcds={data.kcds}
                  conferences={conferences}
                  countries={countryByCode}
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
              className="lg:hidden absolute top-3 right-3 z-[1001] inline-flex items-center gap-2 h-10 px-4 rounded-full bg-background/95 backdrop-blur border border-foreground/10 shadow text-sm font-semibold"
            >
              {panelOpen ? <X className="w-4 h-4" /> : <Globe2 className="w-4 h-4 text-primary" />}
              {t.mapCountriesTitle}
            </button>

            {/* Countries */}
            <div
              id="countries-panel"
              className={`${panelOpen ? "flex" : "hidden"} lg:flex flex-col absolute z-[1000] top-16 left-3 right-3 bottom-3 lg:top-3 lg:left-auto lg:w-[340px] p-4 rounded-2xl bg-background/95 backdrop-blur border border-foreground/10 shadow-xl`}
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
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[hsl(199_89%_45%)]" />{t.mapLegendChapter}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[hsl(160_84%_39%)]" />{t.mapLegendActive}</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full border-2 border-[hsl(38_92%_50%)]" />{t.mapKcd}</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full border-2 border-[hsl(262_83%_58%)]" />KubeCon</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full border-2 border-[hsl(330_81%_60%)]" />AAIF</span>
              </div>

          {/* Our people, when the Dominican Republic is selected */}
          {dr && (
            <div className={`${card} mt-6`} data-testid="dr-people">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="flex items-center gap-2 font-heading font-bold text-lg">
                  {flag("do")} {t.mapOurPeople}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <Link href="/team#ambassadors" className="text-primary hover:underline">
                    {people.ambassadors.length} {t.mapAmbassadors}
                  </Link>
                  <Link href="/team#kubestronauts" className="text-primary hover:underline">
                    {people.kubestronauts.length} {t.mapKubestronauts}
                  </Link>
                </div>
              </div>
              <ul className="flex flex-wrap gap-3">
                {drPeople.map((p) => (
                  <li key={p.name}>
                    <Link
                      href={people.ambassadors.some((a) => a.name === p.name) ? "/team#ambassadors" : "/team#kubestronauts"}
                      className="flex items-center gap-2 pr-3 rounded-full border border-foreground/10 hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <span className="relative w-9 h-9 rounded-full overflow-hidden bg-muted shrink-0">
                        {p.image && <Image src={p.image} alt="" fill sizes="36px" className="object-cover" />}
                      </span>
                      <span className="text-sm font-medium">{p.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <dl className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                <dd className="text-2xl md:text-3xl font-heading font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted-foreground max-w-3xl mt-4">{t.mapSubtitle}</p>

          <EventsGrid events={gridEvents} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
