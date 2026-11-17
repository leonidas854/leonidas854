import * as THREE from "../../vendor/three/three.module.js";
import { material, mesh, ball, box } from "./primitives.js";

// Winter interpretation of Renee French's Go gopher; attribution in CREDITS.md.
export function createGopher(parent, x, z, scarfColor = 0xe96d79) {
  const group = new THREE.Group();
  group.position.set(x, 0.1, z);
  parent.add(group);
  const blue = material(0x39b8d9),
    white = material(0xf7f8ef),
    dark = material(0x121621),
    skin = material(0xe8c5a4),
    scarf = material(scarfColor);
  ball(group, [0.23, 0.34, 0.19], blue, [0, 0.36, 0]);
  for (const side of [-1, 1]) {
    ball(group, [0.085, 0.095, 0.06], blue, [side * 0.21, 0.63, 0]);
    ball(group, [0.046, 0.053, 0.04], skin, [side * 0.21, 0.64, 0.04]);
    ball(group, [0.105, 0.12, 0.085], white, [side * 0.105, 0.55, 0.17]);
    ball(group, [0.035, 0.047, 0.025], dark, [side * 0.1, 0.54, 0.245]);
    ball(group, [0.072, 0.045, 0.1], skin, [side * 0.12, 0.045, 0.07]);
    ball(group, [0.055, 0.12, 0.06], blue, [side * 0.25, 0.29, 0.04]);
  }
  ball(group, [0.095, 0.065, 0.06], skin, [0, 0.4, 0.19]);
  ball(group, [0.043, 0.029, 0.025], dark, [0, 0.44, 0.245]);
  box(group, [0.064, 0.064, 0.03], white, [0, 0.343, 0.231]);
  const collar = mesh(
    group,
    new THREE.TorusGeometry(0.205, 0.036, 8, 32),
    scarf,
    0,
    0.28,
    0,
  );
  collar.rotation.x = Math.PI / 2;
  box(group, [0.065, 0.2, 0.04], scarf, [0.14, 0.18, 0.17]);
  return group;
}
