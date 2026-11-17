function buildGrid(particles, CONFIG) {
  const grid = new Map();

  const size = CONFIG.cellSize;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    const gx = Math.floor(p.x / size);
    const gy = Math.floor(p.y / size);

    const key = gx + "," + gy;

    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(i);
  }
  return grid;
}

export function collisions(particles, CONFIG) {
  const grid = buildGrid(particles, CONFIG);
  const size = CONFIG.cellSize;

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];

    const gx = Math.floor(a.x / size);
    const gy = Math.floor(a.y / size);

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const cell = grid.get(gx + ox + "," + (gy + oy));

        if (!cell) continue;

        for (const j of cell) {
          if (j <= i) continue;

          const b = particles[j];

          let dx = a.x - b.x;
          let dy = a.y - b.y;

          const d2 = dx * dx + dy * dy;
          const min = CONFIG.collisionRadius;

          if (d2 >= min * min || d2 < 0.001) continue;

          const d = Math.sqrt(d2);
          const force = ((min - d) / d) * 0.035;

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
