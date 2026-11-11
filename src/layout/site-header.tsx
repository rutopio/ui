import { Fragment, type ReactNode, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../primitives/drawer.js";
import { FluidHoverControls } from "../motion/fluid-hover-controls.js";
import { cn } from "../shared/class-names.js";

export type HeaderNavItem = {
  id: string;
  label: string;
  href: string;
  active: boolean;
};

export type HeaderLinkProps = {
  className: string;
  onClick?: () => void;
  ariaCurrent?: "page";
  children: ReactNode;
};

export function HeaderNavigation({
  items,
  renderLink,
  label,
  title,
  menuIcon,
  selectedIcon,
}: {
  items: HeaderNavItem[];
  renderLink: (item: HeaderNavItem, props: HeaderLinkProps) => ReactNode;
  label: string;
  title: string;
  menuIcon: ReactNode;
  selectedIcon: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const routeLinkClass =
    "flex h-9 items-center whitespace-nowrap rounded-lg px-3 font-semibold text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
  const drawerLinkClass =
    "flex min-h-10 items-center justify-between rounded-lg px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
  return (
    <>
      <div className="md:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger
            render={
              <button
                type="button"
                aria-label={label}
                className={cn(
                  "base-header-action inline-flex size-9 items-center justify-center rounded-md border border-transparent text-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
                )}
              >
                {menuIcon}
              </button>
            }
          />
          <DrawerContent>
            <DrawerHeader className="border-border border-b pb-4">
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <nav
              aria-label={label}
              className="flex flex-col gap-1 px-4 pt-4 pb-6"
            >
              {items.map((item) => (
                <Fragment key={item.id}>
                  {renderLink(item, {
                    className: drawerLinkClass,
                    onClick: () => setOpen(false),
                    ariaCurrent: item.active ? "page" : undefined,
                    children: (
                      <>
                        {item.label}
                        {item.active && selectedIcon}
                      </>
                    ),
                  })}
                </Fragment>
              ))}
            </nav>
          </DrawerContent>
        </Drawer>
      </div>
      <FluidHoverControls label={label} className="hidden md:flex">
        {items.map((item) => (
          <Fragment key={item.id}>
            {renderLink(item, {
              className: cn(routeLinkClass, item.active && "bg-muted"),
              ariaCurrent: item.active ? "page" : undefined,
              children: item.label,
            })}
          </Fragment>
        ))}
      </FluidHoverControls>
    </>
  );
}

export function SiteHeader({
  brand,
  navigation,
  actions,
  label,
  actionsLabel,
  className,
}: {
  brand: ReactNode;
  navigation?: ReactNode;
  actions: ReactNode;
  label: string;
  actionsLabel?: string;
  className?: string;
}) {
  return (
    <header className={cn("w-full", className)}>
      <nav
        aria-label={label}
        className={cn(
          "relative flex w-full items-center justify-between pt-6 sm:pt-12",
        )}
      >
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          {brand}
          {navigation}
        </div>
        <FluidHoverControls
          compact
          label={actionsLabel}
          className="base-site-header-actions"
        >
          {actions}
        </FluidHoverControls>
      </nav>
    </header>
  );
}
