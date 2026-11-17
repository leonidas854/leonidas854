import * as THREE from "../../vendor/three/three.module.js";
import { OrbitControls } from "../../vendor/three/OrbitControls.js";
import { createShell } from "./shell.js";
import { createGlass } from "./glass.js";
import { createVillage } from "./village.js";
import { createSnow } from "./snow.js";

export async function createSnowGlobe(stage, onUnavailable) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(),
    world = new THREE.Group();
  scene.add(world);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.minPolarAngle = 0.75;
  controls.maxPolarAngle = 1.48;
  controls.target.set(0, 1.25, 0);
  let userRotated = false,
    time = 0;
  controls.addEventListener("start", () => {
    userRotated = true;
  });
  const hemi = new THREE.HemisphereLight(0xd7e5ff, 0x354665, 2);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe2b3, 3.1);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(1024);
  Object.assign(key.shadow.camera, {
    left: -3,
    right: 3,
    top: 4,
    bottom: -3,
    near: 1,
    far: 20,
  });
  key.shadow.normalBias = 0.025;
  key.shadow.bias = -0.001;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x76a5ff, 1.2);
  fill.position.set(4, 3, -3);
  scene.add(fill);
  createShell(world);
  createGlass(world);
  const snow = createSnow(
    world,
    matchMedia("(max-width:700px)").matches ? 650 : 1100,
  );
  function render() {
    renderer.render(scene, camera);
  }
  function reset() {
    userRotated = false;
    world.rotation.y = 0;
    camera.position.set(0.3, 3.45, 10);
    controls.update();
    render();
  }
  function resize() {
    const width = stage.clientWidth,
      height = stage.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    snow.resize(height, renderer.getPixelRatio());
    render();
  }
  function keyboard(event) {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    if (event.key === "Home") {
      reset();
      return;
    }
    userRotated = true;
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    if (event.key === "ArrowLeft") spherical.theta -= 0.12;
    if (event.key === "ArrowRight") spherical.theta += 0.12;
    if (event.key === "ArrowUp") spherical.phi -= 0.08;
    if (event.key === "ArrowDown") spherical.phi += 0.08;
    spherical.phi = THREE.MathUtils.clamp(
      spherical.phi,
      controls.minPolarAngle,
      controls.maxPolarAngle,
    );
    camera.position
      .copy(controls.target)
      .add(new THREE.Vector3().setFromSpherical(spherical));
    controls.update();
    render();
  }
  const resizeObserver = new ResizeObserver(resize);
  function dispose() {
    resizeObserver.disconnect();
    stage.removeEventListener("keydown", keyboard);
    controls.dispose();
    const disposed = new Set();
    scene.traverse((object) => {
      object.geometry?.dispose();
      for (const mat of [object.material].flat().filter(Boolean)) {
        if (disposed.has(mat)) continue;
        disposed.add(mat);
        mat.map?.dispose();
        mat.dispose();
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
    delete stage.dataset.ready;
  }
  try {
    const village = await createVillage(world);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        dispose();
        onUnavailable();
      },
      { once: true },
    );
    stage.append(renderer.domElement);
    stage.addEventListener("keydown", keyboard);
    controls.addEventListener("change", render);
    reset();
    resize();
    resizeObserver.observe(stage);
    stage.dataset.ready = "true";
    return {
      render,
      reset,
      dispose,
      shake: () => snow.shake(),
      update(dt) {
        time += dt;
        village.update(time);
        snow.update(dt, time);
        if (!userRotated) world.rotation.y = Math.sin(time * 0.14) * 0.1;
        render();
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
