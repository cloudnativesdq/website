import { getCncfData } from "@/lib/cncf";
import { json } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  return json(await getCncfData());
}
