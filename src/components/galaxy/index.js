import { createParticleModel } from "./model.js";
import { updateParticles } from "./forces.js";
import { collisions } from "./collisions.js";
import { paint } from "./painter.js";

export function createGalaxy(canvas) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return { update() {}, render() {}, resize() {}, dispose() {} };
  let W,
    H,
    time = 0;
  let particles = [],
    strands = [];
  const pointer = { x: -9999, y: -9999, active: false };
  const CONFIG = {
    mainStrands: 16,
    pointsPerStrand: 48,
    dustCount: 240,
    cellSize: 13,
    collisionRadius: 5.5,
    interactionRadius: 145,
    maxSpeed: 3.5,
    damping: 0.982,
    force: 0.48,
    waveSpeed: 0.0015,
  };
  function vortex(x, y, strength, radius, phase) {
    const angle = time * 0.00018 + phase;

    return {
      x: W * (x + Math.sin(angle) * 0.035),
      y: H * (y + Math.cos(angle * 0.8) * 0.06),
      strength,
      radius,
    };
  }

  function getVortices() {
    return [
      vortex(0.2, 0.62, 1.8, H * 0.32, 0),
      vortex(0.53, 0.4, -2.2, H * 0.28, 2),
      vortex(0.84, 0.35, 1.7, H * 0.34, 4),
    ];
  }

  function resize() {
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    CONFIG.mainStrands = W < 700 ? 10 : 16;
    CONFIG.dustCount = W < 700 ? 120 : 240;
    ({ particles, strands } = createParticleModel(W, H, CONFIG));
    ctx.fillStyle = "#080a10";
    ctx.fillRect(0, 0, W, H);
    render();
  }
  function render() {
    paint(ctx, { W, H, time, strands, particles });
  }
  function move(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }
  function leave() {
    pointer.active = false;
  }
  window.addEventListener("pointermove", move);
  document.documentElement.addEventListener("pointerleave", leave);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return {
    render,
    resize,
    update(seconds) {
      const dt = Math.min(seconds * 60, 2);
      time += dt * 16.67;
      collisions(particles, CONFIG);
      updateParticles(dt, getVortices(), {
        particles,
        strands,
        W,
        H,
        time,
        pointer,
        CONFIG,
      });
      render();
    },
    dispose() {
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    },
  };
}
