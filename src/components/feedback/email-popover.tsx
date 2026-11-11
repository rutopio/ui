import { type ReactNode } from "react";
import { AtIcon } from "@phosphor-icons/react";

import { useCopyFeedback } from "../../hooks/use-copy-feedback.js";
import { CopyFeedbackIcon } from "./copy-feedback-icon.js";
import { Popover } from "../ui/popover.js";
import { Button } from "../ui/button.js";

export function EmailPopover({ email, trigger, triggerClassName }: { email: string; trigger: ReactNode; triggerClassName?: string }) {
  const [emailLocal, emailDomain] = email.split("@");
  const obfuscated = `${emailLocal}[AT]${emailDomain}`;
  const [copied, showCopied] = useCopyFeedback();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(obfuscated);
      showCopied();
    } catch {
      // Clipboard unavailable; leave the address visible for manual copying.
    }
  };

  return (
    <Popover
      label="Email contact"
      side="bottom"
      align="start"
      offset={8}
      unstyledTrigger
      trigger={trigger}
      triggerClassName={triggerClassName}
      className="w-fit max-w-[calc(100vw-1rem)]"
    >
      <div className="flex items-center gap-2">
        <span className="flex-1 rounded-md bg-muted px-3 py-2 font-sans text-base">
          {emailLocal}
          <AtIcon size={16} aria-label="at" className="mx-px inline" />
          {emailDomain}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
          aria-label={copied ? "Email copied" : "Copy email"}
        >
          <CopyFeedbackIcon copied={copied} />
        </Button>
      </div>
    </Popover>
  );
}
