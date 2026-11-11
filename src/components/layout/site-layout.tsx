import type { ComponentProps } from "react";

export function SiteLayout(props: Omit<ComponentProps<"div">, "className">) {
  return (
    <div
      className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-6"
      {...props}
    />
  );
}
