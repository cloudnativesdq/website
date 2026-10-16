"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import Footer from "@/components/Footer";
import EventCalendar from "@/components/EventCalendar";
import EventsSection from "@/components/EventsSection";
import { useLanguage } from "@/hooks/use-language";
import type { CommunityData } from "@/lib/types";
import { ArrowRight, Calendar, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventsPageProps {
  data: CommunityData;
}

export default function EventsPage({ data }: EventsPageProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const tabs = [
    { 
      id: "upcoming" as const, 
      label: language === "es" ? "Próximos" : "Upcoming",
      icon: Calendar,
      count: data.upcoming.length 
    },
    { 
      id: "past" as const, 
      label: language === "es" ? "Pasados" : "Past",
      icon: History,
      count: data.past.length 
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-28 md:pt-32 pb-12">
        <div className="container px-4 sm:px-6">
          <PageHeader
            title={language === "es" ? "Nuestros eventos" : "Our events"}
            subtitle={
              language === "es"
                ? "Meetups, talleres y encuentros sobre tecnologías Cloud Native en Santo Domingo."
                : "Meetups, workshops and gatherings about Cloud Native technologies in Santo Domingo."
            }
          >
            <Link href="/map#events-grid-title" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {language === "es" ? "Ver eventos Cloud Native en todo el mundo" : "See Cloud Native events worldwide"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </PageHeader>

          <div className="flex mb-10">
            <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-foreground/5 border border-foreground/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={cn(
                    "ml-1 px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.id 
                      ? "bg-white/20 text-white" 
                      : "bg-foreground/10 text-muted-foreground"
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <EventCalendar events={data.upcoming} />
        </div>
      </section>

      <section className="pb-16">
        <div className="container px-4 sm:px-6">
          <EventsSection 
            events={activeTab === "upcoming" ? data.upcoming : data.past} 
            title={activeTab === "upcoming" ? t.upcomingEvents : t.pastEvents}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}