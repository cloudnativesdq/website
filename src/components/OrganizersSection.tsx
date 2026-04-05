
"use client";

import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";

interface Organizer {
  name: string;
  role: string;
  company: string;
  image: string;
  profileUrl: string;
}

interface OrganizersSectionProps {
  organizers: Organizer[];
}

const OrganizersSection = ({ organizers }: OrganizersSectionProps) => {
  const { t } = useLanguage();
  if (!organizers || organizers.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">{t.teamTitle}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg">
            {t.teamSubtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {organizers.map((org, i) => (
            <a
              key={org.name + i}
              href={org.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 shadow-xl"
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6 border-2 border-white/10 group-hover:border-primary/50 transition-all duration-500 rotate-3 group-hover:rotate-0 bg-muted">
                <Image
                  src={org.image || "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-cncf/contentbuilder/eventthumb.jpg"}
                  alt={org.name}
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                  fill
                  sizes="(max-width: 768px) 80px, 112px"
                  unoptimized
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors leading-tight">
                  {org.name}
                </h3>
                <div className="h-px w-8 bg-primary/30 mx-auto my-2 group-hover:w-12 transition-all duration-500" />
                <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-wider">{org.role}</p>
                <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">{org.company}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />
    </section>
  );
};

export default OrganizersSection;
