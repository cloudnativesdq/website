
"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Github, Instagram, Linkedin, Youtube } from "@/components/BrandIcons";
import { cn } from "@/lib/utils";
import { sendEmail } from "@/app/actions/send-email";
import { links } from "@/lib/links";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function ContactView() {
  const { t, language } = useLanguage();
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<"invalid" | "unavailable" | null>(null);
  // Client-side mount time. Not rendered into the HTML: the page is prerendered, so a server value would be build time.
  const [renderedAt] = useState(() => Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    setErrorCode(null);

    const formData = new FormData(e.currentTarget);
    formData.set("t", String(Date.now() - renderedAt));
    const result = await sendEmail(formData).catch(() => ({ error: "unavailable" as const }));

    if ("success" in result) {
      setFormState("success");
    } else {
      setFormState("error");
      setErrorCode(result.error);
    }
  };

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen bg-background focus:outline-none">
      
      <section className="pt-28 md:pt-32 pb-16">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl">
            <PageHeader title={t.contactTitle} subtitle={t.contactSubtitle} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8 animate-fade-up animate-delay-200">
                <div className="p-8 rounded-3xl bg-card/60 border border-foreground/10">
                  <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                    <Mail className="w-6 h-6 text-primary" />
                    Email
                  </h2>
                  <a 
                    href={links.emailMailto}
                    className="text-lg md:text-xl font-medium text-foreground hover:text-primary transition-colors block mb-2 break-all"
                  >
                    {links.email}
                  </a>
                  <p className="text-muted-foreground text-sm">
                    {language === "es" ? "Te responderemos lo antes posible." : "We'll get back to you as soon as possible."}
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-card/60 border border-foreground/10">
                  <h2 className="text-2xl font-heading font-bold mb-6">{t.contactSocial}</h2>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { icon: Instagram, href: links.instagram, label: "Instagram" },
                      { icon: Linkedin, href: links.linkedin, label: "LinkedIn" },
                      { icon: Youtube, href: links.youtube, label: "YouTube" },
                      { icon: WhatsAppIcon, href: links.whatsapp, label: "WhatsApp" },
                      { icon: Github, href: links.github, label: "GitHub" }
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl glass-darker flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-foreground/5 group"
                        title={social.label}
                      >
                        <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="animate-fade-up animate-delay-300">
                {formState === "success" ? (
                  <div className="p-8 md:p-12 rounded-4xl bg-foreground/5 border border-primary/20 glass-darker text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold">{t.successMessage}</h2>
                    <button 
                      onClick={() => setFormState("idle")}
                      className="px-8 py-3 bg-secondary text-secondary-foreground font-heading font-bold rounded-2xl"
                    >
                      {language === "es" ? "Enviar otro mensaje" : "Send another message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-3xl bg-card/60 border border-foreground/10 space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        {t.nameLabel}
                      </label>
                      <input 
                        required
                        id="contact-name"
                        name="name"
                        maxLength={100}
                        type="text" 
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder={t.contactNamePlaceholder}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        {t.emailLabel}
                      </label>
                      <input 
                        required
                        id="contact-email"
                        name="email"
                        maxLength={254}
                        type="email" 
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder={t.contactEmailPlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-message" className="block text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        {t.messageLabel}
                      </label>
                      <textarea 
                        required
                        id="contact-message"
                        name="message"
                        minLength={10}
                        maxLength={5000}
                        rows={5}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        placeholder="..."
                      />
                    </div>

                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      {/* Non-semantic name so browser autofill never fills it for a real visitor. */}
                      <input name="hp" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    </div>

                    <button 
                      type="submit"
                      disabled={formState === "sending"}
                      className={cn(
                        "w-full py-4 bg-primary text-primary-foreground font-heading font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]",
                        formState === "sending" ? "opacity-70 cursor-not-allowed" : "glow-sm hover:glow-md hover:-translate-y-1"
                      )}
                    >
                      {formState === "sending" ? t.sending : t.sendButton}
                      <Send className="w-5 h-5" />
                    </button>

                    {formState === "error" && (
                      <div className="flex items-center gap-2 text-destructive text-sm font-medium mt-4">
                        <AlertCircle className="w-4 h-4" />
                        {(errorCode && t.contactErrors[errorCode]) || t.errorMessage}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
