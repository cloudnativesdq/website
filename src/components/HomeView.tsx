
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OrganizersSection from "@/components/OrganizersSection";
import { Instagram, Linkedin, Mail, Github, Youtube, Presentation, Mic2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";

interface HomeViewProps {
  data: any;
}

export default function HomeView({ data }: HomeViewProps) {
  const { t, language } = useLanguage();

  const parseEventDate = (dateStr: string) => {
    const match = dateStr.match(/(\w+)\s+(\d+),\s*(\d+)/);
    if (match) {
      const [, month, day, year] = match;
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(`${month} ${day}, ${fullYear}`);
    }
    return new Date(dateStr);
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cloud Native Santo Domingo",
    "alternateName": "CNCD SDQ",
    "url": links.siteUrl,
    "logo": links.siteLogo,
    "sameAs": [
      links.instagram,
      links.linkedin,
      links.youtube,
      links.githubOrg,
      links.cncfCommunity
    ],
    "description": "Comunidad oficial de Cloud Native Computing Foundation (CNCF) en Santo Domingo, República Dominicana. Eventos, charlas y networking sobre Kubernetes, Docker y el ecosistema Cloud Native.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Santo Domingo",
      "addressRegion": "Santo Domingo",
      "addressCountry": "DO"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Dominican Republic"
    },
    "member": data.organizers.map((org: any) => ({
      "@type": "Person",
      "name": org.name,
      "jobTitle": org.role,
      "worksFor": {
        "@type": "Organization",
        "name": org.company
      }
    })),
    "event": data.upcoming.map((event: any) => {
      const eventDate = parseEventDate(event.date);
      return {
        "@type": "Event",
        "name": event.title,
        "startDate": eventDate.toISOString(),
        "endDate": eventDate.toISOString(),
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": event.location?.toLowerCase().includes("virtual") 
            ? "VirtualLocation" 
            : "Place",
          "name": event.location || "Santo Domingo",
          ...(event.location?.toLowerCase().includes("virtual") 
            ? { "url": event.url }
            : { "address": { "@type": "PostalAddress", "addressLocality": "Santo Domingo", "addressCountry": "DO" } }
          )
        },
        "image": event.image || links.siteLogo,
        "url": event.url,
        "description": `${event.title} - Evento de la comunidad Cloud Native Santo Domingo.`,
        "organizer": {
          "@type": "Organization",
          "name": "Cloud Native Santo Domingo",
          "url": links.siteUrl
        }
      };
    })
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <Navbar />
      <HeroSection membersCount={data.membersCount} pastCount={data.pastCount} upcomingCount={data.upcoming.length} />
      
      <OrganizersSection organizers={data.organizers} />
      <footer className="relative py-20 mt-24 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-surface/20 backdrop-blur-3xl -z-10" />
        <div className="container px-6">
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              {[
                { icon: Instagram, href: links.instagram, label: "Instagram" },
                { icon: Linkedin, href: links.linkedin, label: "LinkedIn" },
                { icon: Youtube, href: links.youtube, label: "YouTube" },
                { icon: Github, href: links.github, label: "GitHub" },
                { icon: Mail, href: links.emailMailto, label: "Email" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl glass-darker flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-white/5 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-4">
                <a
                  href={links.cncfMain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
                >
                  Cloud Native Computing Foundation
                </a>
                <span className="hidden md:block text-white/10">|</span>
                <a
                  href={links.slides}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Presentation className="w-4 h-4" />
                  {language === "es" ? "Presentaciones" : "Slide Decks"}
                </a>
                <span className="hidden md:block text-white/10">|</span>
                <a
                  href={links.cfp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Mic2 className="w-4 h-4" />
                  {language === "es" ? "Postular Charla" : "Call for Speakers"}
                </a>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] font-bold">
                <span>© {new Date().getFullYear()} Cloud Native SDQ</span>
                <span className="hidden md:block text-primary/20">•</span>
                <span>Santo Domingo, {language === "es" ? "República Dominicana" : "Dominican Republic"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative corner glow */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      </footer>
    </main>
  );
}
