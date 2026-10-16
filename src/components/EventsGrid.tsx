"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import CardGrid, { type CardCategory } from "@/components/CardGrid";
import EventTypeHint from "@/components/EventTypeHint";
import { flag } from "@/lib/chapters";

export type EventKind = "chapter" | "kcd" | "cnd" | "kubecon" | "aaif";

// Latin America and the Caribbean (ISO 3166-1 alpha-2, lowercase).
const LATAM = new Set(
  "ar bo br cl co cr cu do ec gt hn ht mx ni pa pe pr py sv uy ve bz gy sr jm tt bs bb".split(" ")
);

export interface GridEvent {
  title: string;
  start: string;
  url: string;
  image: string | null;
  kind: EventKind;
  place: string;
  countryCode: string | null;
  organizer?: string;
  region?: string;
}

export default function EventsGrid({ events }: { events: GridEvent[] }) {
  const { t } = useLanguage();

  const hint = (text: string) => <p className="text-xs text-muted-foreground mb-3">{text}</p>;
  const categories: CardCategory[] = [
    { id: "latam", label: t.eventsGrid.latam, logo: "cncg.svg", hint: hint(t.eventsGrid.latamHint) },
    { id: "chapter", label: t.eventsGrid.chapter, badge: "Meetup", logo: "cncg.svg" },
    { id: "kcd", label: "KCD", logo: "kubernetes.png", hint: <EventTypeHint type="kcd" /> },
    { id: "cnd", label: "Cloud Native Days", logo: "cloudnativedays.png", hint: <EventTypeHint type="cnd" /> },
    { id: "kubecon", label: "KubeCon", logo: "cncf.svg", hint: hint(t.kubeconHint) },
    { id: "aaif", label: "AAIF", logo: "aaif.png", hint: hint(t.aaifHint) },
  ];

  const items = [...events]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((e) => ({
      category: e.kind,
      tags: (e.countryCode && LATAM.has(e.countryCode)) || e.region === "Latin America" ? ["latam"] : [],
      title: e.title,
      url: e.url,
      image: e.image,
      // Chapter "images" are the group logos: show them whole instead of cropping.
      imageFit: e.kind === "chapter" ? ("contain" as const) : ("cover" as const),
      subtitle: e.organizer,
      date: e.start,
      footer: (
        <span className="inline-flex items-center gap-1.5 max-w-full">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {flag(e.countryCode)} {e.place || "Online"}
          </span>
        </span>
      ),
    }));

  return <CardGrid id="events-grid" title={t.eventsGrid.title} categories={categories} items={items} />;
}
