function drawFilaments(ctx, strands) {
  ctx.globalCompositeOperation = "lighter";

  for (const strand of strands) {
    const points = strand.points;

    if (points.length < 2) continue;

    ctx.beginPath();

    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = strand.color;
    ctx.lineWidth = strand.width;
    ctx.globalAlpha = strand.opacity * 0.35;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

function drawParticles(ctx, particles, time) {
  ctx.globalCompositeOperation = "lighter";

  for (const p of particles) {
    const pulse = 0.75 + Math.sin(time * 0.003 + p.phase) * 0.25;

    const alpha = p.alpha * pulse;

    ctx.beginPath();

    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;

    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

    ctx.fill();

    // Selected luminous particles
    if (p.radius > 2.5) {
      ctx.beginPath();

      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha * 0.12})`;

      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalCompositeOperation = "source-over";
}

export function paint(ctx, state) {
  ctx.fillStyle = "rgba(8,10,16,.24)";
  ctx.fillRect(0, 0, state.W, state.H);
  drawFilaments(ctx, state.strands);
  drawParticles(ctx, state.particles, state.time);
}
