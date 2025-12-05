"use client";

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      {subtitle ? <p className="text-muted-foreground mt-2">{subtitle}</p> : null}
    </div>
  );
}
