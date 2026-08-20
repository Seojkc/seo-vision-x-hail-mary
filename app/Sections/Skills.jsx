"use client";

import Image from "next/image";
import AstrophageField from "./AstrophageField";
import { useEffect, useRef, useState } from "react";
import { skillCategories } from "./skills-data"; // ---- Skill categories ----

// shared spring-like easing -- slight overshoot on the way in, gives a "pop"
const SPRING_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
// smooth deceleration for the row's own expand/collapse -- no overshoot here,
// since a bouncy padding change looks janky rather than lively
const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// pure ease-in for the planet's grow + spin -- starts slow, accelerates,
// reads as something with real mass settling into place
const EASE_IN = "cubic-bezier(0.25, 0, 1, 0.45)";

// fades the particle field to transparent smoothly from center to edges,
// instead of letting particles get hard-clipped at the canvas's rectangular bounds
const PARTICLE_FADE_MASK =
  "radial-gradient(circle at center, black 30%, transparent 72%)";

const BGSRC = ["/Assets/comets-skills.png","/Assets/birds-skills.png","/Assets/flowers-skills.png","/Assets/fishs-skills.png"];

// ---- timing ----
// heading slides in + rises first; the planet grows/spins alongside it;
// the skill rows only start their own slide-in once the heading's
// animation has essentially finished, so it reads as two clear beats
// instead of everything arriving at once
const HEADING_DURATION = 600;
const PLANET_DURATION = 500;
const PLANET_DELAY = 150; // starts just after the heading begins, not simultaneous

const ROWS_START_DELAY = HEADING_DURATION - 150; // rows begin just before heading fully settles, feels connected rather than dead-paused
const ROW_DURATION = 700;
const ROW_STAGGER = 90;

// one-shot IntersectionObserver reveal hook
function useReveal(threshold = 0.25) {
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
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export default function Skills() {
  // drives the particle glow around the planet -- true while any category row is hovered
  const [isSkillHover, setIsSkillHover] = useState(false);

  // one shared trigger for the whole section's entrance choreography
  const [sectionRef, sectionVisible] = useReveal(0.2);

  const HEADING_TEXT = "Skills"; // "Skill" + red "s" combined

  const letterStyle = (i) => ({
    opacity: sectionVisible ? 1 : 0,
    transform: sectionVisible ? "translate(0px, 0px)" : "translate(0px, 110px)",
    transitionProperty: "transform, opacity",
    transitionDuration: `${HEADING_DURATION}ms`,
    transitionDelay: `${i * 200}ms`,
    transitionTimingFunction: SPRING_EASE,
    willChange: "transform, opacity",
    display: "inline-block",
  });


  const planetStyle = {
    opacity: sectionVisible ? 1 : 0,
    transform: sectionVisible
      ? "translate(0px, 0px)"
      : " translate(0px, 110px) ",
    transformOrigin: "center center",
    transitionProperty: "transform, opacity",
    transitionDuration: `${PLANET_DURATION}ms`,
    transitionDelay: `${PLANET_DELAY}ms`,
    willChange: "transform, opacity",
  };

  const rowStyle = (i) => ({
    opacity: sectionVisible ? 1 : 0,
    transform: sectionVisible
      ? "translate(0px, 0px)" : "translate(0px, 110px)",
    transitionProperty: "transform, opacity",
    transitionDuration: `${ROW_DURATION}ms`,
    transitionTimingFunction: SPRING_EASE,
    transitionDelay: `${ROWS_START_DELAY + i * ROW_STAGGER}ms`,
    willChange: "transform, opacity",
  });

  return (
    <>
      <div ref={sectionRef} className="h-[100vh] relative bg-[#0c0c0c] ">
        <div className="h-[50%] bg-[#0c0c0c]">
        <h1 className="text-[20vh] h-full pl-[3%] flex items-end self-end">
          {HEADING_TEXT.split("").map((letter, i) => (
            <span
              key={i}
              style={letterStyle(i)}
              className={i === HEADING_TEXT.length - 1 ? "text-elegant-red" : undefined}
            >
              {letter}
            </span>
          ))}
        </h1>
        </div>

        {/* planet + a small, contained particle field emitting from behind it --
            only lit up while a skill category is being hovered */}
        <div className="pointer-events-none absolute w-[42%] h-[70%] top-1/2 -translate-y-1/2 right-[-2%] z-0">
          {/* particle field only -- masked so it fades to transparent well
              before it reaches the container's rectangular edge, instead of
              getting hard-clipped there */}
          <div
            className="absolute inset-0 z-11"
            style={{
              maskImage: PARTICLE_FADE_MASK,
              WebkitMaskImage: PARTICLE_FADE_MASK,
            }}
          >
            <AstrophageField active={isSkillHover} particleCount={150} />
          </div>

          <Image
            width={1080}
            height={1080}
            alt="fun-fact-note"
            src="/Assets/adrian-planet.png"
            className="absolute inset-0 m-auto w-[80%] h-auto z-10"
            style={planetStyle}
          />
        </div>

        <div className="h-[50%] bg-[#F2F0EF]">
          <div className="h-full w-[58%] pl-[3%] flex flex-col justify-center gap-[1.6vh]">
            {skillCategories.map((cat, i) => {
              // one shared background image, tiled -- fades out by 90% of the row's width

              return (
                <div
                  key={cat.title}
                  onMouseEnter={() => setIsSkillHover(true)}
                  onMouseLeave={() => setIsSkillHover(false)}
                  className="group relative overflow-hidden border-b border-black/10 py-[1.4vh] last:border-none hover:py-[5vh] hover:border-black/30"
                  style={{
                    ...rowStyle(i),
                    transitionProperty: `${rowStyle(i).transitionProperty}, padding, border-color`,
                  }}
                >
                  {/* row highlight sweep, grows in from the left behind everything */}
                  <div className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-black/[0.03] transition-transform duration-500 ease-out group-hover:scale-x-100" />

                  {/* per-category background artwork -- tiles left-to-right,
                      fading to transparent by 90% of the row's width */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[12vh] origin-bottom scale-y-0 opacity-0 transition-all duration-[650ms] group-hover:scale-y-100 group-hover:opacity-80"
                    style={{
                      transitionTimingFunction: EXPAND_EASE,
                      backgroundImage: `url(${BGSRC[i]})`,
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: " bottom",
                      backgroundSize: "auto 100%",
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 30%,black 40%, transparent 80%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 40%, transparent 70%)",
                    }}
                  />

                  <div className="relative z-10 flex items-baseline justify-between gap-6">
                    <div className="flex items-baseline gap-4">
                      <span
                        className="text-[1.3vh] font-mono text-black/30 tabular-nums origin-left transition-all duration-500 group-hover:text-black/60 group-hover:scale-110"
                        style={{ transitionTimingFunction: SPRING_EASE }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-[3vh] font-bold text-[#0c0c0c] tracking-tight origin-left transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-125"
                        style={{ transitionTimingFunction: SPRING_EASE }}
                      >
                        {cat.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                      {cat.skills.map((skill, si) => (
                        <span
                          key={skill}
                          className="inline-block origin-right text-[1.5vh] text-black/45 transition-all duration-500 group-hover:text-black group-hover:-translate-y-0.5  group-hover:scale-120 group-hover:px-2"
                          style={{
                            transitionTimingFunction: SPRING_EASE,
                            transitionDelay: `${si * 35}ms`,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}