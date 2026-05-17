"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

const galleryImages = [
  "https://lh3.googleusercontent.com/pw/AP1GczOCcmb8M-0hVxC0XNnNe-rBbyx_qCXHZ0ZXj2Y-jK0uT3A70dtP0HDVPOjlp8dghuvlAUQXgiGhKVfA1sJ8ytsV-ulrzBRmz5wf7YnV2cuEc03IiYk=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczNNBlMtsqszNV28ssPquXoSdPcIuJXjFZ7u95L1ja0FFLO2XxfmpT9_w8DzZq7QmWLU_NHqsMnWNkT9odhivIfKqVchbJUtLM47ZY7bXRn_fjMg9gE=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMvBjLIpVcO6pbjF4khGMbuA-R8Cscx6MrHh5vIQuQVTWEBvV7NP39MCUn7behBLAn_mNJJBFmHHnqtOCL69-PY5SmFewKy0vgwO5dAZCb0VesPbTg=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczP23K6VMh4zwJYg32Z1TBt7hLGDnp8SvrviXLfgd4hkcTmdxOpAizBhsYCKjF-jx0kWqZBh0Fm9-FXAKPd0qa0FeqaG7NndUCYA806ApBXSmRxAD1w=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczNX3NIONelV6jN2vZj5hySL1gnZvD5kW2eEkGqAAjY6UReyKSWdAOXb6NaqCCn4h1jdpDPeuApIxeJZqWkIjV-XAxLgsZQ6fbo2LzJrJJzwQwh9cgE=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczO5TPqxuEN35yuNjsLLycKHubTXlEc4wPaYhLTSaVlydArOB8ZOJe-9U-c66W8cu0q4URGnrY0Q46ZRYoq6PWllNE-NH3IdzR-MNfQz3O_e4bFxmOI=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMsOKUxkbbLY24lvm6hhNb7gY1goDeWu1sz3FwNQNO69XtDS--l9k7ET_W6-y5J1vPlxsOXJayK-tWKZjs7FNHgWBu-bSwuR7IkKOwFnrXsZsGtIUI=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMUdC76Mzeg5m5595ReWkPKanCrX_leTJH__TiWsBi2zK9AwAcXiKaezdWXFazCmwq7fPjDuxUC_Y4WetaL5-23AC4i9WgxaMBQOa1_NvNM3HFekE4=w1200",
  "https://lh3.googleusercontent.com/pw/AP1GczMVjZegrvXGA5wAS7wcTCR3z9xI99T3I7fwcT3z-QCI6qXwtERwP7rW623jQnNq1EeCLuhxzCD1Voragj1_-ybujRmHMQzDf9HHzh159-Imn7LoHjE=w1200",
  "https://lh3.googleusercontent.com/d/1R0lpW1Y_4xOyVRuGe0UQ_uLwSAwW2Z3g=w1200",
  "https://lh3.googleusercontent.com/d/1ok4_aMmu01zuH0utAURbtDcLkwfw5HfQ=w1200",
  "https://lh3.googleusercontent.com/d/15ToewxUrZwoqWm7q4gYMOaELfagxXfPH=w1200",
  "https://lh3.googleusercontent.com/d/1a6ozSjd6FoYeNHbbWw0D6o2w5Ps_CucU=w1200",
  "https://lh3.googleusercontent.com/d/1OqPtIdFZW5sv411NYdSQZR4hhbQ7X98O=w1200",
  "https://lh3.googleusercontent.com/d/1J1Td_90NlmdEbX7Nf274fUesUrCytFbB=w1200",
  "https://lh3.googleusercontent.com/d/1uwZvZ5dJ9DSEJhId1B2nh5jzmPXC3nq0=w1200",
  "https://lh3.googleusercontent.com/d/17xUhWYWdfrYAEOE8Lgt0Ocnr_L9nF0xw=w1200",
  "https://lh3.googleusercontent.com/d/1mD1SGynsFPE8_4kt_452K85ZqEbws0T3=w1200",
  "https://lh3.googleusercontent.com/d/1zKJoTu3ffsSFkUbgd4_k-8zZkM3ebKJ4=w1200",
  "https://lh3.googleusercontent.com/d/1FnWjepU6OwhM17y2Ho2r0QfIZuJZa4IJ=w1200",
  "https://lh3.googleusercontent.com/d/1up_fco9eGZ0fpWyrhNHs0mMdSjD5thwn=w1200",
  "https://lh3.googleusercontent.com/d/1MZwJj3ycPSoKw62Q4pUNokSHyhFTXA_h=w1200",
  "https://lh3.googleusercontent.com/d/1SBYh9Y3rbWkAvMBJTTK4e9vUTBi3gjn9=w1200",
  "https://lh3.googleusercontent.com/d/1hKor_u2Ib4yGhUmtGV9XDaPvij5rH9Fp=w1200",
  "https://lh3.googleusercontent.com/d/1YUKg5usdZNqNpo3I4cQI_4ZuIvO8BsKf=w1200",
  "https://lh3.googleusercontent.com/d/1A0SxoY3M2hijijbGZb-tho2sD5SSXW22=w1200",
  "https://lh3.googleusercontent.com/d/1ConYKJsShf53AYmSsa98X7b2gY_XVSBF=w1200",
  "https://lh3.googleusercontent.com/d/1z3UJIECWkVWPMWqqJWL-bbzRZXjh2QYv=w1200",
  "https://lh3.googleusercontent.com/d/1OBbgtPepkKxzjf-XMyoQ_vxL-HE79Pdk=w1200",
  "https://lh3.googleusercontent.com/d/1J-01QK13ZobjjxPEElq2Ditap6hW8kxl=w1200",
  "https://lh3.googleusercontent.com/d/1G2dqR2kF5Dw08Q1_B69kBaOkRMZX6fte=w1200",
  "https://lh3.googleusercontent.com/d/15rc5QpB35kLhBVw1XUav3C0VB6Izna4_=w1200",
  "https://lh3.googleusercontent.com/d/1qouJanxHBaUeoNW8pDqOUqoZAnkoKB0P=w1200",
  "https://lh3.googleusercontent.com/d/1hxqIMSIRrNssgJodDcFAN_ZWZJJWJL1w=w1200",
  "https://lh3.googleusercontent.com/d/1cqOlyzPv7sjDidQmj12_LEkeQSi_gSgN=w1200",
  "https://lh3.googleusercontent.com/d/1Obs1k_r_5pSTvOO5yv_6wpC0nFsdFmiw=w1200",
  "https://lh3.googleusercontent.com/d/1ubww0H_7c3NxKzv67NNX6r0y7uX9kb5C=w1200",
  "https://lh3.googleusercontent.com/d/1gWrkMmYRRpbbS0Zumky5YV-fPhfdmLW8=w1200",
  "https://lh3.googleusercontent.com/d/1bAb2lG9xDhlwsXMAGjCRZaRemooD63Rp=w1200",
  "https://lh3.googleusercontent.com/d/1ZjTi22V9-gtuPrtk0YWe0VF28ZVKfyfj=w1200",
  "https://lh3.googleusercontent.com/d/1NZrn4suysi0kGkMHCLu5YdC685WOHlJ0=w1200",
  "https://lh3.googleusercontent.com/d/1HMH43C-SE6kcbDHwHBAaTQv4Ps7tpjLZ=w1200",
  "https://lh3.googleusercontent.com/d/153gkemtahu2lmu5qbwD7kj5Cmu3OOV0d=w1200",
  "https://lh3.googleusercontent.com/d/1r29G-lNIYOkyk9xKnKt49sZ5VwFHEQBl=w1200",
  "https://lh3.googleusercontent.com/d/102D-aBmDzZTphgS1-HSFTd3CUn0aWH5I=w1200",
  "https://lh3.googleusercontent.com/d/1mKKrIkm6FMHcNUBV5paFdCX5Gp1I4MXl=w1200",
  "https://lh3.googleusercontent.com/d/10jBAgO3EUpWZy3WkhzdhjiJ8rh5WYIuR=w1200",
  "https://lh3.googleusercontent.com/d/181YNIKMev9ITrSKm8qOz8tC4QCQ6504N=w1200",
  "https://lh3.googleusercontent.com/d/1EeC_h0mYoBnOj1Vsys7oS-Dhq47Bdj4H=w1200",
];

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
                ? "Momentos captured de nuestros encuentros, meetups y eventos"
                : "Captured moments from our gatherings, meetups and events"}
            </p>
            <p className="text-muted-foreground/60 text-sm mt-4">
              {galleryImages.length} {language === "es" ? "fotos" : "photos"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-zoom-in"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
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
              src={galleryImages[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
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
    </main>
  );
}