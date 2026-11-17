import { rand, clamp, gaussian, bezier } from "./geometry.js";

export function createParticleModel(W, H, CONFIG) {
  let particles = [],
    strands = [];
  const palette = [
    [255, 102, 159],
    [255, 205, 125],
    [69, 255, 192],
  ];
  function colorAt(x) {
    return palette[Math.min(2, Math.floor(clamp(x / W, 0, 0.999) * 3))];
  }

  function makeStrand(startX, startY, endX, endY, depth, parent) {
    const p0 = { x: startX, y: startY };

    const p1 = {
      x: W * rand(0.15, 0.48),
      y: startY + rand(-H * 0.38, H * 0.38),
    };

    const p2 = {
      x: W * rand(0.52, 0.86),
      y: endY + rand(-H * 0.36, H * 0.36),
    };

    const p3 = { x: endX, y: endY };

    const strand = {
      id: strands.length,
      p0,
      p1,
      p2,
      p3,
      depth,
      parent,
      phase: rand(0, Math.PI * 2),
      width: rand(0.35, 1.5),
      opacity: rand(0.12, 0.48),
      frequency: rand(2, 7),
      amplitude: rand(0.006, 0.035) * H,
      color: `rgb(${palette[strands.length % palette.length].join(",")})`,
      points: [],
    };

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

        radius: rand(0.45, 1.8),
        alpha: rand(0.3, 0.95),

        r: color[0],
        g: color[1],
        b: color[2],

        phase: rand(0, 6.28),
        seed: rand(0, 100),
      });
      strand.points.push(particles[particles.length - 1]);
    }
  }

  function createNebula() {
    particles = [];
    strands = [];

    const centerY = H * 0.5;

    // Main organic filaments
    for (let i = 0; i < CONFIG.mainStrands; i++) {
      const offset = gaussian() * H * 0.19;

      makeStrand(
        -W * 0.08,
        centerY + offset,
        W * 1.08,
        centerY + gaussian() * H * 0.2,
        0,
        null,
      );
    }

    // Branching filaments
    const parents = [...strands];

    for (const parent of parents) {
      for (let b = 0; b < 1; b++) {
        if (Math.random() > 0.82) continue;

        const t = rand(0.25, 0.85);
        const origin = bezier(parent.p0, parent.p1, parent.p2, parent.p3, t);

        const direction = Math.random() > 0.5 ? 1 : -1;

        makeStrand(
          origin.x,
          origin.y,
          clamp(origin.x + rand(90, W * 0.35), 0, W),
          clamp(origin.y + direction * rand(40, H * 0.34), -H * 0.1, H * 1.1),
          1,
          parent.id,
        );
      }
    }

    // Free floating particles
    for (let i = 0; i < CONFIG.dustCount; i++) {
      const x = rand(-20, W + 20);
      const color = colorAt(x);

      particles.push({
        x,
        y: rand(0, H),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),

        strandId: -1,
        index: -1,
        t: 0,

        radius: Math.random() < 0.04 ? rand(2, 5) : rand(0.35, 1.3),
        alpha: rand(0.15, 0.8),

        r: color[0],
        g: color[1],
        b: color[2],

        phase: rand(0, 6.28),
        seed: rand(0, 100),
      });
    }
  }

  createNebula();
  return { particles, strands };
}
