import * as THREE from "../../vendor/three/three.module.js";
import { RADIUS, CENTER_Y, FLOOR, domeRadius, domeTop } from "./shell.js";

// The source's liquid swirl/roll model, separated from scene construction and controls.
export function createSnow(world, count) {
  const positions = new Float32Array(count * 3),
    velocity = new Float32Array(count * 3),
    fall = new Float32Array(count),
    sizes = new Float32Array(count);
  let swirl = 0,
    roll = 0;
  function respawn(i, anywhere = false) {
    const angle = Math.random() * Math.PI * 2,
      r = Math.sqrt(Math.random()) * 2.25,
      j = i * 3;
    positions[j] = Math.cos(angle) * r;
    positions[j + 2] = Math.sin(angle) * r;
    const top = domeTop(r) * 0.94;
    positions[j + 1] = anywhere ? FLOOR + Math.random() * (top - FLOOR) : top;
    velocity[j] = velocity[j + 2] = 0;
    velocity[j + 1] = -fall[i];
  }
  for (let i = 0; i < count; i++) {
    fall[i] = 0.1 + Math.random() * 0.14;
    sizes[i] = 0.7 + Math.random() * 1.4;
    respawn(i, true);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const uniforms = { uScale: { value: 600 } };
  const points = new THREE.Points(
    geometry,
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: `attribute float aSize; uniform float uScale;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=.025*aSize*uScale/-mv.z;gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.9,.95,1.,(1.-smoothstep(.1,.5,d))*.85);}`,
    }),
  );
  points.renderOrder = 3;
  world.add(points);
  return {
    resize(height, dpr) {
      uniforms.uScale.value = height * dpr;
    },
    shake() {
      swirl = (Math.random() < 0.5 ? -1 : 1) * 1.15;
      roll = 1.55;
      for (let i = 0; i < count; i++)
        velocity[i * 3 + 1] = 1.2 + Math.random() * 2.6;
    },
    update(dt, time) {
      swirl *= Math.exp(-dt / 7);
      roll *= Math.exp(-dt / 4.4);
      const follow = Math.min(1, dt * 2.4),
        wall = RADIUS * 0.955;
      for (let i = 0; i < count; i++) {
        const j = i * 3,
          x = positions[j],
          y = positions[j + 1],
          z = positions[j + 2];
        const r = Math.hypot(x, z),
          q = Math.min(1, r / Math.max(0.3, domeRadius(y))),
          hy = THREE.MathUtils.clamp(
            (y - FLOOR) / (CENTER_Y + RADIUS - FLOOR),
            0,
            1,
          );
        const turn = swirl * (1 - q * q),
          up =
            roll *
            ((1 - 2.2 * q * q) * Math.sin(Math.PI * hy) +
              0.7 * (1 - q) ** 2 * (1 - hy) ** 4),
          out = roll * q * (0.85 * hy - 0.16);
        const churn = 0.3 * (roll + Math.abs(swirl) * 0.5),
          rx = r > 0.0001 ? x / r : 0,
          rz = r > 0.0001 ? z / r : 0;
        const target = [
          -z * turn +
            rx * out +
            Math.sin(time / 1.7 + i) * 0.04 +
            Math.sin(time / 0.64 + i * 12.99) * churn,
          up - fall[i] + Math.sin(time / 0.78 + i * 7.31) * churn * 0.7,
          x * turn +
            rz * out +
            Math.cos(time / 2.1 + i * 1.7) * 0.04 +
            Math.cos(time / 0.7 + i * 4.17) * churn,
        ];
        for (let axis = 0; axis < 3; axis++) {
          velocity[j + axis] += (target[axis] - velocity[j + axis]) * follow;
          positions[j + axis] += velocity[j + axis] * dt;
        }
        const dx = positions[j],
          dy = positions[j + 1] - CENTER_Y,
          dz = positions[j + 2],
          distance = Math.hypot(dx, dy, dz);
        if (distance > wall) {
          const normal = [dx / distance, dy / distance, dz / distance];
          const push = normal.reduce(
            (sum, n, axis) => sum + n * velocity[j + axis],
            0,
          );
          for (let axis = 0; axis < 3; axis++) {
            positions[j + axis] =
              normal[axis] * wall + (axis === 1 ? CENTER_Y : 0);
            if (push > 0) velocity[j + axis] -= normal[axis] * push;
          }
        }
        if (positions[j + 1] <= FLOOR) {
          if (roll > 0.1) {
            positions[j + 1] = FLOOR;
            velocity[j + 1] = Math.max(0, velocity[j + 1]);
          } else respawn(i);
        }
      }
      geometry.attributes.position.needsUpdate = true;
    },
  };
}
