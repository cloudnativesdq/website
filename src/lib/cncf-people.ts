import { unstable_cache } from "next/cache";

// Dominican Kubestronauts and CNCF Ambassadors, from CNCF's people registry (the source behind
// cncf.io/training/kubestronaut). people.json is ~5.6 MB, over Next's 2 MB fetch-cache limit, so
// it is fetched uncached and only the filtered result is cached.
const PEOPLE_JSON = "https://raw.githubusercontent.com/cncf/people/main/people.json";
const IMAGES = "https://raw.githubusercontent.com/cncf/people/main/images/";
// Dominicans whose registry location is outside the country.
const DOMINICANS_ABROAD = ["Christopher Tineo"];

export interface CncfPerson {
  name: string;
  company: string;
  location: string;
  image: string;
  golden: boolean;
  linkedin: string;
  github: string;
}

type Person = {
  name: string;
  company?: string;
  location?: string;
  image?: string;
  category?: string[];
  linkedin?: string;
  github?: string;
};

export interface DominicanCncfPeople {
  kubestronauts: CncfPerson[];
  ambassadors: CncfPerson[];
}

const toPerson = (p: Person): CncfPerson => ({
  name: p.name,
  company: p.company ?? "",
  location: p.location ?? "",
  image: p.image ? IMAGES + p.image : "",
  golden: p.category?.includes("Golden-Kubestronaut") ?? false,
  linkedin: p.linkedin ?? "",
  github: p.github ?? "",
});

const byGoldenThenName = (a: CncfPerson, b: CncfPerson) =>
  Number(b.golden) - Number(a.golden) || a.name.localeCompare(b.name);

// Throws on failure so an error is never cached; getDominicanCncfPeople turns it into empty lists.
const fetchDominicanPeople = unstable_cache(
  async (): Promise<DominicanCncfPeople> => {
    const res = await fetch(PEOPLE_JSON, { cache: "no-store" });
    if (!res.ok) throw new Error(`${PEOPLE_JSON}: ${res.status}`);
    const people: Person[] = await res.json();
    const dominicans = people.filter(
      (p) => /dominican republic/i.test(p.location ?? "") || DOMINICANS_ABROAD.includes(p.name)
    );
    // The registry has some mistyped GitHub handles; drop links whose profile 404s.
    await Promise.all(
      dominicans.map(async (p) => {
        if (!p.github) return;
        const r = await fetch(p.github, { method: "HEAD", cache: "no-store" }).catch(() => null);
        if (r?.status === 404) p.github = "";
      })
    );
    const inCategory = (c: string) => dominicans.filter((p) => p.category?.includes(c)).map(toPerson).sort(byGoldenThenName);
    return { kubestronauts: inCategory("Kubestronaut"), ambassadors: inCategory("Ambassadors") };
  },
  ["cncf-people-do"],
  { revalidate: 21600 }
);

export async function getDominicanCncfPeople(): Promise<DominicanCncfPeople> {
  try {
    return await fetchDominicanPeople();
  } catch {
    return { kubestronauts: [], ambassadors: [] };
  }
}
