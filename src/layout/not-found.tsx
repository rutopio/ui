import { ArrowLeftIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { Button } from "../primitives/button.js";

export const NOT_FOUND_TITLE = "404 Page Not Found";

export function NotFound({
  homeLink,
}: {
  homeLink?: ReactElement<Record<string, unknown>>;
}) {
  return (
    <>
      <title>{NOT_FOUND_TITLE}</title>
      <meta name="robots" content="noindex" />
      <section className="flex flex-auto flex-col items-center justify-center gap-8 py-24 text-center font-heading">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-balance font-bold text-base leading-[1.65]">
            {NOT_FOUND_TITLE}
          </h1>
          <p className="max-w-md text-pretty font-semibold text-base text-muted-foreground leading-[1.65]">
            It looks like you are lost in cosmos!
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={homeLink ?? <a href="/" />}>
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Back to Home
        </Button>
      </section>
    </>
  );
}
