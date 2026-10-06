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

function stickTexture(logo, wrap) {
  // u runs around the stick, v runs along it; logos read along the length
  const W = 1024, H = 3000, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  if (wrap) { const t = 512; for (let y = 0; y < H; y += t) for (let x = 0; x < W; x += t) g.drawImage(wrap, x, y, t, t); }
  else { g.fillStyle = "#eab3a0"; g.fillRect(0, 0, W, H); }
  if (logo) {
    const lw = H * .3, lh = lw * logo.height / logo.width;
    const draw = (cx, cy) => { g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 2); g.drawImage(logo, -lw / 2, -lh / 2, lw, lh); g.restore(); };
    for (const f of [.33, .72]) draw(W * .5, H * f);                 // front column
    for (const f of [.52, .9]) { draw(0, H * f); draw(W, H * f); }  // back, wraps the seam
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

  // candy: lens-shaped like the 3D character sheet (about half as thick as
  // it is wide, fully rounded edge), with the product photo projected
  // straight onto both faces and the sheet's bubbly candy texture on the rim
  const R = 1, T = .5, tl = new THREE.TextureLoader();
  const faceTex = tl.load("img/candy-face.webp", () => draw());
  faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 8;
  const pts = [];
  for (let k = 0; k <= 64; k++) { const a = -Math.PI / 2 + Math.PI * k / 64; pts.push(new THREE.Vector2(R * Math.cos(a) ** .55, T * Math.sin(a))); }
  const lens = new THREE.LatheGeometry(pts, 160); lens.rotateX(Math.PI / 2);
  { const pos = lens.attributes.position, uv = lens.attributes.uv; for (let k = 0; k < pos.count; k++) uv.setXY(k, pos.getX(k) / (2 * R) * (pos.getZ(k) < 0 ? -1 : 1) + .5, pos.getY(k) / (2 * R) + .5); lens.computeVertexNormals(); }
  const candy = new THREE.MeshPhysicalMaterial({
    map: faceTex, emissiveMap: faceTex, emissive: 0xffffff, emissiveIntensity: .5, color: 0x808080,
    roughness: .12, metalness: 0, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: .5
  });
  const disc = new THREE.Mesh(lens, candy);

  const stickMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .55, roughness: .38, clearcoat: .7, clearcoatRoughness: .25, envMapIntensity: .7 });
  const SL = 3.3, SR = .17;
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(SR, SR, SL, 64, 1, false), stickMat);
  stick.rotation.y = Math.PI;            // put the front logo column (u = .5) toward the viewer
  stick.position.y = -SL / 2 - .35;      // top end sits inside the candy
  const cap = new THREE.Mesh(new THREE.SphereGeometry(SR, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), stickMat);
  cap.position.y = -SL - .35;

  const pop = new THREE.Group();
  pop.add(disc, stick, cap);
  pop.rotation.order = "ZYX";
  const rig = new THREE.Group(); rig.add(pop); scene.add(rig);

  const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  Promise.all([logoSrc ? loadImg(logoSrc) : null, loadImg("img/stick-wrap.webp")]).then(([logo, wrap]) => {
    stickMat.map = stickTexture(logo, wrap); stickMat.needsUpdate = true; draw();
  });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const MID = -1.45; // centre of the second logo on the stick: the camera ends on it

  // raw scroll progress; past 1 the stage is scrolling away, and the motion
  // keeps drifting (never freezes) while it fades into the next section
  function progress() {
    if (reduce) return .3;
    const r = sec.getBoundingClientRect(), total = sec.offsetHeight - stage.offsetHeight;
    return total > 0 ? Math.min(Math.max(-r.top / total, 0), 1.6) : 0;
  }
  let ps = progress();

  function size() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole lollipop in frame on narrow phones
    camera.position.z = w / h < .8 ? 14 * Math.min(1.9, .8 / (w / h)) : 14;
    camera.updateProjectionMatrix();
  }

  function draw(t) {
    ps += (progress() - ps) * .085;                               // eased, so it glides instead of snapping
    const pa = ps, p = clamp01(pa), over = Math.max(pa - 1, 0), time = (t || 0) / 1000;
    const zr = -Math.PI / 2 + (Math.PI / 4) * easeInOut(p);      // lying flat -> 45deg tilt
    const yr = Math.PI * 2 * easeInOut(p) + .35 * (1 - p);        // one full spin, ending logo-forward
    const s = (1 + 7 * Math.pow(p, 3)) * (1 + over * .9);         // fly in onto the stick, then keep drifting
    pop.rotation.set(.22 * Math.sin(time * .9) * (1 - p) + .12 * (1 - p), yr + .12 * Math.sin(time * .7) * (1 - p) + over * .5, zr - over * .25);
    pop.scale.setScalar(s);
    // offset so the middle of the lollipop is centred first, then the candy
    const off = s;
    rig.position.set(MID * Math.sin(zr) * off, -MID * Math.cos(zr) * off, 0);
    rig.position.y += Math.sin(time * 1.1) * .1 * (1 - p);
    cv.style.opacity = (1 - Math.min(over * 1.8, 1)).toFixed(3);
    renderer.render(scene, camera);
  }

  let visible = true, raf = 0;
  function loop(t) { draw(t); raf = visible ? requestAnimationFrame(loop) : 0; }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(sec);
  addEventListener("resize", () => { size(); draw(); });
  size(); draw();
  sec.classList.add("pop--3d");
}
