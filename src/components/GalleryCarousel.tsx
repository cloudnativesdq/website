
"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface GalleryCarouselProps {
  images: string[];
}

const GalleryCarousel = ({ images }: GalleryCarouselProps) => {
  const { t, language } = useLanguage();
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
      duration: 30,
      skipSnaps: true,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const setTweenNodes = useCallback((emblaApi: any) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const scrollSnapList = emblaApi.scrollSnapList();
    const isScrollEvent = scrollSnapList.length > 0;

    if (!isScrollEvent) return;

    emblaApi.slideNodes().forEach((slideNode: HTMLElement, slideIndex: number) => {
      let diffToTarget = scrollSnapList[slideIndex] - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopPoint: any) => {
          const target = loopPoint.target();

          if (slideIndex === loopPoint.index && target !== 0) {
            const sign = Math.sign(target);

            if (sign === -1) {
              diffToTarget = scrollSnapList[slideIndex] - (1 + scrollProgress);
            }
            if (sign === 1) {
              diffToTarget = scrollSnapList[slideIndex] + (1 - scrollProgress);
            }
          }
        });
      }

      const absDiffToTarget = Math.abs(diffToTarget);

      // Tween scale and opacity
      const scale = 1 - absDiffToTarget * 0.25;
      const opacity = 1 - absDiffToTarget * 0.6;
      const slideInner = slideNode.querySelector(".carousel-item-inner") as HTMLElement;
      const slideImage = slideNode.querySelector(".carousel-item-image") as HTMLElement;

      if (slideInner) {
        slideInner.style.transform = `scale(${Math.max(0.85, scale)})`;
        slideInner.style.opacity = `${Math.max(0.3, opacity)}`;
      }

      if (slideImage) {
        // Parallax effect
        const parallax = diffToTarget * 20;
        slideImage.style.transform = `translateX(${parallax}%) scale(1.1)`;
      }
    });
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onScroll = useCallback((emblaApi: any) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
    setTweenNodes(emblaApi);
  }, [setTweenNodes]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (images && images.length > 0) {
      // Pick 15 random images to keep it snappy
      const shuffled = [...images].sort(() => Math.random() - 0.5).slice(0, 15);
      setShuffledImages(shuffled);
    }
  }, [images]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onScroll(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onSelect, onScroll]);

  if (!shuffledImages || shuffledImages.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-gradient">{t.galleryTitle}</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t.gallerySubtitle}
            </p>
          </div>
          
          <div className="hidden md:flex gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-2xl glass-darker flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-white/10 active:scale-95 z-10"
              aria-label={language === "es" ? "Anterior" : "Previous"}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-2xl glass-darker flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-white/10 active:scale-95 z-10"
              aria-label={language === "es" ? "Siguiente" : "Next"}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative -mx-6 md:mx-0">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex gap-4 px-6 md:px-0">
              {shuffledImages.map((src, index) => (
                <div
                  key={index}
                  className="flex-[0_0_85%] sm:flex-[0_0_60%] lg:flex-[0_0_40%] min-w-0"
                >
                  <div className="carousel-item-inner aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 relative group/item shadow-2xl bg-muted transition-transform duration-100 ease-linear">
                    <Image
                      src={src}
                      alt={`Cloud Native Santo Domingo evento ${index + 1}`}
                      className="carousel-item-image w-full h-full object-cover transition-none group-hover/item:rotate-1"
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
            {selectedIndex + 1} <span className="mx-2 text-primary/40">/</span> {shuffledImages.length}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryCarousel;
