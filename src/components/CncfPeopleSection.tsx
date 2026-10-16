"use client";

import Image from "next/image";
import { Github, Linkedin, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";
import BrandLogo from "@/components/BrandLogo";
import type { CncfPerson, DominicanCncfPeople } from "@/lib/cncf-people";

function PersonCard({ person }: { person: CncfPerson }) {
  return (
    <li
      className={`w-[calc(50%-0.5rem)] sm:w-56 flex flex-col items-center text-center p-5 rounded-3xl bg-card/60 border ${person.golden ? "border-warning/60" : "border-foreground/10"}`}
    >
      <div className="relative w-20 h-20 mb-3 rounded-2xl overflow-hidden bg-muted">
        {person.image && <Image src={person.image} alt={person.name} fill sizes="80px" className="object-cover" />}
      </div>
      <p className="font-heading font-bold leading-tight">{person.name}</p>
      {person.golden && (
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-warning">
          <Star className="w-3 h-3 fill-current" aria-hidden="true" />
          Golden Kubestronaut
        </span>
      )}
      {person.company && <p className="mt-1 text-xs text-muted-foreground">{person.company}</p>}
      <div className="mt-3 flex gap-2">
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} LinkedIn`} className="p-2 rounded-xl border border-foreground/10 hover:text-primary hover:border-primary/40">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {person.github && (
          <a href={person.github} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} GitHub`} className="p-2 rounded-xl border border-foreground/10 hover:text-primary hover:border-primary/40">
            <Github className="w-4 h-4" />
          </a>
        )}
      </div>
    </li>
  );
}

function PeopleGroup({ id, title, subtitle, href, logo, people }: { id: string; title: string; subtitle: string; href: string; logo: string; people: CncfPerson[] }) {
  const { t } = useLanguage();
  if (!people.length) return null;

  return (
    <div id={id} className="scroll-mt-24 mb-16 last:mb-0">
      <div className="text-center mb-10">
        <BrandLogo src={logo} size={56} className="block w-14 h-14 mx-auto mb-3" />
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
          {title} <span className="text-primary">({people.length})</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {subtitle}{" "}
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {t.learnMore}
          </a>
        </p>
      </div>
      <ul className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
        {people.map((p) => (
          <PersonCard key={p.name} person={p} />
        ))}
      </ul>
    </div>
  );
}

export default function CncfPeopleSection({ people }: { people: DominicanCncfPeople }) {
  const { t } = useLanguage();

  return (
    <section className="py-16">
      <div className="container px-6">
        <PeopleGroup id="ambassadors" title={t.ambassadorsTitle} subtitle={t.ambassadorsSubtitle} href={links.cncfAmbassadors} logo="cncf.svg" people={people.ambassadors} />
        <PeopleGroup id="kubestronauts" title={t.kubestronautsTitle} subtitle={t.kubestronautsSubtitle} href={links.kubestronautProgram} logo="kubestronaut.svg" people={people.kubestronauts} />
      </div>
    </section>
  );
}
