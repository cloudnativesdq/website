import { translations } from "@/lib/translations";
import { links } from "@/lib/links";
import { json } from "@/lib/api";

export const dynamic = "force-static";

export function GET() {
  return json({
    es: translations.es.programs,
    en: translations.en.programs,
    links: {
      kubestronaut: links.kubestronautProgram,
      kubestronautFaq: links.kubestronautFaq,
      kubestronautStandards: links.kubestronautStandards,
      certifications: { kcna: links.certKcna, kcsa: links.certKcsa, cka: links.certCka, ckad: links.certCkad, cks: links.certCks, lfcs: links.certLfcs },
      ambassadorApply: links.ambassadorApply,
      ambassadorFaq: links.ambassadorFaq,
      ambassadorStandards: links.ambassadorStandards,
    },
  });
}
