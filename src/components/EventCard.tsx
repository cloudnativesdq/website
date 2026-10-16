
"use client";

import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { links } from "@/lib/links";

export interface Event {
  title: string;
  type: string;
  image: string;
  url: string;
  date: string;
  location?: string;
  soldOut?: boolean;
  spotsRemaining?: number;
  portraitImage?: string;
  isPast?: boolean;
}

interface EventCardProps {
  event: Event;
  formatDate: (d: string) => string;
  getIcon: (t: string) => typeof Calendar;
  isPast?: boolean;
  isSingle?: boolean;
  spotsText: string;
  /** Tighter single-row layout for the homepage preview grid. */
  compact?: boolean;
}

export default function EventCard({
  event,
  formatDate,
  getIcon,
  isPast = false,
  isSingle = false,
  spotsText,
  compact = false,
}: EventCardProps) {
  const [imgSrc, setImgSrc] = useState(event.portraitImage || event.image || links.eventFallbackImage);
  const EventIcon = getIcon(event.type);
  const showSoldOut = event.soldOut && !isPast;
  const showSpots = !isPast && !showSoldOut && event.spotsRemaining !== undefined && event.spotsRemaining < 10;

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex ${compact ? "flex-row" : "flex-col sm:flex-row"} gap-4 sm:gap-6 p-1 rounded-3xl bg-foreground/5 border border-foreground/10 hover:border-primary/50 hover:bg-foreground/[0.08] transition-card overflow-hidden hover-lift shadow-2xl shadow-black/20 ${isSingle ? "lg:col-span-2 lg:max-w-2xl lg:mx-auto" : ""}`}
    >
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-2xl bg-muted ${
          compact ? "w-28 h-28 sm:w-32 sm:h-32" : "w-full sm:w-48 h-48 sm:h-auto"
        }`}
      >
        <Image
          src={imgSrc}
          alt={event.title}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fill
          sizes={compact ? "128px" : "(max-width: 640px) 100vw, 192px"}
          onError={() => setImgSrc(links.eventFallbackImage)}
        />
        {!compact && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
            <div className="absolute bottom-4 left-4 sm:hidden flex items-center gap-2">
              <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
                {event.type}
              </span>
              {showSoldOut && (
                <span className="px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-widest">
                  Sold Out
                </span>
              )}
              {showSpots && (
                <span className="px-2 py-1 rounded-md bg-warning text-warning-foreground text-[10px] font-bold uppercase tracking-widest">
                  {spotsText.replace("{count}", String(event.spotsRemaining))}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col justify-center p-4 sm:p-2 min-w-0 flex-1">
        <div className={`${compact ? "flex" : "hidden sm:flex"} items-center gap-2 mb-2 sm:mb-3 flex-wrap`}>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] uppercase tracking-wider text-primary font-bold border border-primary/20">
            <EventIcon className="w-3 h-3" />
            {event.type}
          </span>
          {showSoldOut && (
            <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-[10px] uppercase tracking-wider text-destructive font-bold border border-destructive/20">
              Sold Out
            </span>
          )}
          {showSpots && (
            <span className="px-2 py-0.5 rounded-full bg-warning/20 text-[10px] uppercase tracking-wider text-warning font-bold border border-warning/20">
              {spotsText.replace("{count}", String(event.spotsRemaining))}
            </span>
          )}
        </div>

        <h3
          className={`font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 ${
            compact ? "text-base sm:text-lg mb-2" : "text-xl md:text-2xl mb-4"
          }`}
        >
          {event.title}
        </h3>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary/60 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.location && !compact && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
