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
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, i) => {
            const EventIcon = getIcon(event.type);
            return (
              <a
                key={event.title + i}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:glow-sm transition-all duration-300"
              >
                <div className="relative w-28 h-28 flex-shrink-0">
                  <img
                    src={event.image || "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/contentbuilder/eventthumb.jpg"}
                    alt={event.title}
                    className="w-full h-full rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary font-bold">
                      <EventIcon className="w-3 h-3" />
                      {event.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3 text-primary/60" />
                    <span className="truncate">{event.location}</span>
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
