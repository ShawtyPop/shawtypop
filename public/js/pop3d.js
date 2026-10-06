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

  // candy: the real Cherry Gloss photos from the character sheet wrapped on a
  // 3D disc. The front-view photo is printed on both domed faces and the
  // side-view photo wraps the rounded rim, so it reads as the actual candy.
  const R = 1, h = .21, FR = R * .97, tl = new THREE.TextureLoader();
  const faceTex = tl.load("img/candy-face.webp", () => draw());
  faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 8;
  const rimTex = tl.load("img/candy-rim.webp", () => draw());
  rimTex.colorSpace = THREE.SRGBColorSpace; rimTex.wrapS = THREE.RepeatWrapping; rimTex.repeat.set(9, 1);
  const photoMat = map => new THREE.MeshPhysicalMaterial({
    map, emissiveMap: map, emissive: 0xffffff, emissiveIntensity: .5, color: 0x7d7d7d,
    roughness: .16, metalness: 0, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: .45
  });
  const faceGeo = new THREE.CircleGeometry(FR, 128, 0, Math.PI * 2);
  { const pos = faceGeo.attributes.position; for (let k = 0; k < pos.count; k++) { const x = pos.getX(k), y = pos.getY(k), rr = (x * x + y * y) / (FR * FR); pos.setZ(k, .05 * (1 - rr)); } faceGeo.computeVertexNormals(); }
  const faceMat = photoMat(faceTex);
  const front = new THREE.Mesh(faceGeo, faceMat); front.position.z = h;
  const back = new THREE.Mesh(faceGeo, faceMat); back.position.z = -h; back.rotation.y = Math.PI;
  const rimPts = [];
  for (let k = 0; k <= 24; k++) { const t = -1 + 2 * k / 24; rimPts.push(new THREE.Vector2(FR + (R - FR) * (1 - t * t) * 1.6, t * h)); }
  const rimGeo = new THREE.LatheGeometry(rimPts, 160); rimGeo.rotateX(Math.PI / 2);
  const rimMesh = new THREE.Mesh(rimGeo, photoMat(rimTex));
  const disc = new THREE.Group(); disc.add(front, back, rimMesh);

  const stickMat = new THREE.MeshPhysicalMaterial({ color: 0xffd2c2, metalness: .75, roughness: .3, clearcoat: .5, clearcoatRoughness: .2, envMapIntensity: .8 });
  const SL = 3.5, SR = .1;
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(SR, SR, SL, 64, 1, false), stickMat);
  stick.rotation.y = Math.PI;            // put the front logo column (u = .5) toward the viewer
  stick.position.y = -SL / 2 - .35;      // top end sits inside the candy
  const cap = new THREE.Mesh(new THREE.SphereGeometry(SR, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), stickMat);
  cap.position.y = -SL - .35;

  const pop = new THREE.Group();
  pop.add(disc, stick, cap);
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
    const s = (1 + 8 * Math.pow(p, 3)) * (1 + over * .9);         // fly in onto the stick, then keep drifting
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
