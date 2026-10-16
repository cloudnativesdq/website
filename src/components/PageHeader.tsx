import React from "react";

// Shared title block for inner pages: same alignment, size and spacing everywhere.
export default function PageHeader({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8 md:mb-10">
      {icon && <div className="mb-4">{icon}</div>}
      <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-3">{title}</h1>
      {subtitle && <p className="text-muted-foreground max-w-2xl text-base md:text-lg">{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
}
