"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useScrollReveal from "../Components/useScrollReveal"

/* =========================================================================
   HELPERS
   ========================================================================= */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

/* =========================================================================
   TYPEWRITER HERO HEADING (unchanged)
   ========================================================================= */

function TypewriterHeading() {
  const LEFT = "Built From Scratch";
  const RIGHT = "Time Go Fishing";
  const LEFT_BLACK_LEN = "Built From ".length; // "Scratch" is the red part

  const [ref, inView] = useReveal();
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let leftInterval;
    let rightInterval;
    let startRightTimeout;

    let i = 0;
    leftInterval = setInterval(() => {
      i++;
      setLeftCount(i);
      if (i >= LEFT.length) {
        clearInterval(leftInterval);
        startRightTimeout = setTimeout(() => {
          let j = 0;
          rightInterval = setInterval(() => {
            j++;
            setRightCount(j);
            if (j >= RIGHT.length) {
              clearInterval(rightInterval);
            }
          }, 60);
        }, 250);
      }
    }, 60);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
      clearTimeout(startRightTimeout);
    };
  }, [inView]);

  const leftRevealed = LEFT.slice(0, leftCount);
  const leftBlack = leftRevealed.slice(0, LEFT_BLACK_LEN);
  const leftRed = leftRevealed.slice(LEFT_BLACK_LEN);
  const rightRevealed = RIGHT.slice(RIGHT.length - rightCount);

  return (
    <h1
      ref={ref}
      className="relative z-10 text-[4vw] my-[4vw] text-[#C4C4C4] p-[30px] grid grid-cols-[1fr_auto_1fr] items-center"
    >
      <span className="text-right whitespace-pre">
        {leftBlack}
        <span className=" text-elegant-red">{leftRed}</span>
      </span>

      <span className="mx-4 md:mx-6">|</span>

      <span className="text-left whitespace-pre">{rightRevealed}</span> 
     
    </h1>
  );
}

/* =========================================================================
   PAGE
   -------------------------------------------------------------------------
   Scroll behaviour (per reference diagram):

     - Project 1 scrolls in normally at first (no effects).
     - Once the section's sticky layer hits the top of the viewport, the
       background pins and further scroll drives progress 0 -> 1, split
       into four phases:

         PHASE A (0 -> P1_END)
           Project 1 scales down from 1 -> 0.4, staying centered and
           fully opaque. This is the "shrink to center" step.

         PHASE B (P1_END -> P2_END)
           Both cards sit at scale 0.4 in the same centered slot.
           Project 1 fades opacity 1 -> 0 (and drifts up slightly).
           Project 2 fades opacity 0 -> 1 (and rises up from below into
           the same slot). This is the crossfade/swap step.

         PHASE C (P2_END -> P3_END)
           Project 2 grows from scale 0.4 -> 1, opacity held at 1,
           arriving at its final full-size resting position.

         PHASE D (P3_END -> 1)
           Project 2 just holds at its final position. This is pure
           scroll buffer so the pin doesn't release the instant project 2
           arrives, which would read as a skipped/cut transition.

     - When progress hits 1 the wrapper's extra scroll height runs out and
       the sticky layer releases — "background fix ends" here, right back
       into the same #0c0c0c background so there's no flash to a lighter
       page background underneath.

     This same 4-phase timeline drives BOTH the image half and the
     details half, so they move in lockstep.
   ========================================================================= */

export default function Projects() {
  /* ---- project 1 ---- */
  const project1 = {
    code: "01",
    title: "Money Compass",
    desc: "A modern personal finance app that turns everyday spending into clear insights, helping users budget smarter and stay in control of their money.",
    tags: ["React", "Python", "TypeScript", "Postgres", "Tailwind CSS"],
    status: "live", // "live" | "archived"
    href: "https://money-compass-navy.vercel.app/",
    image: "/Assets/projects/project-1-1.png",
  };

  /* ---- project 2 ---- */
  const project2 = {
    code: "02",
    title: "Arrive Alert",
    desc: "Arrive Alert is a smart notification platform designed to help users stay informed about important arrivals and events with timely, reliable alerts.",
    tags: ["React Native", "Kotlin", "Ruby", "Swift", "Python"],
    status: "live",
    href: "https://github.com/Seojkc/GPSAlarmApp",
    image: "/Assets/projects/project-2-1.png",
  };

  /* ---- pinned-scroll progress ----
     Driven manually with fixed/absolute instead of CSS `position: sticky`.
     `sticky` silently stops pinning if ANY ancestor (layout wrapper, body,
     an earlier section) has overflow set to anything but visible — e.g. a
     stray `overflow-x-hidden` used elsewhere on the page, which per spec
     forces overflow-y to compute as `auto` and detaches sticky from the
     window scroll. Doing the pin ourselves has no such dependency. */
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [pinState, setPinState] = useState("before"); // "before" | "pinned" | "after"

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let raf = null;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh; // scroll distance available for the pin
      if (total <= 0) {
        setPinState("before");
        setProgress(0);
        return;
      }

      if (rect.top > 0) {
        setPinState("before");
        setProgress(0);
      } else if (rect.bottom <= vh) {
        setPinState("after");
        setProgress(1);
      } else {
        setPinState("pinned");
        setProgress(clamp01(-rect.top / total));
      }
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const P1_END = 0.28; // shrink-to-center ends
  const P2_END = 0.48; // slide-swap ends
  const P3_END = 0.85; // grow-to-final ends, hold begins
  
  const SHRINK_SCALE = 0.5;   // scale both cards sit at during the swap
  const SLIDE_DISTANCE = 50;

  function computeStates(t) {
    let p1 = { scale: 1, opacity: 1, translateY: 0 };
  let p2 = { scale: SHRINK_SCALE, opacity: 0, translateY: SLIDE_DISTANCE };

  if (t <= P1_END) {
    // PHASE A — project 1 shrinks toward center
    const a = clamp01(t / P1_END);
    p1 = { scale: lerp(1, SHRINK_SCALE, a), opacity: 1, translateY: 0 };
    p2 = { scale: SHRINK_SCALE, opacity: 0, translateY: SLIDE_DISTANCE };
  } else if (t <= P2_END) {
    // PHASE B — project 1 slides straight up and out while project 2
    // slides straight up into place, at a constant SLIDE_DISTANCE apart
    const b = clamp01((t - P1_END) / (P2_END - P1_END));
    p1 = {
      scale: SHRINK_SCALE,
      opacity: 1,
      translateY: lerp(0, -SLIDE_DISTANCE, b),
    };
    p2 = {
      scale: SHRINK_SCALE,
      opacity: 1,
      translateY: lerp(SLIDE_DISTANCE, 0, b),
    };
  } else if (t <= P3_END) {
    // PHASE C — project 2 grows up to its final position
    const c = clamp01((t - P2_END) / (P3_END - P2_END));
    p1 = { scale: SHRINK_SCALE, opacity: 0, translateY: -SLIDE_DISTANCE };
    p2 = { scale: lerp(SHRINK_SCALE, 1, c), opacity: 1, translateY: 0 };
  } else {
    // PHASE D — hold at final position (scroll buffer)
    p1 = { scale: SHRINK_SCALE, opacity: 0, translateY: -SLIDE_DISTANCE };
    p2 = { scale: 1, opacity: 1, translateY: 0 };
  }

  return { p1, p2 };
  }

  const { p1, p2 } = computeStates(progress);

  /* ---- hover state, one per card ---- */
  const [hovered1, setHovered1] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [headingRef, headingVisible] = useScrollReveal({ threshold: 1 });

  return (
    <div className="bg-[#0c0c0c] min-h-screen pb-[10vh]">
      <div className="relative text-center py-30 overflow-hidden">
        <TypewriterHeading />
      </div>

      <div className="flex px-[5%] items-center pt-[2vw] justify-between mb-10 font-mono text-[12px] tracking-[0.2em] text-[#C4C4C4]/60">
        <span className="bree-serif-regular text-[16px] tracking-normal text-[#C4C4C4]">
          Selected Work
        </span>
        <span>02 TRANSMISSIONS</span>
      </div>

      {/* ================= PINNED SCROLL STACK (inlined) ================= */}
      <section ref={wrapperRef} className="relative bg-[#0c0c0c]" style={{ height: "400vh" }}>
        <div
          className="h-screen overflow-hidden bg-[#0c0c0c]"
          style={{
            perspective: "1600px",
            position: pinState === "pinned" ? "fixed" : "absolute",
            top: pinState === "after" ? "auto" : 0,
            bottom: pinState === "after" ? 0 : "auto",
            left: 0,
            right: 0,
          }}
        >
          {/* dotted grid background — stays put for the whole pin */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(200, 200, 200, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(200, 200, 200, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "98px 98px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom,#0c0c0c, transparent 10%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to right,#0c0c0c, transparent 30%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top,#0c0c0c, transparent 30%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to left,#0c0c0c, transparent 30%, transparent)" }}
          />

          <div className="relative z-10 h-full flex flex-col md:flex-row items-center px-6 md:px-16">
            {/* ---- IMAGE (always left) ---- */}
            <div className="relative w-full md:w-[35%] h-[38vh] md:h-[70vh] flex items-center justify-center shrink-0">
              {/* CARD 1 IMAGE */}
              <div
                className="absolute inset-0 flex items-center justify-center p-5"
                style={{
                  opacity: p1.opacity,
                  transform: `translateY(${p1.translateY}vh) scale(${p1.scale})`,
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  alt={project1.title}
                  width={1080}
                  height={1080}
                  className="w-full h-auto"
                  src={project1.image}
                />
              </div>

              {/* CARD 2 IMAGE */}
              <div
                className="absolute inset-0 flex items-center justify-center p-5"
                style={{
                  opacity: p2.opacity,
                  transform: `translateY(${p2.translateY}vh) scale(${p2.scale})`,
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  alt={project2.title}
                  width={1080}
                  height={1080}
                  className="w-full h-auto"
                  src={project2.image}
                />
              </div>
            </div>

            {/* ---- DETAILS (always right) ---- */}
            <div className="relative flex-1 w-full h-[42vh] md:h-[70vh]">
              {/* ===== CARD 1 — Money Compass ===== */}
              <div
                className="absolute inset-0 flex items-center z-10"
                style={{
                  opacity: p1.opacity,
                  transform: `translateY(${p1.translateY}vh) scale(${p1.scale})`,
                  willChange: "transform, opacity",
                }}
              >
                
               <a href={project1.href}
                  onMouseEnter={() => setHovered1(true)}
                  onMouseLeave={() => setHovered1(false)}
                  className="group relative block p-6 min-h-[220px] mx-[6%] md:mx-[10%] w-full">

                  <span
                    className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }}
                  />
                  <span
                    className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }}
                  />
                  <span
                    className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }}
                  />
                  <span
                    className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between font-mono text-[11px] tracking-widest text-[#C4C4C4]/60">
                      <span>PRJ-{project1.code}</span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: project1.status === "live" ? "#0f6b64" : "transparent",
                            border: project1.status === "live" ? "none" : "1px solid #292929",
                          }}
                        />
                        {project1.status === "live" ? "LIVE" : "ARCHIVED"}
                      </span>
                    </div>

                    <h3 className="mt-6 text-[6vw] md:text-[2.6vw] bodoni-moda-regular font-semibold text-[#C4C4C4] tracking-tight">
                      {project1.title}
                    </h3>

                    <p
                      ref={headingRef}
                      className={`reveal-wipe ${headingVisible ? "is-visible" : ""}
                       mt-2 pt-6 text-[3.4vw] md:text-[1vw] leading-relaxed text-[#C4C4C4]/70 flex-1`}
                    >
                      {project1.desc}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-4 md:gap-7 flex-wrap">
                        {project1.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bodoni-moda-regular text-[3vw] md:text-[1vw] tracking-wide px-2 py-1 text-[#C4C4C4]/70"
                            style={{ border: "1px solid rgba(196, 196, 196,0.3)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-[12px] text-[#0f6b64] flex items-center gap-1 shrink-0">
                        VIEW
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* ===== CARD 2 — Arrive Alert ===== */}
              <div
                className="absolute inset-0 flex items-center z-20"
                style={{
                  opacity: p2.opacity,
                  transform: `translateY(${p2.translateY}vh) scale(${p2.scale})`,
                  willChange: "transform, opacity",
                }}
              >
                
                <a  href={project2.href}
                  onMouseEnter={() => setHovered2(true)}
                  onMouseLeave={() => setHovered2(false)}
                  className="group relative block p-6 min-h-[220px] mx-[6%] md:mx-[10%] w-full"
                >
                  <span
                    className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }}
                  />
                  <span
                    className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }}
                  />
                  <span
                    className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }}
                  />
                  <span
                    className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-all duration-300 group-hover:w-5 group-hover:h-5"
                    style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between font-mono text-[11px] tracking-widest text-[#C4C4C4]/60">
                      <span>PRJ-{project2.code}</span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: project2.status === "live" ? "#0f6b64" : "transparent",
                            border: project2.status === "live" ? "none" : "1px solid #292929",
                          }}
                        />
                        {project2.status === "live" ? "LIVE" : "ARCHIVED"}
                      </span>
                    </div>

                    <h3 className="mt-6 text-[6vw] md:text-[2.6vw] bodoni-moda-regular font-semibold text-[#C4C4C4] tracking-tight">
                      {project2.title}
                    </h3>

                    <p className="mt-2 pt-6 text-[3.4vw] md:text-[1vw] leading-relaxed text-[#C4C4C4]/70 flex-1">
                      {project2.desc}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-4 md:gap-7 flex-wrap">
                        {project2.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bodoni-moda-regular text-[3vw] md:text-[1vw] tracking-wide px-2 py-1 text-[#C4C4C4]/70"
                            style={{ border: "1px solid rgba(196, 196, 196,0.3)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-[12px] text-[#0f6b64] flex items-center gap-1 shrink-0">
                        VIEW
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}