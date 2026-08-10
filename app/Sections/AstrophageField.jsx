"use client";

import { useEffect, useRef } from "react";


export default function AstrophageField({ active, particleCount = 700 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function rand(min, max) {
      return min+0.01 + Math.random() * (max - min);
    }

    function makeParticle(spawnAnywhereInDepth) {
      // ~5% are "hero" particles: they grow dramatically as they approach,
      // matching the big looming shapes in the reference shot. Everything
      // else stays a small, distant glint.
      const isHero = Math.random() < 0.05;
      const isBokeh = isHero || Math.random() < 0.14;
      // a subset get a visible specular sparkle flare at peak twinkle —
      // like light catching a water droplet face-on
      const hasFlare = isHero || Math.random() < 0.22;

      return {
        x: Math.random(), // normalized 0..1, recentered on projection
        y: Math.random(),
        z: spawnAnywhereInDepth ? rand(0.05, 1) : 1, // 1 = far away, ~0 = at camera
        speed: isHero ? 0.08 : 0.20,
        driftX: rand(-1, 1) * 0.00035,
        driftY: rand(-1, 1) * 0.00035,
        maxSizeFrac: isHero
          ? 0.5
          : isBokeh
          ? rand(0.02, 0.05)
          : rand(0.01, 0.018),
        twinkleSpeed: 1.2,
        twinklePhase: Math.random() * Math.PI * 2,
        bokeh: isBokeh,
        hero: isHero,
        flare: hasFlare,
        blobSeed: Math.random() * Math.PI * 2,
        blobFreq: 2 + Math.floor(Math.random() * 2), // 2 or 3 lobes
        blobAmp: 0.17,
        rotSpeed: 0.1,
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { w, h };
    }

    resize();
    particlesRef.current = Array.from({ length: particleCount }, () =>
      makeParticle(true)
    );

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    
    function traceSmoothBlob(px, py, baseRadius, p, t) {
      const segments = 7;
      const pts = [];
      const rot = t * p.rotSpeed;
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const wobble = 1 + p.blobAmp * Math.sin(theta * p.blobFreq + p.blobSeed + rot);
        const r = baseRadius * wobble;
        pts.push([px + Math.cos(theta) * r, py + Math.sin(theta) * r]);
      }

      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const len = pts.length;

      ctx.beginPath();
      const start = mid(pts[len - 1], pts[0]);
      ctx.moveTo(start[0], start[1]);
      for (let i = 0; i < len; i++) {
        const cur = pts[i];
        const next = pts[(i + 1) % len];
        const m = mid(cur, next);
        ctx.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
      }
      ctx.closePath();
    }

    // Hot-light radial gradient: near-white core -> orange -> deep red ->
    // transparent. This color-temperature falloff (instead of a flat red
    // fill) is what makes it read as an actual light source.
    function hotGradient(px, py, radius, alpha) {
      const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
      g.addColorStop(0, `rgba(255, 244, 224, ${alpha})`);
      g.addColorStop(0.18, `rgba(255, 176, 110, ${alpha * 0.95})`);
      g.addColorStop(0.45, `rgba(255, 70, 50, ${alpha * 0.75})`);
      g.addColorStop(0.8, `rgba(200, 20, 20, ${alpha * 0.35})`);
      g.addColorStop(1, "rgba(160, 10, 10, 0)");
      return g;
    }

    

    let rafId;
    let last = performance.now();

    function frame(now) {
      rafId = requestAnimationFrame(frame);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const { w, h } = dimsRef.current;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);

      // ambient warm haze filling the frame, like diffuse IR light
      // scattering through the water — drawn additively so it lifts the
      // blacks slightly instead of sitting as a flat tinted layer
      ctx.globalCompositeOperation = "source-over";
      const ambient = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.42
      );
      ambient.addColorStop(0, "rgba(255, 0, 21, 0.39)");
      ambient.addColorStop(1, "rgba(140, 20, 15, 0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.42;
      const minDim = Math.min(w, h);
      const t = now * 0.001;

      // draw distant/small particles first, big close ones last, so hero
      // particles looming into frame overlap correctly on top
      const sorted = particlesRef.current.slice().sort((a, b) => b.z - a.z);

      // additive blending from here down — this is what makes overlapping
      // glow brighten like real overlapping light instead of just
      // stacking transparency
      ctx.globalCompositeOperation = "lighter";

      for (const p of sorted) {
        p.z -= p.speed * dt;
        p.x += p.driftX * dt * 100;
        p.y += p.driftY * dt * 100;

        if (p.z <= 0.03) {
          Object.assign(p, makeParticle(false));
          continue;
        }

        // perspective: how "arrived" this particle is, 0 (far) -> 1 (at camera)
        const arrival = 1 - p.z;
        const persp = arrival * arrival; // eased growth curve, accelerates as it nears

        const spreadPersp = Math.min(1 / p.z, 6);
        const px = cx + (p.x - 0.5) * w * spreadPersp * 0.5;
        const py = cy + (p.y - 0.5) * h * spreadPersp * 0.5;

        if (px < -minDim || px > w + minDim || py < -minDim || py > h + minDim) {
          Object.assign(p, makeParticle(false));
          continue;
        }

        const radius = Math.max(0.6, p.maxSizeFrac * minDim * (0.08 + persp));

        // fade in as it arrives from the distance, fade out just before
        // it "passes" the camera
        const fadeIn = Math.min(1, (1 - p.z) * 5);
        const fadeOut = Math.min(1, p.z * 4);
        const twinkle =
          0.5 + 0.5 * Math.sin(now * 0.001 * p.twinkleSpeed + p.twinklePhase);
        // additive blending accumulates brightness fast, so base alphas
        // stay modest — overlap does the work of making things glow hot
        const baseAlpha = p.bokeh ? (p.hero ? 0.22 : 0.32) : 0.55;
        const alpha = fadeIn * fadeOut * baseAlpha * (0.45 + 0.55 * twinkle);

        // soft outer glow bloom, wider than the shape itself
        ctx.fillStyle = hotGradient(px, py, radius * 1.6, alpha * 0.6);
        ctx.beginPath();
        ctx.arc(px, py, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // the shape itself — hot-core gradient traced as a smooth blob
        ctx.fillStyle = hotGradient(px, py, radius, alpha);
        traceSmoothBlob(px, py, radius, p, t);
        ctx.fill();

        
      }

      ctx.globalCompositeOperation = "source-over";
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[5] transition-opacity duration-[1400ms] ease-out"
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}