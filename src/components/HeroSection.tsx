
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import heroBanner from "@/assets/hero-banner.jpg";
import { MapPin, Users, ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  membersCount: number;
  pastCount: number;
  upcomingCount: number;
}

const CountUp = ({ end, duration = 2000, prefix = "" }: { end: number; duration?: number; prefix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentValue = Math.floor(easeOutQuart * end);
      
      setCount(currentValue);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className="tabular-nums font-bold">{prefix}{count}</span>;
};

const HeroSection = ({ membersCount, pastCount, upcomingCount }: HeroSectionProps) => {
  const { t, mounted } = useLanguage();

  return (
    <section className="relative h-screen min-h-[660px] flex items-center justify-center overflow-hidden border-b border-white/5 bg-background select-none">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBanner}
          alt="Cloud Native Santo Domingo"
          className="object-cover scale-110 blur-[2px] opacity-40 brightness-50"
          fill
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(199,89%,48%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsla(222,47%,10%,0.4),transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsla(199,89%,48%,0.05)_0%,transparent_70%)] animate-pulse" />
      </div>

      <div className="relative z-10 container px-6 flex flex-col items-center text-center">
        {/* Community Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-darker text-[10px] md:text-xs font-heading font-bold tracking-[0.2em] uppercase text-primary mb-6 md:mb-8 animate-fade-up border border-primary/20 shadow-xl shadow-primary/5">
          <Sparkles className="w-3 h-3 animate-pulse" />
          Latin America · CNCF Community Group
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-heading font-black mb-6 md:mb-8 animate-fade-up leading-[0.9] tracking-tighter" style={{ animationDelay: "0.1s" }}>
          <span className="block opacity-90">{t.heroTitle1}</span>
          <span className="text-gradient block pb-2">{t.heroTitle2}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-xl mb-8 md:mb-12 animate-fade-up leading-relaxed font-medium" style={{ animationDelay: "0.2s" }}>
          {t.heroSubtitle}
        </p>

        {/* Metrics Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8 md:mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="group flex flex-col items-center gap-0.5 md:gap-1 px-5 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-[2.5rem] glass hover:bg-white/5 transition-all duration-500 border border-white/10 hover:border-primary/30 shadow-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div className="text-lg md:text-3xl font-heading font-bold text-foreground">
                {mounted ? <CountUp end={membersCount} prefix="+" /> : "0"}
              </div>
            </div>
            <span className="text-[8px] md:text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary/80 transition-colors">{t.members}</span>
          </div>

          <div className="group flex flex-col items-center gap-0.5 md:gap-1 px-5 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-[2.5rem] glass hover:bg-white/5 transition-all duration-500 border border-white/10 hover:border-primary/30 shadow-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <CalendarCheck className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div className="text-lg md:text-3xl font-heading font-bold text-foreground">
                {mounted ? <CountUp end={pastCount} prefix="+" /> : "0"}
              </div>
            </div>
            <span className="text-[8px] md:text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary/80 transition-colors">{t.eventsLabel}</span>
          </div>

          <div className="group hidden sm:flex flex-col items-center gap-0.5 md:gap-1 px-5 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-[2.5rem] glass hover:bg-white/5 transition-all duration-500 border border-white/10 hover:border-primary/30 shadow-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div className="text-sm md:text-xl font-heading font-extrabold text-foreground">Santo Domingo</div>
            </div>
            <span className="text-[8px] md:text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary/80 transition-colors">República Dominicana</span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <a
            href={links.cncfCommunity}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-5 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground font-heading font-black rounded-2xl md:rounded-3xl glow-md hover:glow-lg transition-all duration-500 hover:-translate-y-2 active:scale-95 shadow-2xl shadow-primary/40 uppercase tracking-wider text-xs md:text-sm"
          >
            {t.joinCommunity}
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-2" />
          </a>
          
          <a
            href="#events"
            className="relative px-8 md:px-10 py-3.5 md:py-5 bg-white/5 hover:bg-white/10 text-white font-heading font-black rounded-2xl md:rounded-3xl transition-all duration-300 border border-white/10 hover:border-white/30 backdrop-blur-xl hover:-translate-y-1 active:scale-95 uppercase tracking-wider text-xs md:text-sm"
          >
            {upcomingCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative flex items-center justify-center rounded-full h-5 w-5 bg-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                  {upcomingCount}
                </span>
              </span>
            )}
            {t.exploreEvents}
          </a>
        </div>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-[10%] -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" />
      <div className="absolute bottom-[10%] -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" style={{ animationDelay: "3s" }} />
    </section>
  );
};

export default HeroSection;
