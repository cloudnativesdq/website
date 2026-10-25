import { cn } from "@/lib/utils";

// Mark + community name. Paths copied from public/brand/mark.svg; the mark is
// decorative, so the wrapping link's accessible name is the text alone.
export default function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-heading font-bold tracking-tight", className)}>
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false" className="w-8 h-8 shrink-0">
        <path d="M57 47C45 52 21 54 11 42C3 31 9 13 27 9C40 6 49 13 48 22C47 29 39 30 37 24" stroke="#0ea8e6" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M23 42C15 34 17 23 26 19" stroke="#7ad8fa" strokeWidth="5" strokeLinecap="round" />
        <circle cx="57" cy="47" r="5" fill="#0ea8e6" />
        <circle cx="55" cy="12" r="4.5" fill="#ce1126" />
      </svg>
      {/* Two lines on phones, one from sm up. The space keeps the accessible name "Cloud Native Santo Domingo". */}
      <span className="flex flex-col leading-none sm:flex-row sm:gap-[0.25em] sm:leading-tight whitespace-nowrap">
        <span>Cloud Native</span> <span>Santo Domingo</span>
      </span>
    </span>
  );
}
