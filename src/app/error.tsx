"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";

// Next 16.4 passes `retry` (re-fetch and re-render the segment); `reset` only clears the boundary.
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-[70vh] flex items-center focus:outline-none">
        <section className="container px-4 sm:px-6 pt-32 pb-16 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl">{t.error.title}</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">{t.error.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => retry()}
              className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-heading font-semibold hover:bg-primary/90 transition-colors"
            >
              {t.error.retry}
            </button>
            <Link
              href="/"
              className="inline-flex items-center h-11 px-6 rounded-full border border-foreground/10 font-heading font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              {t.error.home}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
