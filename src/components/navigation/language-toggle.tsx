import { CheckIcon, TranslateIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ActionMenu } from "./action-menu.js";
import { Button } from "../ui/button.js";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer.js";

export type LanguageOption<T extends string = string> = {
  value: T;
  label: string;
  htmlLang?: string;
};

export function LanguageToggle<T extends string>({
  label,
  current,
  options,
  onChange,
  isNarrowViewport,
  className,
}: {
  label: string;
  current: T;
  options: readonly LanguageOption<T>[];
  onChange: (value: T) => void;
  isNarrowViewport: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (isNarrowViewport) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className={className}
              aria-label={label}
            >
              <TranslateIcon aria-hidden="true" />
            </Button>
          }
        />
        <DrawerContent>
          <DrawerHeader className="border-border border-b pb-4">
            <DrawerTitle>{label}</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-1 px-4 pt-4 pb-6">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                lang={option.htmlLang}
                aria-current={current === option.value ? "true" : undefined}
                className="flex min-h-10 items-center justify-between rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=true]:bg-muted"
                onClick={() => {
                  setOpen(false);
                  onChange(option.value);
                }}
              >
                {option.label}
                {current === option.value && (
                  <CheckIcon className="size-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <ActionMenu
      label={label}
      trigger={<TranslateIcon className="size-4" aria-hidden="true" />}
      triggerClassName={className}
      openOnHover
      indicator={<CheckIcon className="size-4" aria-hidden="true" />}
      items={options.map((option) => ({
        id: option.value,
        label: option.label,
        lang: option.htmlLang,
        active: current === option.value,
        ariaCurrent: current === option.value ? ("true" as const) : undefined,
        onSelect: () => onChange(option.value),
      }))}
    />
  );
}
