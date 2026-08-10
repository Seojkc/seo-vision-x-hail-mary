"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { skills } from "./skills-data";
import AstrophageField from "./AstrophageField";

// ---------------- Starfield ----------------
function StarField() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 220 }, (_, i) => ({
      id: i,
      size: Math.random() * 2.2 + 0.6,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: (Math.random() * 3 + 2).toFixed(2),
      delay: (Math.random() * 5).toFixed(2),
      opacity: (Math.random() * 0.6 + 0.4).toFixed(2),
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            // @ts-ignore
            "--base-opacity": s.opacity,
            boxShadow: "0 0 4px rgba(255,255,255,0.65)",
          }}
        />
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
            opacity: calc(var(--base-opacity) * 0.25);
            transform: scale(0.7);
          }
          50% {
            opacity: var(--base-opacity);
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}

function DotFadeOverlay({
  heightPercent = 25,
  dotColor = "rgba(49, 49, 49, 0.64)",
  dotSize = 18,
}) {
  return (
    <div
      className="absolute inset-x-0 top-0 pointer-events-none z-10"
      style={{
        height: `${heightPercent}%`,
        WebkitMaskImage:
          "linear-gradient(to bottom, rgb(12, 12, 12), transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, rgb(12, 12, 12), transparent 100%)",
      }}
    />
  );
}

// ---------------- Skill star ----------------
// No circle, no border, no background — the logo (or letter) glows on its
// own via `filter: drop-shadow`, which hugs the actual glyph/logo shape
// instead of a box. A slow independent wiggle keeps each one gently alive.
function SkillStar({ name, logo, left, top, glowDelay, wiggleDuration, wiggleDelay }) {
  return (
    <div
  className="group absolute flex flex-col items-center"
  style={{
    left: `${left}%`,
    top: `${top}%`,
    transform: "translate(-50%, -50%)",
  }}
>
  <div className="transition-transform duration-300 group-hover:scale-[1.18]">
    <div className="skill-icon-wrap relative flex items-center justify-center">
      {/* radiating light layer — sits behind the icon, centered on it,
          scales outward and fades as it "spreads" */}
      <span
        className="skill-glow pointer-events-none absolute inset-0 m-auto"
        style={{
          animationDelay: `${glowDelay}s, ${glowDelay * 1}s`,
          animationDuration: `2.4s, 2.6s`,
        }}
      />

      {logo ? (
        <Image
          src={logo}
          alt={`${name} logo`}
          width={90}
          height={90}
          className="skill-icon  relative block object-contain"
          style={{
            animationDelay: `${wiggleDelay}s`,
            animationDuration: `${wiggleDuration}s`,
          }}
        />
      ) : (
        <span
          className="skill-icon relative block text-[70px] font-semibold text-[#fff6df]"
          style={{
            animationDelay: `${wiggleDelay}s`,
            animationDuration: `${wiggleDuration}s`,
          }}
        >
          {name.charAt(0)}
        </span>
      )}
    </div>
  </div>

  <span className="skill-label pointer-events-none absolute top-full mt-2 whitespace-nowrap text-[20px] tracking-wide text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    {name}
  </span>

  <style jsx>{`
    .skill-icon-wrap {
      width: 90px;
      height: 90px;
    }

    

    /* icon itself just wiggles now — the glow lives on its own layer */
    .skill-icon {
      animation-name: wiggle;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      z-index: 1;
    }

    /* the radiating aura, centered behind the icon */
    .skill-glow {
      
    }

    

 

    

    @keyframes wiggle {
      0%,
      100% {
        transform: rotate(0deg) translateY(0px);
      }
      25% {
        transform: rotate(-5deg) translateY(-2px);
      }
      50% {
        transform: rotate(0deg) translateY(1px);
      }
      75% {
        transform: rotate(5deg) translateY(-1px);
      }
    }
  `}</style>
</div>
  );
}

// ---------------- Section ----------------
export default function SkillsSection() {
  const [petrovaLine, setPetrovaLine] = useState(false);
  const [flash, setFlash] = useState(false);
  const [positions, setPositions] = useState([]);
  const flashTimeouts = useRef([]);
  const autoRevertTimeout = useRef(null); // 3s auto-revert timer



  function clearAllTimers() {
    flashTimeouts.current.forEach(clearTimeout);
    flashTimeouts.current = [];
    if (autoRevertTimeout.current) {
      clearTimeout(autoRevertTimeout.current);
      autoRevertTimeout.current = null;
    }
  }



  function runTransition(next) {
    setFlash(true);
    flashTimeouts.current.push(
      setTimeout(() => {
        setPetrovaLine(next);
      }, 220)
    );
    flashTimeouts.current.push(
      setTimeout(() => {
        setFlash(false);
      }, 260)
    );

    // Every time we turn the effect ON, schedule an automatic
    // flash-cut back to the normal state 3s later.
    if (next) {
      autoRevertTimeout.current = setTimeout(() => {
        runTransition(false);
      }, 5000);
    }
  }



  // scatter skills into a jittered grid so placement looks random but
  // nothing overlaps and everything stays clear of the section edges
  useEffect(() => {
    const n = skills.length;
    const aspect = 2.3; // section is wide relative to its height
    const columns = Math.max(1, Math.ceil(Math.sqrt(n * aspect)));
    const rows = Math.max(1, Math.ceil(n / columns));

    const cells = Array.from({ length: columns * rows }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const OUTER_X = 8; // % padding kept clear on left/right
    const OUTER_Y = 14; // % padding kept clear on top/bottom
    const usableW = 100 - OUTER_X * 2;
    const usableH = 100 - OUTER_Y * 2;
    const cellW = usableW / columns;
    const cellH = usableH / rows;
    const pad = 0.24; // keeps jitter away from each cell's own edges

    const generated = skills.map((skill, i) => {
      const cell = cells[i];
      const col = cell % columns;
      const row = Math.floor(cell / columns);

      const jitterX = pad + Math.random() * (1 - pad * 2);
      const jitterY = pad + Math.random() * (1 - pad * 2);

      return {
        ...skill,
        left: OUTER_X + col * cellW + jitterX * cellW,
        top: OUTER_Y + row * cellH + jitterY * cellH,
        glowDelay: (Math.random() * 3).toFixed(2),
        wiggleDuration: (Math.random() * 1.6 + 3.2).toFixed(2),
        wiggleDelay: (Math.random() * 2.5).toFixed(2),
      };
    });

    setPositions(generated);
  }, []);

  // Recreates the film's hard cut-to-black then flash-reveal transition:
  // flash to black, swap the scene underneath while hidden, then fade
  // the black away to reveal the new state.
  function handleToggle() {
    clearAllTimers();
    runTransition(!petrovaLine);
  }

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const sectionRef= useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          clearAllTimers(); // stop any pending flash/auto-revert
          setPetrovaLine(false);
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        ...(petrovaLine
          ? { backgroundColor: "rgb(0, 0, 0)" }
          : { backgroundImage: "url('/Assets/adrian-zoom.png')" }),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative w-full h-200 overflow-hidden opacity-80"
    >
      <DotFadeOverlay />

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(12,12,12,1)] transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 transparent" />

      {/* space starfield — only relevant to the default "naked eye" view */}
      <div
        className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
        style={{ opacity: petrovaLine ? 0 : 1 }}
      >
        <StarField />
      </div>

      {/* infinite Astrophage dust field — always running, only faded in/out */}
      
      <AstrophageField active={petrovaLine} particleCount={900} />

      {/* hard cut-to-black flash, matching the film's transition cut */}
      <div
        className="absolute inset-0 z-20 bg-black pointer-events-none transition-ease-in-out duration-150 ease-in"
        style={{ opacity: flash ? 1 : 0 }}
      />

      <button
        onClick={handleToggle}
        className="glass-btn text-[24px]  bree-serif-regular absolute left-1/2 -translate-x-1/2 z-40 w-84 px-6 py-4 mt-3"
      >
        Imagine Astrophage
      </button>

      {/* fills the entire section — skills scatter across the full width/height */}
      <div className="absolute inset-0 z-10">
        {positions.map((skill) => (
          <SkillStar
            key={skill.name}
            name={skill.name}
            logo={skill.logo}
            left={skill.left}
            top={skill.top}
            glowDelay={skill.glowDelay}
            wiggleDuration={skill.wiggleDuration}
            wiggleDelay={skill.wiggleDelay}
          />
        ))}
      </div>
    </section>
  );
}