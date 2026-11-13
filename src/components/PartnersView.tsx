"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";
import { partnerCommunities, partnerJoinMailto } from "@/lib/links";
import { SITE_URL } from "@/lib/seo";
import { ArrowUpRight, Mail } from "lucide-react";

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Comunidades aliadas de Cloud Native Santo Domingo",
  "itemListElement": partnerCommunities.map((p, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "Organization",
      "name": p.name,
      "url": p.href,
      "logo": `${SITE_URL}${p.logo}`,
      ...(p.luma !== p.href && { "sameAs": [p.luma] }),
    },
  })),
};

export default function PartnersView() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen focus:outline-none">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <section className="pt-32 pb-20">
          <div className="container px-6 max-w-4xl">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{t.partners.title}</h1>
              <p className="text-muted-foreground max-w-2xl">{t.partners.subtitle}</p>
              <a
                href={partnerJoinMailto}
                className="inline-flex items-center gap-2 h-12 px-7 mt-6 rounded-full bg-primary text-primary-foreground font-heading font-semibold hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {t.partners.join}
              </a>
              <p className="mt-3 text-sm text-muted-foreground">{t.partners.joinHint}</p>
            </header>
            <ul className="grid gap-6 sm:grid-cols-2">
              {partnerCommunities.map((p) => (
                <li key={p.id} className="flex flex-col rounded-3xl bg-card/60 border border-foreground/10 overflow-hidden">
                  <div className="flex items-center justify-center h-40 p-8" style={{ background: p.logoBg }}>
                    <Image src={p.logo} alt={p.name} width={240} height={80} className="max-h-20 w-auto object-contain" />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h2 className="text-xl font-heading font-bold mb-2">{p.name}</h2>
                    <p className="text-sm text-muted-foreground flex-1">{t.partners.descriptions[p.id]}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                      {[
                        { href: p.href, label: t.partners.visit },
                        ...(p.luma !== p.href ? [{ href: p.luma, label: t.partners.luma }] : []),
                      ].map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {l.label}
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
