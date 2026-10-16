import React from "react";

// Shared title block for inner pages: same alignment, size and spacing everywhere.
export default function PageHeader({
  title,
  subtitle,
  icon,
  children,
  center = false,
}: {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <header className={`mb-8 md:mb-10 ${center ? "text-center" : ""}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-3">{title}</h1>
      {subtitle && <p className={`text-muted-foreground max-w-2xl text-base md:text-lg ${center ? "mx-auto" : ""}`}>{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
}
