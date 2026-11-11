import type { ReactNode } from "react"
import { cn } from "../shared/utils.js"

type FooterLink = { href: string; label: string }

const linkClass =
  "rounded-sm hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"

export function AttributionFooter({
  repository,
  author,
  partner,
  className,
}: {
  repository: FooterLink
  author: FooterLink
  partner?: FooterLink
  className?: string
}) {
  const authorLink = (
    <a
      href={author.href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {author.label}
    </a>
  )
  return (
    <footer className={cn("mt-auto w-full", className)}>
      <div className="w-full py-12 text-center font-mono text-muted-foreground text-sm">
        <div className="flex flex-col items-center gap-2">
          <a
            href={repository.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("block", linkClass)}
          >
            {repository.label}
          </a>
          {partner ? (
            <p>
              {authorLink} {" / "}{" "}
              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {partner.label}
              </a>
            </p>
          ) : (
            authorLink
          )}
        </div>
      </div>
    </footer>
  )
}

export function CelebrationFooter({
  authorName,
  avatarSrc,
  onCelebrate,
  className,
  avatarClassName,
  children,
}: {
  authorName: string
  avatarSrc: string
  onCelebrate: (element: HTMLButtonElement) => void
  className?: string
  avatarClassName?: string
  children?: ReactNode
}) {
  return (
    <footer className={cn("mt-12 flex w-full justify-center py-12", className)}>
      <button
        type="button"
        aria-label={`Celebrate ${authorName}`}
        className="footer-celebrate-button size-20 rounded-full"
        onClick={(event) => onCelebrate(event.currentTarget)}
      >
        {children ?? (
          <img
            src={avatarSrc}
            alt=""
            aria-hidden="true"
            className={cn("size-full dark:invert", avatarClassName)}
          />
        )}
      </button>
    </footer>
  )
}
