import type { ReactNode } from "react";

export function PageIntro({
  title,
  subtitle,
  year,
  id,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  year?: ReactNode;
  id?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex min-w-0 flex-col gap-2">
        <h1
          id={id}
          className="text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="font-semibold text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50">
            {subtitle}
          </p>
        )}
        {year && (
          <p className="font-semibold text-base text-neutral-950 leading-[1.65] dark:text-neutral-50">
            {year}
          </p>
        )}
      </div>
      {actions && (
        <div className="-ml-2 flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
