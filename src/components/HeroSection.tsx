
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import heroBanner from "@/assets/hero-banner.jpg";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { links, latamCommunities } from "@/lib/links";

interface HeroSectionProps {
  membersCount: number;
  pastCount: number;
  upcomingCount: number;
  kubestronautsCount: number;
}

const CountUp = ({ end, duration = 2000, prefix = "" }: { end: number; duration?: number; prefix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }

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

const HeroSection = ({ membersCount, pastCount, upcomingCount, kubestronautsCount }: HeroSectionProps) => {
  const { t, mounted } = useLanguage();

  return (
    <section className="relative min-h-[560px] py-20 md:py-0 md:h-screen md:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-foreground/5 bg-background select-none">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBanner}
          alt="Cloud Native Santo Domingo"
          className="object-cover scale-110 blur-[2px] opacity-15 dark:opacity-40 brightness-50"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(199,89%,48%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsla(222,47%,10%,0.4),transparent_50%)]" />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsla(199,89%,48%,0.05)_0%,transparent_70%)] animate-pulse" />
      </div>

      <div className="relative z-10 container px-6 flex flex-col items-center text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-5 md:mb-6 animate-fade-up animate-delay-100 leading-[1.05] tracking-tight">
          <span className="block">{t.heroTitle1}</span>
          <span className="text-gradient block pb-1">{t.heroTitle2}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg mb-8 md:mb-10 animate-fade-up animate-delay-200 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-[280px] sm:max-w-none mx-auto mb-12 md:mb-14 animate-fade-up animate-delay-300">
          <a
            href={links.cncfCommunity}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-sm md:text-base hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            {t.joinCommunity}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
          </a>
          <a
            href="/events"
            className="relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-foreground/15 text-foreground font-heading font-semibold text-sm md:text-base hover:border-primary/60 hover:text-primary active:scale-[0.98] transition-all"
          >
            {t.exploreEvents}
            {upcomingCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full h-5 min-w-5 px-1.5 bg-primary text-[11px] font-bold text-primary-foreground">
                {upcomingCount}
              </span>
            )}
          </a>
        </div>

        {/* Metrics */}
        <dl className={`grid ${kubestronautsCount ? "grid-cols-3" : "grid-cols-2"} w-full max-w-2xl divide-x divide-foreground/10 animate-fade-up animate-delay-400`}>
          {[
            { value: membersCount, label: t.members },
            { value: pastCount, label: t.eventsLabel },
            ...(kubestronautsCount
              ? [{ value: kubestronautsCount, label: t.kubestronautsLabel, href: "/team#kubestronauts" }]
              : []),
          ].map((stat) => {
            const body = (
              <>
                <dt className="mt-1 text-[11px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                <dd className="text-2xl md:text-4xl font-heading font-bold text-foreground">
                  {mounted ? <CountUp end={stat.value} /> : "0"}
                </dd>
              </>
            );
            return (
              <div key={stat.label} className="flex flex-col-reverse items-center px-2">
                {stat.href ? (
                  <a href={stat.href} className="flex flex-col-reverse items-center hover:text-primary [&_dt]:hover:text-primary transition-colors">
                    {body}
                  </a>
                ) : body}
              </div>
            );
          })}
        </dl>

        {/* Latin America */}
        <div className="mt-12 md:mt-14 animate-fade-up animate-delay-500">
          <p className="text-xs md:text-sm text-muted-foreground mb-3">{t.latamTitle}</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {latamCommunities.map((c) => (
              <a
                key={c.href}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-foreground/10 text-xs md:text-sm text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors"
              >
                {c.name}
              </a>
            ))}
            <a
              href={links.kcds}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm font-medium text-primary hover:underline"
            >
              {t.allKcds}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-[10%] -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float" />
      <div className="hidden md:block absolute bottom-[10%] -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float animate-delay-float" />
    </section>
  );
};

export default HeroSection;
