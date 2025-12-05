"use client";

type PageTitleProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function PageTitle({ title, subtitle, actions }: PageTitleProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {subtitle ? <p className="text-muted-foreground mt-2">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
