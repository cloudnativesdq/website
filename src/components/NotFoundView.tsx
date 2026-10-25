"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";

export default function NotFoundView() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-[70vh] flex items-center focus:outline-none">
        <section className="container px-4 sm:px-6 pt-32 pb-16 text-center">
          <p className="font-heading font-bold text-6xl md:text-7xl text-primary">404</p>
          <h1 className="mt-4 font-heading font-bold text-3xl md:text-4xl">{t.notFound.title}</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">{t.notFound.body}</p>
          <Link
            href="/"
            className="inline-flex items-center mt-8 h-11 px-6 rounded-full bg-primary text-primary-foreground font-heading font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.notFound.home}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
