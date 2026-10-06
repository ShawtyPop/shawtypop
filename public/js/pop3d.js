/* 3D Cherry Gloss lollipop for the scroll opener (#pop).
   Built from the character sheet: a thick, high-gloss translucent red disc
   with a rounded rim, on a metallic rose gold stick printed with the logo.
   Scroll progress p (0 to 1) drives everything: one full spin on the stick,
   a twist from lying flat to a 45deg tilt, and a fly-in until the candy
   fills the screen. If WebGL is missing, the flat photo stays in place. */
import * as THREE from "./three.module.min.js";
import { RoomEnvironment } from "./RoomEnvironment.js";

const sec = document.getElementById("pop");
const stage = sec && sec.querySelector(".pop__stage");
const logoSrc = (document.getElementById("footerLogo") || {}).src;

function webgl() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; }
}

if (stage && webgl()) init();

function stickTexture(logo) {
  // u runs around the stick, v runs along it; logos read along the length
  const W = 512, H = 4096, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#d99a86"); grad.addColorStop(.5, "#f6c9b8"); grad.addColorStop(1, "#d99a86");
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  if (logo) {
    const lw = H * .2, lh = lw * logo.height / logo.width;
    const draw = (cx, cy) => { g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 2); g.drawImage(logo, -lw / 2, -lh / 2, lw, lh); g.restore(); };
    for (let i = 0; i < 4; i++) {
      draw(W * .5, H * (.14 + i * .24));          // front
      draw(0, H * (.26 + i * .24)); draw(W, H * (.26 + i * .24)); // back, wraps the seam
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  const cv = renderer.domElement;
  cv.className = "pop__gl";
  cv.setAttribute("aria-hidden", "true");
  stage.appendChild(cv);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, .05, 100);
  camera.position.set(0, 0, 14);

  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff8fb8, 1.8); rim.position.set(6, -2, -5); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffd6e6, .15));
  const glint = new THREE.PointLight(0xffffff, 18, 12); glint.position.set(-2.5, 2.5, 4); scene.add(glint);

  // candy: lathe a rounded-rim profile, then face it at the camera
  // like the sheet: a fat rounded rim that stands slightly proud of two
  // gently domed faces, so the edge catches a ring of light
  const R = 1, T = .5, e = .27, F = .2, inner = R - 2 * e + .02, pts = [];
  const face = sgn => { const out = []; for (let i = 0; i <= 16; i++) { const r = inner * i / 16; out.push(new THREE.Vector2(r, sgn * (F + .045 * (1 - (r / inner) ** 2)))); } return out; };
  pts.push(...face(-1));
  for (let i = 0; i <= 40; i++) { const a = -Math.PI * .62 + Math.PI * 1.24 * i / 40; pts.push(new THREE.Vector2(R - e + Math.cos(a) * e, Math.sin(a) * e)); }
  pts.push(...face(1).reverse());
  const discGeo = new THREE.LatheGeometry(pts, 128);
  discGeo.rotateX(Math.PI / 2);
  const candy = new THREE.MeshPhysicalMaterial({
    color: 0x9e0016, roughness: .04, metalness: 0, clearcoat: 1, clearcoatRoughness: .01,
    ior: 1.5, envMapIntensity: 1.25, specularIntensity: 1, transparent: true, opacity: .95
  });
  const disc = new THREE.Mesh(discGeo, candy);

  // inner "core" gives the deep red glow seen through the glossy shell
  const core = new THREE.Mesh(new THREE.CylinderGeometry(R * .66, R * .66, F * 1.4, 96).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x6e0010, roughness: .5, emissive: 0x3a0006, emissiveIntensity: .5 }));

  const stickMat = new THREE.MeshPhysicalMaterial({ color: 0xffd2c2, metalness: .75, roughness: .3, clearcoat: .5, clearcoatRoughness: .2, envMapIntensity: .8 });
  const SL = 3.5, SR = .1;
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(SR, SR, SL, 64, 1, false), stickMat);
  stick.rotation.y = Math.PI;            // put the front logo column (u = .5) toward the viewer
  stick.position.y = -SL / 2 - .35;      // top end sits inside the candy
  const cap = new THREE.Mesh(new THREE.SphereGeometry(SR, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), stickMat);
  cap.position.y = -SL - .35;

  const pop = new THREE.Group();
  pop.add(core, disc, stick, cap);
  pop.rotation.order = "ZYX";
  const rig = new THREE.Group(); rig.add(pop); scene.add(rig);

  if (logoSrc) {
    const img = new Image();
    img.onload = () => { stickMat.map = stickTexture(img); stickMat.needsUpdate = true; draw(); };
    img.src = logoSrc;
  } else { stickMat.map = stickTexture(null); }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const MID = -1.66; // centre of the second logo on the stick: the camera ends on it

  function progress() {
    if (reduce) return .3;
    const r = sec.getBoundingClientRect(), total = sec.offsetHeight - stage.offsetHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  }

  function size() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole lollipop in frame on narrow phones
    camera.position.z = w / h < .8 ? 14 * Math.min(1.9, .8 / (w / h)) : 14;
    camera.updateProjectionMatrix();
  }

  function draw(t) {
    const p = progress(), time = (t || 0) / 1000;
    const zr = -Math.PI / 2 + (Math.PI / 4) * easeInOut(p);      // lying flat -> 45deg tilt
    const yr = Math.PI * 2 * easeInOut(p) + .35 * (1 - p);        // one full spin, ending logo-forward
    const s = 1 + 8 * Math.pow(p, 3);                             // fly in onto the stick
    pop.rotation.set(.22 * Math.sin(time * .9) * (1 - p) + .12 * (1 - p), yr + .12 * Math.sin(time * .7) * (1 - p), zr);
    pop.scale.setScalar(s);
    // offset so the middle of the lollipop is centred first, then the candy
    const off = s;
    rig.position.set(MID * Math.sin(zr) * off, -MID * Math.cos(zr) * off, 0);
    rig.position.y += Math.sin(time * 1.1) * .1 * (1 - p);
    renderer.render(scene, camera);
  }

  let visible = true, raf = 0;
  function loop(t) { draw(t); raf = visible ? requestAnimationFrame(loop) : 0; }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(sec);
  addEventListener("resize", () => { size(); draw(); });
  size(); draw();
  sec.classList.add("pop--3d");
}
