import { unstable_cache } from "next/cache";
import { getCncfData } from "./cncf";
import type { Organizer } from "./types";

// Dominican Kubestronauts and CNCF Ambassadors, from CNCF's people registry (the source behind
// cncf.io/training/kubestronaut). people.json is ~5.6 MB, over Next's 2 MB fetch-cache limit, so
// it is fetched uncached and only the filtered result is cached.
const PEOPLE_JSON = "https://raw.githubusercontent.com/cncf/people/main/people.json";
const IMAGES = "https://raw.githubusercontent.com/cncf/people/main/images/";
// Dominicans whose registry location is outside the country.
const DOMINICANS_ABROAD = ["Christopher Tineo"];

export interface CncfPerson {
  name: string;
  role: string;
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
  role: "",
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

const nameTokens = (name: string) =>
  name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/\s+/).filter(Boolean);

// The registry and OCG spell names differently ("Lester" vs "Lester Diaz"), so match when every
// token of the shorter name appears in the longer one.
// ponytail: name heuristic, match on GitHub/LinkedIn handle if two people ever share a first name.
const sameName = (a: string, b: string) => {
  const [short, long] = [nameTokens(a), nameTokens(b)].sort((x, y) => x.length - y.length);
  return short.length > 0 && short.every((t) => long.includes(t));
};

// people.json has no job title, so role comes from the person's OCG organizer profile when they
// have one. Employer prefers the registry and falls back to OCG.
const withOrganizerRole = (organizers: Organizer[]) => (p: CncfPerson): CncfPerson => {
  const o = organizers.find((o) => sameName(p.name, o.name));
  return o ? { ...p, role: o.role, company: p.company || o.company } : p;
};

export async function getDominicanCncfPeople(): Promise<DominicanCncfPeople> {
  try {
    const [people, { organizers }] = await Promise.all([
      fetchDominicanPeople(),
      getCncfData().catch(() => ({ organizers: [] as Organizer[] })),
    ]);
    const enrich = withOrganizerRole(organizers);
    return { kubestronauts: people.kubestronauts.map(enrich), ambassadors: people.ambassadors.map(enrich) };
  } catch {
    return { kubestronauts: [], ambassadors: [] };
  }
}
