"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  Backpack,
  BadgeCheck,
  BookOpen,
  Gift,
  Globe2,
  HandCoins,
  Info,
  MessagesSquare,
  Percent,
  Shirt,
  Star,
  Ticket,
  Users,
} from "lucide-react";

type Icon = React.ElementType;

// Certification path, in the order most people take them.
const kubestronautCerts = [
  { label: "KCNA", logo: "kcna.svg", href: links.certKcna },
  { label: "KCSA", logo: "kcsa.svg", href: links.certKcsa },
  { label: "CKA", logo: "cka.svg", href: links.certCka },
  { label: "CKAD", logo: "ckad.svg", href: links.certCkad },
  { label: "CKS", logo: "cks.svg", href: links.certCks },
];

// Icons follow the order of the benefit lists in translations.
const kubestronautIcons: Icon[] = [Shirt, BadgeCheck, MessagesSquare, Percent, Ticket];
const goldenIcons: Icon[] = [Backpack, BookOpen, Ticket, Ticket, Percent, Star];
const ambassadorIcons: Icon[] = [Award, Globe2, HandCoins, Ticket, Users, Gift];

const card = "rounded-3xl bg-card/60 border border-foreground/10";

function Benefits({ items, icons }: { items: string[]; icons: Icon[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = icons[i] ?? Gift;
        return (
          <li key={item} className="flex gap-3 p-3 rounded-2xl bg-background/60 border border-foreground/5 text-sm leading-snug">
            <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-primary/10 text-primary">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="self-center">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Requirements({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
          <span className="w-1.5 h-1.5 mt-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{children}</h3>;
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm leading-relaxed">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

function OfficialLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 h-9 px-4 rounded-full border border-foreground/15 text-sm font-medium hover:border-primary/60 hover:text-primary transition-colors"
        >
          {l.label}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      ))}
    </div>
  );
}

function SectionHeader({ logo, title, intro }: { logo: string; title: string; intro: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <BrandLogo src={logo} size={72} className="w-14 h-14 md:w-[72px] md:h-[72px]" />
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold">{title}</h2>
        <p className="text-muted-foreground">{intro}</p>
      </div>
    </div>
  );
}

export default function ProgramsView() {
  const { t } = useLanguage();
  const p = t.programs;

  const overview = [
    { id: "kubestronaut", logo: "kubestronaut.svg", title: p.kubestronaut.title, intro: p.kubestronaut.intro, key: p.overview.kubestronaut },
    { id: "golden", logo: "golden-kubestronaut.svg", title: p.golden.title, intro: p.golden.intro, key: p.overview.golden },
    { id: "ambassador", logo: "ambassador.svg", title: p.ambassador.title, intro: p.ambassador.intro, key: p.overview.ambassador },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="container px-4 sm:px-6 max-w-6xl">
          <PageHeader title={p.title} subtitle={p.subtitle} center />

          {/* Pick a program */}
          <nav aria-label={p.title} className="grid gap-3 sm:grid-cols-3 mb-12 md:mb-16">
            {overview.map((o) => (
              <a
                key={o.id}
                href={`#${o.id}`}
                className={`${card} group flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 p-4 sm:p-6 hover:border-primary/50 transition-colors`}
              >
                <BrandLogo src={o.logo} size={80} className="w-14 h-14 sm:w-20 sm:h-20" />
                <span className="flex-1 min-w-0">
                  <span className="block font-heading font-bold text-lg">{o.title}</span>
                  <span className="block text-sm text-muted-foreground mt-0.5">{o.key}</span>
                </span>
                <ArrowDown className="w-4 h-4 shrink-0 text-primary group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
            ))}
          </nav>

          <div className="space-y-8 md:space-y-10">
            {/* Kubestronaut */}
            <article id="kubestronaut" className={`${card} p-5 sm:p-8 md:p-10 scroll-mt-24`}>
              <SectionHeader logo="kubestronaut.svg" title={p.kubestronaut.title} intro={p.kubestronaut.intro} />

              <ColumnTitle>{p.path}</ColumnTitle>
              <ol className="grid grid-cols-5 gap-2 sm:gap-4 mb-8">
                {kubestronautCerts.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 p-2 sm:p-3 rounded-2xl hover:bg-foreground/5 transition-colors"
                    >
                      <BrandLogo src={c.logo} size={96} className="w-12 h-12 sm:w-20 sm:h-20" alt={c.label} />
                      <span className="text-xs sm:text-sm font-semibold group-hover:text-primary">{c.label}</span>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                <div className="space-y-6">
                  <div>
                    <ColumnTitle>{p.requirements}</ColumnTitle>
                    <Requirements items={p.kubestronaut.requirements} />
                  </div>
                  <div>
                    <ColumnTitle>{p.howTo}</ColumnTitle>
                    <p className="text-sm leading-relaxed mb-3">{p.kubestronaut.how}</p>
                    <Callout>
                      {p.kubestronaut.tip}{" "}
                      <Link href="/resources" className="text-primary font-medium hover:underline">
                        {p.cta} →
                      </Link>
                    </Callout>
                  </div>
                </div>
                <div>
                  <ColumnTitle>{p.benefits}</ColumnTitle>
                  <Benefits items={p.kubestronaut.benefits} icons={kubestronautIcons} />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <OfficialLinks
                  items={[
                    { href: links.kubestronautProgram, label: p.links.kubestronaut },
                    { href: links.kubestronautFaq, label: p.links.kubestronautFaq },
                    { href: links.kubestronautStandards, label: p.links.kubestronautStandards },
                  ]}
                />
                <Link href="/team#kubestronauts" className="inline-flex items-center gap-1 text-sm font-semibold hover:text-primary">
                  {p.meetOurs}: {t.kubestronautsTitle}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Golden Kubestronaut */}
            <article id="golden" className={`${card} p-5 sm:p-8 md:p-10 scroll-mt-24 border-warning/40 bg-gradient-to-br from-warning/10 via-card/60 to-card/60`}>
              <SectionHeader logo="golden-kubestronaut.svg" title={p.golden.title} intro={p.golden.intro} />
              <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                <div>
                  <ColumnTitle>{p.requirements}</ColumnTitle>
                  <Requirements items={p.golden.requirements} />
                  <div className="flex items-center gap-3 mt-4">
                    <BrandLogo src="linuxfoundation.png" size={32} className="w-8 h-8" alt="Linux Foundation" />
                    <a href={links.certLfcs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      LFCS
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div>
                  <ColumnTitle>{p.benefits}</ColumnTitle>
                  <Benefits items={p.golden.benefits} icons={goldenIcons} />
                </div>
              </div>
            </article>

            {/* CNCF Ambassador */}
            <article id="ambassador" className={`${card} p-5 sm:p-8 md:p-10 scroll-mt-24`}>
              <SectionHeader logo="ambassador.svg" title={p.ambassador.title} intro={p.ambassador.intro} />

              <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                <div className="space-y-6">
                  <div>
                    <ColumnTitle>{p.requirements}</ColumnTitle>
                    <Requirements items={p.ambassador.requirements} />
                    <ol className="mt-3 space-y-2.5">
                      {p.ambassador.criteria.map((c, i) => (
                        <li key={c} className="flex gap-3 text-sm leading-relaxed">
                          <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                          {c}
                        </li>
                      ))}
                    </ol>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs">
                      <a href={links.devstats} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        DevStats <ArrowUpRight className="w-3 h-3" />
                      </a>
                      <a href={links.cncfMentoring} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        CNCF mentoring <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <ColumnTitle>{p.howTo}</ColumnTitle>
                    <p className="text-sm leading-relaxed mb-3">{p.ambassador.how}</p>
                    <Callout>
                      {p.ambassador.tip}{" "}
                      <Link href="/contact" className="text-primary font-medium hover:underline">
                        {t.nav.contact} →
                      </Link>
                    </Callout>
                  </div>
                </div>
                <div>
                  <ColumnTitle>{p.benefits}</ColumnTitle>
                  <Benefits items={p.ambassador.benefits} icons={ambassadorIcons} />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <OfficialLinks
                  items={[
                    { href: links.ambassadorApply, label: p.links.ambassadorApply },
                    { href: links.ambassadorFaq, label: p.links.ambassadorFaq },
                    { href: links.ambassadorStandards, label: p.links.ambassadorStandards },
                  ]}
                />
                <Link href="/team#ambassadors" className="inline-flex items-center gap-1 text-sm font-semibold hover:text-primary">
                  {p.meetOurs}: {t.ambassadorsTitle}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
