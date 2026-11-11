import assert from "node:assert/strict";
import { test } from "node:test";
import { runThemeTransition } from "../dist/lib/theme/run-theme-transition.js";

test("a skipped animation waits for its update and handles both rejected promises", async () => {
  let update, finish;
  let applies = 0, complete = false;
  globalThis.document = { startViewTransition(callback) {
    update = callback;
    return { ready: Promise.reject(new Error("Skipped")), finished: new Promise((resolve) => { finish = resolve; }) };
  } };
  try {
    const running = runThemeTransition(() => { applies++; }).then(() => { complete = true; });
    await new Promise(setImmediate);
    assert.equal(complete, false);
    assert.equal(applies, 0);
    update();
    finish();
    await running;
    assert.equal(applies, 1);
    document.startViewTransition = () => ({ ready: Promise.reject(new Error("Ready failed")), finished: Promise.reject(new Error("Update failed")) });
    await runThemeTransition(() => { applies++; });
    assert.equal(applies, 2);
    document.startViewTransition = () => { throw new Error("Cannot start"); };
    await assert.rejects(runThemeTransition(() => { applies++; }), /Cannot start/);
    assert.equal(applies, 3);
  } finally { delete globalThis.document; }
});
