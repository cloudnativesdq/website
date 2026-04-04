import Image from "next/image";

interface Organizer {
  name: string;
  role: string;
  company: string;
  image: string;
  profileUrl: string;
}

interface OrganizersSectionProps {
  organizers: Organizer[];
}

const OrganizersSection = ({ organizers }: OrganizersSectionProps) => {
  if (!organizers || organizers.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          <span className="text-gradient">Organizadores</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          El equipo que hace posible la comunidad Cloud Native en Santo Domingo.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {organizers.map((org) => (
            <a
              key={org.name}
              href={org.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:glow-sm transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-border group-hover:border-primary transition-colors relative">
                <Image
                  src={org.image || "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/contentbuilder/eventthumb.jpg"}
                  alt={org.name}
                  className="object-cover"
                  fill
                  sizes="96px"
                  unoptimized
                />
              </div>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-1 leading-tight">
                {org.name}
              </h3>
              <p className="text-xs text-primary font-medium mb-1">{org.role}</p>
              <p className="text-xs text-muted-foreground leading-snug">{org.company}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};


export default OrganizersSection;
