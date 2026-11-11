import assert from "node:assert/strict";
import { test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement } from "react";
import { usePageShare } from "../dist/feedback/page-share.js";

function Probe({ publish, onCopyError }) { publish(usePageShare({ onCopyError })); return null; }

test("copy feedback follows completion, renews its timer, and cleans up on unmount", async () => {
  const window = new Window({ url: "https://example.com/" });
  Object.assign(globalThis, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let resolveCopy, rejectCopy;
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent: "test", clipboard: { writeText: () => new Promise((resolve, reject) => { resolveCopy = resolve; rejectCopy = reject; }) } } });
  const timers = new Map();
  let nextTimer = 0;
  window.setTimeout = (callback) => { const id = ++nextTimer; timers.set(id, callback); return id; };
  window.clearTimeout = (id) => timers.delete(id);
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.createElement("div"));
  let state, errors = 0;
  try {
    await act(() => root.render(createElement(Probe, { publish: (next) => { state = next; }, onCopyError: () => { errors++; } })));
    let copying = state.copy();
    assert.equal(state.copied, false);
    await act(async () => { resolveCopy(); await copying; });
    const firstTimer = [...timers.keys()][0];
    assert.equal(state.copied, true);
    copying = state.copy();
    await act(async () => { resolveCopy(); await copying; });
    assert.equal(timers.has(firstTimer), false);
    assert.equal(timers.size, 1);
    await act(() => [...timers.values()][0]());
    assert.equal(state.copied, false);
    copying = state.copy();
    await act(async () => { rejectCopy(new Error("Denied")); await copying; });
    assert.equal(state.copied, false);
    assert.equal(errors, 1);
    copying = state.copy();
    await act(async () => { resolveCopy(); await copying; });
    await act(() => root.unmount());
    assert.equal(timers.size, 0);
  } finally {
    await window.happyDOM.abort();
    Object.defineProperty(globalThis, "navigator", previousNavigator);
    delete globalThis.window;
    delete globalThis.document;
  }
});
