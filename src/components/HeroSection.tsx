import Image from "next/image";
import heroBanner from "@/assets/hero-banner.jpg";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const HeroSection = () => {
  const { t } = useLanguage();

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
          {t.heroTitle1}<br />
          <span className="text-gradient">{t.heroTitle2}</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-xl mb-12 animate-fade-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
          {t.heroSubtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm font-medium">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-foreground">481 {t.members}</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass text-sm font-medium">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-foreground">{t.location}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="https://community.cncf.io/cloud-native-santo-domingo/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-heading font-bold rounded-2xl glow-md hover:glow-lg transition-all duration-500 hover:-translate-y-1 active:scale-95 shadow-2xl shadow-primary/30"
          >
            {t.joinCommunity}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#events"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-heading font-bold rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 backdrop-blur-md hover:-translate-y-1 active:scale-95"
          >
            {t.exploreEvents}
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

