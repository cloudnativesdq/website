import { getMapData } from "@/lib/chapters";
import { getLfEvents } from "@/lib/cncf-resources";
import { json } from "@/lib/api";

export const revalidate = 21600;

export async function GET() {
  const [map, lf] = await Promise.all([getMapData(), getLfEvents()]);
  return json({ ...map, kubecons: lf.kubecons, aaifEvents: lf.aaif });
}
