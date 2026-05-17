"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ExternalLink, X } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import { cn } from "@/lib/utils";

interface Event {
  title: string;
  type: string;
  image: string;
  url: string;
  date: string;
  location?: string;
}

interface EventCalendarProps {
  events: Event[];
}

interface ParsedEvent extends Event {
  parsedDate: Date;
}

const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEKDAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventCalendar({ events }: EventCalendarProps) {
  const { language, t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ParsedEvent | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const locale = language === "es" ? es : enUS;
  const weekdays = language === "es" ? WEEKDAYS_ES : WEEKDAYS_EN;

  const parsedEvents = useMemo(() => {
    return events.map(e => {
      let parsedDate = new Date(e.date);
      
      if (isNaN(parsedDate.getTime())) {
        const match = e.date.match(/(\w+)\s+(\d+),\s*(\d+)/);
        if (match) {
          const [, month, day, year] = match;
          const fullYear = year.length === 2 ? `20${year}` : year;
          parsedDate = new Date(`${month} ${day}, ${fullYear}`);
        }
      }
      
      return {
        ...e,
        parsedDate
      };
    }).filter(e => !isNaN(e.parsedDate.getTime()));
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return parsedEvents
      .filter(e => isAfter(e.parsedDate, today) || isSameDay(e.parsedDate, today))
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
  }, [parsedEvents]);

  const monthName = currentMonth.getFullYear();
  const monthLabel = language === "es" 
    ? `${MONTHS_ES[currentMonth.getMonth()]} ${monthName}`
    : format(currentMonth, "MMMM yyyy", { locale });

  const monthEvents = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return upcomingEvents.filter(e => 
      e.parsedDate >= start && e.parsedDate <= end
    );
  }, [upcomingEvents, currentMonth]);

  const nextMonth = () => {
    setIsAnimating(false);
    setCurrentMonth(addMonths(currentMonth, 1));
    setTimeout(() => setIsAnimating(true), 50);
  };

  const prevMonth = () => {
    setIsAnimating(false);
    setCurrentMonth(subMonths(currentMonth, 1));
    setTimeout(() => setIsAnimating(true), 50);
  };

  if (!events || events.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">{t.calendarTitle}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
            {t.calendarSubtitle}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevMonth}
              className="group flex items-center justify-center w-12 h-12 rounded-2xl glass hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-primary/50"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            
<div className="text-center">
            <span className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
              {monthLabel}
            </span>
          </div>

            <button
              onClick={nextMonth}
              className="group flex items-center justify-center w-12 h-12 rounded-2xl glass hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-primary/50"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekdays.map((day, i) => (
              <div
                key={day}
                className={cn(
                  "text-center text-[10px] md:text-xs font-heading font-bold uppercase tracking-widest py-3",
                  i === 0 || i === 6 ? "text-primary/60" : "text-muted-foreground/40"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const firstOfMonth = startOfMonth(currentMonth);
              const lastOfMonth = endOfMonth(currentMonth);
              const startOffset = firstOfMonth.getDay();
              const dayNum = i - startOffset + 1;
              
              if (dayNum < 1 || dayNum > lastOfMonth.getDate()) {
                return <div key={i} className="aspect-square" />;
              }

              const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
              const dayEvents = upcomingEvents.filter(e => isSameDay(e.parsedDate, currentDate));
              const hasEvents = dayEvents.length > 0;
              const isToday = isSameDay(currentDate, new Date());

              return (
                <div
                  key={i}
                  className={cn(
                    "relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 cursor-pointer",
                    hasEvents 
                      ? "hover:bg-primary/10 hover:scale-105" 
                      : "hover:bg-white/5",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  onClick={() => dayEvents[0] && setSelectedEvent(dayEvents[0])}
                >
                  <span className={cn(
                    "text-sm font-heading font-bold",
                    hasEvents ? "text-primary" : "text-muted-foreground/60",
                    isToday && "text-primary"
                  )}>
                    {dayNum}
                  </span>
                  {hasEvents && (
                    <div className="absolute bottom-2 flex gap-1">
                      {dayEvents.slice(0, 3).map((_, ei) => (
                        <div
                          key={ei}
                          className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                          style={{ animationDelay: `${ei * 0.2}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {monthEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground/60 text-sm">{t.noEventsThisMonth}</p>
            </div>
          )}
        </div>

        {monthEvents.length > 0 && (
          <div className="mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              {monthEvents.slice(0, 4).map((event, i) => (
                <button
                  key={event.url + i}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-primary/50",
                    "animate-fade-up"
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold uppercase tracking-wider text-primary">
                      {format(event.parsedDate, "d MMM", { locale })}
                    </span>
                    <span className="block text-sm font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 max-w-[150px]">
                      {event.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300",
        selectedEvent ? "opacity-100 visible" : "opacity-0 invisible"
      )}
      onClick={() => setSelectedEvent(null)}
      >
        <div 
          className={cn(
            "relative w-full max-w-lg bg-card rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl transform transition-all duration-500",
            selectedEvent ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          )}
          onClick={e => e.stopPropagation()}
        >
          {selectedEvent && (
            <>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative h-48 bg-muted">
                {selectedEvent.image ? (
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                    {selectedEvent.type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4 leading-tight">
                  {selectedEvent.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      {format(selectedEvent.parsedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale })}
                    </span>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>

                <a
                  href={selectedEvent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground font-heading font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
                >
                  {t.viewEvent}
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/2 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
}