import { rand, bezier } from "./geometry.js";
// Curl field, vortices and pointer force adapted from the supplied particle field.
export function fieldForce(p, vortices, { W, H, time, pointer, CONFIG }) {
  let fx = 0;
  let fy = 0;

  // Organic curl field
  const nx = p.x / W;
  const ny = p.y / H;

  const wave =
    Math.sin(nx * 13 + ny * 7 + time * 0.00035 + p.seed) +
    Math.cos(ny * 15 - nx * 8 - time * 0.00022);

  fx += Math.cos(wave * 2.1) * 0.38;
  fy += Math.sin(wave * 2.1) * 0.55;

  // Rotating vortex forces
  for (const v of vortices) {
    const dx = p.x - v.x;
    const dy = p.y - v.y;
    const d2 = dx * dx + dy * dy;
    const r2 = v.radius * v.radius;

    if (d2 > r2 * 5) continue;

    const d = Math.sqrt(d2) + 0.01;
    const influence = Math.exp(-d2 / r2);

    fx += (-dy / d) * v.strength * influence;
    fy += (dx / d) * v.strength * influence;

    // Attraction/repulsion around vortex core
    const radial = Math.sin(time * 0.001 + p.phase) * 0.22;

    fx -= (dx / d) * radial * influence;
    fy -= (dy / d) * radial * influence;
  }

  // Compression waves moving across the nebula
  const wavePhase = p.x * 0.012 - time * CONFIG.waveSpeed + p.seed;

  const compression = Math.sin(wavePhase);

  fy += compression * 0.2;
  fx += Math.cos(wavePhase * 0.5) * 0.15;

  // Pointer vortex
  if (pointer.active) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;

    const d2 = dx * dx + dy * dy;
    const radius = CONFIG.interactionRadius;

    if (d2 < radius * radius && d2 > 1) {
      const d = Math.sqrt(d2);
      const influence = 1 - d / radius;

      // Radial repulsion
      fx += (dx / d) * influence * 2.5;

      fy += (dy / d) * influence * 2.5;

      // Tangential rotation
      fx += (-dy / d) * influence * 1.2;
      fy += (dx / d) * influence * 1.2;
    }
  }

  return { fx, fy };
}

export function updateParticles(dt, vortices, state) {
  const { particles, strands, W, H, time, pointer, CONFIG } = state;
  const damping = Math.pow(CONFIG.damping, dt);

  for (const p of particles) {
    const f = fieldForce(p, vortices, { W, H, time, pointer, CONFIG });

    p.vx += f.fx * CONFIG.force * dt * 0.045;
    p.vy += f.fy * CONFIG.force * dt * 0.045;

    // Keep the original filament structure alive
    if (p.strandId >= 0) {
      const strand = strands[p.strandId];
      const target = bezier(strand.p0, strand.p1, strand.p2, strand.p3, p.t);

      const dx = target.x - p.x;
      const dy = target.y - p.y;

      const wave = Math.sin(
        p.t * strand.frequency * Math.PI * 2 + time * 0.001 + strand.phase,
      );

      const pull = 0.0015 * (1 + strand.depth);

      p.vx += (dx + wave * strand.amplitude * 0.015) * pull * dt;
      p.vy += dy * pull * dt;
    }

    p.vx *= damping;
    p.vy *= damping;

    const speed = Math.hypot(p.vx, p.vy);

    if (speed > CONFIG.maxSpeed) {
      p.vx = (p.vx / speed) * CONFIG.maxSpeed;
      p.vy = (p.vy / speed) * CONFIG.maxSpeed;
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Recycle particles without breaking the simulation
    if (p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
      const home =
        p.strandId >= 0
          ? bezier(
              strands[p.strandId].p0,
              strands[p.strandId].p1,
              strands[p.strandId].p2,
              strands[p.strandId].p3,
              p.t,
            )
          : { x: rand(0, W), y: rand(0, H) };
      p.x = home.x;
      p.y = home.y;
      p.vx = 0;
      p.vy = 0;
    }
  }
}
