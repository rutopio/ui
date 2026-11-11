import assert from "node:assert/strict";
import { test } from "node:test";
import { playSound } from "../dist/feedback/sounds/react-bits-sound.js";

test("sound rendering starts while audio resume is pending and failures settle", async () => {
  let rejectResume;
  let rendering = false;
  const node = () => ({ connect() {}, gain: {}, frequency: {}, Q: {} });
  globalThis.window = { AudioContext: class {
    state = "suspended";
    sampleRate = 48000;
    resume() { return new Promise((_, reject) => { rejectResume = reject; }); }
  } };
  globalThis.OfflineAudioContext = class {
    createGain = node;
    createBiquadFilter = node;
    startRendering() { rendering = true; return Promise.reject(new Error("Render failed")); }
  };
  try {
    const playing = playSound({ duration: 0.01, layers: [] });
    assert.equal(rendering, true);
    await assert.rejects(playing, /Render failed/);
    rejectResume(new Error("Resume failed"));
    await Promise.resolve();
  } finally {
    delete globalThis.window;
    delete globalThis.OfflineAudioContext;
  }
});
