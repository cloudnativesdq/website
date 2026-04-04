import Image from "next/image";
import heroBanner from "@/assets/hero-banner.jpg";
import { MapPin, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <Image
        src={heroBanner}
        alt="Cloud Native network visualization"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={640}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="relative z-10 container text-center py-20">
        <p className="text-primary font-heading font-medium tracking-widest uppercase text-sm mb-4 animate-fade-up">
          Latin America · CNCF Community Group
        </p>
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Cloud Native<br />
          <span className="text-gradient">Santo Domingo</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Una comunidad tecnológica dinámica llevando los principios del movimiento Cloud Native 
          a la República Dominicana y Latinoamérica.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            481 miembros
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Santo Domingo, RD
          </span>
        </div>
        <a
          href="https://community.cncf.io/cloud-native-santo-domingo/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 px-8 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-lg glow-sm hover:glow-md transition-shadow animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Únete a la Comunidad
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
