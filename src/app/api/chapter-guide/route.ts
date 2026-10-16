import { translations } from "@/lib/translations";
import { links } from "@/lib/links";
import { json } from "@/lib/api";

export const dynamic = "force-static";

export function GET() {
  return json({
    es: translations.es.chapterGuide,
    en: translations.en.chapterGuide,
    links: {
      apply: links.chapterApply,
      guidelines: links.chapterGuidelines,
      bestPractices: links.chapterBestPractices,
      branding: links.chapterBranding,
      meetupVsKcd: links.chapterMeetupVsKcd,
      officeHours: links.chapterOfficeHours,
      ocgDocs: links.ocgDocs,
      codeOfConduct: links.cncfCodeOfConduct,
    },
  });
}
