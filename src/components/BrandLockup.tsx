import { cn } from "@/lib/utils";

// Mark + community name. Paths copied from public/brand/mark.svg; the mark is
// decorative, so the wrapping link's accessible name is the text alone.
export default function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-heading font-bold tracking-tight", className)}>
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false" className="w-8 h-8 shrink-0">
        <path d="M10 16C24.7 10.9 39.3 10.9 54 16V48C39.3 53.1 24.7 53.1 10 48Z" fill="#0ea8e6" />
        <ellipse cx="10" cy="32" rx="4.8" ry="16" fill="#7ad8fa" />
        <path d="M14.8 20L23.4 44L32 20L40.6 44L49.2 20M14.8 44L23.4 20L32 44L40.6 20L49.2 44" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <g fill="#ffffff">
          {[14.8, 23.4, 32, 40.6, 49.2].map((x) => <circle key={`t${x}`} cx={x} cy="20" r="2.4" />)}
          {[14.8, 23.4, 32, 40.6].map((x) => <circle key={`b${x}`} cx={x} cy="44" r="2.4" />)}
        </g>
        <circle cx="49.2" cy="44" r="3" fill="#ce1126" />
      </svg>
      {/* Two lines on phones, one from sm up. The space keeps the accessible name "Cloud Native Santo Domingo". */}
      <span className="flex flex-col leading-none sm:flex-row sm:gap-[0.25em] sm:leading-tight whitespace-nowrap">
        <span>Cloud Native</span> <span>Santo Domingo</span>
      </span>
    </span>
  );
}
