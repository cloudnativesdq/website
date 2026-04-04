import { Calendar, Monitor, Coffee, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const getIcon = (type: string) => {
    if (type?.toLowerCase().includes("online") || type?.toLowerCase().includes("virtual")) return Monitor;
    if (type?.toLowerCase().includes("meetup") || type?.toLowerCase().includes("brunch")) return Coffee;
    return Calendar;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy '·' p", { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <section className="py-24 bg-surface/50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          <span className="text-gradient">{title}</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          {title.toLowerCase().includes("próximos") 
            ? "¡No te pierdas nuestros siguientes encuentros!" 
            : "Revive los momentos de nuestros encuentros anteriores."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, i) => {
            const EventIcon = getIcon(event.type);
            return (
              <a
                key={event.title + i}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:glow-sm transition-all duration-300"
              >
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                  <img
                    src={event.image || "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/contentbuilder/eventthumb.jpg"}
                    alt={event.title}
                    className="w-full h-full rounded-xl object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary font-bold">
                      <EventIcon className="w-3.5 h-3.5" />
                      {event.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium bg-muted/50 px-2 py-0.5 rounded-full">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-start gap-2 text-[12px] text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2 leading-relaxed">{event.location}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
