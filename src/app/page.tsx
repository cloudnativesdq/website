import HeroSection from "@/components/HeroSection";
import OrganizersSection from "@/components/OrganizersSection";
import EventsSection from "@/components/EventsSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import { getCncfData } from "@/lib/cncf";

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
      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
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
      </footer>
    </main>
  );
}
