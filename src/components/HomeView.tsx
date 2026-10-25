
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import UpcomingEventsPreview from "@/components/UpcomingEventsPreview";
import OrganizersSection from "@/components/OrganizersSection";
import WcnfSection from "@/components/WcnfSection";
import type { WcnfEvent } from "@/lib/wcnf";
import type { CommunityData, Organizer, CommunityEvent } from "@/lib/types";
import { links } from "@/lib/links";

interface HomeViewProps {
  data: CommunityData;
  kubestronautsCount: number;
  wcnfEvents: WcnfEvent[];
}

export default function HomeView({ data, kubestronautsCount, wcnfEvents }: HomeViewProps) {

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
    "member": data.organizers.map((org: Organizer) => ({
      "@type": "Person",
      "name": org.name,
      "jobTitle": org.role,
      "worksFor": {
        "@type": "Organization",
        "name": org.company
      }
    })),
    "event": data.upcoming.map((event: CommunityEvent) => {
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
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen focus:outline-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <HeroSection
          membersCount={data.membersCount}
          pastCount={data.pastCount}
          upcomingCount={data.upcoming.length}
          kubestronautsCount={kubestronautsCount}
        />
        <UpcomingEventsPreview events={data.upcoming} />

        <OrganizersSection organizers={data.organizers} />
        <WcnfSection events={wcnfEvents} />
      </main>
      <Footer />
    </>
  );
}
