import type { HTMLAttributes, MouseEventHandler } from "react";
import { SectionHeadingAnchor } from "./section-heading-anchor.js";
import { cn } from "../../lib/class-names.js";

export function SectionHeading({
  level = 2,
  id,
  children,
  className,
  linkTitle,
  onLinkClick,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  level?: 2 | 3;
  linkTitle?: string;
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <Heading
      id={id}
      className={cn(
        "group text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50",
        level === 2
          ? "-ml-8 overflow-hidden scroll-mt-14 pl-8"
          : "flex scroll-m-20 items-center",
        className,
      )}
      {...props}
    >
      <SectionHeadingAnchor id={id} title={linkTitle} onClick={onLinkClick}>
        {children}
      </SectionHeadingAnchor>
      {level === 2 && (
        <span
          aria-hidden="true"
          data-slot="section-heading-divider"
          className="-mr-[calc(100%+1rem)] ml-4 inline-block h-0.5 w-full scale-y-50 bg-border align-middle"
        />
      )}
    </Heading>
  );
}
