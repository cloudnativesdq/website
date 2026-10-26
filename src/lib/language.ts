import type { Language } from "./translations";

export const LANGUAGE_COOKIE = "lang";

const isLanguage = (value: string | undefined | null): value is Language => value === "es" || value === "en";

// The visitor's language for server rendering: an explicit `lang` cookie wins, then the first
// es/en entry of Accept-Language (in header order, ignoring q < 0.5), then Spanish.
export function resolveLanguage(cookieValue: string | undefined | null, acceptLanguage: string | undefined | null): Language {
  if (isLanguage(cookieValue)) return cookieValue;
  for (const part of (acceptLanguage ?? "").split(",")) {
    const [tag, ...params] = part.trim().split(";");
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    if (q && Number(q.slice(2)) < 0.5) continue;
    const primary = tag.split("-")[0].toLowerCase();
    if (isLanguage(primary)) return primary;
  }
  return "es";
}
