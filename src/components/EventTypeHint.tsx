"use client";

import { Info, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/links";

// Short explanation of what a KCD or a Cloud Native Days event is, with a link to learn more.
export default function EventTypeHint({ type }: { type: "kcd" | "cnd" }) {
  const { t } = useLanguage();
  const [text, href] = type === "kcd" ? [t.kcdHint, links.kcds] : [t.cndHint, links.cloudNativeDaysAbout];

  return (
    <p className="flex gap-2 text-xs text-muted-foreground leading-relaxed mb-3">
      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <span>
        {text}{" "}
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
          {t.learnMore}
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </span>
    </p>
  );
}
