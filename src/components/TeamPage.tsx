"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrganizersSection from "@/components/OrganizersSection";
import PageHeader from "@/components/PageHeader";
import CncfPeopleSection from "@/components/CncfPeopleSection";
import type { DominicanCncfPeople } from "@/lib/cncf-people";
import { useLanguage } from "@/hooks/use-language";
import type { CommunityData } from "@/lib/types";
import { links } from "@/lib/links";
import { Mail, Users, CalendarCheck } from "lucide-react";
import { Linkedin, Github } from "@/components/BrandIcons";
import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";

interface TeamPageProps {
  data: CommunityData;
  people: DominicanCncfPeople;
}

export default function TeamPage({ data, people }: TeamPageProps) {
  const { t, language } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-28 md:pt-32 pb-12">
        <div className="container px-4 sm:px-6">
          <PageHeader title={t.teamTitle} subtitle={t.teamSubtitle} center />
          <OrganizersSection organizers={data.organizers} showHeader={false} />
        </div>
      </section>

      <section className="pb-4">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto rounded-3xl bg-card/60 border border-foreground/10 p-6 md:p-10">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:divide-x divide-foreground/10">
              {[
                { icon: <Users className="w-5 h-5 text-primary" />, value: data.membersCount, label: language === "es" ? "Miembros" : "Members" },
                { icon: <CalendarCheck className="w-5 h-5 text-primary" />, value: data.pastCount, label: language === "es" ? "Eventos realizados" : "Events held" },
                { icon: <BrandLogo src="kubestronaut.svg" size={20} className="w-5 h-5" />, value: people.kubestronauts.length, label: t.mapKubestronauts },
                { icon: <BrandLogo src="cncf.svg" size={20} className="w-5 h-5" />, value: people.ambassadors.length, label: t.mapAmbassadors },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center px-2">
                  <dt className="order-2 mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                  <dd className="order-1 flex items-center gap-2 text-3xl md:text-4xl font-heading font-bold tabular-nums">
                    {stat.icon}
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-foreground/10 text-sm text-muted-foreground text-center">
              <BrandLogo src="cncg.svg" size={20} />
              {language === "es" ? "Grupo comunitario oficial de la CNCF" : "Official CNCF Community Group"}
            </p>
          </div>
        </div>
      </section>

      <CncfPeopleSection people={people} />

      <section className="py-20 relative">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-card/60 border border-foreground/10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              {language === "es" ? "¿Quieres ser parte del equipo?" : "Want to be part of the team?"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === "es"
                ? "Siempre estamos buscando personas apasionadas por la tecnología y la comunidad. ¿Te gustaría ayudar a organizar eventos, dar charlas o contribuir de otra manera?"
                : "We're always looking for people passionate about technology and the community. Would you like to help organize events, give talks, or contribute in other ways?"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-heading font-semibold hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {language === "es" ? "Contáctanos" : "Contact Us"}
              </Link>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-foreground/15 text-foreground font-heading font-semibold hover:border-primary/60 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}