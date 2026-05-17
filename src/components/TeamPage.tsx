"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import OrganizersSection from "@/components/OrganizersSection";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import { Linkedin, Mail, Github } from "lucide-react";
import Link from "next/link";

interface TeamPageProps {
  data: any;
}

export default function TeamPage({ data }: TeamPageProps) {
  const { t, language } = useLanguage();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />
        
        <div className="container px-6 relative z-10">
          <OrganizersSection organizers={data.organizers} />
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-[2rem] bg-white/5 border border-white/10">
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground font-heading font-black rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
              >
                <Mail className="w-5 h-5" />
                {language === "es" ? "Contáctanos" : "Contact Us"}
              </Link>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-foreground font-heading font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="container px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-heading font-black text-primary">+{data.membersCount}</span>
              </div>
              <h3 className="text-lg font-heading font-bold mb-2">{language === "es" ? "Miembros" : "Members"}</h3>
              <p className="text-muted-foreground text-sm">
                {language === "es" 
                  ? "En nuestra comunidad de Meetup" 
                  : "In our Meetup community"}
              </p>
            </div>
            <div className="text-center p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-3xl font-heading font-black text-blue-400">+{data.pastCount}</span>
              </div>
              <h3 className="text-lg font-heading font-bold mb-2">{language === "es" ? "Eventos Realizados" : "Events Held"}</h3>
              <p className="text-muted-foreground text-sm">
                {language === "es" 
                  ? "Meetups, talleres y más" 
                  : "Meetups, workshops and more"}
              </p>
            </div>
            <div className="text-center p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                <span className="text-3xl font-heading font-black text-cyan-400">CNCF</span>
              </div>
              <h3 className="text-lg font-heading font-bold mb-2">{language === "es" ? "Comunidad Oficial" : "Official Community"}</h3>
              <p className="text-muted-foreground text-sm">
                {language === "es" 
                  ? "Grupo comunitario oficial de CNCF" 
                  : "Official CNCF Community Group"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}