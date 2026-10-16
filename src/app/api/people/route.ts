import { getDominicanCncfPeople } from "@/lib/cncf-people";
import { json } from "@/lib/api";

export const revalidate = 21600;

export async function GET() {
  const { kubestronauts, ambassadors } = await getDominicanCncfPeople();
  return json({
    country: "DO",
    source: "https://github.com/cncf/people",
    kubestronauts: { count: kubestronauts.length, people: kubestronauts },
    ambassadors: { count: ambassadors.length, people: ambassadors },
  });
}
