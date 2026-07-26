/**
 * Entrance-stagger delay classes.
 *
 * Components stagger children by index (nav links sliding in, event rows
 * fading up, calendar dots pulsing). Expressing that as `style={{
 * animationDelay: `${i * 100}ms` }}` puts layout values in inline style
 * attributes; these helpers return a real utility class instead.
 *
 * The class names are written out in full below rather than assembled from a
 * template, because Tailwind's scanner only sees literal strings in source —
 * a computed `animate-delay-${n}` would never be generated.
 *
 * Utilities are defined in src/app/globals.css.
 */

const STAGGER_CLASSES = [
  "animate-delay-0",
  "animate-delay-100",
  "animate-delay-200",
  "animate-delay-300",
  "animate-delay-400",
  "animate-delay-500",
  "animate-delay-600",
  "animate-delay-700",
] as const;

export type StaggerClass = (typeof STAGGER_CLASSES)[number];

/**
 * Delay class for the item at `index`, in 100ms steps.
 *
 * `step` multiplies the index for coarser sequences — the calendar's event
 * dots use `step: 2` for 200ms gaps. Out-of-range indices clamp to the last
 * class rather than returning undefined, so a longer-than-expected list still
 * renders with a valid class instead of dropping the delay.
 */
export function staggerDelay(index: number, step = 1): StaggerClass {
  const slot = Math.round(index * step);
  const clamped = Math.min(Math.max(slot, 0), STAGGER_CLASSES.length - 1);
  return STAGGER_CLASSES[clamped];
}
