import Image from "next/image";

// Small third-party logo, self-hosted under public/logos.
export default function BrandLogo({ src, alt = "", size = 20, className = "" }: { src: string; alt?: string; size?: number; className?: string }) {
  return (
    <Image
      src={`/logos/${src}`}
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 rounded object-contain ${className}`}
    />
  );
}
