import * as THREE from "../../vendor/three/three.module.js";
import { material, mesh, label } from "./primitives.js";

// Dome profile and turned base adapted from the supplied Guthrie snow-globe source.
export const RADIUS = 2.66,
  CENTER_Y = 0.92,
  FLOOR = 0.08;
export const domeRadius = (y) =>
  Math.sqrt(Math.max(0, RADIUS ** 2 - (y - CENTER_Y) ** 2));
export const domeTop = (r) =>
  CENTER_Y + Math.sqrt(Math.max(0, RADIUS ** 2 - r * r));
export function domeGeometry(scale = 1) {
  const points = [],
    start = -Math.asin(CENTER_Y / RADIUS);
  for (let i = 0; i <= 64; i++) {
    const angle = start + (i / 64) * (Math.PI / 2 - start);
    points.push(
      new THREE.Vector2(
        Math.max(0.0001, RADIUS * scale * Math.cos(angle)),
        CENTER_Y + RADIUS * scale * Math.sin(angle),
      ),
    );
  }
  return new THREE.LatheGeometry(points, 80);
}
export function createShell(world) {
  const basePoints = [
    [0, -0.5],
    [2.52, -0.5],
    [2.66, -0.46],
    [2.72, -0.34],
    [2.7, -0.16],
    [2.62, -0.04],
    [2.52, 0.02],
    [2.42, 0],
  ].map((p) => new THREE.Vector2(...p));
  mesh(
    world,
    new THREE.LatheGeometry(
      new THREE.SplineCurve(basePoints).getPoints(48),
      80,
    ),
    material(0x171c2a, { metalness: 0.45, roughness: 0.32 }),
  );
  const ring = mesh(
    world,
    new THREE.TorusGeometry(domeRadius(0) + 0.01, 0.025, 12, 96),
    material(0xc9a45c, { metalness: 0.7, roughness: 0.28 }),
    0,
    0.02,
    0,
  );
  ring.rotation.x = Math.PI / 2;
  mesh(
    world,
    new THREE.CylinderGeometry(2.43, 2.43, 0.08, 80),
    material(0xe2ebf5),
    0,
    0.04,
    0,
  );
  const plate = mesh(
    world,
    new THREE.CylinderGeometry(2.73, 2.73, 0.22, 32, 1, true, -0.32, 0.64),
    label("LEONIDAS", "#201708", "#d2b577"),
    0,
    -0.25,
    0,
  );
  plate.castShadow = false;
  const sky = mesh(
    world,
    domeGeometry(0.985),
    new THREE.MeshBasicMaterial({ color: 0x0b1222, side: THREE.BackSide }),
  );
  sky.castShadow = false;
  return { sky };
}
