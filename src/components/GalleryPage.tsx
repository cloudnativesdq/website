"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { galleryImages } from "@/lib/gallery-data";

export default function GalleryPage() {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-28 md:pt-32 pb-16">
        <div className="container px-4 sm:px-6">
          <PageHeader
            title={language === "es" ? "Galería" : "Gallery"}
            subtitle={
              language === "es"
                ? `Fotos de nuestros encuentros, meetups y eventos · ${galleryImages.length} fotos`
                : `Photos from our gatherings, meetups and events · ${galleryImages.length} photos`
            }
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-zoom-in bg-muted"
              >
                <Image
                  src={img.url}
                  alt={img.alt || (language === "es"
                    ? `Encuentro de Cloud Native Santo Domingo, foto ${index + 1}`
                    : `Cloud Native Santo Domingo meetup, photo ${index + 1}`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden md:block"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
            }}
          >
            ←
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <Image
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].alt || (language === "es"
                ? `Encuentro de Cloud Native Santo Domingo, foto ${selectedImage + 1}`
                : `Cloud Native Santo Domingo meetup, photo ${selectedImage + 1}`)}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-full rounded-lg"
            />
          </div>
          
          <button
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden md:block"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((selectedImage + 1) % galleryImages.length);
            }}
          >
            →
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
            {selectedImage + 1} / {galleryImages.length}
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}