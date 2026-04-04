const organizers = [
  {
    name: "Enmanuel Marcial Medina Martinez",
    role: "Co-organizer",
    company: "Freelance Python Developer",
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_250,h_250,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/avatars/enmanuel_marcial_medina_martinez.jpg",
    profileUrl: "https://community.cncf.io/u/m2jemv/",
  },
  {
    name: "Ayesha Diane Yege Peña",
    role: "Organizer",
    company: "Digital Transformation & IT Manager, MPIV Partners",
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_250,h_250,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/avatars/ayesha_diane_yege_pe%C3%B1a.jpg",
    profileUrl: "https://community.cncf.io/u/m893kc/",
  },
  {
    name: "Miguel de los Santos",
    role: "Co-Organizer",
    company: "Upwind",
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_250,h_250,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/avatars/miguel_de_los_santos.jpeg",
    profileUrl: "https://community.cncf.io/u/mmwxjt/",
  },
  {
    name: "Victor S. Recio",
    role: "Co-Organizer",
    company: "Senior SA & Technical Lead, Nixversity",
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_250,h_250,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/avatars/victor_s._recio_3A6mism.jpg",
    profileUrl: "https://community.cncf.io/u/mcvqry/",
  },
  {
    name: "Lester Diaz",
    role: "Organizer",
    company: "DevOps Engineer, CEVALDOM",
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_250,h_250,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/avatars/lester_diaz.jpg",
    profileUrl: "https://community.cncf.io/u/mmd5qj/",
  },
];

const OrganizersSection = () => {
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
      </div>
    </section>
  );
};

export default OrganizersSection;
