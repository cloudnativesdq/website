"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import BrandLogo from "@/components/BrandLogo";

export interface CardCategory {
  id: string;
  label: string;
  /** Shorter label for the badge on each card. */
  badge?: string;
  logo: string;
  hint?: React.ReactNode;
}

export interface CardItem {
  category: string;
  /** Extra tab ids the item also belongs to (e.g. a region), on top of its category. */
  tags?: string[];
  title: string;
  url: string;
  image?: string | null;
  /** "contain" for logos and square artwork; photos and thumbnails are cropped. */
  imageFit?: "cover" | "contain";
  subtitle?: string;
  footer?: React.ReactNode;
  /** Shown as a calendar chip over the image. */
  date?: string;
  /** Used only for ordering (newest first); not displayed. */
  sortDate?: string;
  external?: boolean;
}

const PAGE = 8;

// Filterable grid of link cards, used for events on /map and learning resources on /resources.
export default function CardGrid({
  id,
  title,
  categories,
  items,
  toolbar,
}: {
  id: string;
  title: string;
  categories: CardCategory[];
  items: CardItem[];
  /** Extra controls shown next to the title (e.g. a country filter). */
  toolbar?: React.ReactNode;
}) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState("all");
  const [shown, setShown] = useState(PAGE);

  const byId = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const i of items) for (const id of [i.category, ...(i.tags ?? [])]) c[id] = (c[id] ?? 0) + 1;
    return c;
  }, [items]);
  const filtered = active === "all" ? items : items.filter((i) => i.category === active || i.tags?.includes(active));
  const hint = byId.get(active)?.hint;

  const locale = language === "es" ? "es-DO" : "en-US";
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "UTC" });
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });

  const tabs = [{ id: "all", label: t.eventsGrid.all, logo: "" }, ...categories].filter((c) => counts[c.id]);

  return (
    <section className="mt-10 first:mt-0" aria-labelledby={`${id}-title`}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-heading font-bold">
          {title}
        </h2>
        {toolbar}
      </div>

      {/* Category tabs; scroll sideways on small screens */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div role="tablist" className="flex gap-2 pb-2 w-max md:w-auto md:flex-wrap">
          {tabs.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              onClick={() => {
                setActive(c.id);
                setShown(PAGE);
              }}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                active === c.id ? "bg-primary text-primary-foreground border-primary" : "border-foreground/15 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {c.logo && <BrandLogo src={c.logo} size={16} className="w-4 h-4" />}
              {c.label}
              <span className={`text-xs tabular-nums ${active === c.id ? "opacity-80" : "text-muted-foreground"}`}>{counts[c.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 min-h-5">{hint}</div>

      {filtered.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {filtered.slice(0, shown).map((item) => {
            const cat = byId.get(item.category);
            return (
              <li key={item.url + (item.date ?? "")}>
                {/* Compact row on phones (thumbnail + text), image card from sm up. */}
                <a
                  href={item.url}
                  {...(item.external === false ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex sm:flex-col gap-3 sm:gap-0 h-full p-2.5 sm:p-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-card/60 border border-foreground/10 hover:border-primary/50 transition-colors"
                >
                  <span className="relative block w-24 sm:w-auto shrink-0 aspect-square sm:aspect-video rounded-xl sm:rounded-none bg-muted overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 96px, (max-width: 1280px) 33vw, 25vw"
                        className={`transition-transform duration-500 group-hover:scale-105 ${
                          item.imageFit === "contain" ? "object-contain p-2 sm:p-6 bg-linear-to-br from-primary/10 via-background to-primary/5" : "object-cover"
                        }`}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/15 via-background to-primary/5">
                        {cat && <BrandLogo src={cat.logo} size={64} className="w-10 h-10 sm:w-14 sm:h-14 opacity-90" />}
                      </span>
                    )}
                    {item.date && (
                      <span className="hidden sm:flex absolute top-3 left-3 flex-col items-center min-w-11 px-2 py-1 rounded-xl bg-background/90 backdrop-blur text-foreground shadow">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{month.format(new Date(item.date))}</span>
                        <span className="text-lg font-heading font-bold leading-none">{day.format(new Date(item.date))}</span>
                      </span>
                    )}
                    {cat && active === "all" && (
                      <span className="hidden sm:inline-flex absolute top-3 right-3 items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold shadow">
                        <BrandLogo src={cat.logo} size={14} className="w-3.5 h-3.5" />
                        {cat.badge ?? cat.label}
                      </span>
                    )}
                  </span>

                  <span className="flex flex-col flex-1 min-w-0 sm:p-4">
                    {item.date && (
                      <span className="sm:hidden text-[11px] font-bold uppercase tracking-wide text-primary">
                        {day.format(new Date(item.date))} {month.format(new Date(item.date))}
                      </span>
                    )}
                    <span className="font-heading font-semibold text-[15px] sm:text-base leading-snug line-clamp-2 group-hover:text-primary">{item.title}</span>
                    {item.subtitle && <span className="mt-0.5 sm:mt-1 text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">{item.subtitle}</span>}
                    <span className="mt-auto pt-1.5 sm:pt-3 text-xs text-muted-foreground truncate">{item.footer}</span>
                  </span>
                </a>
              </li>
            );
          })}
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
