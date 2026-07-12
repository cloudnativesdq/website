import type { CommunityEvent } from "./types";

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export function parseEventDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  try {
    let d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  } catch {}

  const isoMatch = dateStr.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/
  );
  if (isoMatch) {
    const [, y, m, day, h, min, s] = isoMatch;
    return new Date(
      parseInt(y), parseInt(m) - 1, parseInt(day),
      parseInt(h), parseInt(min), s ? parseInt(s) : 0
    );
  }

  const cleaned = dateStr.replace(/·/g, "").trim();

  const patterns: RegExp[] = [
    /(\w+)\s+(\d+),\s*(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i,
    /(\w+)\s+(\d+),\s*(\d{4})\s+(\d{1,2}):(\d{2})/i,
    /(\w+)\s+(\d+),\s*(\d{4})/i,
    /(\w+)\s+(\d+),\s*(\d{2})/i,
  ];

  for (const re of patterns) {
    const m = cleaned.match(re);
    if (!m) continue;
    const monthName = m[1].substring(0, 3).toLowerCase();
    const month = MONTHS[monthName];
    if (month === undefined) continue;
    const day = parseInt(m[2]);
    const yearStr = m[3];
    const fullYear = yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr);
    let hours = parseInt(m[4] || "0");
    const minutes = parseInt(m[5] || "0");
    const period = m[6] as string | undefined;
    if (period?.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;
    const result = new Date(fullYear, month, day, hours, minutes);
    if (!isNaN(result.getTime())) return result;
  }

  return null;
}

export function classifyEvents(events: CommunityEvent[]): {
  upcoming: CommunityEvent[];
  past: CommunityEvent[];
} {
  const now = new Date();
  const upcoming: CommunityEvent[] = [];
  const past: CommunityEvent[] = [];

  for (const event of events) {
    const parsed = parseEventDate(event.date);
    if (parsed && parsed < now) {
      past.push(event);
    } else {
      upcoming.push(event);
    }
  }

  upcoming.sort((a, b) => {
    const da = parseEventDate(a.date);
    const db = parseEventDate(b.date);
    if (!da || !db) return 0;
    return da.getTime() - db.getTime();
  });

  past.sort((a, b) => {
    const da = parseEventDate(a.date);
    const db = parseEventDate(b.date);
    if (!da || !db) return 0;
    return db.getTime() - da.getTime();
  });

  return { upcoming, past };
}

export function mergeAndClassifyEvents(
  ocgUpcoming: CommunityEvent[],
  ocgPast: CommunityEvent[],
  lumaEvents: CommunityEvent[] = []
): {
  upcoming: CommunityEvent[];
  past: CommunityEvent[];
  pastCount: number;
} {
  const allEvents = [...ocgUpcoming, ...ocgPast, ...lumaEvents];

  const seen = new Set<string>();
  const deduped: CommunityEvent[] = [];
  for (const event of allEvents) {
    const key = event.url;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(event);
  }

  const { upcoming, past } = classifyEvents(deduped);

  return {
    upcoming,
    past,
    pastCount: past.length,
  };
}
