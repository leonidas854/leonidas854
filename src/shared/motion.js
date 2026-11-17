// A single clock governs both scenes. No background loops while paused or hidden.
export function createMotionClock(target, onFrame, onState) {
  const reduce = matchMedia("(prefers-reduced-motion:reduce)"),
    forced = matchMedia("(forced-colors:active)");
  let paused = false,
    inView = true,
    frame = null,
    last = 0,
    stopped = true;
  function tick(now) {
    frame = requestAnimationFrame(tick);
    if (last && now - last < 32) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 30;
    last = now;
    onFrame(dt);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = null;
    last = 0;
    const restricted = reduce.matches || forced.matches;
    stopped = paused || restricted || document.hidden || !inView;
    document.documentElement.dataset.motion = stopped ? "paused" : "running";
    onState({ paused, restricted, stopped });
    if (!stopped) frame = requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  observer.observe(target);
  reduce.addEventListener("change", sync);
  forced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
  return {
    get stopped() {
      return stopped;
    },
    sync,
    toggle() {
      paused = !paused;
      sync();
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduce.removeEventListener("change", sync);
      forced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    },
  };
}
