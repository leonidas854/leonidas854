import * as THREE from "../../vendor/three/three.module.js";
import { material, mesh, box, label, logoMaterial } from "./primitives.js";
import { createGopher } from "./characters.js";

function house(parent, x, name, logo) {
  const group = new THREE.Group();
  group.position.set(x, 0.08, -0.25);
  group.rotation.y = x < 0 ? 0.12 : -0.18;
  parent.add(group);
  const rust = name === "RUST";
  const wall = material(rust ? 0x75432c : 0x473766),
    snow = material(0xe9f1fa),
    frame = material(0x252238);
  box(group, [1.2, 0.95, 1.1], wall, [0, 0.48, 0]);
  if (rust) {
    const triangle = new THREE.Shape()
      .moveTo(-0.75, 0)
      .lineTo(0, 0.55)
      .lineTo(0.75, 0)
      .closePath();
    const roof = mesh(
      group,
      new THREE.ExtrudeGeometry(triangle, { depth: 1.38, bevelEnabled: false }),
      snow,
      0,
      0.94,
      -0.69,
    );
    roof.castShadow = true;
    box(group, [0.19, 0.5, 0.2], wall, [-0.36, 1.39, -0.22]);
    box(group, [0.25, 0.06, 0.26], snow, [-0.36, 1.66, -0.22]);
    for (let y = 0.12; y < 0.91; y += 0.15)
      box(group, [1.21, 0.018, 1.11], material(0x543322), [0, y, 0]);
  } else {
    box(group, [1.4, 0.15, 1.3], snow, [0, 1.04, 0]);
    for (let x = -0.5; x <= 0.5; x += 0.2)
      box(group, [0.018, 0.8, 0.015], frame, [x, 0.49, 0.56]);
  }
  const windowMat = material(rust ? 0xffc571 : 0x75e5d1, {
    emissive: rust ? 0xffab42 : 0x45c8b1,
    emissiveIntensity: 0.7,
  });
  box(group, [0.26, 0.31, 0.04], windowMat, [-0.34, 0.5, 0.575]);
  box(group, [0.025, 0.32, 0.05], frame, [-0.34, 0.5, 0.6]);
  box(group, [0.27, 0.025, 0.05], frame, [-0.34, 0.5, 0.6]);
  box(group, [0.28, 0.55, 0.05], frame, [0.3, 0.28, 0.58]);
  mesh(group, new THREE.PlaneGeometry(0.28, 0.28), logo, 0.3, 0.74, 0.621);
  mesh(group, new THREE.PlaneGeometry(0.72, 0.18), label(name), 0, 0.13, 0.626);
  return group;
}
function pine(parent, x, z, scale) {
  const group = new THREE.Group();
  group.position.set(x, 0.08, z);
  group.scale.setScalar(scale);
  parent.add(group);
  const green = material(0x235b50),
    snow = material(0xe1edf3);
  box(group, [0.09, 0.35, 0.09], material(0x65503c), [0, 0.17, 0]);
  for (let i = 0; i < 3; i++) {
    const radius = 0.33 - i * 0.07,
      height = 0.62 - i * 0.1,
      y = 0.45 + i * 0.27;
    mesh(group, new THREE.ConeGeometry(radius, height, 9), green, 0, y, 0);
    mesh(
      group,
      new THREE.ConeGeometry(radius * 0.72, height * 0.72, 9),
      snow,
      0,
      y + height * 0.17,
      0,
    );
  }
}
export async function createVillage(world) {
  const [rust, podman] = await Promise.all([
    logoMaterial("rust"),
    logoMaterial("podman"),
  ]);
  house(world, -0.88, "RUST", rust);
  house(world, 0.88, "PODMAN", podman);
  [
    [-1.8, -0.45, 0.85],
    [1.85, -0.4, 0.9],
    [-1.25, -1.4, 1],
    [0.2, -1.7, 1.1],
    [1.3, -1.3, 0.8],
  ].forEach((p) => pine(world, ...p));
  createGopher(world, -0.4, 1.1);
  createGopher(world, 0.42, 0.87, 0xe9bc64).scale.setScalar(0.82);
  const path = mesh(
    world,
    new THREE.CircleGeometry(0.8, 40),
    material(0xc8d8e6),
    0,
    0.086,
    0.9,
  );
  path.rotation.x = -Math.PI / 2;
  path.scale.set(0.55, 1.4, 1);
}
