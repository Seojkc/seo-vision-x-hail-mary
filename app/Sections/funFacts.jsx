"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";


















function SkillsMarquee() {
    const skills = [
        "Creative",
        "Innovative",
        "Adaptive",
        "Curious",
        "Strategic",
        "Aesthetic",
        "Explorative",
      ];
     
      // Repeat the base list so one "set" is wider than the strip itself —
      // that's what keeps the loop from ever showing a blank gap.
      const REPEAT = 4;
      const baseSet = Array.from({ length: REPEAT }, () => skills).flat();
      const loopItems = [...baseSet, ...baseSet];
     
      const trackRef = useRef(null);
      const offset = useRef(0);
      const halfWidth = useRef(0);

      const position = useRef(0);
      const velocity = useRef(1); // base speed

      const lastScrollY = useRef(0);
      const boost = useRef(0);


      useEffect(() => {

        let frameId;
      
        function animate() {
      
          position.current += velocity.current + boost.current;
      
          boost.current *= 0.94; // smooth decay
      
          if (trackRef.current) {
      
            const halfWidth =
              trackRef.current.scrollWidth / 2;
      
            if (position.current >= halfWidth) {
              position.current -= halfWidth;
            }
      
            trackRef.current.style.transform =
              `translateX(-${position.current}px)`;
          }
      
          frameId = requestAnimationFrame(animate);
        }
      
        animate();
      
        return () => cancelAnimationFrame(frameId);
      
      }, []);

      useEffect(() => {

        lastScrollY.current = window.scrollY;
      
        function handleScroll() {
      
          const currentY = window.scrollY;
      
          const delta =
            Math.abs(currentY - lastScrollY.current);
      
          lastScrollY.current = currentY;
      
          boost.current += delta * 0.03;
        }
      
        window.addEventListener("scroll", handleScroll);
      
        return () =>
          window.removeEventListener("scroll", handleScroll);
      
      }, []);

     
      return (
        <>

        <div className="relative w-full p-[20px] pt-[100px] ">
          <div className="absolute mt-8 inset-0 flex items-center overflow-hidden justify-center">
            <div style={{ transform: "rotate(0deg)" }}>
              <div className=" overflow-hidden">
                <div ref={trackRef} className="flex w-max flex-nowrap animate-marquee-left" >
                  {loopItems.map((skill, i) => (
                    <span
                      key={i}
                      className="mx-8 flex items-center  flex-shrink-0"
                    >
                      <span className="text-[#DBDBDB] text-6xl md:text-8xl font-black uppercase tracking-tight">
                        {skill}
                      </span>
                    
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        



        </>
        
      );
  }




// ---- helpers ----
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
 
// Each note: final scattered position (relative to center), final rotation,
// and `rise` — how far below its final spot (in vh) it starts. Because the
// sticky wrapper below has overflow-hidden, a note sitting `rise` vh below
// its target is simply clipped off-screen until scroll brings it up — so
// there's no fade-in, it genuinely feels "stuck to the page" underneath.
const NOTES = [
  {
    src: "/Assets/bug-fixed.png",
    x: -34, // vw offset from center (final, and held throughout — no horizontal drift)
    y: -8,  // vh offset from center (final)
    rotate: -20,
    rise: 75,
    width: 200,
  },
  {
    src: "/Assets/Coffee-consumed.png",
    x: 30,
    y: -14,
    rotate: 10,
    rise: 75,
    width: 200,
  },
  {
    src: "/Assets/claude-helps.png",
    x: -28,
    y: 18,
    rotate: 30,
    rise: 50,
    width: 200,
  },
  {
    src: "/Assets/late-night.png",
    x: 34,
    y: 16,
    rotate: 0,
    rise: 70,
    width: 200,
  },
  {
    src: "/Assets/way-too-many.png",
    x: 0,
    y: 27,
    rotate: -10,
    rise: 60,
    width: 200,
  },
];
 
// how much of the pinned/hold phase is used for staggering notes in
const HOLD_START = 0.12;
const HOLD_END = 0.86;
 
export default function FunFacts() {
  const wrapperRef = useRef(null);
  const funFactsRef = useRef(null);
  const noteRefs = useRef([]);
  const rafRef = useRef(null);
 
  const update = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
 
    const rect = wrapper.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = rect.height - vh;
 
    // 0 at start of pin, 1 at end of pin
    const progress = clamp(scrollable > 0 ? -rect.top / scrollable : 0);
 
    // --- fun facts scale: grow in (0 -> 0.12), hold, shrink out (0.86 -> 1)
    let scale = 1;
    if (progress < HOLD_START) {
      scale = lerp(1, 1.35, progress / HOLD_START);
    } else if (progress > HOLD_END) {
      scale = lerp(1.35, 1, (progress - HOLD_END) / (1 - HOLD_END));
    } else {
      scale = 1.35;
    }
 
    if (funFactsRef.current) {
      funFactsRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
 
    // --- each note staggers up during the hold window ---
    const holdRange = HOLD_END - HOLD_START;
    const step = holdRange / NOTES.length;
 
    NOTES.forEach((note, i) => {
      const el = noteRefs.current[i];
      if (!el) return;
 
      const noteStart = HOLD_START + step * i;
      const noteEnd = noteStart + step * 0.9;
 
      // RAW linear t — deliberately NOT eased. This is what makes the note
      // travel at a rate tied directly to scroll distance, so it reads as
      // "attached to the page" rather than flying in on its own timer.
      const t = clamp((progress - noteStart) / (noteEnd - noteStart));
 
      // position: linear with scroll, x never moves
      const tx = note.x;
      const ty = lerp(note.y + note.rise, note.y, t);
 
      // a gentle ease ONLY for rotation/scale — cosmetic settle, doesn't
      // touch position so the scroll-linked feel stays intact
      const eased = 1 - Math.pow(1 - t, 2);
      const rotKick = i % 2 === 0 ? 14 : -14;
      const rot = lerp(note.rotate + rotKick, note.rotate, eased);
      const noteScale = lerp(0.88, 1, eased);
 
      el.style.transform = `translate(-50%, -50%) translate(${tx}vw, ${ty}vh) rotate(${rot}deg) scale(${noteScale})`;
    });
  }, []);
 
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);
 
  return (
    <div
      className="relative w-full pb-[8%]"
      style={{
        backgroundColor: "rgb(12,12,12)",
        backgroundImage:
          "radial-gradient(circle,rgba(49, 49, 49, 0.64) 1px, transparent 0.5px)",
        backgroundSize: "18px 18px",
      }}
    >
      
 
      {/* tall scroll track that drives the whole pinned sequence */}
      <div ref={wrapperRef} className="relative" style={{ height: "600vh" }}>
        {/* overflow-hidden here is what clips each note until scroll
            brings it up from below — no opacity animation needed */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {NOTES.map((note, i) => (
            <div
              key={note.src}
              ref={(el) => (noteRefs.current[i] = el)}
              className="absolute left-1/2 top-1/2 will-change-transform"
            >
              <Image
                width={note.width}
                height={200}
                alt="fun-fact-note"
                src={note.src}
              />
            </div>
          ))}

<p className="text-[#218a13] pt-30 ml-10 font-section-underline">
              _// Section two : Fun facts //_
            </p>
 
          {/* centered fun-facts heading image, pinned + scaling — unchanged */}
          <div
            ref={funFactsRef}
            className="absolute left-1/2 top-1/2 z-20 will-change-transform"
          >
           
            <Image
              width={250}
              height={200}
              alt="fun-facts"
              src="/Assets/fun-facts.png"
            />
          </div>
        </div>
      </div>
 
      <div className="mt-50">
        <SkillsMarquee />
      </div>
    </div>
  );
}