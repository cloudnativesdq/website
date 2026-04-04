import { Calendar, Monitor, Coffee } from "lucide-react";

interface Event {
  title: string;
  type: string;
  image: string;
  url: string;
  date: string;
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

  if (!events || events.length === 0) return null;

  return (
    <section className="py-24 bg-surface/50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          <span className="text-gradient">{title}</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          Meetups, charlas y talleres para la comunidad Cloud Native.
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
                <img
                  src={event.image || "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/contentbuilder/eventthumb.jpg"}
                  alt={event.title}
                  className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                  width={112}
                  height={112}
                />
                <div className="flex flex-col justify-center min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mb-2">
                    <EventIcon className="w-3 h-3" />
                    {event.type}
                  </span>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {event.title}
                  </h3>
                  <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Ver detalles →
                  </span>
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
