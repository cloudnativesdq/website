"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, Linkedin, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { wcnfOrganizers, type WcnfEvent } from "@/lib/wcnf";

export default function WcnfSection({ events }: { events: WcnfEvent[] }) {
  const { t, language } = useLanguage();
  const fmt = new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", {
    dateStyle: "medium",
    timeZone: "America/Santo_Domingo",
  });

  return (
    <section id="wcnf" className="py-16 scroll-mt-24">
      <div className="container px-6">
        <div className="rounded-[2rem] border border-foreground/10 bg-card/60 p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">WCNF</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">{t.wcnf.title}</h2>
              <p className="text-muted-foreground mb-6">{t.wcnf.subtitle}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t.wcnf.organizers}</p>
              <ul className="flex flex-col gap-3">
                {wcnfOrganizers.map((o) => (
                  <li key={o.name} className="flex items-center gap-3">
                    <span className="relative w-11 h-11 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image src={o.image} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="font-medium">{o.name}</span>
                    {o.linkedin && (
                      <a href={o.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${o.name} LinkedIn`} className="ml-auto p-2 rounded-xl border border-foreground/10 hover:text-primary hover:border-primary/40">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                <CalendarDays className="w-4 h-4 text-primary" />
                {t.wcnf.events}
              </p>
              {events.length ? (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {events.slice(0, 4).map((e) => (
                    <li key={e.url}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl border border-foreground/10 overflow-hidden hover:border-primary/50 transition-colors">
                        <span className="relative block aspect-video bg-muted">
                          {e.cover && <Image src={e.cover} alt="" fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />}
                          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${e.upcoming ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground"}`}>
                            {e.upcoming ? t.wcnf.upcoming : t.wcnf.past}
                          </span>
                        </span>
                        <span className="block p-3">
                          <span className="block font-medium leading-snug group-hover:text-primary">{e.name}</span>
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span>{fmt.format(new Date(e.start))}</span>
                            {e.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {e.location}
                              </span>
                            )}
                            <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{t.wcnf.noEvents}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
