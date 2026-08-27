"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useScrollReveal from "../Components/useScrollReveal";
import ScrollSlideUp from "../Components/ScrollSlideUp"

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
    const project1 = { /* unchanged */ 
      code: "01", title: "Money Compass",
      desc: "A modern personal finance app that turns everyday spending into clear insights, helping users budget smarter and stay in control of their money.",
      tags: ["React", "Python", "TypeScript", "Postgres", "Tailwind CSS"],
      status: "live", href: "https://money-compass-navy.vercel.app/",
      image: "/Assets/projects/project-1-1.png",
    };
    const project2 = { /* unchanged */
      code: "02", title: "Arrive Alert",
      desc: "Arrive Alert is a smart notification platform designed to help users stay informed about important arrivals and events with timely, reliable alerts.",
      tags: ["React Native", "Kotlin", "Ruby", "Swift", "Python"],
      status: "live", href: "https://github.com/Seojkc/GPSAlarmApp",
      image: "/Assets/projects/project-2-1.png",
    };
  
    const wrapperRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [pinState, setPinState] = useState("before");
  
    /* ---- NEW: track mobile vs desktop so animation distances stay
       relative to each column's actual height instead of the viewport ---- */
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
  
    useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;
      let raf = null;
      const measure = () => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = el.offsetHeight - vh;
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
  
    const P1_END = 0.28;
    const P2_END = 0.48;
    const P3_END = 0.85;
  
    const SHRINK_SCALE = 0.5;
    /* ---- CHANGED: was a flat 50 (vh). On mobile each column is only
       ~38-42vh tall, so a 50vh slide spilled into the neighboring column.
       Desktop keeps the exact same 50 as before. ---- */
    const SLIDE_DISTANCE = isMobile ? 14 : 50;
  
    function computeStates(t) {
      let p1 = { scale: 1, opacity: 1, translateY: 0 };
      let p2 = { scale: SHRINK_SCALE, opacity: 0, translateY: SLIDE_DISTANCE };
  
      if (t <= P1_END) {
        const a = clamp01(t / P1_END);
        p1 = { scale: lerp(1, SHRINK_SCALE, a), opacity: 1, translateY: 0 };
        p2 = { scale: SHRINK_SCALE, opacity: 0, translateY: SLIDE_DISTANCE };
      } else if (t <= P2_END) {
        const b = clamp01((t - P1_END) / (P2_END - P1_END));
        p1 = { scale: SHRINK_SCALE, opacity: 1, translateY: lerp(0, -SLIDE_DISTANCE, b) };
        p2 = { scale: SHRINK_SCALE, opacity: 1, translateY: lerp(SLIDE_DISTANCE, 0, b) };
      } else if (t <= P3_END) {
        const c = clamp01((t - P2_END) / (P3_END - P2_END));
        p1 = { scale: SHRINK_SCALE, opacity: 0, translateY: -SLIDE_DISTANCE };
        p2 = { scale: lerp(SHRINK_SCALE, 1, c), opacity: 1, translateY: 0 };
      } else {
        p1 = { scale: SHRINK_SCALE, opacity: 0, translateY: -SLIDE_DISTANCE };
        p2 = { scale: 1, opacity: 1, translateY: 0 };
      }
      return { p1, p2 };
    }
  
    const { p1, p2 } = computeStates(progress);
    const [hovered1, setHovered1] = useState(false);
    const [hovered2, setHovered2] = useState(false);
    const [headingRef, headingVisible] = useScrollReveal({ threshold: 1 });
  
    return (
      <div className="bg-[#0c0c0c] min-h-screen pb-[10vh]">
        <div className="relative text-center py-30 overflow-hidden hidden md:block">
          <TypewriterHeading />
        </div>
  
        <ScrollSlideUp className="relative text-center py-30 overflow-hidden md:hidden block text-start pl-10">
          <h1 className="text-[25vw] text-white/80">
            Built <span className="text-[8vw] text-white/50"> From</span>{" "}
          </h1>
          <h1 className="text-[23vw] text-elegant-red">Scratch</h1>
        </ScrollSlideUp>
  
        <ScrollSlideUp delay={50}>
          <div className="flex px-[5%] items-center pt-[2vw] justify-between mb-10 font-mono text-[12px] tracking-[0.2em] text-[#C4C4C4]/60">
            <span className="bree-serif-regular text-[16px] tracking-normal text-[#C4C4C4]">
              Selected Work
            </span>
            <span>02 TRANSMISSIONS</span>
          </div>
        </ScrollSlideUp>
  
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
            {/* background grid/gradients unchanged */}
            <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, rgba(200, 200, 200, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.05) 1px, transparent 1px)`, backgroundSize: "98px 98px" }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom,#0c0c0c, transparent 10%, transparent)" }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to right,#0c0c0c, transparent 30%, transparent)" }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top,#0c0c0c, transparent 30%, transparent)" }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to left,#0c0c0c, transparent 30%, transparent)" }} />
  
            {/* ---- CHANGED: added justify-center so the whole stack sits
                 vertically centered in the pinned screen on mobile, instead
                 of hugging the top ---- */}
            <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-start px-6 md:px-16 pt-[30%] md:pt-0">
              {/* ---- IMAGE ----
                 CHANGED: h-[38vh] -> h-[30vh] on mobile, plus overflow-hidden
                 so a card can never visually bleed into the details block
                 below it even mid-transition. Desktop (md:) untouched. */}


<div className="relative w-full  md:w-[35%] h-[32vh] md:h-[70vh] flex items-end md:items-center justify-center shrink-0 overflow-hidden md:overflow-visible">
  {/* CARD 1 IMAGE */}
  <div
    className="absolute inset-0 flex items-end md:items-center justify-center"
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
      className="w-auto h-[95%] max-w-[99%] object-contain md:w-full md:h-auto md:max-w-none"
      src={project1.image}
    />
  </div>

  {/* CARD 2 IMAGE */}
  <div
    className="absolute inset-0 flex items-end md:items-center justify-center"
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
      className="w-auto h-[95%] max-w-[99%] object-contain md:w-full md:h-auto md:max-w-none"
      src={project2.image}
    />
  </div>
</div>

{/* ---- DETAILS ----
   CHANGED: height reduced to 46vh (freed up from the bigger image
   box above it) — still items-start/pt-2 from before so text stays
   flush at the top of its space with no re-introduced gap. */}
<div className="relative flex-1 w-full h-[46vh] md:h-[70vh] overflow-hidden md:overflow-visible">
  {/* ===== CARD 1 — Money Compass ===== */}
  <div
    className="absolute inset-0 flex items-start md:items-center z-10 pt-2 md:pt-0"
    style={{
      opacity: p1.opacity,
      transform: `translateY(${p1.translateY}vh) scale(${p1.scale})`,
      willChange: "transform, opacity",
    }}
  >
    <a href={project1.href}
      onMouseEnter={() => setHovered1(true)}
      onMouseLeave={() => setHovered1(false)}
      className="group relative block p-4 md:p-6 min-h-0 md:min-h-[220px] mx-[6%] md:mx-[10%] w-full">

      <span className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }} />
      <span className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }} />
      <span className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }} />
      <span className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered1 ? "#0f6b64" : "#292929" }} />

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

        <h3 className="mt-2 md:mt-6 text-[6vw] md:text-[2.6vw] bodoni-moda-regular font-semibold text-[#C4C4C4] tracking-tight">
          {project1.title}
        </h3>

        <p
          ref={headingRef}
          className={`reveal-wipe ${headingVisible ? "is-visible" : ""}
           mt-2 pt-1 md:pt-6 text-[3.4vw] md:text-[1vw] leading-relaxed text-[#C4C4C4]/70 flex-1`}
        >
          {project1.desc}
        </p>

        <div className="mt-2 md:mt-5 flex items-center justify-between">
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
    className="absolute inset-0 flex items-start md:items-center z-20 pt-2 md:pt-0"
    style={{
      opacity: p2.opacity,
      transform: `translateY(${p2.translateY}vh) scale(${p2.scale})`,
      willChange: "transform, opacity",
    }}
  >
    <a href={project2.href}
      onMouseEnter={() => setHovered2(true)}
      onMouseLeave={() => setHovered2(false)}
      className="group relative block p-4 md:p-6 min-h-0 md:min-h-[220px] mx-[6%] md:mx-[10%] w-full"
    >
      <span className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }} />
      <span className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }} />
      <span className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }} />
      <span className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-all duration-300 group-hover:w-5 group-hover:h-5" style={{ borderColor: hovered2 ? "#0f6b64" : "#292929" }} />

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

        <h3 className="mt-2 md:mt-6 text-[6vw] md:text-[2.6vw] bodoni-moda-regular font-semibold text-[#C4C4C4] tracking-tight">
          {project2.title}
        </h3>

        <p className="mt-2 pt-1 md:pt-6 text-[3.4vw] md:text-[1vw] leading-relaxed text-[#C4C4C4]/70 flex-1">
          {project2.desc}
        </p>

        <div className="mt-2 md:mt-5 flex items-center justify-between">
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