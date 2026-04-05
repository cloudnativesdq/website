
"use client";

import { Calendar, Monitor, Coffee, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";

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
  const { language } = useLanguage();
  
  const getIcon = (type: string) => {
    if (type?.toLowerCase().includes("online") || type?.toLowerCase().includes("virtual")) return Monitor;
    if (type?.toLowerCase().includes("meetup") || type?.toLowerCase().includes("brunch")) return Coffee;
    return Calendar;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy '·' p", { 
        locale: language === "es" ? es : enUS 
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!events || events.length === 0) return null;

  const isUpcoming = title.toLowerCase().includes("próximos") || title.toLowerCase().includes("upcoming");

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
          {events.map((event, i) => {
            const EventIcon = getIcon(event.type);
            return (
              <a
                key={event.title + i}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row gap-6 p-1 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden"
              >
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={event.image || "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/contentbuilder/eventthumb.jpg"}
                    alt={event.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    unoptimized
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
          })}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default EventsSection;
