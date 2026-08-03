"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";




export function Stars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }, () => ({
      size: Math.round(Math.random() * 20 + 10),
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 100}%`,
      zIndex: `${Math.random() * 100}%`,
    }));

    setStars(generatedStars);
  }, []);

  return (
    <>
      {stars.map((star, index) => (
        <Image
          key={index}
          width={star.size}
          height={star.size}
          alt="star"
          src="/Assets/glow-star.png"
          className="absolute"
          style={{
            top: star.top,
            left: star.left,
            zIndex:star.zIndex
          }}
        />
      ))}
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

// ---- Generates a tangled -> taut rope curve between two anchor points ----
function getRopePoints(start, end, progress, numPoints = 44) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const perpX = -uy;
  const perpY = ux;

  // slack shrinks as astronaut nears the door
  const amplitude = (1 - progress) * 70 + 6;
  const frequency = 2.4 + (1 - progress) * 3.2;

  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const taper = Math.sin(t * Math.PI); // 0 at ends, 1 mid
    const wave = Math.sin(t * frequency * Math.PI * 2) * amplitude * taper;
    const swirl =
      Math.cos(t * frequency * Math.PI * 3.1) * amplitude * 0.45 * taper;

    // gravity-ish sag added to the wave
    const sag = Math.sin(t * Math.PI) * (1 - progress) * 40;

    points.push({
      x: start.x + dx * t + perpX * wave + ux * swirl * 0.3,
      y: start.y + dy * t + perpY * wave + uy * swirl * 0.3 + sag,
    });
  }
  return points;
}

export default function graceToDoor() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const astronautWrapRef = useRef(null);
  const astronautAnchorRef = useRef(null);
  const doorAnchorRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [ropePath, setRopePath] = useState("");
  const [glowPath, setGlowPath] = useState("");
  const rafRef = useRef(null);

  const maxTranslateRef = useRef(0);

  // --- scroll progress: 0 -> 1 as section travels through viewport ---
  const updateScrollProgress = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const raw = (vh - rect.top) / (vh + rect.height);
    const clamped = Math.min(1, Math.max(0, raw));
    setProgress(clamped);
  }, []);

  // --- measure anchors + rebuild rope path each time progress changes ---
  const updateRope = useCallback((p) => {
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

    const pts = getRopePoints(start, end, p);
    setRopePath(pointsToSmoothPath(pts));
    setGlowPath(pointsToSmoothPath(pts));
  }, []);

  // recompute how far the astronaut is allowed to travel toward the door
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

    const gapAtEnd = 140; // keep a safety gap so he never overlaps the door
    const distance = dRect.left - aRect.right - gapAtEnd;
    maxTranslateRef.current = Math.max(0, distance);
  }, []);

  useEffect(() => {
    computeMaxTranslate();

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateScrollProgress();
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", () => {
      computeMaxTranslate();
      onScrollOrResize();
    });
    onScrollOrResize();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [computeMaxTranslate, updateScrollProgress]);


  
  

  // whenever progress changes, move astronaut then re-measure rope on next frame
  useEffect(() => {
    if (astronautWrapRef.current) {
      const translateX = maxTranslateRef.current * progress;
      const translateY = Math.sin(progress * Math.PI) * -18; // slight arc
      const rotate = progress * 6;
      astronautWrapRef.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
    }
    const id = requestAnimationFrame(() => updateRope(progress));
    return () => cancelAnimationFrame(id);
  }, [progress, updateRope]);

  return (


    <>






        <section
            ref={sectionRef}
            className="relative w-full h-auto overflow-hidden "
            style={{
                backgroundColor: "rgb(12,12,12)",
                backgroundImage:
                "radial-gradient(circle,rgba(49, 49, 49, 0.64) 1px, transparent 0.5px)",
                backgroundSize: "18px 18px",
            }}
            >


            <Stars />


            <div
                ref={containerRef}
                className="relative flex items-center"
            >
                {/* ---- SVG rope layer ---- */}
                <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
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

                {/* soft outer glow */}
                <path
                    d={glowPath}
                    fill="none"
                    stroke="#e0202b"
                    strokeWidth={10}
                    strokeOpacity={0.25}
                    filter="url(#ropeGlow)"
                />

                {/* dark rope base (thick, gives it body/shadow) */}
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

                {/* animated energy pulse traveling along the rope */}
                <path
                    d={ropePath}
                    fill="none"
                    stroke="#ffb3b3"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeDasharray="6 220"
                    className="rope-pulse"
                />
                </svg>

                {/* ---- Astronaut ---- */}
                <div ref={astronautWrapRef} className="relative ml-[10%] will-change-transform">
                <Image
                    width={350}
                    height={200}
                    alt="astronaut"
                    src="/Assets/grace-suit.png"
                />
                {/* invisible anchor near the astronaut's outstretched hand */}
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
                />
                {/* invisible anchor at the door opening */}
                <span
                    ref={doorAnchorRef}
                    className="absolute"
                    style={{ left: "6%", top: "40%", width: 1, height: 1 }}
                />
                </div>
            </div>

            <style jsx>{`
                .rope-pulse {
                animation: pulse-travel 2.6s linear infinite;
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
            `}</style>
            </section>
    
    
    
    </>
    
  );
}