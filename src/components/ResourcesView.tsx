"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage } from "@/hooks/use-language";
import { links, latamCommunities } from "@/lib/links";
import Image from "next/image";
import type { Coupon, CncfCourse, Article, Orientation, Video } from "@/lib/cncf-resources";
import { ArrowRight, ArrowUpRight, Award, BookOpen, Github, GitPullRequest, Newspaper, Play, Tag, Users } from "lucide-react";

interface ResourcesViewProps {
  coupon: Coupon | null;
  courses: CncfCourse[];
  videos: Video[];
  blogs: { io: Article[]; dev: Article[] };
  orientations: Orientation[];
}

const card = "p-6 md:p-8 rounded-3xl bg-card/60 border border-foreground/10";
const linkRow =
  "group flex items-center justify-between gap-4 py-3 border-b border-foreground/5 last:border-0 text-foreground/90 hover:text-primary transition-colors";

const ExternalRow = ({ href, logo, children }: { href: string; logo?: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkRow}>
    <span className="flex items-center gap-3 min-w-0 break-words">
      {logo && <BrandLogo src={logo} />}
      <span className="min-w-0">{children}</span>
    </span>
    <ArrowUpRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" />
  </a>
);

const SectionTitle = ({ icon: Icon, logo, children }: { icon: React.ElementType; logo?: string; children: React.ReactNode }) => (
  <h2 className="flex items-center gap-2 text-xl md:text-2xl font-heading font-bold mb-4">
    {logo ? <BrandLogo src={logo} size={24} /> : <Icon className="w-5 h-5 shrink-0 text-primary" />}
    {children}
  </h2>
);

const MoreLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline">
    {children}
    <ArrowRight className="w-3.5 h-3.5" />
  </a>
);

export default function ResourcesView({ coupon, courses, videos, blogs, orientations }: ResourcesViewProps) {
  const { t, language } = useLanguage();
  const fmtTime = new Intl.DateTimeFormat(language === "es" ? "es-DO" : "en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container px-6 max-w-5xl">
          <header className="mb-10 md:mb-14">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">{t.resourcesTitle}</h1>
            <p className="text-muted-foreground max-w-2xl">{t.resourcesSubtitle}</p>
          </header>

          {/* Discount */}
          <div className={`${card} mb-6 border-primary/30`}>
            <SectionTitle icon={Tag}>{t.discountsTitle}</SectionTitle>
            {coupon ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-medium mb-2">{coupon.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.couponCode}:{" "}
                    <code className="px-2 py-1 rounded-md bg-primary/10 text-primary font-mono font-semibold select-all break-all">{coupon.code}</code>
                  </p>
                </div>
                <a
                  href={coupon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
                >
                  {t.getDiscount}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-muted-foreground">{t.couponFallback}</p>
            )}
            <a href={links.lfCoupons} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-xs text-muted-foreground hover:text-primary">
              <Github className="w-3.5 h-3.5" />
              {t.couponSource}
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className={card}>
              <SectionTitle icon={Award}>{t.certsTitle}</SectionTitle>
              <ExternalRow href={links.cncfCertifications} logo="cncf.svg">{t.certsAll}</ExternalRow>
              <ExternalRow href={links.kubestronautProgram} logo="kubestronaut.svg">{t.kubestronautProgram}</ExternalRow>
            </div>

            {/* Where to learn */}
            <div className={card}>
              <SectionTitle icon={BookOpen}>{t.learnTitle}</SectionTitle>
              <ExternalRow href={links.kodekloud} logo="kodekloud.png">KodeKloud</ExternalRow>
              <ExternalRow href={links.lfTraining} logo="linuxfoundation.png">Linux Foundation Training</ExternalRow>
              <ExternalRow href={links.killercoda} logo="killercoda.png">Killercoda</ExternalRow>
            </div>

            {/* Free courses (live) */}
            <div className={`${card} flex flex-col`}>
              <SectionTitle icon={BookOpen} logo="cncf.svg">{t.freeCoursesTitle}</SectionTitle>
              {courses.length ? (
                // Fills the card down to the height of the events card next to it; scrolls past that.
                <div className="relative flex-1 min-h-80">
                  <div className="absolute inset-0 overflow-y-auto pr-2">
                    {courses.map((c) => (
                      <ExternalRow key={c.url} href={c.url}>{c.title}</ExternalRow>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t.unavailable}</p>
              )}
              <MoreLink href={links.cncfCourses}>{t.allCourses}</MoreLink>
            </div>

            {/* Contribute to Kubernetes */}
            <div className={card}>
              <SectionTitle icon={GitPullRequest} logo="kubernetes.png">{t.k8sContributeTitle}</SectionTitle>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mt-2 mb-1">{t.ncoTitle}</p>
              {orientations.length ? (
                orientations.map((o) => (
                  <a key={o.url + o.start} href={o.url} target="_blank" rel="noopener noreferrer" className={linkRow}>
                    <span className="flex flex-col min-w-0 break-words">
                      <span>{o.title}</span>
                      <span className="text-xs text-muted-foreground">{fmtTime.format(new Date(o.start))}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" />
                  </a>
                ))
              ) : (
                <ExternalRow href={links.k8sCalendar}>{t.ncoCalendar}</ExternalRow>
              )}
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mt-5 mb-1">{t.k8sGetStarted}</p>
              <ExternalRow href={links.k8sContributorGuide}>{t.k8sContributorGuide}</ExternalRow>
              <ExternalRow href={links.k8sMembership}>{t.k8sMaintainer}</ExternalRow>
              <ExternalRow href={links.k8sDevMailingList}>{t.k8sMailingList}</ExternalRow>
              <ExternalRow href={links.k8sCommunityGroups}>{t.k8sSigs}</ExternalRow>
              <ExternalRow href={links.k8sVolunteer}>{t.k8sVolunteer}</ExternalRow>
            </div>

            {/* Kubernetes blogs (live) */}
            <div className={card}>
              <SectionTitle icon={Newspaper} logo="kubernetes.png">{t.k8sBlogsTitle}</SectionTitle>
              {[
                { label: "kubernetes.io", items: blogs.io, href: links.k8sBlog, logo: "kubernetes.png" },
                { label: "kubernetes.dev", items: blogs.dev, href: links.k8sDevBlog, logo: "kubernetes-dev.png" },
              ].map((b) => (
                <div key={b.label} className="mb-4 last:mb-0">
                  <a href={b.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary">
                    <BrandLogo src={b.logo} size={16} />
                    {b.label}
                  </a>
                  {b.items.length ? (
                    b.items.map((a) => <ExternalRow key={a.url} href={a.url}>{a.title}</ExternalRow>)
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">{t.unavailable}</p>
                  )}
                </div>
              ))}
            </div>

            {/* freeCodeCamp videos (live) */}
            <div className={`${card} md:col-span-2`}>
              <SectionTitle icon={BookOpen} logo="freecodecamp.png">{t.freeCodeCampTitle}</SectionTitle>
              {videos.length ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((v) => (
                    <li key={v.id}>
                      <a href={v.url} target="_blank" rel="noopener noreferrer" className="group block">
                        <span className="relative block aspect-video rounded-2xl overflow-hidden bg-muted">
                          <Image src={v.thumbnail} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform group-hover:scale-105" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </span>
                          </span>
                        </span>
                        <span className="block mt-2 text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary">{v.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{t.unavailable}</p>
              )}
              <MoreLink href={links.freeCodeCampDevOps}>{t.freeCodeCampMore}</MoreLink>
            </div>

            {/* Communities */}
            <div className={`${card} md:col-span-2`}>
              <SectionTitle icon={Users}>{t.communitiesTitle}</SectionTitle>
              <Link href="/start-a-chapter" className="inline-flex items-center gap-1 mb-3 text-sm font-medium text-primary hover:underline">
                {t.chapterGuide.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="grid sm:grid-cols-2 gap-x-8">
                <ExternalRow href={links.cncfSlack} logo="slack.png">{t.joinSlack}</ExternalRow>
                <ExternalRow href={links.cncfCommunityGroups} logo="cncg.svg">{t.communityGroups}</ExternalRow>
                <ExternalRow href={links.kcds} logo="kubernetes.png">Kubernetes Community Days (KCDs)</ExternalRow>
                <ExternalRow href={links.cloudNativeDays} logo="cloudnativedays.png">Cloud Native Days</ExternalRow>
                {latamCommunities.map((c) => (
                  <ExternalRow key={c.href} href={c.href} logo="cncg.svg">{c.name}</ExternalRow>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
