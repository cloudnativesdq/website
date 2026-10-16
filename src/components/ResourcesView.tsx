"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";
import CardGrid, { type CardCategory, type CardItem } from "@/components/CardGrid";
import { useLanguage } from "@/hooks/use-language";
import { links, latamCommunities } from "@/lib/links";
import type { Coupon, CncfCourse, Article, Orientation, Video } from "@/lib/cncf-resources";
import { ArrowRight, ArrowUpRight, Github, Tag } from "lucide-react";

interface ResourcesViewProps {
  coupon: Coupon | null;
  courses: CncfCourse[];
  videos: Video[];
  blogs: { io: Article[]; dev: Article[] };
  orientations: Orientation[];
}

const logoImage = (file: string) => ({ image: `/logos/${file}`, imageFit: "contain" as const });

export default function ResourcesView({ coupon, courses, videos, blogs, orientations }: ResourcesViewProps) {
  const { t, language } = useLanguage();
  const locale = language === "es" ? "es-DO" : "en-US";
  const fmtDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const categories: CardCategory[] = [
    { id: "videos", label: t.resourcesGrid.videos, logo: "freecodecamp.png" },
    { id: "courses", label: t.resourcesGrid.courses, logo: "cncf.svg" },
    { id: "certs", label: t.certsTitle, logo: "kubestronaut.svg" },
    { id: "platforms", label: t.learnTitle, logo: "kodekloud.png" },
    { id: "contribute", label: t.k8sContributeTitle, logo: "kubernetes.png" },
    { id: "blogs", label: t.k8sBlogsTitle, logo: "kubernetes-dev.png" },
    { id: "communities", label: t.communitiesTitle, logo: "cncg.svg" },
  ];

  const items: CardItem[] = [
    ...videos.map((v) => ({
      category: "videos",
      title: v.title,
      url: v.url,
      image: v.thumbnail,
      subtitle: "freeCodeCamp · YouTube",
      footer: fmtDate.format(new Date(v.date)),
      sortDate: v.date,
    })),
    ...courses.map((c) => ({
      category: "courses",
      title: c.title,
      url: c.url,
      subtitle: t.resourcesGrid.freeCourse,
      footer: `cncf.io · ${fmtDate.format(new Date(c.date))}`,
      sortDate: c.date,
    })),
    { category: "certs", title: t.programs.title, url: "/programs", external: false, ...logoImage("kubestronaut.svg"), subtitle: "Kubestronaut · Golden Kubestronaut · CNCF Ambassador", footer: "cloudnativesdq.org" },
    { category: "certs", title: t.certsAll, url: links.cncfCertifications, ...logoImage("cncf.svg"), footer: "cncf.io" },
    { category: "certs", title: t.kubestronautProgram, url: links.kubestronautProgram, ...logoImage("kubestronaut.svg"), footer: "cncf.io" },
    { category: "platforms", title: "KodeKloud", url: links.kodekloud, ...logoImage("kodekloud.png"), footer: "kodekloud.com" },
    { category: "platforms", title: "Linux Foundation Training", url: links.lfTraining, ...logoImage("linuxfoundation.png"), footer: "training.linuxfoundation.org" },
    { category: "platforms", title: "Killercoda", url: links.killercoda, ...logoImage("killercoda.png"), footer: "killercoda.com" },
    ...(orientations.length
      ? orientations.map((o) => ({
          category: "contribute",
          title: o.title,
          url: o.url,
          date: o.start,
          sortDate: o.start,
          subtitle: t.ncoTitle,
          footer: "kubernetes.dev",
        }))
      : [{ category: "contribute", title: t.ncoCalendar, url: links.k8sCalendar, subtitle: t.ncoTitle, ...logoImage("kubernetes-dev.png"), footer: "kubernetes.dev" }]),
    { category: "contribute", title: t.k8sContributorGuide, url: links.k8sContributorGuide, ...logoImage("kubernetes-dev.png"), footer: "kubernetes.dev" },
    { category: "contribute", title: t.k8sMaintainer, url: links.k8sMembership, ...logoImage("kubernetes.png"), footer: "github.com/kubernetes" },
    { category: "contribute", title: t.k8sMailingList, url: links.k8sDevMailingList, ...logoImage("kubernetes.png"), footer: "groups.google.com" },
    { category: "contribute", title: t.k8sSigs, url: links.k8sCommunityGroups, ...logoImage("kubernetes-dev.png"), footer: "kubernetes.dev" },
    { category: "contribute", title: t.k8sVolunteer, url: links.k8sVolunteer, ...logoImage("kubernetes.png"), footer: "github.com/kubernetes" },
    ...[
      ...blogs.io.map((a) => ({ ...a, source: "kubernetes.io", logo: "kubernetes.png" })),
      ...blogs.dev.map((a) => ({ ...a, source: "kubernetes.dev", logo: "kubernetes-dev.png" })),
    ]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((a) => ({
        category: "blogs",
        title: a.title,
        url: a.url,
        ...logoImage(a.logo),
        subtitle: a.source,
        footer: fmtDate.format(new Date(a.date)),
        sortDate: a.date,
      })),
    { category: "communities", title: t.joinSlack, url: links.cncfSlack, ...logoImage("slack.png"), footer: "slack.cncf.io" },
    { category: "communities", title: t.communityGroups, url: links.cncfCommunityGroups, ...logoImage("cncg.svg"), footer: "community.cncf.io" },
    { category: "communities", title: "Kubernetes Community Days (KCDs)", url: links.kcds, ...logoImage("kubernetes.png"), footer: "cncf.io" },
    { category: "communities", title: "Cloud Native Days", url: links.cloudNativeDays, ...logoImage("cloudnativedays.png"), footer: "cloudnativedays.org" },
    ...latamCommunities.map((c) => ({ category: "communities", title: c.name, url: c.href, ...logoImage("cncg.svg"), footer: "community.cncf.io" })),
  ];

  // Newest first across every category; undated links (platforms, guides, communities) go last.
  items.sort((a, b) => (b.sortDate ?? "").localeCompare(a.sortDate ?? ""));

  const moreSources = [
    { href: links.cncfCourses, label: t.allCourses },
    { href: links.freeCodeCampDevOps, label: t.freeCodeCampMore },
    { href: links.k8sBlog, label: "kubernetes.io/blog" },
    { href: links.k8sDevBlog, label: "kubernetes.dev/blog" },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-16">
        <div className="container px-4 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-3">{t.resourcesTitle}</h1>
            <p className="text-muted-foreground max-w-2xl">{t.resourcesSubtitle}</p>
          </header>

          {/* Discount */}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-card/60 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary shrink-0">
                <Tag className="w-6 h-6" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{t.discountsTitle}</p>
                {coupon ? (
                  <>
                    <p className="font-heading font-semibold text-lg mt-1">{coupon.title}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t.couponCode}:{" "}
                      <code className="px-2 py-1 rounded-md bg-primary/10 text-primary font-mono font-semibold select-all break-all">{coupon.code}</code>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-1">{t.couponFallback}</p>
                )}
                <a href={links.lfCoupons} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-primary">
                  <Github className="w-3.5 h-3.5" />
                  {t.couponSource}
                </a>
              </div>
              {coupon && (
                <a
                  href={coupon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
                >
                  {t.getDiscount}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <CardGrid id="resources-grid" title={t.resourcesGrid.title} categories={categories} items={items} />

          <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-foreground/10 bg-card/60 p-6">
            <div className="flex items-center gap-3">
              <BrandLogo src="cncg.svg" size={40} className="w-10 h-10" />
              <Link href="/start-a-chapter" className="inline-flex items-center gap-1 font-heading font-semibold hover:text-primary">
                {t.chapterGuide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {moreSources.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                  {s.label}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
