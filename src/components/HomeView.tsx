
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
import { SITE_URL } from "@/lib/seo";
import { parseEventDate } from "@/lib/event-utils";

interface HomeViewProps {
  data: CommunityData;
  kubestronautsCount: number;
  wcnfEvents: WcnfEvent[];
}

export default function HomeView({ data, kubestronautsCount, wcnfEvents }: HomeViewProps) {

  const orgId = `${SITE_URL}/#organization`;

  // Date-only fallback for sources that give display text without an ISO instant (OCG).
  const startDateOf = (event: CommunityEvent) => {
    if (event.startDate) return event.startDate;
    const d = parseEventDate(event.date);
    if (!d) return undefined;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        "name": "Cloud Native Santo Domingo",
        "alternateName": "Cloud Native SDQ",
        "url": SITE_URL,
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
        }))
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "name": "Cloud Native Santo Domingo",
        "url": SITE_URL,
        "inLanguage": "es",
        "publisher": { "@id": orgId }
      },
      // An Event without startDate is invalid for search engines, so skip events with no parseable date.
      ...data.upcoming.flatMap((event: CommunityEvent) => {
        const isVirtual = /virtual|online/i.test(event.location ?? "");
        const startDate = startDateOf(event);
        if (!startDate) return [];
        return [{
          "@type": "Event",
          "name": event.title,
          "startDate": startDate,
          ...(event.endDate && event.endDate !== startDate && { "endDate": event.endDate }),
          "eventAttendanceMode": isVirtual
            ? "https://schema.org/OnlineEventAttendanceMode"
            : "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": isVirtual
            ? { "@type": "VirtualLocation", "url": event.url }
            : {
                "@type": "Place",
                "name": event.location || "Santo Domingo",
                "address": { "@type": "PostalAddress", "addressLocality": "Santo Domingo", "addressCountry": "DO" }
              },
          "image": event.image || links.siteLogo,
          "url": event.url,
          "description": `${event.title} - Evento de la comunidad Cloud Native Santo Domingo.`,
          "organizer": { "@id": orgId },
          "offers": {
            "@type": "Offer",
            "price": 0,
            "priceCurrency": "USD",
            "url": event.url,
            "availability": event.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
          }
        }];
      })
    ]
  };

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen focus:outline-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape "<" so a scraped event title cannot close the script tag.
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c")
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
