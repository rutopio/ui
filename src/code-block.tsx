import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Button } from "./button.js";
import { CopyFeedbackIcon } from "./copy-feedback-icon.js";

/** A shared pre renderer; syntax highlighting is supplied at build time. */
export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [feedback, setFeedback] = useState<{ kind: "copied" | "error" } | null>(null);

  useEffect(() => {
    if (feedback?.kind !== "copied") return;
    const timer = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function copyCode() {
    const code = preRef.current?.querySelector("code");
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent ?? "");
      setFeedback({ kind: "copied" });
    } catch {
      setFeedback({ kind: "error" });
    }
  }

  const copied = feedback?.kind === "copied";
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
      <p role="status" className={feedback?.kind === "error" ? "base-code-block-error" : "sr-only"}>
        {feedback?.kind === "error" ? "Unable to copy. Select the code and copy it manually." : copied ? "Code copied." : ""}
      </p>
    </div>
  );
}
