import { Calendar, Monitor, Coffee } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Language } from "@/lib/translations";

export function getEventIcon(type: string) {
  if (type?.toLowerCase().includes("online") || type?.toLowerCase().includes("virtual")) return Monitor;
  if (type?.toLowerCase().includes("meetup") || type?.toLowerCase().includes("brunch")) return Coffee;
  return Calendar;
}

export function formatEventDate(dateString: string, language: Language) {
  const pattern = language === "es" ? "d 'de' MMMM, yyyy '·' p" : "MMMM d, yyyy '·' p";
  const locale = language === "es" ? es : enUS;

  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return format(date, pattern, { locale });
    }
  } catch {
    // fall through to the manual parser below
  }

  const match = dateString.match(
    /(\w+)\s+(\d+),\s+(\d+)\s+·\s+(\d+:\d+)\s*([AP]M)\s*([-+]\d+|AST|EST|EDT|CST|CDT|MST|PDT|PST)?/i
  );
  if (!match) return dateString;

  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };

  const [, month, day, year, time, period] = match;
  let hours = parseInt(time.split(":")[0], 10);
  const minutes = time.split(":")[1];

  if (period?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;

  const monthNum = months[month] || "01";
  const date = new Date(`${year}-${monthNum}-${day}T${hours.toString().padStart(2, "0")}:${minutes}:00`);

  if (isNaN(date.getTime())) return dateString;

  return format(date, pattern, { locale });
}
