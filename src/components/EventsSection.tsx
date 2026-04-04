import { Calendar, Monitor, Coffee } from "lucide-react";

const events = [
  {
    title: "Kubernetes + GPUs: Desatando el poder de la IA",
    type: "Online Event",
    icon: Monitor,
    image: "https://res.cloudinary.com/startup-grind/image/fetch/c_fill,w_500,h_500,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/https://res.cloudinary.com/startup-grind/image/upload/c_fill%2Cdpr_2.0%2Cf_auto%2Cg_center%2Cq_auto:good/v1/gcs/platform-data-cncf/event_banners/eventthumb_ZZJiRWK.jpg",
    url: "https://community.cncf.io/events/details/cncf-cloud-native-santo-domingo-presents-kubernetes-gpus-desatando-el-poder-de-la-ia/",
  },
  {
    title: "Brunch - Celebrando a las Mujeres en Cloud Native",
    type: "Meetup",
    icon: Coffee,
    image: "https://res.cloudinary.com/startup-grind/image/fetch/c_fill,w_500,h_500,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/https://res.cloudinary.com/startup-grind/image/upload/c_fill%2Cdpr_2.0%2Cf_auto%2Cg_center%2Cq_auto:good/v1/gcs/platform-data-cncf/event_banners/eventthumb.jpg",
    url: "https://community.cncf.io/events/details/cncf-cloud-native-santo-domingo-presents-brunch-celebrando-a-las-mujeres-en-cloud-native-y-tech-talk-cafe/",
  },
  {
    title: "Java en Kubernetes: Deja de Quemar Dinero",
    type: "Online Event",
    icon: Monitor,
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_500,h_500,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/events/blob_HwlOwcM",
    url: "https://community.cncf.io/events/details/cncf-cloud-native-santo-domingo-presents-java-en-kubernetes-deja-de-quemar-dinero/cohost-cloud-native-santo-domingo",
  },
  {
    title: "Del monitoreo a la observabilidad: entendiendo el comportamiento real",
    type: "Online Event",
    icon: Monitor,
    image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_500,h_500,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/events/blob_ufKPj0U",
    url: "https://community.cncf.io/events/details/cncf-cloud-native-santo-domingo-presents-del-monitoreo-a-la-observabilidad-entendiendo-el-comportamiento-real-de-los-sistemas/",
  },
];

const EventsSection = () => {
  return (
    <section className="py-24 bg-surface/50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          <span className="text-gradient">Eventos</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          Meetups, charlas y talleres para la comunidad Cloud Native.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <a
              key={event.title}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:glow-sm transition-all duration-300"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
                width={112}
                height={112}
              />
              <div className="flex flex-col justify-center min-w-0">
                <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mb-2">
                  <event.icon className="w-3 h-3" />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
