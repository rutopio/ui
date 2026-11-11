import * as React from "react";
import { HashIcon } from "@phosphor-icons/react";
import { SectionHeading } from "./section-heading.js";
import { cn } from "./utils.js";

export const articleLinkClassName =
  "break-words font-normal text-primary underline decoration-[0.5px] underline-offset-4 transition-[color,text-decoration-thickness] duration-150 hover:text-neutral-950 hover:decoration-[1px] dark:hover:text-neutral-50";

export function Article({
  className,
  ...props
}: React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "base-article flex w-full min-w-0 flex-col gap-16 text-base text-neutral-800 tabular-nums leading-[1.65] dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  );
}

export function ArticleBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("base-article-body flex min-w-0 flex-col", className)}
      {...props}
    />
  );
}

export function ArticleSection({
  heading,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "className"> & {
  heading: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2" {...props}>
      {heading}
      <ArticleBody>{children}</ArticleBody>
    </section>
  );
}

function HeadingAnchor({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  if (!id) return <span>{children}</span>;
  return (
    <a
      href={`#${id}`}
      className="inline-flex items-start gap-2 transition-colors duration-150 group-hover:text-neutral-950 dark:group-hover:text-neutral-50"
    >
      <span>{children}</span>
      <span className="flex h-[1lh] shrink-0 items-center">
        <HashIcon className="size-4 text-primary" aria-hidden="true" />
      </span>
    </a>
  );
}

function MinorHeading({
  level,
  id,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { level: 5 | 6 }) {
  const Heading = level === 5 ? "h5" : "h6";
  return (
    <Heading
      id={id}
      className={cn(
        "group mt-6 scroll-m-20 text-balance font-bold font-heading text-base first:mt-0",
        className,
      )}
      {...props}
    >
      <HeadingAnchor id={id}>{children}</HeadingAnchor>
    </Heading>
  );
}

export const articleComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "scroll-m-20 text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <SectionHeading className={className} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <SectionHeading level={3} {...props} />
  ),
  h4: ({
    className,
    id,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      id={id}
      className={cn(
        "group mt-6 flex scroll-m-20 items-center text-balance font-bold font-heading text-base text-neutral-950 leading-[1.65] first:mt-0 sm:text-lg dark:text-neutral-50",
        className,
      )}
      {...props}
    >
      <HeadingAnchor id={id}>{children}</HeadingAnchor>
    </h4>
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MinorHeading level={5} {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <MinorHeading level={6} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-pretty text-base text-neutral-800 leading-[1.65] dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-4 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-4 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn(
        "mt-2 text-pretty text-base text-neutral-800 leading-[1.65] dark:text-neutral-300",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6", className)} {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn("border px-4 py-2 text-left font-bold", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn("border px-4 py-2 text-left", className)} {...props} />
  ),
  code: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { "data-language"?: string }) => {
    if (props["data-language"])
      return <code className={className} {...props} />;
    return (
      <code
        className={cn(
          "relative rounded border bg-muted/60 px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className,
        )}
        {...props}
      />
    );
  },
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
};
