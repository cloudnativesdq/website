"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/hooks/use-language";
import { flag, ambassadorsUrl, type MapData } from "@/lib/chapters";
import { ArrowUpRight, CalendarDays, Globe2, Search } from "lucide-react";

// Leaflet touches `window`, so the map only renders in the browser.
const ChaptersMap = dynamic(() => import("@/components/ChaptersMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

const card = "p-6 rounded-3xl bg-card/60 border border-foreground/10";

export default function MapView({ data }: { data: MapData }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
    [language]
  );
  const formatDate = (iso: string) => fmt.format(new Date(iso));

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
  const upcomingCount = data.chapters.reduce((n, c) => n + c.events.length, 0) + data.kcds.length + data.cloudNativeDays.length;
  const countryCount = new Set(data.chapters.map((c) => c.countryCode).filter(Boolean)).size;

  const stats = [
    { value: data.chapters.length, label: t.mapChapters },
    { value: countryCount, label: t.mapCountries },
    { value: totalKubestronauts, label: t.mapKubestronauts },
    { value: totalAmbassadors, label: t.mapAmbassadors },
    { value: upcomingCount, label: t.mapUpcoming },
  ];

  const eventList = (items: { name: string; start: string; url: string; countryCode: string | null; city?: string }[]) =>
    items.length ? (
      items.map((e) => (
        <a
          key={e.url + e.start}
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-3 py-2.5 border-b border-foreground/5 last:border-0 hover:text-primary transition-colors"
        >
          <span className="flex flex-col">
            <span className="text-sm">
              {flag(e.countryCode)} {e.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(e.start)}
              {e.city ? ` · ${e.city}` : ""}
            </span>
          </span>
          <ArrowUpRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" />
        </a>
      ))
    ) : (
      <p className="text-sm text-muted-foreground">{t.unavailable}</p>
    );

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container px-6">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{t.mapTitle}</h1>
            <p className="text-muted-foreground max-w-3xl">{t.mapSubtitle}</p>
          </header>

          <dl className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                <dd className="text-3xl font-heading font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
            <div className="flex flex-col gap-3 min-w-0">
              <div className="h-[60vh] min-h-[420px] rounded-3xl overflow-hidden border border-foreground/10" data-testid="chapters-map">
                <ChaptersMap
                  chapters={data.chapters}
                  kcds={data.kcds}
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
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[hsl(199_89%_45%)]" />{t.mapLegendChapter}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[hsl(160_84%_39%)]" />{t.mapLegendActive}</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full border-2 border-[hsl(38_92%_50%)]" />{t.mapKcd}</span>
              </div>
            </div>

            {/* Countries */}
            <div className={`${card} flex flex-col lg:h-[60vh] lg:min-h-[420px]`}>
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
                <span className="w-12 text-right" title={t.mapChapters}>{t.mapChaptersShort}</span>
                <span className="w-14 text-right" title={t.mapKubestronauts}>Kubestr.</span>
                <span className="w-14 text-right" title={t.mapAmbassadors}>Amb.</span>
              </div>
              <ul className="flex-1 min-h-60 overflow-y-auto -mx-1" data-testid="country-list">
                {visibleCountries.map((c) => (
                  <li key={c.code}>
                    <button
                      onClick={() => setSelected(c.code)}
                      disabled={!c.chapters}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left transition-colors disabled:opacity-60 disabled:cursor-default enabled:hover:bg-foreground/5 ${selected === c.code ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <span className="flex-1 truncate">{flag(c.code)} {c.name}</span>
                      <span className="w-12 text-right tabular-nums">{c.chapters || "–"}</span>
                      <span className="w-14 text-right tabular-nums font-semibold">{c.kubestronauts || "–"}</span>
                      <span className="w-14 text-right tabular-nums">{c.ambassadors || "–"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selected && countryByCode.get(selected)?.ambassadors ? (
            <a
              href={ambassadorsUrl(selected)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
            >
              {flag(selected)} {t.mapSeeAmbassadors} ({countryByCode.get(selected)!.ambassadors})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : null}

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className={card}>
              <h2 className="flex items-center gap-2 font-heading font-bold text-lg mb-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                {t.mapUpcomingKcds}
              </h2>
              {eventList(data.kcds)}
            </div>
            <div className={card}>
              <h2 className="flex items-center gap-2 font-heading font-bold text-lg mb-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                {t.mapCloudNativeDays}
              </h2>
              {eventList(data.cloudNativeDays)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
