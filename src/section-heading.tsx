import type { HTMLAttributes, MouseEventHandler } from "react";
import { SectionHeadingAnchor } from "./section-heading-anchor.js";
import { cn } from "./utils.js";

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
        "group flex items-center text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50",
        level === 2 ? "scroll-mt-14" : "scroll-m-20",
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
          className="ml-4 h-0.5 min-w-4 flex-1 scale-y-50 bg-border"
        />
      )}
    </Heading>
  );
}
