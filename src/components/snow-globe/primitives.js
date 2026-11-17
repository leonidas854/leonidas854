import * as THREE from "../../vendor/three/three.module.js";

export function material(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...extra });
}
export function mesh(parent, geometry, surface, x = 0, y = 0, z = 0) {
  const object = new THREE.Mesh(geometry, surface);
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}
export function box(parent, size, surface, position) {
  return mesh(parent, new THREE.BoxGeometry(...size), surface, ...position);
}
export function ball(parent, size, surface, position) {
  const object = mesh(
    parent,
    new THREE.SphereGeometry(1, 24, 16),
    surface,
    ...position,
  );
  object.scale.set(...size);
  return object;
}
export function label(text, color = "#e6edf3", background = "#121826") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = color;
  ctx.font = "bold 52px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture });
}
export async function logoMaterial(name) {
  const image = new Image();
  image.src = new URL(`../../../assets/${name}.svg`, import.meta.url).href;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  canvas.getContext("2d").drawImage(image, 0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
}
