import { useQuery } from "@tanstack/react-query";

const fetchCncfData = async () => {
  const res = await fetch("/api/cncf");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const OrganizersSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["cncf-data"],
    queryFn: fetchCncfData,
  });

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          <span className="text-gradient">Organizadores</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          El equipo que hace posible la comunidad Cloud Native en Santo Domingo.
        </p>
        
        {isLoading ? (
          <p className="text-center text-muted-foreground">Cargando organizadores...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {data?.organizers?.map((org: any) => (
              <a
                key={org.name}
                href={org.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:glow-sm transition-all duration-300"
              >
                <img
                  src={org.image}
                  alt={org.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-border group-hover:border-primary transition-colors"
                  loading="lazy"
                  width={96}
                  height={96}
                />
                <h3 className="font-heading font-semibold text-sm text-foreground mb-1 leading-tight">
                  {org.name}
                </h3>
                <p className="text-xs text-primary font-medium mb-1">{org.role}</p>
                <p className="text-xs text-muted-foreground leading-snug">{org.company}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizersSection;
