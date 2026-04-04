import HeroSection from "@/components/HeroSection";
import OrganizersSection from "@/components/OrganizersSection";
import EventsSection from "@/components/EventsSection";
import GalleryCarousel from "@/components/GalleryCarousel";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <OrganizersSection />
      <GalleryCarousel />
      <EventsSection />
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
};

export default Index;
