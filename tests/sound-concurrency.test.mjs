import assert from "node:assert/strict";
import { test } from "node:test";
import { playSound } from "../dist/lib/feedback/sounds/react-bits-sound.js";

test("sound rendering starts while audio resume is pending and failures settle", async () => {
  let rejectResume;
  let rendering = 0;
  const node = () => ({ connect() {}, gain: {}, frequency: {}, Q: {} });
  globalThis.window = { AudioContext: class {
    state = "suspended";
    sampleRate = 48000;
    resume() { return new Promise((_, reject) => { rejectResume = reject; }); }
  } };
  globalThis.OfflineAudioContext = class {
    createGain = node;
    createBiquadFilter = node;
    startRendering() { rendering += 1; return Promise.reject(new Error("Render failed")); }
  };
  try {
    const recipe = { duration: 0.01, layers: [] };
    const playing = playSound(recipe);
    assert.equal(rendering, 1);
    await assert.rejects(playing, /Render failed/);
    rejectResume(new Error("Resume failed"));
    await Promise.resolve();
    const retry = playSound(recipe);
    assert.equal(rendering, 2);
    await assert.rejects(retry, /Render failed/);
    rejectResume(new Error("Resume failed again"));
  } finally {
    delete globalThis.window;
    delete globalThis.OfflineAudioContext;
  }
});
