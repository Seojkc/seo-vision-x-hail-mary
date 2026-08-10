"use client";

import Image from "next/image";
import { useEffect, useRef,useState, useCallback } from "react";


















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

      const sectionRef = useRef(null);
const isVisibleRef = useRef(false);
const frameId = useRef(null);

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





      useEffect(() => {

        let frameId;
      
        function animate() {
      
          position.current += velocity.current + boost.current;
      
          boost.current *= 0.2; // smooth decay
      
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

      
     
      return (
        <>

        <div className="relative w-full p-[20px] pt-[100px]  ">
          <div className="absolute mt-8  mb-[50px] inset-0 flex items-center justify-center">
            <div style={{ transform: "rotate(0deg)" }}>
              <div className="  ">
                <div ref={trackRef} className="flex w-max flex-nowrap animate-marquee-left " >
                  {loopItems.map((skill, i) => (
                    <span
                      key={i}
                      className="mx-8 flex items-center  flex-shrink-0"
                    >
                      <span className="text-[#0c0c0c] bree-serif-regular  text-6xl md:text-6xl font-black  tracking-tight">
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
  { src: "/Assets/claude-helps.png", x: -28, y: 18, rotate: 30, width: 200 },
  { src: "/Assets/late-night.png", x: 34, y: 16, rotate: 0, width: 200 },
  { src: "/Assets/way-too-many.png", x: 0, y: 27, rotate: -10, width: 200 },
];






const GIF_SRC = "/Assets/FunFact/coffee-mug-video-2.gif";
const GIF_DURATION_MS = 1200;
const DISPLAY_WIDTH = 150;

export function CoffeeToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.src = GIF_SRC;
    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = DISPLAY_WIDTH;
      const displayHeight = (img.height / img.width) * displayWidth;

      setAspectRatio(img.width / img.height);

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
    };
  }, []);

  const handleClick = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setReplayKey((k) => k + 1);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPlaying(false), GIF_DURATION_MS);
  };

  return (
    <div
      onClick={handleClick}
      className="absolute top-[30px] right-[30%] w-[150px] cursor-pointer"
      style={{ aspectRatio }}
    >
      {/* static first frame, shown when idle */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${
          isPlaying ? "opacity-100" : "opacity-100"
        }`}
      />

      {/* real animated gif, only mounted while playing */}
      {isPlaying && (
        <img
          key={replayKey}
          src={`${GIF_SRC}?play=${replayKey}`}
          alt="fun-fact-note"
          className="absolute inset-0 w-full h-full opacity-100"
        />
      )}
    </div>
  );
}


// how much of the pinned/hold phase is used for staggering notes in
const HOLD_START = 0.12;
const HOLD_END = 0.86;
 
export default function FunFacts() {

  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // fire once, never re-trigger
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
 
  return (
    <div
      className="relative w-full "
      style={{
        backgroundColor:"#f5f5f5",
        backgroundImage: `
          linear-gradient(to right, rgba(41,41,41,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(41,41,41,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "98px 98px",
      }}
    >

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full "
        style={{
          background: "linear-gradient(to bottom,#F2F0EF, transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full "
        style={{
          background: "linear-gradient(to right,#F2F0EF, transparent 30%, transparent)",
        }}
      />

        <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full "
        style={{
          background: "linear-gradient(to left,#F2F0EF, transparent 30%, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full "
        style={{
          background: "linear-gradient(to top,#F2F0EF, transparent 10%, transparent)",
        }}
      />





      
      
 
      <div
      ref={wrapperRef}
      className="relative w-full h-screen overflow-hidden" >


        <Image width={300} height={500} className=" -rotate-2 absolute top-[7vw] left-[6%]" alt="fun-fact-note" src="/Assets/FunFact/wall-poster.png" />

        <CoffeeToggle/>


        <Image width={200} height={500} className=" -rotate-10 absolute top-[35vw] right-[20%]" alt="fun-fact-note" src="/Assets/FunFact/flower-pot.png" />
 
        <Image width={200} height={500} className=" -rotate-2 absolute top-[8vw] left-[20%]" alt="fun-fact-note" src="/Assets/FunFact/bug-fix.png" />

      <p className="text-[#218a13] pt-10 ml-10 font-section-underline">
        _// Section two : Fun facts //_
      </p>
      
      

      {NOTES.map((note, i) => (
        <div
          key={note.src}
          className="absolute left-1/2 top-1/2 will-change-transform transition-all ease-out"
          style={{
            transitionDuration: "900ms",
            transitionDelay: `${i * 120}ms`,
            transform: visible
              ? `translate(-50%, -50%) translate(${note.x}vw, ${note.y}vh) rotate(${note.rotate}deg) scale(1)`
              : `translate(-50%, -50%) translate(${note.x}vw, ${note.y + 40}vh) rotate(${note.rotate + (i % 2 === 0 ? 14 : -14)}deg) scale(0.85)`,
            opacity: visible ? 1 : 0,
          }}
        >
          <Image width={note.width} height={200} alt="fun-fact-note" src={note.src} />
        </div>
      ))}

      <div
        className="absolute left-1/2 top-1/2 z-20 will-change-transform transition-all ease-out"
        style={{
          transitionDuration: "700ms",
          transform: visible
            ? "translate(-50%, -50%) scale(1.15)"
            : "translate(-50%, -50%) scale(0.6)",
          opacity: visible ? 1 : 0,
        }}
      >
<div className="relative  text-center py-30 overflow-hidden">
          <h1 className="relative z-10 bree-serif-regular text-[4vw] my-[4vw] text-[#0c0c0c] p-[30px]">
                  Fun Fact
          </h1>
        </div>      </div>

      
    </div>
    <div className="mt-[30px]">
        <SkillsMarquee />
      </div>
 

      

      


          
    </div>
  );
}