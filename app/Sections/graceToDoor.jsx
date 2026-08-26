"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function Stars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }, () => ({
      size: Math.round(Math.random() * 16 + 8),
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 100}%`,
      zIndex: Math.round(Math.random() * 5),
      duration: (Math.random() * 3 + 2.2).toFixed(2),
      delay: (Math.random() * 4).toFixed(2),
      depth: Math.random(), // 0 = far/dim/blurred, 1 = near/sharp/bright
    }));
    setStars(generatedStars);
  }, []);

  return (
    <>
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute star-twinkle"
          style={{
            top: star.top,
            left: star.left,
            zIndex: star.zIndex,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            filter: `blur(${((1 - star.depth) * 0.6).toFixed(2)}px)`,
            // @ts-ignore custom property consumed by the keyframes below
            "--base-opacity": (0.35 + star.depth * 0.65).toFixed(2),
          }}
        >
          <Image
            width={star.size}
            height={star.size}
            alt="star"
            src="/Assets/glow-star.png"
          />
        </div>
      ))}

      <style jsx>{`
        .star-twinkle {
          animation-name: twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: calc(var(--base-opacity) * 0.35);
            transform: scale(0.85);
          }
          50% {
            opacity: var(--base-opacity);
            transform: scale(1.15);
          }
        }
      `}</style>
    </>
  );
}

// ---- Catmull-Rom -> smooth SVG path ----
function pointsToSmoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

// ---- Generates a tangled -> taut rope curve between two anchor points ----
// `time` drives a continuous low-amplitude "hum" so the cable never looks
// perfectly static, even when scroll isn't moving.
function getRopePoints(start, end, progress, time, numPoints = 48) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const perpX = -uy;
  const perpY = ux;

  const eased = easeOutCubic(1 - progress); // 1 -> 0, decays faster at the end (whip-tighten)
  const amplitude = eased * 78 + 4;
  const frequency = 2.2 + eased * 3.4;

  // subtle standing "hum" vibration, always present, strongest when nearly taut
  const tautness = 1 - eased; // 0 -> 1 as rope tightens
  const humAmp = 1.2 + tautness * 2.4;

  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const taper = Math.sin(t * Math.PI); // 0 at ends, 1 mid
    const wave = Math.sin(t * frequency * Math.PI * 2) * amplitude * taper;
    const swirl =
      Math.cos(t * frequency * Math.PI * 3.1) * amplitude * 0.45 * taper;
    const hum = Math.sin(t * 46 + time * 9) * humAmp * taper;

    // gravity-ish sag added to the wave
    const sag = Math.sin(t * Math.PI) * eased * 44;

    points.push({
      x: start.x + dx * t + perpX * (wave + hum) + ux * swirl * 0.3,
      y: start.y + dy * t + perpY * (wave + hum) + uy * swirl * 0.3 + sag,
    });
  }
  return points;
}

export default function graceToDoor() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const astronautWrapRef = useRef(null);
  const astronautImgRef = useRef(null);
  const astronautAnchorRef = useRef(null);
  const doorAnchorRef = useRef(null);
  const doorGlowRef = useRef(null);
  const starsWrapRef = useRef(null);

  const [ropePath, setRopePath] = useState("");
  const [glowPath, setGlowPath] = useState("");
  const [doorProgress, setDoorProgress] = useState(0); // throttled render-facing value

  const rafRef = useRef(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const prevXRef = useRef(0);
  const lastRenderRef = useRef(0);
  const maxTranslateRef = useRef(0);

  // --- raw scroll progress: 0 -> 1 as section travels through viewport ---
  const readScrollProgress = useCallback(() => {
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const raw = (vh - rect.top) / (vh + rect.height);
    return Math.min(1, Math.max(0, raw));
  }, []);

  const updateRope = useCallback((p, time) => {
    if (
      !containerRef.current ||
      !astronautAnchorRef.current ||
      !doorAnchorRef.current
    )
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const aRect = astronautAnchorRef.current.getBoundingClientRect();
    const dRect = doorAnchorRef.current.getBoundingClientRect();

    const start = {
      x: aRect.left + aRect.width / 2 - containerRect.left,
      y: aRect.top + aRect.height / 2 - containerRect.top,
    };
    const end = {
      x: dRect.left + dRect.width / 2 - containerRect.left,
      y: dRect.top + dRect.height / 2 - containerRect.top,
    };

    const pts = getRopePoints(start, end, p, time);
    const path = pointsToSmoothPath(pts);
    setRopePath(path);
    setGlowPath(path);
  }, []);

  const computeMaxTranslate = useCallback(() => {
    if (
      !containerRef.current ||
      !astronautAnchorRef.current ||
      !doorAnchorRef.current
    )
      return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const aRect = astronautAnchorRef.current.getBoundingClientRect();
    const dRect = doorAnchorRef.current.getBoundingClientRect();

    const gapAtEnd = 140;
    const distance = dRect.left - aRect.right - gapAtEnd;
    maxTranslateRef.current = Math.max(0, distance);
  }, []);

  // scroll/resize just update the TARGET, no direct DOM writes here
  useEffect(() => {
    computeMaxTranslate();

    const onScroll = () => {
      targetProgressRef.current = readScrollProgress();
    };
    const onResize = () => {
      computeMaxTranslate();
      targetProgressRef.current = readScrollProgress();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [computeMaxTranslate, readScrollProgress]);

  // continuous animation loop: lerps toward target progress every frame,
  // so motion has weight and never snaps directly to the scrollbar.
  useEffect(() => {
    const start = performance.now();

    const tick = (now) => {

      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const time = (now - start) / 1000;
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;

      // critically-damped-ish lerp
      const next = current + (target - current) * 0.075;
      smoothProgressRef.current = Math.abs(next - target) < 0.0001 ? target : next;
      const p = smoothProgressRef.current;

      const translateX = maxTranslateRef.current * p;
      const velocity = Math.abs(translateX - prevXRef.current);
      prevXRef.current = translateX;

      const idleBob = Math.sin(time * 1.1) * 3; // slow ambient float, always alive
      const translateY = Math.sin(p * Math.PI) * -18 + idleBob;
      const rotate = p * 6 + Math.sin(time * 0.7) * 1.2;

      if (astronautWrapRef.current) {
        astronautWrapRef.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
      }
     
      
      
      if (containerRef.current) {
        // slow cinematic push-in over the whole scroll
        containerRef.current.style.transform = `scale(${1 + p * 0.045})`;
      }
      if (starsWrapRef.current) {
        // stars drift opposite/slower than foreground -> parallax depth
        starsWrapRef.current.style.transform = `translateX(${-p * 30}px)`;
      }

      updateRope(p, time);

      // throttle React state updates (door label / css-driven bits) to ~15fps
      if (now - lastRenderRef.current > 65) {
        lastRenderRef.current = now;
        setDoorProgress(p);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateRope]);


  const isVisibleRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      {
        threshold: 0.1,
      }
    );
  
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  
    return () => observer.disconnect();
  }, []);



  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full py-[6%] h-auto overflow-hidden"
        style={{
          backgroundColor: "rgb(12, 12, 12)",
            
        }}
      >

        

        

        
        <div ref={starsWrapRef} className="absolute inset-0 will-change-transform">
          <Stars />
        </div>

        <div
          ref={containerRef}
          className="relative flex items-center will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          {/* ---- SVG rope layer ---- */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7a0d14" />
                <stop offset="50%" stopColor="#e0202b" />
                <stop offset="100%" stopColor="#7a0d14" />
              </linearGradient>

              <filter id="ropeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* soft outer glow, brightens as tension builds */}
            <path
              d={glowPath}
              fill="none"
              stroke="#e0202b"
              strokeWidth={10}
              strokeOpacity={0.2 + doorProgress * 0.35}
              filter="url(#ropeGlow)"
            />

            {/* dark rope base */}
            <path
              d={ropePath}
              fill="none"
              stroke="#3a0509"
              strokeWidth={7}
              strokeLinecap="round"
            />

            {/* main rope */}
            <path
              d={ropePath}
              fill="none"
              stroke="url(#ropeGradient)"
              strokeWidth={4.5}
              strokeLinecap="round"
            />

            {/* twisted strand highlight */}
            <path
              d={ropePath}
              fill="none"
              stroke="#ff6b6b"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeOpacity={0.6}
              strokeDasharray="10 14"
            />

            
            
          </svg>

          {/* ---- Astronaut ---- */}
          <div
  ref={astronautWrapRef}
  className="relative ml-[4%] sm:ml-[6%] md:ml-[10%] will-change-transform"
>
  <div ref={astronautImgRef} className="will-change-[filter]">
    <Image
      width={350}
      height={200}
      alt="astronaut"
      src="/Assets/grace-suit.png"
      className="w-[160px] sm:w-[220px] md:w-[300px] lg:w-[350px] h-auto"
    />
  </div>

  <span
    ref={astronautAnchorRef}
    className="absolute"
    style={{ right: "6%", top: "34%", width: 1, height: 1 }}
  />
</div>

          {/* ---- Shuttle door ---- */}
       
<div className="absolute right-[0%]">
  <Image
    width={400}
    height={200}
    alt="space-door"
    src="/Assets/space-door-1.png"
    className="w-[200px] sm:w-[260px] md:w-[340px] lg:w-[400px] h-auto"
  />
  <span
    ref={doorAnchorRef}
    className="absolute"
    style={{ left: "6%", top: "40%", width: 1, height: 1 }}
  />
</div>
        </div>

        {/* cinematic vignette frame */}
        <div className="absolute inset-0 pointer-events-none vignette" />

        <style jsx>{`
          .rope-pulse {
            animation-name: pulse-travel;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            filter: drop-shadow(0 0 4px #ff4d4d);
          }
          @keyframes pulse-travel {
            from {
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: -226;
            }
          }

         

          

          .vignette {
            
          }
        `}</style>


        
      </section>
    </>
  );
}