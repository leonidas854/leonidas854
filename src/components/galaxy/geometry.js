export const rand = (a, b) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function gaussian() {
  return (
    (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 0.5
  );
}

export function bezier(p0, p1, p2, p3, t) {
  const u = 1 - t;

  return {
    x:
      u ** 3 * p0.x +
      3 * u ** 2 * t * p1.x +
      3 * u * t ** 2 * p2.x +
      t ** 3 * p3.x,

    y:
      u ** 3 * p0.y +
      3 * u ** 2 * t * p1.y +
      3 * u * t ** 2 * p2.y +
      t ** 3 * p3.y,
  };
}
