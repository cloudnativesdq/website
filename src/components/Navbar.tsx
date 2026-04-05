
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-white/5 py-3" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl tracking-tight flex items-center gap-2">
          <span className="text-primary">Cloud Native</span>
          <span className="hidden sm:inline">SDQ</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-white/10 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-white/10 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            {language === "es" ? "EN" : "ES"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="p-2 rounded-xl glass border border-white/10 text-xs font-bold"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 p-6 flex flex-col gap-6 md:hidden animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-heading font-semibold text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
