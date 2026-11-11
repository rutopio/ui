import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { useCopyFeedback } from "../feedback/use-copy-feedback.js";
import { Button } from "../primitives/button.js";
import { CopyFeedbackIcon } from "../feedback/copy-feedback-icon.js";

/** A shared pre renderer; syntax highlighting is supplied at build time. */
export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, showCopied, clearCopied] = useCopyFeedback();
  const [copyError, setCopyError] = useState(false);

  async function copyCode() {
    const code = preRef.current?.querySelector("code");
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent ?? "");
      setCopyError(false);
      showCopied();
    } catch {
      clearCopied();
      setCopyError(true);
    }
  }

  return (
    <div className="base-code-block">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="base-code-block-copy"
        onClick={copyCode}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
      >
        <CopyFeedbackIcon copied={copied} />
      </Button>
      <pre {...props} ref={preRef}>{children}</pre>
      <p role="status" className={copyError ? "base-code-block-error" : "sr-only"}>
        {copyError ? "Unable to copy. Select the code and copy it manually." : copied ? "Code copied." : ""}
      </p>
    </div>
  );
}
