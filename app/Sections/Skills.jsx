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
const HEADING_DURATION = 600;
const PLANET_DURATION = 500;
const PLANET_DELAY = 150;

const ROWS_START_DELAY = HEADING_DURATION - 150;
const ROW_DURATION = 700;
const ROW_STAGGER = 90;

// mobile breakpoint used for the "virtual hover" simulation (matches Tailwind's md:)
const MOBILE_QUERY = "(max-width: 767px)";

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

// tracks whether we're below the md breakpoint (mobile) -- only mobile
// gets the simulated "hidden mouse at screen center" hover behavior
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

// on mobile, finds which row's bounding box contains the viewport's
// x/y center point -- acts like an imaginary mouse fixed at screen center
function useCenterActiveRow(rowRefs, isMobile) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!isMobile) {
      setActiveIndex(-1);
      return;
    }

    let rafId = null;

    const computeActive = () => {
      rafId = null;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      let found = -1;
      rowRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const withinY = centerY >= rect.top && centerY <= rect.bottom;
        const withinX = centerX >= rect.left && centerX <= rect.right;
        if (withinY && withinX) found = idx;
      });
      setActiveIndex(found);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile, rowRefs]);

  return activeIndex;
}

export default function Skills() {
  const [isSkillHover, setIsSkillHover] = useState(false);
  const [sectionRef, sectionVisible] = useReveal(0.2);

  const rowRefs = useRef([]);
  const isMobile = useIsMobile();
  const activeIndex = useCenterActiveRow(rowRefs, isMobile);

  const HEADING_TEXT = "Skills";

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
      {/* h-auto on mobile so sections just stack to their natural height —
          h-[100vh] is restored at md so desktop is untouched */}
      <div ref={sectionRef} className="h-auto md:h-[100vh] relative bg-[#0c0c0c]">
        {/* fixed vh on mobile instead of % (percentage heights need a
            fixed-height parent, which we no longer have below md) */}
        <div className="h-[16vh] md:h-[50%] bg-[#0c0c0c]">
          <h1 className="md:text-[20vh] text-[20vw] h-full pl-[3%] flex items-end self-end">
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

        {/* planet + particle field */}
        <div className="pointer-events-none relative md:absolute w-[100%] md:w-[42%] h-[28vh] md:h-[70%] top-0 md:top-1/2 translate-y-0 md:-translate-y-1/2 right-0 md:right-[-2%] z-0 mb-[2vh] md:mb-0 hidden md:block">
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
            className="absolute inset-0 m-auto w-full md:w-[80%] h-auto z-10"
            style={planetStyle}
          />
        </div>

        {/* h-auto + vertical padding on mobile instead of a fixed 50% slice */}
        <div className="h-auto md:h-[50%] bg-[#F2F0EF] py-[4vh] md:py-0">
          <div className="h-full w-full md:w-[58%] pl-[3%] pr-[5%] md:pr-0 flex flex-col justify-center gap-[1.6vh]">
            {skillCategories.map((cat, i) => {
              const entrance = rowStyle(i);
              // true only on mobile, when this row sits under the
              // "imaginary hidden mouse" at screen x/y center
              const isCenterActive = isMobile && activeIndex === i;

              return (
                <div
                    key={cat.title}
                    ref={(el) => (rowRefs.current[i] = el)}
                    onMouseEnter={() => setIsSkillHover(true)}
                    onMouseLeave={() => setIsSkillHover(false)}
                    className={`group relative overflow-hidden border-b border-black/10 py-[4vh] md:py-[1.4vh] last:border-none md:hover:py-[5vh] md:hover:border-black/30 ${
                      isCenterActive ? "border-black/30" : ""
                    }`}
                    style={{
                      opacity: entrance.opacity,
                      transform: entrance.transform,
                      willChange: "transform, opacity",
                      transitionProperty: "transform, opacity, padding, border-color",
                      transitionDuration: `${ROW_DURATION}ms, ${ROW_DURATION}ms, 650ms, 650ms`,
                      transitionTimingFunction: `${SPRING_EASE}, ${SPRING_EASE}, ${EXPAND_EASE}, ${EXPAND_EASE}`,
                      transitionDelay: `${entrance.transitionDelay}, ${entrance.transitionDelay}, 0ms, 0ms`,
                    }}
                  >
                  <div className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />

                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[7vh] md:h-[12vh] origin-bottom scale-y-0 opacity-0 transition-all duration-[650ms] md:group-hover:scale-y-100 md:group-hover:opacity-80 ${
                      isCenterActive ? "scale-y-100 opacity-80" : ""
                    }`}
                    style={{
                      transitionTimingFunction: EXPAND_EASE,
                      backgroundImage: `url(${BGSRC[i]})`,
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: " left bottom",
                      backgroundSize: "auto 100%",
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 30%,black 40%, transparent 90%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 40%, transparent 70%)",
                    }}
                  />

                  {/* stacked on mobile: title line, then skills line below.
                      Row layout returns at md, unchanged from before. */}
                  <div className="relative z-10 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`text-[1.3vh] font-mono text-black/30 tabular-nums origin-left transition-all duration-500 md:group-hover:text-black/60 md:group-hover:scale-110 ${
                          isCenterActive ? "text-black/60 scale-110" : ""
                        }`}
                        style={{ transitionTimingFunction: SPRING_EASE }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`text-[3vh] font-bold text-[#0c0c0c] tracking-tight origin-left transition-transform duration-500 md:group-hover:translate-x-2 md:group-hover:scale-125 ${
                          isCenterActive ? "translate-x-2 scale-125" : ""
                        }`}
                        style={{ transitionTimingFunction: SPRING_EASE }}
                      >
                        {cat.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap justify-start md:justify-end gap-x-3 gap-y-1">
                      {cat.skills.map((skill, si) => (
                        <span
                          key={skill}
                          className={`inline-block origin-right text-[1.5vh] text-black/45 transition-all duration-500 md:group-hover:text-black md:group-hover:-translate-y-0.5 md:group-hover:scale-110 md:group-hover:scale-120 md:group-hover:px-2 ${
                            isCenterActive ? "text-black -translate-y-0.5 scale-110 px-2" : ""
                          }`}
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