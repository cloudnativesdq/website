import HeroSection from "@/components/HeroSection";
import OrganizersSection from "@/components/OrganizersSection";
import EventsSection from "@/components/EventsSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import { getCncfData } from "@/lib/cncf";
import { Instagram, Linkedin, Mail } from "lucide-react";

export const runtime = 'edge';

const galleryImages = [
  "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1591115765373-520b7a2d7294?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000",
];

export default async function Home() {
  const data = await getCncfData();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <OrganizersSection organizers={data.organizers} />
      <GalleryCarousel images={galleryImages} />
      <EventsSection events={data.upcoming} title="Próximos Eventos" />
      <EventsSection events={data.past} title="Eventos Pasados" />
      <footer className="py-16 text-center border-t border-border bg-surface/30">
        <div className="container">
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://www.instagram.com/cncfsdq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/cloud-native-santo-domingo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:organizers@cloudnativesdq.org"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            Cloud Native Santo Domingo · Powered by{" "}
            <a
              href="https://www.cncf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CNCF
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Cloud Native SDQ
          </p>
        </div>
      </footer>
    </main>
  );
}

