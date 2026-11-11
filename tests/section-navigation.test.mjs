import assert from "node:assert/strict";
import { test } from "node:test";
import { scrollToSection } from "../dist/lib/navigation/section-navigation.js";

test("delayed outline navigation keeps only the latest click and cannot change a different page", () => {
  const timers = new Map();
  const scrolls = [], hashes = [];
  let nextId = 0;
  globalThis.window = {
    location: { href: "https://example.com/one" },
    matchMedia: () => ({ matches: false }),
    setTimeout: (callback) => { const id = ++nextId; timers.set(id, callback); return id; },
    clearTimeout: (id) => timers.delete(id),
  };
  globalThis.document = { getElementById: (id) => ({ scrollIntoView: () => scrolls.push(id) }) };
  globalThis.history = { replaceState: (_, __, hash) => hashes.push(hash) };
  const flush = () => { for (const callback of timers.values()) callback(); timers.clear(); };
  try {
    scrollToSection("first");
    scrollToSection("second");
    assert.equal(timers.size, 1);
    flush();
    assert.deepEqual(scrolls, ["second"]);
    assert.deepEqual(hashes, ["#second"]);
    scrollToSection("old");
    window.location.href = "https://example.com/two";
    flush();
    assert.deepEqual(scrolls, ["second"]);
    assert.deepEqual(hashes, ["#second"]);
  } finally { delete globalThis.window; delete globalThis.document; delete globalThis.history; }
});
