import * as THREE from "../../vendor/three/three.module.js";
import { material, ball, box, mesh } from "./primitives.js";

// Winter interpretation of Podman's seal mascot, matching the README drawing.
export function createPodmanSeal(parent, x, z) {
  const group = new THREE.Group();
  group.name = "podman-seal";
  group.position.set(x, 0.1, z);
  parent.add(group);
  const coat = material(0xd9d9e8), dark = material(0x392453);
  const white = material(0xf8fafc), purple = material(0x673ab7);
  ball(group, [0.31, 0.38, 0.25], coat, [0, 0.39, 0]);
  ball(group, [0.29, 0.25, 0.24], coat, [0, 0.72, 0.035]);
  ball(group, [0.21, 0.24, 0.07], white, [0, 0.34, 0.22]);
  for (const side of [-1, 1]) {
    const tail = ball(group, [0.17, 0.055, 0.15], coat, [side * 0.19, 0.05, 0.04]);
    tail.rotation.y = side * 0.5;
    ball(group, [0.043, 0.055, 0.025], dark, [side * 0.12, 0.77, 0.25]);
    ball(group, [0.013, 0.016, 0.009], white, [side * 0.12 + 0.01, 0.785, 0.274]);
    ball(group, [0.1, 0.07, 0.06], white, [side * 0.065, 0.65, 0.26]);
    for (const row of [-1, 1]) {
      const points = [new THREE.Vector3(side * 0.11, 0.65, 0.31), new THREE.Vector3(side * 0.29, 0.65 + row * 0.045, 0.3)];
      mesh(group, new THREE.TubeGeometry(new THREE.LineCurve3(...points), 1, 0.008, 5, false), dark);
    }
  }
  ball(group, [0.045, 0.032, 0.03], dark, [0, 0.685, 0.319]);
  box(group, [0.012, 0.04, 0.012], dark, [0, 0.643, 0.319]);
  const collar = mesh(group, new THREE.TorusGeometry(0.255, 0.048, 8, 32), purple, 0, 0.53, 0.02);
  collar.rotation.x = Math.PI / 2;
  box(group, [0.09, 0.24, 0.055], purple, [0.17, 0.39, 0.25]);
  for (const y of [0.31, 0.34]) box(group, [0.095, 0.015, 0.012], white, [0.17, y, 0.283]);
  const left = ball(group, [0.095, 0.23, 0.07], coat, [-0.3, 0.35, 0]);
  left.rotation.z = -0.55;
  const flipper = new THREE.Group();
  flipper.position.set(0.25, 0.49, 0.02);
  group.add(flipper);
  ball(flipper, [0.085, 0.23, 0.07], coat, [0.08, 0.14, 0]);
  return {
    update(time) {
      group.rotation.z = Math.sin(time * 1.65) * 0.035;
      flipper.rotation.z = -0.4 + Math.sin(time * 3.3) * 0.3;
    },
  };
}
