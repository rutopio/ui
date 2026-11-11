/** Callers keep their transition lock until both promises settle, even if animation is skipped. */
export async function runThemeTransition(applyTheme: () => void) {
  let applied = false;
  const applyOnce = () => {
    if (applied) return;
    applied = true;
    applyTheme();
  };
  try {
    const transition = document.startViewTransition(applyOnce);
    await Promise.allSettled([transition.ready, transition.finished]);
  } finally {
    // A synchronous start failure must still honor the requested theme.
    applyOnce();
  }
}
