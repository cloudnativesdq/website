import Image from "next/image";
import heroBanner from "@/assets/hero-banner.jpg";
import { MapPin, Users, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBanner}
          alt="Cloud Native Santo Domingo"
          className="object-cover scale-105"
          fill
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-70" />
      </div>

      <div className="relative z-10 container px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-darker text-[10px] md:text-xs font-heading font-semibold tracking-wider uppercase text-primary mb-8 animate-fade-up border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Latin America · CNCF Community Group
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-extrabold mb-8 animate-fade-up leading-[1.1] tracking-tight" style={{ animationDelay: "0.1s" }}>
          Cloud Native<br />
          <span className="text-gradient">Santo Domingo</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-xl mb-12 animate-fade-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
          Empoderando a la próxima generación de ingenieros en la República Dominicana a través de tecnologías open source y principios Cloud Native.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm font-medium">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-foreground">481 miembros</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm font-medium">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-foreground">Santo Domingo, RD</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="https://community.cncf.io/cloud-native-santo-domingo/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-2xl glow-sm hover:glow-md transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-xl shadow-primary/20"
          >
            Únete a la Comunidad
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#events"
            className="px-8 py-4 bg-secondary text-secondary-foreground font-heading font-bold rounded-2xl hover:bg-secondary/80 transition-all duration-300 border border-white/5"
          >
            Ver Eventos
          </a>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
    </section>
  );
};
export default HeroSection;

