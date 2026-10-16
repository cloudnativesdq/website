import { getWcnfEvents, wcnfOrganizers } from "@/lib/wcnf";
import { json } from "@/lib/api";

export const revalidate = 21600;

export async function GET() {
  return json({
    name: "Women in Cloud Native LATAM",
    organizers: wcnfOrganizers.map(({ name, linkedin }) => ({ name, linkedin })),
    events: await getWcnfEvents(),
  });
}
