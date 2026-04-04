"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBOPyXfvKsvjfOD3TvLtnpiQZdGaOpxopDmR7hfoSzMXTuMKavEpJROl1hu5II3Twp1qjpl6OYSH-8xJH9DffyijJsHEfR4ujf0VrfA=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMr80nU51C6uyIBek_YW_pXClTgd3ZvHRNPxqp4c0GSaHwgnh5ow2jdPz3sYIOVRIIs6ISj0jXLAljoOtrDDnslw81UxplZHtN-xTg=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBPyLO2Eivh01ZUwfYo95TU5-QmAKMm0nan7krn0nCFZCCIyg6dGBhH4_1Y8dW-9NJZXxZkq460p2Q5zbdlEo2gHVNBPaupw1b41d-g=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBOi3kWSIYVVtP9CGj2Df64K5mxtqeH_Zs41KmQjHEhcCrstQbYyXNu3PHztmzqGGZMuCH6u8koPpq6obYIj7CelwQRAD7lojSA5dx8=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMGYdU2U5CMvIpqfVa0UWHwqsXPg0Uq085-NjqXINmKYwUjlO4zNcaQiZLt_nktxfq2XtzAsQ4GAmO6nWzlg0dl75yfx_ZFAKOH_T8=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBP-J1-xLLmXNaURyAtDm0gJLJgBc2ge0-_zT0kyhnJscvrKxUadUwOijsm5oxCfupF_XMgTsY6NNG1obfrqmjMsXgaV3s6Xld-EU2I=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBM2UtX4TOlNW9sONNK6zRG2iqR0ECqB1w-dQmw5rNOd-TtGAM_gZmKHu1bdKHLl0AOgn1CIOdECOb2_BhzV_PGrDOP9GEkfI06NIcY=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBOTPn5K7B8sGZH0GvW1Q6yWZdIcUMit8d3aTW6d74aQ6q1Pqxp5EispfwIK9r3WeSu8AVKFos2McRyUolp1IeP8jCuE8TrEiQALJSw=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMMtIj0dbrDamjxs1FaE4AYaDXkBJUA3Y2d5MdJEpFLjo7yKkyldxB5P-Y_APvO35M5HqAD92PqHNBjlhae-iUBqEf6R-P9ghKktL0=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBNUYeOEBYCZPOAquj2Q05lRNodwbINlbGGBVZkMwhT8nuAZC5y2MDSeBP6gTdwZW4H8cOMz7Z4Jiw2tlNe-XvQY-F9gKCgmDy5uMBo=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBP2LydG8ETTUwmemyHpJI_9hVPN0X16cdTPPwy6YhIE4Yi0VLzctF9woaaFhSObPElHu4ODKKbuzChsVx-HMreJEQ-uKRBSHFfY-lE=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBOLGNmzT1yG2p_EBZsV--2OhJ83P8ro9jXwR0MApDIbWO5ldAGN8IRXhZiQkOEEx1gpY7DQuCebDpoySg4QVrH25c6jmiPnK-4xd7k=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBPcrw1QBXLaNzs4R7z36-fDB3Maq-xRYWb8MU_rLZ21Zdd2iuwD-n-f9Y_rak4nH29JPF1i-ITx9-yxyfu5pfAogYw1Sl_kOnjpHkU=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMC2SkAygIrK1k4dpS2RbVq76mdYE2idy0s3SWCXoiQpPIIHM4EkNtq-88TKQV4zVNERK9R53lDhMy7SIIKNTXRo_MRLdn-auGQqbY=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBPdoT3DkbZmXEw-BhfHGChLflhU31n0YAw9tOEAI-FaU765sfaSLH_sS9xM9dCLoFQRC3radLuuPFFHtWXQHta8J4ZFXhqXDEVWf2g=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMbWbnDmg54-3BvRh7_lkw1UxsQ39S_XuzAdUdSubDnPkdf8T4sV__rdicjWYIGli_jtsZAMa76TGIziGvlGWqyW0ku0BHFhYsuzcU=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBNyFH79ujpPzSst74zeXuxmxCqTCQreko83KEL2cKFep_2SGgTJ_jVFjiuEtsg8m0LAAoJQEpEi4WFs9CZ-1-rC1fT5pYL7E6TgEJE=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMr4dgrkb_W18rwkRe_0rEGgl-rMHwgSrDxbe4rzqiL7sVBBGVXKFddyAU7AoaOibk-JUMm16vLvP7Msn1NOIyQOWWkuWHihf47uZQ=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMSw2jRzQ777k0xJCtE2XIIta2DTPOGGk4DoFps3Nhyi3ikaygCAJFc8EYZaP7wRXggR1DGYX0MkQudnEPsC1eh55L4Z4PLsrk75xs=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBPTXGa51XBpRNNFXWbQGOxl0U9cpGVbB3-AQ_iXcukX0EMqiSNMz2c_TCpO4H2WCdoVnRbXNJ97OFyiXu0tZhcCXlfj3dAYJHxEbBo=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMEvbHaZ1HDkUGH-nilK4VfXYApLl8SVkM5Y8OZFNUFhMbuQ77lD9Ib9aNZz3kTZkBZ60kZxBKBFWmESLqRpgbkAMt01xsTX6o9ttM=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBOQrwiT7nKQextuKLYu5C1vzGykTVhBxY1qgAuY34u2sLENJkztNnGbmkyrze8F48cPf7gdV1z9Vk5GIjLuFLZ3BbfsDbFW5rYSW20=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMoSy-tT0_LyqKdx1gHRzlBm5OONJWAB1nLTjBGgkH9tk-ev5xLyC6Si68lOw9YcGvcuFyu5EE5wMdIgq6uE-kQnb8QFMwhxi93Wt0=s800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBOFDiyuXUNWf-CFVFHOTKeej-2JoKq3oRbD6gAC1uIyitNJ1lGjEcxURbMLBoM1pjTANt1noRVzM0fPswb7J6dQHB9-up_nRh9vZvI=s800",
];

const GalleryCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          <span className="text-gradient">Galería</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Momentos de nuestros eventos y meetups de la comunidad.
        </p>

        <div className="relative group">
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex gap-4">
              {galleryImages.map((src, index) => (
                <div
                  key={index}
                  className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border">
                    <img
                      src={src}
                      alt={`Cloud Native Santo Domingo evento ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryCarousel;
