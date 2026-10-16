"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
  title: string;
  url: string;
  image?: string | null;
  /** "contain" for logos and square artwork; photos and thumbnails are cropped. */
  imageFit?: "cover" | "contain";
  subtitle?: string;
  footer?: React.ReactNode;
  /** Shown as a calendar chip over the image. */
  date?: string;
  external?: boolean;
}

const PAGE = 8;

// Filterable grid of link cards, used for events on /map and learning resources on /resources.
export default function CardGrid({
  id,
  title,
  categories,
  items,
}: {
  id: string;
  title: string;
  categories: CardCategory[];
  items: CardItem[];
}) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState("all");
  const [shown, setShown] = useState(PAGE);

  const byId = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const i of items) c[i.category] = (c[i.category] ?? 0) + 1;
    return c;
  }, [items]);
  const filtered = active === "all" ? items : items.filter((i) => i.category === active);
  const hint = byId.get(active)?.hint;

  const locale = language === "es" ? "es-DO" : "en-US";
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "UTC" });
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const year = new Intl.DateTimeFormat(locale, { year: "numeric", timeZone: "UTC" });

  const tabs = [{ id: "all", label: t.eventsGrid.all, logo: "" }, ...categories].filter((c) => counts[c.id]);

  return (
    <section className="mt-10" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-heading font-bold mb-4">
        {title}
      </h2>

      {/* Category tabs; scroll sideways on small screens */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.slice(0, shown).map((item) => {
            const cat = byId.get(item.category);
            return (
              <li key={item.url + (item.date ?? "")}>
                <a
                  href={item.url}
                  {...(item.external === false ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex flex-col h-full rounded-3xl overflow-hidden bg-card/60 border border-foreground/10 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
                >
                  <span className="relative block aspect-[16/9] bg-muted overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                        className={`transition-transform duration-500 group-hover:scale-105 ${
                          item.imageFit === "contain" ? "object-contain p-6 bg-gradient-to-br from-primary/10 via-background to-primary/5" : "object-cover"
                        }`}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-background to-primary/5">
                        {cat && <BrandLogo src={cat.logo} size={64} className="w-14 h-14 opacity-90" />}
                      </span>
                    )}
                    {item.date && (
                      <span className="absolute top-3 left-3 flex flex-col items-center min-w-12 px-2 py-1 rounded-xl bg-background/90 backdrop-blur text-foreground shadow">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{month.format(new Date(item.date))}</span>
                        <span className="text-lg font-heading font-bold leading-none">{day.format(new Date(item.date))}</span>
                        <span className="text-[10px] text-muted-foreground">{year.format(new Date(item.date))}</span>
                      </span>
                    )}
                    {cat && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold shadow">
                        <BrandLogo src={cat.logo} size={14} className="w-3.5 h-3.5" />
                        {cat.badge ?? cat.label}
                      </span>
                    )}
                  </span>

                  <span className="flex flex-col flex-1 p-4">
                    <span className="font-heading font-semibold leading-snug line-clamp-2 group-hover:text-primary">{item.title}</span>
                    {item.subtitle && <span className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.subtitle}</span>}
                    <span className="mt-auto pt-3 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                      <span className="min-w-0 flex-1 truncate">{item.footer}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
                    </span>
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
