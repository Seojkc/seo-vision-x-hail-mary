"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "./navbar";
import Image from "next/image";

import useScrollReveal from "../Components/useScrollReveal"




// Smooth a closed loop of points into a soft blob outline
function pointsToPath(points) {
    const n = points.length;
    let d = "";
    for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        if (i === 0) d += `M ${p1.x.toFixed(2)},${p1.y.toFixed(2)} `;
        d += `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} `;
    }
    return d + "Z";
}

export default function Welcome() {
    const wrapperRef = useRef(null);  // outer container — defines the section's box in normal flow
    const maskRef = useRef(null);     // masked image (facemask)
    const pathRef = useRef(null);     // svg path driving the mask shape
    const glowRef = useRef(null);     // specular highlight overlay
    const rafId = useRef(null);
    const [seoRef, seoVisible] = useScrollReveal({ threshold: 0.2 });

    // true while the section is still in view (or hasn't been reached yet) —
    // the background layer is `fixed` in this state. Once the wrapper's
    // bottom edge passes the top of the viewport, this flips to false and
    // the layer switches to `absolute`, permanently detaching it — it can
    // never bleed into later sections again because from that point on it's
    // just ordinary content sitting inside wrapperRef's own box.
    const [pinned, setPinned] = useState(true);

    const mouse = useRef({ x: -9999, y: -9999 });
    const active = useRef(false);

    // spring-driven position (lags/overshoots slightly — premium "weighted" feel)
    const pos = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 });
    const rad = useRef({ v: 0, vel: 0 }); // radius spring

    const N = 22; // points around the blob
    const phases = useRef(
        Array.from({ length: N }, () => ({
            phase: Math.random() * Math.PI * 2,
            freq: 1.4 + Math.random() * 1.6,
            amp: 0.5 + Math.random() * 0.5,
        }))
    );

    // ---- Tunables ----
    const REVEAL_RADIUS = 150;
    const POS_STIFFNESS = 0.05;   // lower = slower / heavier drag behind cursor
    const POS_DAMPING = 0.80;     // lower = more overshoot/jiggle (springy droplet)
    const RAD_STIFFNESS = 0.09;
    const RAD_DAMPING = 0.78;
    const ELONGATION_GAIN = 0.9;  // how much speed stretches the droplet forward
    const MAX_ELONGATION = 55;
    const BACK_PINCH = 0.35;      // tapers a tail opposite the motion
    const AMBIENT_BASE = 3;       // idle ripple size (water never fully still)
    const AMBIENT_SPEED_GAIN = 0.9;
    const seoStyle = {
        opacity: seoVisible ? 1 : 0,
        transform: seoVisible ? "translateY(0px)" : "translateY(220px)",
        transitionProperty: "transform, opacity",
        transitionDuration: "1500ms",
        transitionTimingFunction: "cubic-bezier(0.36, 1, 0.5, 1)", // POP_EASE — matches the rest of the section
        willChange: "transform, opacity",
      };

    // Scroll-position toggle — same pattern as Navbar/Logo's own scroll
    // listeners, just watching the wrapper's bottom edge instead of a
    // fixed scrollY threshold.
    useEffect(() => {
        const handleScroll = () => {
            if (!wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();
            // still pinned as long as the wrapper's bottom hasn't reached
            // the top of the viewport yet
            setPinned(rect.bottom > 0);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const maskEl = maskRef.current;
        const pathEl = pathRef.current;
        const glowEl = glowRef.current;
        if (!maskEl || !pathEl) return;

        let t = 0;
        let lastSpeed = 0;

        const handleMove = (e) => {
            const rect = maskEl.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
            active.current = true;
        };
        const handleLeave = () => {
            active.current = false;
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseleave", handleLeave);

        const animate = () => {
            t += 1;

            // --- spring position toward mouse (damped, can slightly overshoot) ---
            pos.current.vx = pos.current.vx * POS_DAMPING + (mouse.current.x - pos.current.x) * POS_STIFFNESS;
            pos.current.vy = pos.current.vy * POS_DAMPING + (mouse.current.y - pos.current.y) * POS_STIFFNESS;
            pos.current.x += pos.current.vx;
            pos.current.y += pos.current.vy;

            // --- spring radius open/closed ---
            const targetR = active.current ? REVEAL_RADIUS : 0;
            rad.current.vel = rad.current.vel * RAD_DAMPING + (targetR - rad.current.v) * RAD_STIFFNESS;
            rad.current.v += rad.current.vel;
            const baseR = Math.max(rad.current.v, 0);

            // --- droplet speed & direction (drives stretch + ripple energy) ---
            const speed = Math.sqrt(pos.current.vx ** 2 + pos.current.vy ** 2);
            const smoothedSpeed = lastSpeed + (speed - lastSpeed) * 0.25;
            lastSpeed = smoothedSpeed;
            const velAngle = Math.atan2(pos.current.vy, pos.current.vx);
            const elongation = Math.min(smoothedSpeed * ELONGATION_GAIN, MAX_ELONGATION);
            const ambientAmp = AMBIENT_BASE + smoothedSpeed * AMBIENT_SPEED_GAIN;

            // --- build blob points ---
            const points = [];
            for (let i = 0; i < N; i++) {
                const angle = (i / N) * Math.PI * 2;
                const forward = Math.max(0, Math.cos(angle - velAngle));
                const backward = Math.max(0, Math.cos(angle - velAngle + Math.PI));

                const stretch = elongation * forward;
                const pinch = elongation * BACK_PINCH * backward;

                const ph = phases.current[i];
                const wobble = Math.sin(t * 0.045 * ph.freq + ph.phase) * ambientAmp * ph.amp;

                const r = Math.max(baseR + stretch - pinch + wobble, 0);
                points.push({
                    x: pos.current.x + Math.cos(angle) * r,
                    y: pos.current.y + Math.sin(angle) * r,
                });
            }

            pathEl.setAttribute("d", baseR < 0.5 ? "" : pointsToPath(points));

            // specular highlight follows droplet, offset toward "light source" corner
            if (glowEl) {
                const hx = pos.current.x - baseR * 0.32;
                const hy = pos.current.y - baseR * 0.32;
                glowEl.style.setProperty("--gx", `${hx}px`);
                glowEl.style.setProperty("--gy", `${hy}px`);
                glowEl.style.setProperty("--gr", `${Math.max(baseR * 0.55, 0)}px`);
                glowEl.style.opacity = baseR > 4 ? "1" : "0";
            }

            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseleave", handleLeave);
            cancelAnimationFrame(rafId.current);
        };
    }, []);


    const videoRef = useRef(null);
    useEffect(()=>
        {
            if(videoRef.current){
                videoRef.current.playbackRate = 1;
            }

        },[])




    return (
        // Outer wrapper stays a plain h-screen block in normal document
        // flow — this box is what the background layer detaches to once
        // scrolled past, and what mouse tracking measures against.
        <div ref={wrapperRef} id="home" className="relative h-screen w-full overflow-hidden">

            {/* ---- BACKGROUND LAYER: navbar mount, gradient, planet, SEO text ----
                 `fixed` while `pinned` is true (identical look/feel to true
                 position:fixed — no sticky quirks). The instant the
                 wrapper's bottom edge reaches the top of the viewport,
                 this flips to `absolute bottom-0`, which lands on the
                 exact same pixels (since the wrapper is exactly one
                 viewport tall) — zero visual jump — and from then on it
                 scrolls away with the wrapper like normal content,
                 permanently, never reappearing behind later sections. */}
            <div
                className={
                    pinned
                        ? "fixed inset-x-0 top-0 h-screen z-0"
                        : "absolute inset-x-0 bottom-0 h-screen z-0"
                }
            >
                

                <Image
                    src="/Assets/adrian-planet-1.png"
                    alt="face"
                    width={2800}
                    height={900}
                    className="
                        absolute w-[75%]
                        bottom-[5%] left-[50%]
                        -translate-x-1/2 translate-y-1/2
                        opacity-95
                        animate-pulse-glow
                    "
                />

                <style jsx global>{`
                  @keyframes pulseGlow {
                    0%, 100% {
                      filter: drop-shadow(0 0 80px rgba(18, 218, 0, 0.87));
                    }
                    50% {
                      filter: drop-shadow(0 0 180px rgb(62, 219, 0));
                    }
                  }
                  .animate-pulse-glow {
                    animation: pulseGlow 5s ease-in-out infinite;
                  }

                  
                `}</style>

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/90" />

                <div
                    ref={seoRef}
                    className="absolute inset-x-0 top-0 h-[90%] px-5 flex items-center justify-center agdasima-regular"
                    style={seoStyle}
                >
                    <h1 className="w-full text-center text-[18vw] font-bold scaleY-15 glass-heading">
                        <span className="max-[600px]:hidden">SEO JAMES</span>
                        <span className="hidden max-[600px]:inline">SEO</span>
                    </h1>
                </div>
            </div>

            {/* SVG mask def */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    <filter id="droplet-blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="9" />
                    </filter>
                    <mask id="droplet-mask" maskUnits="userSpaceOnUse" x="-99999" y="-99999" width="199999" height="199999">
                        <path ref={pathRef} d="" fill="white" filter="url(#droplet-blur)" />
                    </mask>
                </defs>
            </svg>

            {/* ---- FACEMASK / mask3 (the "border bottom") ----
                 Always normal-flow `absolute` against wrapperRef, exactly
                 as in the original — this was never the source of the
                 bleed-through, so it's untouched. It scrolls away with the
                 wrapper naturally alongside the now-detached background. */}
            <div className="pointer-events-none absolute -bottom-[2px] left-1/2 z-10 -translate-x-1/2">
                <div className="relative w-[min(800px,85vw)]">
                    <Image
                        src="/Assets/mask4.png"
                        alt="face"
                        width={800}
                        height={200}
                        className="relative  -bottom-[2px] z-10 h-auto w-full object-contain object-bottom"
                    />

                    <Image
                        ref={maskRef}
                        src="/Assets/face4.png"
                        alt="facemask"
                        width={800}
                        height={200}
                        className="absolute -bottom-[2px] right-0 z-20 h-auto w-full object-contain object-bottom"
                        style={{
                            WebkitMaskImage: "url(#droplet-mask)",
                            maskImage: "url(#droplet-mask)",
                        }}
                    />

                    {/* Specular highlight — gives the reveal area a glossy "water surface" catch-light */}
                    <div
                        ref={glowRef}
                        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-150"
                        style={{
                            background:
                                "radial-gradient(circle var(--gr, 0px) at var(--gx, -9999px) var(--gy, -9999px), rgba(255, 255, 255, 0) 0%, transparent 70%)",
                            mixBlendMode: "screen",
                            opacity: 0,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}