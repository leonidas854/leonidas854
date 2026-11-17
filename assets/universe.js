"use strict";
(() => {

const scene = document.getElementById("scene");
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d", { alpha: false });
if (!ctx) return;

let W, H, DPR;
let particles = [];
let strands = [];
let grid = new Map();
let pointer = { x: -9999, y: -9999, active: false };
let time = 0;
let lastTime = 0;
let animationId = null;

const CONFIG = {
  mainStrands: 27,
  branchStrands: 24,
  pointsPerStrand: 64,
  dustCount: 850,
  cellSize: 13,
  collisionRadius: 5.5,
  interactionRadius: 145,
  maxSpeed: 3.5,
  damping: 0.982,
  force: 0.48,
  waveSpeed: 0.0015
};

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function gaussian() {
  return (
    Math.random() + Math.random() +
    Math.random() + Math.random() - 2
  ) * 0.5;
}

function colorAt(x) {
  const colors = [[152, 216, 189], [175, 190, 203], [207, 183, 122]];
  return colors[Math.min(2, Math.floor(clamp(x / W, 0, .999) * 3))];
}

function bezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x +
       3 * u ** 2 * t * p1.x +
       3 * u * t ** 2 * p2.x +
       t ** 3 * p3.x,
    y: u ** 3 * p0.y +
       3 * u ** 2 * t * p1.y +
       3 * u * t ** 2 * p2.y +
       t ** 3 * p3.y
  };
}

function makeStrand(startX, startY, endX, endY, depth, parent) {
  const p0 = { x: startX, y: startY };
  const p1 = {
    x: W * rand(.15, .48),
    y: startY + rand(-H * .38, H * .38)
  };
  const p2 = {
    x: W * rand(.52, .86),
    y: endY + rand(-H * .36, H * .36)
  };
  const p3 = { x: endX, y: endY };

  const strand = {
    id: strands.length,
    p0, p1, p2, p3,
    depth,
    parent,
    phase: rand(0, Math.PI * 2),
    width: rand(.35, 1.5),
    opacity: rand(.12, .48),
    frequency: rand(2, 7),
    amplitude: rand(.006, .035) * H,
    color: rand(0, 1)
  };

  strand.points = [];
  strands.push(strand);

  for (let i = 0; i < CONFIG.pointsPerStrand; i++) {
    const t = i / (CONFIG.pointsPerStrand - 1);
    const point = bezier(p0, p1, p2, p3, t);
    const color = colorAt(point.x);

    particles.push({
      x: point.x + gaussian() * 3,
      y: point.y + gaussian() * 3,
      vx: 0,
      vy: 0,
      strandId: strand.id,
      index: i,
      t,
      radius: rand(.45, 1.8),
      alpha: rand(.3, .95),
      r: color[0],
      g: color[1],
      b: color[2],
      phase: rand(0, 6.28),
      seed: rand(0, 100)
    });
    strand.points.push(particles[particles.length - 1]);
  }
}

function createNebula() {
  particles = [];
  strands = [];
  const centerY = H * .50;

  for (let i = 0; i < CONFIG.mainStrands; i++) {
    const offset = gaussian() * H * .19;
    makeStrand(
      -W * .08,
      centerY + offset,
      W * 1.08,
      centerY + gaussian() * H * .20,
      0,
      null
    );
  }

  const parents = [...strands];
  for (const parent of parents) {
    for (let b = 0; b < 1; b++) {
      if (Math.random() > .82) continue;
      const t = rand(.25, .85);
      const origin = bezier(
        parent.p0, parent.p1, parent.p2, parent.p3, t
      );
      const direction = Math.random() > .5 ? 1 : -1;
      makeStrand(
        origin.x,
        origin.y,
        clamp(origin.x + rand(90, W * .35), 0, W),
        clamp(origin.y + direction * rand(40, H * .34), -H * .1, H * 1.1),
        1,
        parent.id
      );
    }
  }

  for (let i = 0; i < CONFIG.dustCount; i++) {
    const x = rand(-20, W + 20);
    const color = colorAt(x);
    particles.push({
      x,
      y: rand(0, H),
      vx: rand(-.3, .3),
      vy: rand(-.3, .3),
      strandId: -1,
      index: -1,
      t: 0,
      radius: Math.random() < .04 ? rand(2, 5) : rand(.35, 1.3),
      alpha: rand(.15, .8),
      r: color[0],
      g: color[1],
      b: color[2],
      phase: rand(0, 6.28),
      seed: rand(0, 100)
    });
  }
}

function vortex(x, y, strength, radius, phase) {
  const angle = time * .00018 + phase;
  return {
    x: W * (x + Math.sin(angle) * .035),
    y: H * (y + Math.cos(angle * .8) * .06),
    strength,
    radius
  };
}

function getVortices() {
  return [
    vortex(.20, .62, 1.8, H * .32, 0),
    vortex(.53, .40, -2.2, H * .28, 2),
    vortex(.84, .35, 1.7, H * .34, 4)
  ];
}

function fieldForce(p, vortices) {
  let fx = 0;
  let fy = 0;
  const nx = p.x / W;
  const ny = p.y / H;

  const wave =
    Math.sin(nx * 13 + ny * 7 + time * .00035 + p.seed) +
    Math.cos(ny * 15 - nx * 8 - time * .00022);

  fx += Math.cos(wave * 2.1) * .38;
  fy += Math.sin(wave * 2.1) * .55;

  for (const v of vortices) {
    const dx = p.x - v.x;
    const dy = p.y - v.y;
    const d2 = dx * dx + dy * dy;
    const r2 = v.radius * v.radius;

    if (d2 > r2 * 5) continue;

    const d = Math.sqrt(d2) + .01;
    const influence = Math.exp(-d2 / r2);

    fx += (-dy / d) * v.strength * influence;
    fy += ( dx / d) * v.strength * influence;

    const radial = Math.sin(time * .001 + p.phase) * .22;
    fx -= dx / d * radial * influence;
    fy -= dy / d * radial * influence;
  }

  const wavePhase = p.x * .012 - time * CONFIG.waveSpeed + p.seed;
  const compression = Math.sin(wavePhase);

  fy += compression * .20;
  fx += Math.cos(wavePhase * .5) * .15;

  if (pointer.active) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const d2 = dx * dx + dy * dy;
    const radius = CONFIG.interactionRadius;

    if (d2 < radius * radius && d2 > 1) {
      const d = Math.sqrt(d2);
      const influence = 1 - d / radius;
      fx += dx / d * influence * 2.5;
      fy += dy / d * influence * 2.5;
      fx += -dy / d * influence * 1.2;
      fy += dx / d * influence * 1.2;
    }
  }

  return { fx, fy };
}

function buildGrid() {
  grid.clear();
  const size = CONFIG.cellSize;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const gx = Math.floor(p.x / size);
    const gy = Math.floor(p.y / size);
    const key = gx + "," + gy;

    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(i);
  }
}

function collisions() {
  const size = CONFIG.cellSize;

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    const gx = Math.floor(a.x / size);
    const gy = Math.floor(a.y / size);

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const cell = grid.get((gx + ox) + "," + (gy + oy));
        if (!cell) continue;

        for (const j of cell) {
          if (j <= i) continue;
          const b = particles[j];

          let dx = a.x - b.x;
          let dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const min = CONFIG.collisionRadius;

          if (d2 >= min * min || d2 < .001) continue;

          const d = Math.sqrt(d2);
          const force = (min - d) / d * .035;
          const nx = dx * force;
          const ny = dy * force;

          a.vx += nx;
          a.vy += ny;
          b.vx -= nx;
          b.vy -= ny;
        }
      }
    }
  }
}

function updateParticles(dt, vortices) {
  const damping = Math.pow(CONFIG.damping, dt);

  for (const p of particles) {
    const f = fieldForce(p, vortices);
    p.vx += f.fx * CONFIG.force * dt * .045;
    p.vy += f.fy * CONFIG.force * dt * .045;

    if (p.strandId >= 0) {
      const strand = strands[p.strandId];
      const target = bezier(
        strand.p0, strand.p1, strand.p2, strand.p3, p.t
      );
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const wave = Math.sin(
        p.t * strand.frequency * Math.PI * 2 +
        time * .001 + strand.phase
      );
      const pull = .0015 * (1 + strand.depth);

      p.vx += (dx + wave * strand.amplitude * .015) * pull * dt;
      p.vy += dy * pull * dt;
    }

    p.vx *= damping;
    p.vy *= damping;

    const speed = Math.hypot(p.vx, p.vy);
    if (speed > CONFIG.maxSpeed) {
      p.vx = p.vx / speed * CONFIG.maxSpeed;
      p.vy = p.vy / speed * CONFIG.maxSpeed;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
      p.x = rand(0, W);
      p.y = rand(0, H);
      p.vx = 0;
      p.vy = 0;
    }
  }
}

function drawFilaments() {
  ctx.globalCompositeOperation = "lighter";
  for (const strand of strands) {
    const points = strand.points;
    if (points.length < 2) continue;

    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = "#98d8bd";
    ctx.lineWidth = strand.width;
    ctx.globalAlpha = strand.opacity * .22;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawParticles() {
  ctx.globalCompositeOperation = "lighter";
  for (const p of particles) {
    const pulse = .75 + Math.sin(time * .003 + p.phase) * .25;
    const alpha = p.alpha * pulse;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    if (p.radius > 2.5) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha * .12})`;
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";
}

function render() {
  ctx.fillStyle = "rgba(16,25,35,0.3)";
  ctx.fillRect(0, 0, W, H);
  drawFilaments();
  drawParticles();
}

function resize() {
  W = scene.clientWidth;
  H = scene.clientHeight;
  DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  CONFIG.mainStrands = W < 400 ? 8 : 12;
  CONFIG.branchStrands = W < 700 ? 16 : 24;
  CONFIG.pointsPerStrand = 64;
  CONFIG.dustCount = 120;

  createNebula();
  ctx.fillStyle = "#101923";
  ctx.fillRect(0, 0, W, H);
}

function animate(timestamp) {
  const dt = lastTime ? Math.min((timestamp - lastTime) / 16.67, 1.8) : 1;
  lastTime = timestamp;
  time += dt * 16.67;

  const vortices = getVortices();
  buildGrid();
  collisions();
  updateParticles(dt, vortices);
  render();

  animationId = requestAnimationFrame(animate);
}

const motion = document.getElementById("motion");
const shake = document.getElementById("shake");
const globe = document.getElementById("globe");
const status = document.getElementById("scene-status");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const forced = matchMedia("(forced-colors: active)");
let paused = false;
let inView = true;
let burst = false;
let burstTimer;

function syncMotion() {
  const restricted = reduce.matches || forced.matches;
  const stopped = paused || restricted || document.hidden || !inView;
  cancelAnimationFrame(animationId);
  animationId = null;
  lastTime = 0;
  if (!stopped) animationId = requestAnimationFrame(animate);
  const nextSource = `assets/globe-${stopped ? "static" : burst ? "burst" : "scene"}.svg`;
  if (globe.getAttribute("src") !== nextSource) globe.src = nextSource;
  motion.disabled = restricted;
  motion.setAttribute("aria-pressed", String(paused || restricted));
  motion.textContent = restricted ? "Movimiento reducido" : paused ? "Reanudar animación" : "Pausar animación";
  shake.disabled = paused || restricted;
}

scene.addEventListener("pointermove", event => {
  const rect = scene.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
  pointer.active = true;
});
scene.addEventListener("pointerleave", () => { pointer.active = false; });
motion.addEventListener("click", () => {
  paused = !paused;
  status.textContent = paused ? "La nieve y la galaxia están en pausa." : "Rust, Podman y Go, bajo el mismo cielo.";
  syncMotion();
});
shake.addEventListener("click", () => {
  if (paused || reduce.matches || forced.matches) return;
  burst = true;
  clearTimeout(burstTimer);
  createNebula();
  status.textContent = "Una pequeña nevada para Rust, Podman y Go.";
  syncMotion();
  burstTimer = setTimeout(() => {
    burst = false;
    status.textContent = paused ? "La nieve y la galaxia están en pausa." : "Rust, Podman y Go, bajo el mismo cielo.";
    syncMotion();
  }, 2400);
});
reduce.addEventListener("change", syncMotion);
forced.addEventListener("change", syncMotion);
document.addEventListener("visibilitychange", syncMotion);
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  syncMotion();
}).observe(scene);
new ResizeObserver(() => {
  resize();
  render();
}).observe(scene);
resize();
render();
document.querySelector(".scene-controls").hidden = false;
syncMotion();
})();
