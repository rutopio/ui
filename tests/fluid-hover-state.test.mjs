import assert from "node:assert/strict";
import { test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement, useRef } from "react";
import {
  useFluidHover,
  useFluidHoverSelect,
} from "../dist/hooks/use-fluid-hover.js";

function Selected({ store }) {
  return createElement(
    "span",
    null,
    String(useFluidHoverSelect(store, (index) => index))
  );
}
function Probe({ publish }) {
  const ref = useRef(null);
  const hover = useFluidHover(ref);
  publish(hover);
  return createElement(
    "div",
    { ref },
    createElement(Selected, { store: hover.activeStore })
  );
}

test("hover handlers, DOM attributes and subscribers share one synchronous selection", async () => {
  const window = new Window();
  Object.assign(globalThis, {
    window,
    document: window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
  });
  const { createRoot } = await import("react-dom/client");
  const container = document.createElement("main");
  const root = createRoot(container);
  let hover;
  try {
    await act(() =>
      root.render(
        createElement(Probe, {
          publish: (next) => {
            hover = next;
          },
        })
      )
    );
    const a = document.createElement("button"),
      b = document.createElement("button");
    await act(() => {
      hover.registerItem(0, a);
      hover.registerItem(1, b);
      hover.setActiveIndex(0);
      assert.equal(hover.activeStore.get(), 0);
      assert.ok(a.hasAttribute("data-fluid-hover-active"));
      hover.setActiveIndex((previous) => previous + 1);
      assert.equal(hover.activeStore.get(), 1);
      assert.ok(!a.hasAttribute("data-fluid-hover-active"));
      assert.ok(b.hasAttribute("data-fluid-hover-active"));
    });
    assert.equal(container.textContent, "1");
    await act(async () => {
      hover.registerItem(1, null);
      hover.registerItem(1, b);
    });
    assert.equal(hover.activeIndex, 1);
    await act(async () => hover.registerItem(1, null));
    assert.equal(hover.activeIndex, null);
    assert.equal(container.textContent, "null");
    await act(() => root.unmount());
    assert.ok(!b.hasAttribute("data-fluid-hover-active"));
  } finally {
    await window.happyDOM.abort();
    delete globalThis.window;
    delete globalThis.document;
  }
});
