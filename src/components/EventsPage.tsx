"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import EventCalendar from "@/components/EventCalendar";
import EventsSection from "@/components/EventsSection";
import { useLanguage } from "@/hooks/use-language";
import { Calendar, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventsPageProps {
  data: any;
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
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        
        <div className="container px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-heading font-black mb-4">
              <span className="text-gradient">{language === "es" ? "Nuestros Eventos" : "Our Events"}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === "es" 
                ? "Meetups, talleres y encuentros sobre tecnologías Cloud Native en Santo Domingo"
                : "Meetups, workshops and gatherings about Cloud Native technologies in Santo Domingo"}
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={cn(
                    "ml-1 px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.id 
                      ? "bg-white/20 text-white" 
                      : "bg-white/10 text-muted-foreground"
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

      <section className="pb-24">
        <div className="container px-6">
          <EventsSection 
            events={activeTab === "upcoming" ? data.upcoming : data.past} 
            title={activeTab === "upcoming" ? t.upcomingEvents : t.pastEvents}
          />
        </div>
      </section>
    </main>
  );
}