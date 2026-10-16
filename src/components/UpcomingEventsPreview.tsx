
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import EventCard, { type Event } from "@/components/EventCard";
import { getEventIcon, formatEventDate } from "@/lib/event-format";

interface UpcomingEventsPreviewProps {
  events: Event[];
}

const PREVIEW_COUNT = 3;

const UpcomingEventsPreview = ({ events }: UpcomingEventsPreviewProps) => {
  const { language, t } = useLanguage();

  if (!events || events.length === 0) return null;

  const preview = events.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container px-6 relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">{t.upcomingEvents}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
            {t.upcomingPreviewSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-10 md:mb-12">
          {preview.map((event, i) => (
            <div key={event.title + i} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <EventCard
                event={event}
                formatDate={(d) => formatEventDate(d, language)}
                getIcon={getEventIcon}
                spotsText={t.spotsRemaining}
                compact
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-heading font-bold transition-control border border-foreground/10 hover:border-foreground/30 group"
          >
            {t.seeAllEvents}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default UpcomingEventsPreview;
