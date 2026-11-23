import assert from "node:assert/strict";
import { test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement } from "react";

const domGlobals = [
  "window",
  "document",
  "Element",
  "HTMLElement",
  "Node",
  "MutationObserver",
  "ResizeObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "IS_REACT_ACT_ENVIRONMENT",
];

test("popover opens, has a name, and closes with Escape", async () => {
  const window = new Window({ url: "https://example.com/" });
  const before = new Map(domGlobals.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  for (const name of domGlobals) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value: name === "IS_REACT_ACT_ENVIRONMENT" ? true : window[name],
    });
  }
  const { createRoot } = await import("react-dom/client");
  const { Popover } = await import("../dist/components/ui/popover.js");
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(() => root.render(createElement(Popover, {
      trigger: "Contact",
      label: "Email contact",
      children: createElement("button", { type: "button" }, "Copy address"),
    })));
    const trigger = host.querySelector("button");
    assert.ok(trigger);
    await act(() => trigger.click());
    const dialog = document.querySelector('[role="dialog"]');
    assert.ok(dialog);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.equal(dialog.querySelector("h2")?.textContent, "Email contact");
    assert.equal(document.activeElement?.textContent, "Copy address");
    await act(() => document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, trigger);
  } finally {
    await act(() => root.unmount());
    host.remove();
    await window.happyDOM.abort();
    for (const [name, descriptor] of before) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
