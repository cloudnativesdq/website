
"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/hooks/use-language";
import { Mail, Send, CheckCircle2, AlertCircle, Github, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendEmail } from "@/app/actions/send-email";
import { links } from "@/lib/links";

export default function ContactView() {
  const { t, language } = useLanguage();
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await sendEmail(formData);

    if (result.success) {
      setFormState("success");
    } else {
      setFormState("error");
      setErrorMessage(result.error || "Error");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 animate-fade-up">
                <span className="text-gradient">{t.contactTitle}</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
                {t.contactSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 glass shadow-2xl">
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

                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 glass shadow-2xl">
                  <h2 className="text-2xl font-heading font-bold mb-6">Social Media</h2>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { icon: Instagram, href: links.instagram, label: "Instagram" },
                      { icon: Linkedin, href: links.linkedin, label: "LinkedIn" },
                      { icon: Youtube, href: links.youtube, label: "YouTube" },
                      { icon: MessageCircle, href: links.telegram, label: "Telegram" },
                      { icon: Github, href: links.github, label: "GitHub" }
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl glass-darker flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-white/5 group"
                        title={social.label}
                      >
                        <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
                {formState === "success" ? (
                  <div className="p-8 md:p-12 rounded-[2rem] bg-white/5 border border-primary/20 glass-darker text-center space-y-6">
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
                  <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-[2rem] bg-white/5 border border-white/10 glass shadow-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        {t.nameLabel}
                      </label>
                      <input 
                        required
                        name="name"
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        {t.emailLabel}
                      </label>
                      <input 
                        required
                        name="email"
                        type="email" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        {t.messageLabel}
                      </label>
                      <textarea 
                        required
                        name="message"
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        placeholder="..."
                      />
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
                        {errorMessage || t.errorMessage}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
        <div className="container px-6">
          <p className="text-muted-foreground text-xs md:text-sm font-medium">
            {t.footerText}
          </p>
        </div>
      </footer>
    </main>
  );
}
