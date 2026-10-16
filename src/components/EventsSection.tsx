
"use client";

import { Mic2, Building2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";
import { links } from "@/lib/links";
import EventCard, { type Event } from "@/components/EventCard";
import { getEventIcon, formatEventDate } from "@/lib/event-format";

interface EventsSectionProps {
  events: Event[];
  title: string;
}

const EventsSection = ({ events, title }: EventsSectionProps) => {
  const { language, t } = useLanguage();

  const getIcon = getEventIcon;
  const formatDate = (dateString: string) => formatEventDate(dateString, language);

  const isUpcoming = title.toLowerCase().includes("próximos") || title.toLowerCase().includes("upcoming");
  const isPastEvent = title.toLowerCase().includes("pasados") || title.toLowerCase().includes("past");

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
            <div className="group p-8 rounded-[2rem] bg-foreground/5 border border-foreground/10 glass hover:border-primary/50 transition-all duration-500">
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

            <div className="group p-8 rounded-[2rem] bg-foreground/5 border border-foreground/10 glass hover:border-primary/50 transition-all duration-500">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:max-w-5xl lg:mx-auto">
          {events.map((event, i) => (
            <EventCard
              key={event.title + i}
              event={event}
              formatDate={formatDate}
              getIcon={getIcon}
              isPast={isPastEvent}
              isSingle={events.length === 1}
              spotsText={t.spotsRemaining}
            />
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default EventsSection;
