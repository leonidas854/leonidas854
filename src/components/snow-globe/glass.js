import * as THREE from "../../vendor/three/three.module.js";
import { domeGeometry } from "./shell.js";

// Glass shader adapted from the user-supplied Lucy Bichakhchyan snow globe.
export function createGlass(world) {
  const glassU = {
    uRim: { value: new THREE.Color(0x9ebcff) },
    uFrost: { value: 0.55 },
    uRoom: { value: 1 },
    uPaper: { value: 0 },
  };
  const GLASS_VERT = `varying vec3 vN; varying vec3 vV; varying vec3 vP;
    void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
  // The glass: a thick rim, a second line where the wall of the ball has depth, two soft windows of a
  // room mirrored in it, and frost creeping up from the base when it is cold.
  const glass = new THREE.Mesh(
    domeGeometry(1),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: glassU,
      vertexShader: GLASS_VERT,
      fragmentShader: `uniform vec3 uRim; uniform float uFrost, uRoom; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a*noise(p); p *= 2.07; a *= 0.5; } return s; }
      void main(){
        vec3 n = normalize(vN), v = normalize(vV);
        float ndv = clamp(dot(n, v), 0.0, 1.0);
        float fres = pow(1.0 - ndv, 3.0);
        float rim = 1.0 - smoothstep(0.0, 0.3, ndv);
        float inner = (1.0 - smoothstep(0.0, 0.035, abs(ndv - 0.25))) * 0.2;
        vec3 r = reflect(-v, n);
        float facing = smoothstep(0.0, 0.35, r.z);
        vec2 w1 = (r.xy - vec2(-0.55, 0.55)) / vec2(0.1, 0.15);
        float box1 = 1.0 - smoothstep(0.55, 1.0, max(abs(w1.x), abs(w1.y)));
        float bars = smoothstep(0.03, 0.1, abs(w1.x)) * smoothstep(0.03, 0.1, abs(w1.y + 0.1));
        vec2 w2 = (r.xy - vec2(0.46, -0.34)) / vec2(0.1, 0.17);
        float box2 = 1.0 - smoothstep(0.7, 1.0, max(abs(w2.x), abs(w2.y)));
        float room = (box1 * (0.3 + 0.7 * bars) * 0.17 + box2 * 0.06) * facing * uRoom;
        // Frost: small icy patches low on the glass. Two crossed samples keep it even all the way round.
        float fr = 0.5 * (fbm(vec2(vP.x + vP.z, vP.y * 1.3) * 7.0) + fbm(vec2(vP.x - vP.z, vP.y * 1.3) * 7.0 + 19.0));
        float frost = uFrost * (1.0 - smoothstep(0.0, 0.8, vP.y)) * smoothstep(0.5, 0.6, fr) * (0.6 + 0.4 * noise(vP.xy * 60.0 + vP.z * 43.0));
        vec3 col = uRim * (fres * 0.5 + rim * 0.22 + inner) + vec3(1.0, 0.98, 0.95) * room + vec3(0.8, 0.9, 1.0) * frost * 0.26;
        gl_FragColor = vec4(col, 1.0);
      }`,
    }),
  );
  glass.renderOrder = 5;
  world.add(glass);
  return glass;
}
