"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { links } from "@/lib/links";
import { Menu, X, Globe, Sun, Moon, ChevronDown, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";

type NavItem = { href: string; label: string; external?: boolean };
type NavGroup = { label: string; items: NavItem[] } | { label: string; href: string };

const isGroup = (g: NavGroup): g is { label: string; items: NavItem[] } => "items" in g;

function NavItemLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {item.label}
      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
    </a>
  ) : (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll(); // the page can load already scrolled (anchors, back navigation)
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click or Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  const groups: NavGroup[] = [
    {
      label: t.nav.events,
      items: [
        { href: "/events", label: t.nav.upcomingEvents },
        { href: "/gallery", label: t.nav.gallery },
      ],
    },
    {
      label: t.nav.community,
      items: [
        { href: "/team", label: t.nav.team },
        { href: "/team#kubestronauts", label: t.nav.people },
        { href: "/programs", label: t.programs.nav },
        { href: "/#wcnf", label: "Women in Cloud Native" },
        { href: "/map", label: t.nav.map },
        { href: "/start-a-chapter", label: t.nav.startChapter },
      ],
    },
    { label: t.nav.learn, href: "/resources" },
  ];

  const joinItems: NavItem[] = [
    { href: links.cncfCommunity, label: t.nav.joinOcg, external: true },
    { href: links.whatsapp, label: t.nav.whatsapp, external: true },
    { href: links.cncfSlack, label: t.nav.slack, external: true },
    { href: "/contact", label: t.nav.contact },
  ];

  const dropdownItem =
    "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-foreground/5 hover:text-primary transition-colors";

  // Language + theme as one compact pill.
  const settings = (
    <div className="flex items-center rounded-full glass border border-foreground/10">
      <button
        onClick={() => setLanguage(language === "es" ? "en" : "es")}
        className="flex items-center gap-1.5 min-h-10 px-3 rounded-l-full text-[11px] font-bold tracking-wider hover:text-primary transition-colors"
        aria-label={t.nav.language}
        title={t.nav.language}
      >
        <Globe className="w-3.5 h-3.5 text-primary" />
        {language === "es" ? "EN" : "ES"}
      </button>
      <span className="w-px h-5 bg-foreground/10" aria-hidden="true" />
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="flex items-center justify-center min-h-10 min-w-10 px-3 rounded-r-full hover:text-primary transition-colors"
        aria-label={t.nav.theme}
        title={t.nav.theme}
      >
        {/* Icons switch via the dark selector, so server and client render the same markup. */}
        <Sun className="w-4 h-4 text-primary hidden dark:block" />
        <Moon className="w-4 h-4 text-primary dark:hidden" />
      </button>
    </div>
  );

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 py-4",
        isScrolled || isMobileMenuOpen
          ? "bg-background/90 backdrop-blur-xl border-b border-foreground/5 py-3 shadow-2xl"
          : "bg-transparent"
      )}
    >
      <div className="container px-0 sm:px-4 flex items-center justify-between gap-4">
        <Link href="/" onClick={close} className="font-heading font-bold text-base md:text-xl tracking-tight flex items-center gap-1.5 whitespace-nowrap group">
          <span className="text-primary">Cloud Native</span>
          <span>SDQ</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {groups.map((g) =>
            isGroup(g) ? (
              <div key={g.label} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === g.label ? null : g.label)}
                  aria-expanded={openMenu === g.label}
                  aria-haspopup="true"
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold transition-colors",
                    openMenu === g.label ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {g.label}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", openMenu === g.label && "rotate-180")} />
                </button>
                {openMenu === g.label && (
                  <div className="absolute left-0 top-full mt-2 w-64 p-2 rounded-2xl bg-popover border border-foreground/10 shadow-2xl">
                    {g.items.map((item) => (
                      <NavItemLink key={item.href} item={item} className={dropdownItem} onClick={close} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={g.href}
                href={g.href}
                onClick={close}
                className="px-3 py-2 rounded-full text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {g.label}
              </Link>
            )
          )}

          <div className="relative ml-2">
            <button
              onClick={() => setOpenMenu(openMenu === "join" ? null : "join")}
              aria-expanded={openMenu === "join"}
              aria-haspopup="true"
              className="flex items-center gap-1 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-heading font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.nav.join}
              <ChevronDown className={cn("w-4 h-4 transition-transform", openMenu === "join" && "rotate-180")} />
            </button>
            {openMenu === "join" && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-popover border border-foreground/10 shadow-2xl">
                {joinItems.map((item) => (
                  <NavItemLink key={item.href} item={item} className={dropdownItem} onClick={close} />
                ))}
              </div>
            )}
          </div>

          <div className="ml-2">{settings}</div>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          {settings}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-h-10 min-w-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground border border-foreground/10"
            aria-label={t.nav.menu}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-background border-b border-foreground/10 overflow-y-auto transition-all duration-300 px-6 shadow-2xl",
          isMobileMenuOpen ? "max-h-[calc(100vh-4rem)] py-6 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {groups.map((g) =>
            isGroup(g) ? (
              <div key={g.label}>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{g.label}</p>
                <div className="flex flex-col">
                  {g.items.map((item) => (
                    <NavItemLink key={item.href} item={item} className="py-2 text-lg font-heading font-semibold text-foreground hover:text-primary" onClick={close} />
                  ))}
                </div>
              </div>
            ) : (
              <Link key={g.href} href={g.href} onClick={close} className="text-lg font-heading font-semibold text-foreground hover:text-primary">
                {g.label}
              </Link>
            )
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t.nav.join}</p>
            <div className="grid grid-cols-2 gap-2">
              {joinItems.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  className="flex items-center justify-center gap-1 min-h-11 px-3 rounded-2xl border border-foreground/10 text-sm font-semibold text-center hover:border-primary/50 hover:text-primary"
                  onClick={close}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
