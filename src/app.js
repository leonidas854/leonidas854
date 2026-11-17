import { createGalaxy } from "./components/galaxy/index.js";
import { createMotionClock } from "./shared/motion.js";

const galaxy = createGalaxy(document.getElementById("particles"));
const stage = document.getElementById("globe-stage");
const pause = document.getElementById("motion"),
  shake = document.getElementById("shake"),
  reset = document.getElementById("reset-view");
const status = document.getElementById("scene-status");
let globe = null,
  noticeTimer;
const motion = createMotionClock(
  document.querySelector(".hero"),
  (dt) => {
    galaxy.update(dt);
    globe?.update(dt);
  },
  ({ paused, restricted }) => {
    pause.disabled = restricted;
    pause.setAttribute("aria-pressed", String(paused || restricted));
    pause.textContent = restricted
      ? "Movimiento reducido"
      : paused
        ? "Reanudar movimiento"
        : "Pausar movimiento";
    shake.disabled = !globe || paused || restricted;
    reset.disabled = !globe;
  },
);
document.querySelector(".globe-controls").hidden = false;
pause.addEventListener("click", () => {
  motion.toggle();
});
shake.addEventListener("click", () => {
  if (!globe || motion.stopped) return;
  globe.shake();
  status.textContent = "La nieve está girando dentro de la esfera.";
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    status.textContent = "";
  }, 4000);
});
reset.addEventListener("click", () => {
  globe?.reset();
});
function unavailable() {
  globe = null;
  motion.sync();
  document.getElementById("globe-hint").textContent =
    "Vista ilustrada. La escena 3D no está disponible en este navegador.";
}
// The profile and galaxy do not depend on WebGL or on loading the 3D module.
try {
  const { createSnowGlobe } = await import("./components/snow-globe/index.js");
  globe = await createSnowGlobe(stage, unavailable);
  document.getElementById("globe-hint").textContent =
    "Arrastra para girar · Flechas al enfocar · Inicio para restablecer";
  motion.sync();
} catch {
  unavailable();
}
window.addEventListener("pagehide", () => {
  clearTimeout(noticeTimer);
  motion.dispose();
  galaxy.dispose();
  globe?.dispose();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) location.reload();
});
