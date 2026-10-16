"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import { ArrowRight, ArrowUpRight, Check, Info, Star } from "lucide-react";

const certLinks = [
  { label: "KCNA", href: links.certKcna },
  { label: "KCSA", href: links.certKcsa },
  { label: "CKA", href: links.certCka },
  { label: "CKAD", href: links.certCkad },
  { label: "CKS", href: links.certCks },
];

function List({ items, icon = "check" }: { items: string[]; icon?: "check" | "dot" }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
          {icon === "check" ? (
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          ) : (
            <span className="w-1.5 h-1.5 mt-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-6 mb-3">{children}</h3>;
}

function OfficialLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6 pt-5 border-t border-foreground/10 text-sm">
      {items.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
          {l.label}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      ))}
    </div>
  );
}

const card = "p-6 md:p-8 rounded-3xl bg-card/60 border border-foreground/10";

export default function ProgramsView() {
  const { t } = useLanguage();
  const p = t.programs;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="container px-4 sm:px-6 max-w-6xl">
          <PageHeader title={p.title} subtitle={p.subtitle} center />

          <div className="grid gap-6 lg:grid-cols-2 items-start">
            {/* Kubestronaut + Golden */}
            <article id="kubestronaut" className={`${card} scroll-mt-24`}>
              <div className="flex items-center gap-3">
                <BrandLogo src="kubestronaut.svg" size={48} className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-heading font-bold">{p.kubestronaut.title}</h2>
                  <p className="text-sm text-muted-foreground">{p.kubestronaut.intro}</p>
                </div>
              </div>

              <Label>{p.requirements}</Label>
              <List items={p.kubestronaut.requirements} icon="dot" />
              <div className="flex flex-wrap gap-2 mt-3">
                {certLinks.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-foreground/15 text-xs font-semibold hover:border-primary/60 hover:text-primary"
                  >
                    {c.label}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ))}
              </div>

              <Label>{p.benefits}</Label>
              <List items={p.kubestronaut.benefits} />

              <Label>{p.howTo}</Label>
              <p className="text-sm leading-relaxed">{p.kubestronaut.how}</p>
              <p className="flex gap-2 mt-3 text-sm text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {p.kubestronaut.tip}{" "}
                  <Link href="/resources" className="text-primary hover:underline">
                    {p.cta} →
                  </Link>
                </span>
              </p>

              {/* Golden tier */}
              <div className="mt-6 p-5 rounded-2xl border border-warning/50 bg-warning/5">
                <h3 className="flex items-center gap-2 font-heading font-bold text-lg">
                  <Star className="w-4 h-4 text-warning fill-current" aria-hidden="true" />
                  {p.golden.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{p.golden.intro}</p>
                <List items={p.golden.requirements} icon="dot" />
                <div className="mt-3">
                  <List items={p.golden.benefits} />
                </div>
                <a
                  href={links.certLfcs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:underline"
                >
                  LFCS
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              <OfficialLinks
                items={[
                  { href: links.kubestronautProgram, label: p.links.kubestronaut },
                  { href: links.kubestronautFaq, label: p.links.kubestronautFaq },
                  { href: links.kubestronautStandards, label: p.links.kubestronautStandards },
                ]}
              />
              <Link href="/team#kubestronauts" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold hover:text-primary">
                {p.meetOurs}: {t.kubestronautsTitle}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>

            {/* Ambassador */}
            <article id="ambassador" className={`${card} scroll-mt-24`}>
              <div className="flex items-center gap-3">
                <BrandLogo src="cncf.svg" size={48} className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-heading font-bold">{p.ambassador.title}</h2>
                  <p className="text-sm text-muted-foreground">{p.ambassador.intro}</p>
                </div>
              </div>

              <Label>{p.requirements}</Label>
              <List items={p.ambassador.requirements} icon="dot" />
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

              <Label>{p.benefits}</Label>
              <List items={p.ambassador.benefits} />

              <Label>{p.howTo}</Label>
              <p className="text-sm leading-relaxed">{p.ambassador.how}</p>
              <p className="flex gap-2 mt-3 text-sm text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {p.ambassador.tip}{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    {t.nav.contact} →
                  </Link>
                </span>
              </p>

              <OfficialLinks
                items={[
                  { href: links.ambassadorApply, label: p.links.ambassadorApply },
                  { href: links.ambassadorFaq, label: p.links.ambassadorFaq },
                  { href: links.ambassadorStandards, label: p.links.ambassadorStandards },
                ]}
              />
              <Link href="/team#ambassadors" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold hover:text-primary">
                {p.meetOurs}: {t.ambassadorsTitle}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
