import HeroSection from "@/components/HeroSection";
import OrganizersSection from "@/components/OrganizersSection";
import EventsSection from "@/components/EventsSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import { getCncfData } from "@/lib/cncf";

export const runtime = 'edge';

export default async function Home() {
  const data = await getCncfData();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <OrganizersSection organizers={data.organizers} />
      <GalleryCarousel />
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
