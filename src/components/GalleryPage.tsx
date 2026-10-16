"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
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
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="container px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-heading font-black mb-4">
              <span className="text-gradient">{language === "es" ? "Galería" : "Gallery"}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === "es"
                ? "Fotos de nuestros encuentros, meetups y eventos"
                : "Photos from our gatherings, meetups and events"}
            </p>
            <p className="text-muted-foreground/80 text-sm mt-4">
              {galleryImages.length} {language === "es" ? "fotos" : "photos"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-zoom-in"
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