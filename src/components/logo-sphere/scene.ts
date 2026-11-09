/**
 * Scroll-driven 3D logo sphere for the "Experience with" section.
 *
 * Framework-free: call createLogoSphere(root) on the section element (the
 * markup in logo-sphere.tsx) and call the returned function to tear it down.
 *
 * Timeline (scrubbed by scroll while the section is pinned):
 *   0.00 → 0.32  the five row logos lift off and fly into the middle, then
 *                spread onto a Fibonacci sphere (each repeated ~6 times)
 *   0.15 → 0.45  the sphere grows and the headline lines slide apart
 *   0.45 → 0.86  the sphere spins on its own, faster with scroll velocity,
 *                with mouse parallax and hover-to-highlight
 *   0.86 → 1.00  the sphere shrinks away; the next section blurs into view
 *
 * Libraries (npm, exact versions pinned in package.json):
 *   three 0.186.1, gsap 3.15.0 (incl. ScrollTrigger), lenis 1.3.26
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

const PIN_LENGTH = 2.6; // pinned scroll distance, in viewport heights
const TILES_DESKTOP = 30;
const TILES_MOBILE = 15;

type Logo = {
  index: number; // company index (0-based) for the counter
  texture: THREE.CanvasTexture;
  aspect: number; // visible width / height
  crop: { x: number; y: number; w: number; h: number }; // visible area as a share of the source image
  natural: { w: number; h: number };
  el: HTMLImageElement; // the logo in the static row
};

type Tile = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  logo: Logo;
  normal: THREE.Vector3; // unit position on the sphere
  facing: THREE.Quaternion; // turns the plane to face outward from the centre
  order: number;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const ease = (n: number) => {
  const t = clamp01(n);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rasterise a logo and crop it to its visible (non-transparent) area. */
async function rasterise(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const nw = img.naturalWidth || 1024;
  const nh = img.naturalHeight || 1024;
  const scale = 1024 / Math.max(nw, nh);
  const w = Math.round(nw * scale);
  const h = Math.round(nh * scale);
  const full = document.createElement("canvas");
  full.width = w;
  full.height = h;
  const fc = full.getContext("2d", { willReadFrequently: true })!;
  fc.drawImage(img, 0, 0, w, h);
  const { data } = fc.getImageData(0, 0, w, h);
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 12) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) {
    x0 = 0;
    y0 = 0;
    x1 = w - 1;
    y1 = h - 1;
  }
  const pad = Math.round(Math.max(x1 - x0, y1 - y0) * 0.02);
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(w - 1, x1 + pad);
  y1 = Math.min(h - 1, y1 + pad);
  const out = document.createElement("canvas");
  out.width = x1 - x0 + 1;
  out.height = y1 - y0 + 1;
  out.getContext("2d")!.drawImage(full, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return {
    canvas: out,
    crop: { x: x0 / w, y: y0 / h, w: out.width / w, h: out.height / h },
    natural: { w: nw, h: nh },
  };
}

/** Even points on a unit sphere (Fibonacci / golden-angle spiral). */
function fibonacci(n: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r);
  });
}

/** Where a row logo's visible artwork sits on screen (object-fit: contain). */
function visibleRect(logo: Logo) {
  const box = logo.el.getBoundingClientRect();
  const fit = Math.min(box.width / logo.natural.w, box.height / logo.natural.h);
  const dw = logo.natural.w * fit;
  const dh = logo.natural.h * fit;
  const left = box.left + (box.width - dw) / 2;
  const top = box.top + (box.height - dh) / 2;
  return {
    x: left + logo.crop.x * dw,
    y: top + logo.crop.y * dh,
    w: logo.crop.w * dw,
    h: logo.crop.h * dh,
  };
}

export function createLogoSphere(root: HTMLElement): () => void {
  // Reduced motion: keep the static row of logos, run nothing.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const canvas = root.querySelector<HTMLCanvasElement>("[data-ls-canvas]");
  const head = root.querySelector<HTMLElement>("[data-ls-head]");
  const row = root.querySelector<HTMLElement>("[data-ls-row]");
  const counter = root.querySelector<HTMLElement>("[data-ls-count]");
  const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-ls-line]"));
  const logoEls = Array.from(root.querySelectorAll<HTMLImageElement>("[data-ls-logo]"));
  if (!canvas || !head || !row || !counter || !logoEls.length) return () => {};

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return () => {}; // no WebGL: the static row stays
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  gsap.registerPlugin(ScrollTrigger);
  const total = logoEls.length;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const parallax = !mobile && window.matchMedia("(pointer: fine)").matches;
  const css = getComputedStyle(root);
  const cssNum = (name: string, fallback: number) => parseFloat(css.getPropertyValue(name)) || fallback;
  const sphereShare = mobile ? cssNum("--ls-sphere-size-mobile", 0.4) : cssNum("--ls-sphere-size", 0.46);
  const tileShare = cssNum("--ls-tile-size", 0.42);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 20000);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let logos: Logo[] = [];
  let tiles: Tile[] = [];
  let width = 0;
  let height = 0;

  // State updated by scroll, pointer and time.
  let target = 0; // scroll progress from ScrollTrigger
  let progress = 0; // smoothed progress
  let velocity = 0;
  let spin = 0;
  let mouseX = 0;
  let mouseY = 0;
  let parX = 0;
  let parY = 0;
  let hovered = -1; // company index under the pointer
  let hoverAmount = 0;
  let visible = true;
  let alive = true;
  let lastCount = "";

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Put the camera where the z = 0 plane maps 1 unit to 1 CSS pixel.
    camera.position.set(0, 0, height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.updateProjectionMatrix();
  };

  // Screen (CSS px, relative to the canvas) → world at z = 0.
  const toWorld = (x: number, y: number) => new THREE.Vector3(x - width / 2, height / 2 - y, 0);

  const tmpQ = new THREE.Quaternion();
  const sphereQ = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const pos = new THREE.Vector3();
  const startPos = new THREE.Vector3();
  const identity = new THREE.Quaternion();

  const frame = (_time: number, deltaMs: number) => {
    if (!alive || !tiles.length) return;
    const dt = Math.min(deltaMs, 50) / 1000;

    // Smooth the scrubbed progress a little, and let velocity decay.
    progress += (target - progress) * Math.min(1, dt * 10);
    velocity *= Math.pow(0.04, dt);
    spin += dt * (0.22 + THREE.MathUtils.clamp(velocity * 0.0005, -1.6, 1.6));
    parX += (mouseX - parX) * Math.min(1, dt * 4);
    parY += (mouseY - parY) * Math.min(1, dt * 4);
    hoverAmount += ((hovered >= 0 ? 1 : 0) - hoverAmount) * Math.min(1, dt * 10);

    const p = progress;
    const flying = p > 0.002;
    root.dataset.lsFlying = flying ? "true" : "false";

    // Phases.
    const grow = ease((p - 0.15) / 0.3);
    const out = ease((p - 0.86) / 0.14);

    // Headline lines slide apart to make room as the sphere grows.
    const split = grow * (1 - out);
    lines[0]?.style.setProperty("transform", `translate3d(${(-split * 3).toFixed(2)}vw,0,0)`);
    lines[1]?.style.setProperty("transform", `translate3d(${(split * 12).toFixed(2)}vw,0,0)`);

    // Counter: the hovered company, otherwise the total.
    const now = hovered >= 0 ? hovered + 1 : total;
    const label = String(now).padStart(2, "0");
    if (label !== lastCount) {
      counter.textContent = label;
      lastCount = label;
    }

    if (!visible || !width) return;

    // The free middle area between the headline and the row.
    const c = canvas.getBoundingClientRect();
    const headBottom = head.getBoundingClientRect().bottom - c.top;
    const rowTop = row.getBoundingClientRect().top - c.top;
    const centre = toWorld(width / 2, (headBottom + rowTop) / 2);
    const room = Math.max(120, Math.min(width, (rowTop - headBottom) * 1.25));
    const radius = room * sphereShare * (0.55 + 0.45 * grow) * (1 - 0.85 * out);
    const tileWidth = room * sphereShare * tileShare * (0.55 + 0.45 * grow) * (1 - 0.85 * out);

    // Sphere orientation: idle spin + scroll + parallax.
    euler.set(-0.25 + parY * 0.3, spin + p * Math.PI * 1.4 + parX * 0.45, 0, "YXZ");
    sphereQ.setFromEuler(euler);

    for (const t of tiles) {
      const { mesh, logo } = t;
      // Each tile's own flight, slightly staggered.
      const f = ease((p - 0.02 - t.order * 0.005) / 0.28);

      // Start: exactly over its logo in the row.
      const r = visibleRect(logo);
      startPos.copy(toWorld(r.x + r.w / 2 - c.left, r.y + r.h / 2 - c.top));

      // End: on the sphere, facing outward.
      pos.copy(t.normal).applyQuaternion(sphereQ).multiplyScalar(radius).add(centre);
      mesh.position.lerpVectors(startPos, pos, f);
      tmpQ.copy(sphereQ).multiply(t.facing);
      mesh.quaternion.slerpQuaternions(identity, tmpQ, f);

      // Size: from the row logo to a sphere tile (wide wordmarks capped in height).
      let tw = tileWidth;
      let th = tw / logo.aspect;
      if (th > tileWidth * 0.55) {
        th = tileWidth * 0.55;
        tw = th * logo.aspect;
      }
      const isHovered = hovered === logo.index;
      const lift = 1 + (isHovered ? 0.15 * hoverAmount : 0);
      mesh.scale.set(lerp(r.w, tw, f) * lift, lerp(r.h, th, f) * lift, 1);

      // Opacity: repeats fade in as they leave the row; tiles at the back fade.
      const depth = radius > 0 ? (mesh.position.z - centre.z) / radius : 1;
      const depthAlpha = 0.06 + 0.94 * Math.pow(clamp01((depth + 1) / 2), 1.6);
      let alpha = t.order < total ? 1 : clamp01(f * 1.6);
      alpha *= lerp(1, depthAlpha, f);
      if (hovered >= 0 && !isHovered) alpha *= 1 - 0.65 * hoverAmount;
      alpha *= 1 - out;
      mesh.material.opacity = alpha;
      mesh.visible = flying && alpha > 0.01;
      // Front tiles draw last.
      mesh.renderOrder = Math.round(depth * 100);
    }

    renderer.render(scene, camera);
  };

  // Hover: raycast the visible tiles, map the hit to its company.
  const onPointerMove = (e: PointerEvent) => {
    const c = canvas.getBoundingClientRect();
    if (parallax) {
      mouseX = ((e.clientX - c.left) / c.width) * 2 - 1;
      mouseY = ((e.clientY - c.top) / c.height) * 2 - 1;
    }
    // Only once the tiles are on the sphere.
    if (progress < 0.3 || progress > 0.86) {
      hovered = -1;
      root.dataset.lsHover = "false";
      return;
    }
    pointer.set(((e.clientX - c.left) / c.width) * 2 - 1, -((e.clientY - c.top) / c.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    scene.updateMatrixWorld();
    const hits = raycaster.intersectObjects(
      tiles.filter((t) => t.mesh.visible && t.mesh.material.opacity > 0.35).map((t) => t.mesh),
      false,
    );
    const hit = hits[0]?.object;
    hovered = hit ? (tiles.find((t) => t.mesh === hit)?.logo.index ?? -1) : -1;
    root.dataset.lsHover = hovered >= 0 ? "true" : "false";
  };
  const onPointerLeave = () => {
    hovered = -1;
    mouseX = 0;
    mouseY = 0;
    root.dataset.lsHover = "false";
  };

  // Smooth scrolling, kept in sync with ScrollTrigger on GSAP's ticker.
  const lenis = new Lenis({ anchors: true, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  const lenisRaf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(frame);

  const ctx = gsap.context(() => {
    // Pin the section and scrub the timeline with scroll.
    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * PIN_LENGTH}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        target = self.progress;
        velocity = self.getVelocity();
      },
    });

    // The next section comes in with a soft blur as the sphere leaves. It scales
    // from its top edge (no vertical shift) so anchor links still land correctly.
    const next = root.closest("section")?.nextElementSibling as HTMLElement | null;
    if (next) {
      gsap.fromTo(
        next,
        { filter: "blur(16px)", opacity: 0.35, scale: 0.94, transformOrigin: "50% 0%" },
        {
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 35%", scrub: true },
          clearProps: "filter,transform,opacity",
        },
      );
    }
  }, root);

  // Render only while the section is on screen.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(root);
  const ro = new ResizeObserver(() => {
    resize();
    ScrollTrigger.refresh();
  });
  ro.observe(canvas);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  resize();

  // Build the textures and tiles once the logos have loaded.
  Promise.all(
    logoEls.map(async (el, index) => {
      const r = await rasterise(el.currentSrc || el.src);
      const texture = new THREE.CanvasTexture(r.canvas);
      texture.colorSpace = THREE.SRGBColorSpace; // keep the original brand colours
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.needsUpdate = true;
      return { index, texture, aspect: r.canvas.width / r.canvas.height, crop: r.crop, natural: r.natural, el } as Logo;
    }),
  )
    .then((list) => {
      if (!alive) {
        list.forEach((l) => l.texture.dispose());
        return;
      }
      logos = list;
      const count = mobile ? TILES_MOBILE : TILES_DESKTOP;
      const points = fibonacci(count);
      const z = new THREE.Vector3(0, 0, 1);
      tiles = points.map((normal, order) => {
        // Tile k shows company k % 5, so each company repeats evenly around the sphere.
        const logo = logos[order % logos.length];
        const material = new THREE.MeshBasicMaterial({
          map: logo.texture,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        scene.add(mesh);
        return { mesh, logo, normal, facing: new THREE.Quaternion().setFromUnitVectors(z, normal), order };
      });
      ScrollTrigger.refresh();
    })
    .catch(() => {
      /* If a logo fails to load, the static row stays. */
    });

  // Teardown: stop everything and free GPU memory.
  return () => {
    alive = false;
    gsap.ticker.remove(frame);
    gsap.ticker.remove(lenisRaf);
    ctx.revert();
    lenis.destroy();
    io.disconnect();
    ro.disconnect();
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    for (const t of tiles) {
      t.mesh.material.dispose();
      scene.remove(t.mesh);
    }
    logos.forEach((l) => l.texture.dispose());
    geometry.dispose();
    renderer.dispose();
    lines.forEach((l) => l.style.removeProperty("transform"));
    delete root.dataset.lsFlying;
    delete root.dataset.lsHover;
    counter.textContent = String(total).padStart(2, "0");
  };
}
