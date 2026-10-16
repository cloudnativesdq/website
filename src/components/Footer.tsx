"use client";

import Link from "next/link";
import { Mail, Presentation, Mic2, Braces, ArrowUpRight } from "lucide-react";
import { Instagram, Linkedin, Github, Youtube } from "@/components/BrandIcons";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import BrandLogo from "@/components/BrandLogo";

const linkClass = "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors";

// Repeats every page and external link so nothing depends on the (shorter) navbar.
export default function Footer() {
  const { t } = useLanguage();

  const explore = [
    { href: "/events", label: t.nav.upcomingEvents },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/team", label: t.nav.team },
    { href: "/team#kubestronauts", label: t.nav.people },
    { href: "/programs", label: t.programs.nav },
    { href: "/#wcnf", label: "Women in Cloud Native" },
    { href: "/map", label: t.nav.map },
    { href: "/start-a-chapter", label: t.nav.startChapter },
    { href: "/resources", label: t.nav.learn },
    { href: "/contact", label: t.nav.contact },
  ];

  const connect = [
    { href: links.cncfMain, label: "Cloud Native Computing Foundation", logo: "cncf.svg" },
    { href: links.cncfSlack, label: t.nav.slack, logo: "slack.png" },
    { href: links.slides, label: t.footer.slides, icon: Presentation },
    { href: links.cfp, label: t.footer.cfp, icon: Mic2 },
  ];

  const socials = [
    { icon: Instagram, href: links.instagram, label: "Instagram" },
    { icon: Linkedin, href: links.linkedin, label: "LinkedIn" },
    { icon: Youtube, href: links.youtube, label: "YouTube" },
    { icon: WhatsAppIcon, href: links.whatsapp, label: "WhatsApp" },
    { icon: Github, href: links.githubOrg, label: "GitHub" },
    { icon: Mail, href: links.emailMailto, label: "Email" },
  ];

  return (
    <footer className="relative mt-16 border-t border-foreground/5 bg-surface/40">
      <div className="container px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-heading font-bold text-xl">
              <span className="text-primary">Cloud Native</span> SDQ
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">{t.heroSubtitle}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl border border-foreground/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t.footer.explore}>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">{t.footer.explore}</p>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">{t.footer.connect}</p>
            <ul className="flex flex-col gap-2">
              {connect.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {l.logo ? <BrandLogo src={l.logo} size={16} /> : l.icon && <l.icon className="w-4 h-4" />}
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
              <li>
                <a href="/api" className={linkClass}>
                  <Braces className="w-4 h-4" />
                  API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Cloud Native SDQ</span>
          <span>{t.footer.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
