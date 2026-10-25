"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import BrandLogo from "@/components/BrandLogo";
import { Activity, ArrowRight, ArrowUpRight, CalendarPlus, Check, MapPin, Palette, Send, Tag, Users } from "lucide-react";

const stepIcons = [MapPin, Users, Tag, Send, Palette, CalendarPlus, Activity];
// Same order as t.chapterGuide.steps; "" means the step has no link.
const stepLinks = ["/map", "", "", links.chapterApply, links.chapterBranding, links.chapterBestPractices, ""];
// Same order as t.chapterGuide.resources.
const resourceLinks = [
  links.chapterGuidelines,
  links.chapterBestPractices,
  links.chapterBranding,
  links.chapterMeetupVsKcd,
  links.chapterOfficeHours,
  links.ocgDocs,
  links.cncfCodeOfConduct,
];

const card = "p-6 md:p-8 rounded-3xl bg-card/60 border border-foreground/10";

export default function StartChapterView() {
  const { t } = useLanguage();
  const g = t.chapterGuide;

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen focus:outline-none">

        <section className="pt-32 pb-20">
          <div className="container px-6 max-w-4xl">
            <header className="mb-10">
              <BrandLogo src="cncg.svg" size={64} className="w-14 h-14 md:w-16 md:h-16 mb-4" alt="Cloud Native Community Groups" />
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{g.title}</h1>
              <p className="text-muted-foreground max-w-2xl">{g.subtitle}</p>
              <a
                href={links.chapterApply}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-7 mt-6 rounded-full bg-primary text-primary-foreground font-heading font-semibold hover:bg-primary/90 transition-colors"
              >
                {g.steps[3].link}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </header>

            <h2 className="text-2xl font-heading font-bold mb-4">{g.stepsTitle}</h2>
            <ol className="space-y-3 mb-10">
              {g.steps.map((step, i) => {
                const href = stepLinks[i];
                const Icon = stepIcons[i];
                return (
                  <li key={step.title} className={`${card} flex gap-4 min-w-0`}>
                    <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-primary/10 text-primary font-heading font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 font-heading font-bold text-lg">
                        <Icon className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mt-1">{step.body}</p>
                      {href && step.link &&
                        (href.startsWith("/") ? (
                          <Link href={href} className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary hover:underline">
                            {step.link}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary hover:underline">
                            {step.link}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ))}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={card}>
                <h2 className="text-xl font-heading font-bold mb-4">{g.benefitsTitle}</h2>
                <ul className="space-y-3">
                  {g.benefits.map((b) => (
                    <li key={b} className="flex gap-2 text-sm">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={card}>
                <h2 className="text-xl font-heading font-bold mb-4">{g.resourcesTitle}</h2>
                {g.resources.map((label, i) => (
                  <a
                    key={label}
                    href={resourceLinks[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-2.5 border-b border-foreground/5 last:border-0 text-sm hover:text-primary transition-colors"
                  >
                    {label}
                    <ArrowUpRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>

            <div className={`${card} mt-6 text-center`}>
              <h2 className="text-xl font-heading font-bold mb-2">{g.helpTitle}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-5">{g.helpBody}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-foreground/15 font-heading font-semibold hover:border-primary/60 hover:text-primary transition-colors"
              >
                {g.helpCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
