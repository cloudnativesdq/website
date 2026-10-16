"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import BrandLogo from "@/components/BrandLogo";
import EventTypeHint from "@/components/EventTypeHint";
import { flag } from "@/lib/chapters";

export type EventKind = "chapter" | "kcd" | "cnd" | "kubecon" | "aaif";

export interface GridEvent {
  title: string;
  start: string;
  url: string;
  image: string | null;
  kind: EventKind;
  place: string;
  countryCode: string | null;
  organizer?: string;
}

const KIND_LOGO: Record<EventKind, string> = {
  chapter: "cncg.svg",
  kcd: "kubernetes.png",
  cnd: "cloudnativedays.png",
  kubecon: "cncf.svg",
  aaif: "aaif.png",
};

const PAGE = 8;

export default function EventsGrid({ events }: { events: GridEvent[] }) {
  const { t, language } = useLanguage();
  const [kind, setKind] = useState<EventKind | "all">("all");
  const [shown, setShown] = useState(PAGE);

  const labels: Record<EventKind | "all", string> = {
    all: t.eventsGrid.all,
    chapter: t.eventsGrid.chapter,
    kcd: "KCD",
    cnd: "Cloud Native Days",
    kubecon: "KubeCon",
    aaif: "AAIF",
  };

  const sorted = useMemo(() => [...events].sort((a, b) => a.start.localeCompare(b.start)), [events]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: sorted.length };
    for (const e of sorted) c[e.kind] = (c[e.kind] ?? 0) + 1;
    return c;
  }, [sorted]);
  const filtered = kind === "all" ? sorted : sorted.filter((e) => e.kind === kind);

  const day = new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { day: "numeric", timeZone: "UTC" });
  const month = new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { month: "short", timeZone: "UTC" });
  const year = new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { year: "numeric", timeZone: "UTC" });

  const tabs = (["all", "chapter", "kcd", "cnd", "kubecon", "aaif"] as const).filter((k) => counts[k]);

  return (
    <section className="mt-10" aria-labelledby="events-grid-title">
      <h2 id="events-grid-title" className="text-2xl md:text-3xl font-heading font-bold mb-4">
        {t.eventsGrid.title}
      </h2>

      {/* Organizer tabs; scroll sideways on small screens */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="tablist" className="flex gap-2 pb-2 w-max">
          {tabs.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => {
                setKind(k);
                setShown(PAGE);
              }}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                kind === k ? "bg-primary text-primary-foreground border-primary" : "border-foreground/15 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {k !== "all" && <BrandLogo src={KIND_LOGO[k]} size={16} className="w-4 h-4" />}
              {labels[k]}
              <span className={`text-xs tabular-nums ${kind === k ? "opacity-80" : "text-muted-foreground"}`}>{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 min-h-5">
        {kind === "kcd" && <EventTypeHint type="kcd" />}
        {kind === "cnd" && <EventTypeHint type="cnd" />}
        {kind === "kubecon" && <p className="text-xs text-muted-foreground mb-3">{t.kubeconHint}</p>}
        {kind === "aaif" && <p className="text-xs text-muted-foreground mb-3">{t.aaifHint}</p>}
      </div>

      {filtered.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.slice(0, shown).map((e) => (
            <li key={e.url + e.start}>
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full rounded-3xl overflow-hidden bg-card/60 border border-foreground/10 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
              >
                <span className="relative block aspect-[16/9] bg-muted overflow-hidden">
                  {e.image ? (
                    <Image
                      src={e.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                      // Chapter "images" are the group logos: show them whole instead of cropping.
                      className={`transition-transform duration-500 group-hover:scale-105 ${e.kind === "chapter" ? "object-contain p-6 bg-gradient-to-br from-primary/10 via-background to-primary/5" : "object-cover"}`}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-background to-primary/5">
                      <BrandLogo src={KIND_LOGO[e.kind]} size={64} className="w-14 h-14 opacity-90" />
                    </span>
                  )}
                  {/* Date */}
                  <span className="absolute top-3 left-3 flex flex-col items-center min-w-12 px-2 py-1 rounded-xl bg-background/90 backdrop-blur text-foreground shadow">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{month.format(new Date(e.start))}</span>
                    <span className="text-lg font-heading font-bold leading-none">{day.format(new Date(e.start))}</span>
                    <span className="text-[10px] text-muted-foreground">{year.format(new Date(e.start))}</span>
                  </span>
                  {/* Organizer type */}
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold shadow">
                    <BrandLogo src={KIND_LOGO[e.kind]} size={14} className="w-3.5 h-3.5" />
                    {e.kind === "chapter" ? "Meetup" : labels[e.kind]}
                  </span>
                </span>

                <span className="flex flex-col flex-1 p-4">
                  <span className="font-heading font-semibold leading-snug line-clamp-2 group-hover:text-primary">{e.title}</span>
                  {e.organizer && <span className="mt-1 text-xs text-muted-foreground line-clamp-1">{e.organizer}</span>}
                  <span className="mt-auto pt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {flag(e.countryCode)} {e.place || "Online"}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-50 group-hover:opacity-100" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">{t.unavailable}</p>
      )}

      {filtered.length > shown && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShown((n) => n + PAGE)}
            className="h-11 px-6 rounded-full border border-foreground/15 font-heading font-semibold hover:border-primary/60 hover:text-primary transition-colors"
          >
            {t.eventsGrid.showMore} ({filtered.length - shown})
          </button>
        </div>
      )}
    </section>
  );
}
