
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: language === "es" ? "Inicio" : "Home" },
    { href: "/#events", label: language === "es" ? "Eventos" : "Events" },
    { href: "/contact", label: language === "es" ? "Contacto" : "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-lg xs:text-xl tracking-tight flex items-center gap-1.5 whitespace-nowrap group hover:scale-105 transition-transform duration-300">
          <span className="text-primary group-hover:text-cyan-400 transition-colors">Cloud Native</span>
          <span className="hidden xs:inline">SDQ</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 nav-link-ltr py-1"
            >
              {link.label}
            </Link>
          ))}
          
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glass border border-white/10 text-[10px] font-black uppercase tracking-[0.15em] text-foreground hover:bg-white/10 hover:border-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-xl"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            {language === "es" ? "EN" : "ES"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="px-3 py-1.5 rounded-xl glass border border-white/10 text-[10px] font-black tracking-widest active:scale-90 transition-transform"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/5 text-foreground active:scale-90 transition-all duration-200 border border-white/5"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "absolute top-full left-0 right-0 bg-background/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden transition-all duration-500 ease-in-out px-6 shadow-2xl",
          isMobileMenuOpen ? "max-h-[400px] py-8 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-6 items-center">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-2xl font-heading font-black text-foreground hover:text-primary transition-all duration-300 transform",
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
