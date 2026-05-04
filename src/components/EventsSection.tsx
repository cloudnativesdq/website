
"use client";

import { useState } from "react";
import { Calendar, Monitor, Coffee, MapPin, Mic2, Building2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";
import { links } from "@/lib/links";

interface Event {
  title: string;
  type: string;
  image: string;
  url: string;
  date: string;
  location?: string;
}

interface EventsSectionProps {
  events: Event[];
  title: string;
}

const EventsSection = ({ events, title }: EventsSectionProps) => {
  const { language, t } = useLanguage();
  
  const getIcon = (type: string) => {
    if (type?.toLowerCase().includes("online") || type?.toLowerCase().includes("virtual")) return Monitor;
    if (type?.toLowerCase().includes("meetup") || type?.toLowerCase().includes("brunch")) return Coffee;
    return Calendar;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const pattern = language === "es" 
        ? "d 'de' MMMM, yyyy '·' p" 
        : "MMMM d, yyyy '·' p";
      
      return format(date, pattern, { 
        locale: language === "es" ? es : enUS 
      });
    } catch (e) {
      return dateString;
    }
  };

  const isUpcoming = title.toLowerCase().includes("próximos") || title.toLowerCase().includes("upcoming");

  // Empty state for upcoming events
  if (isUpcoming && (!events || events.length === 0)) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-gradient">{title}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
              {t.noUpcomingEvents}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 glass hover:border-primary/50 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{t.callForSpeakers}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {t.callForSpeakersDesc}
              </p>
              <a 
                href={links.cfp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm group/link"
              >
                {language === "es" ? "Postular Charla" : "Submit Talk"}
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 glass hover:border-primary/50 transition-all duration-500">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{t.becomeHost}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {t.becomeHostDesc}
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-blue-400 font-bold text-sm group/link"
              >
                {language === "es" ? "Contactar" : "Get in touch"}
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">{title}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
            {isUpcoming 
              ? (language === "es" ? "¡No te pierdas nuestros siguientes encuentros! Conéctate con otros profesionales y aprende." : "Don't miss our next meetings! Connect with other professionals and learn.")
              : (language === "es" ? "Revive los momentos de nuestros encuentros anteriores y mantente al día." : "Relive the moments of our previous meetings and stay up to date.")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {events.map((event, i) => (
            <EventCard
              key={event.title + i}
              event={event}
              formatDate={formatDate}
              getIcon={getIcon}
            />
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

function EventCard({
  event,
  formatDate,
  getIcon,
}: {
  event: Event;
  formatDate: (d: string) => string;
  getIcon: (t: string) => typeof Calendar;
}) {
  const [imgSrc, setImgSrc] = useState(event.image || links.eventFallbackImage);
  const EventIcon = getIcon(event.type);

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row gap-6 p-1 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden hover-lift shadow-2xl shadow-black/20"
    >
      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
        <Image
          src={imgSrc}
          alt={event.title}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fill
          sizes="(max-width: 640px) 100vw, 192px"
          onError={() => setImgSrc(links.eventFallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
        <div className="absolute bottom-4 left-4 sm:hidden">
          <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
            {event.type}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col justify-center p-4 sm:p-2 min-w-0 flex-1">
        <div className="hidden sm:flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] uppercase tracking-wider text-primary font-bold border border-primary/20">
            <EventIcon className="w-3 h-3" />
            {event.type}
          </span>
        </div>
        
        <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors leading-tight mb-4 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary/60 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.location && (
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

export default EventsSection;
