import { json } from "@/lib/api";

export const dynamic = "force-static";

const base = "https://cloudnativesdq.org/api";

export function GET() {
  return json({
    description: "Public read-only API for Cloud Native Santo Domingo. All endpoints return JSON and allow cross-origin requests.",
    endpoints: {
      community: { url: `${base}/community`, refresh: "1h", data: "Organizers, upcoming and past events, member count" },
      chapterEvents: { url: `${base}/chapters/{slug}/events`, refresh: "1h", data: "Upcoming events of one CNCF chapter from ocgroups.dev; slug as in ocgroups.dev/cncf/group/{slug}" },
      people: { url: `${base}/people`, refresh: "6h", data: "Dominican Kubestronauts and CNCF Ambassadors (source: github.com/cncf/people)" },
      map: { url: `${base}/map`, refresh: "6h", data: "CNCF chapters with coordinates and upcoming events (with images), Kubestronauts and Ambassadors per country, upcoming KCDs, Cloud Native Days, KubeCons and AAIF events" },
      resources: { url: `${base}/resources`, refresh: "6h", data: "Certification coupon, free courses, Kubernetes blogs, freeCodeCamp articles, New Contributor Orientation sessions" },
      wcnf: { url: `${base}/wcnf`, refresh: "6h", data: "Women in Cloud Native LATAM organizers and events (source: Luma)" },
      programs: { url: `${base}/programs`, refresh: "on deploy", data: "How to become a Kubestronaut, Golden Kubestronaut or CNCF Ambassador, and their benefits (ES/EN)" },
      chapterGuide: { url: `${base}/chapter-guide`, refresh: "on deploy", data: "How to start a CNCF chapter, in Spanish and English" },
    },
  });
}
