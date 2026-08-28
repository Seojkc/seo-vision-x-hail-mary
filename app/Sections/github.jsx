"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useScrollReveal from "../Components/useScrollReveal"

/* =========================================================================
   NEW: mobile breakpoint hook
   ========================================================================= */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

// ---- Every card is the same shape now ----
//   heading   -> always shown
//   subheading-> revealed on hover, typed out character by character
//   commits   -> shown top-left as a small "N Commits" badge
//   x, y      -> center position, ratio of container width/height
//   w         -> width, ratio of container width
//   rotate    -> degrees

const cards = [
  {
    heading: "Money Compass",
    subheading:
      "Money Compass is a personal finance management app designed to help users track expenses, manage budgets, monitor spending habits, and gain a clearer view of their financial goals through an intuitive dashboard.",
    commits: 69,
    x: 0.13,
    y: 0.27,
    w: 0.2,
    rotate: -10,
  },
  {
    heading: "Seo-Vision-X-Hail-Mary",
    subheading:
      "SeoVision X Hail Mary is a cinematic personal portfolio inspired by Project Hail Mary, blending space-themed visuals, immersive animations, and interactive UI to showcase my projects, skills, and creative work.",
    commits: 26,
    x: 0.38,
    y: 0.255,
    w: 0.18,
    rotate: 0,
  },
  {
    heading: "ArriveAlert",
    subheading:
      "Arrive Alert is a smart transit notification app that helps users track their journey and receive timely alerts when they are approaching their destination, making daily commuting more convenient and stress-free.",
    commits: 32,
    x: 0.59,
    y: 0.29,
    w: 0.16,
    rotate: 10,
  },
  {
    heading: "Jerry Wallet",
    subheading:
      "Jerry’s Budget Planner is a simple and intuitive budgeting application that helps users manage their income, track expenses, monitor spending, and stay organized with their personal finances.",
    commits: 53,
    x: 0.8,
    y: 0.41,
    w: 0.14,
    rotate: 35,
  },
  {
    heading: "",
    subheading: "",
    commits: 0,
    x: 0.91,
    y: 0.62,
    w: 0.09,
    rotate: 60,
  },
  {
    heading: "",
    subheading: "",
    commits: 0,
    x: 0.94,
    y: 0.8,
    w: 0.075,
    rotate: 90,
  },
  {
    heading: "",
    subheading: "",
    commits: 0,
    x: 0.87,
    y: 0.934,
    w: 0.07,
    rotate: 150,
  },
  {
    heading: "",
    subheading: "",
    commits: 0,
    x: 0.75,
    y: 0.96,
    w: 0.06,
    rotate: 180,
  },
  {
    heading: "",
    subheading: "",
    commits: 0,
    x: 0.67,
    y: 0.89,
    w: 0.04,
    rotate: 235,
  },
  {
    heading: "",
    subheading: "",
    commits: 0,
    x: 0.66,
    y: 0.8,
    w: 0.035,
    rotate: 270,
  },
];

// ---- One shared "multi-color 3D glass" treatment for every card ----
const GLASS_MESH = `
  radial-gradient(circle at 68% 68%, rgba(36, 68, 252, 0.78), transparent 44%),
  radial-gradient(circle at 82% 22%, rgba(241, 38, 38, 0), transparent 46%),
  radial-gradient(circle at 15% 85%, rgba(36, 68, 252, 0.78), transparent 46%),
  radial-gradient(circle at 88% 82%, rgba(36, 68, 252, 0.78), transparent 46%),
  #0b0f1a
`;

// dot position, ratio of container
const DOT_X_RATIO = 0.75;
const DOT_Y_RATIO = 0.8;

const CARD_ASPECT = 1.3; // height = width * this

// ---- Sizing helpers -- everything scales off the card's own pixel width,
// not the viewport, so small cards never render text bigger than themselves ----
function headingFontSize(cardPxWidth) {
  return Math.max(10, Math.min(24, cardPxWidth * 0.12));
}
function subheadingFontSize(cardPxWidth) {
  return Math.max(6.5, Math.min(12, cardPxWidth * 0.05));
}
function badgeFontSize(cardPxWidth) {
  return Math.max(6, Math.min(11, cardPxWidth * 0.055));
}
// blur scales down with card size -- a fixed 12px blur completely smears the
// four color blobs together on the smallest cards
function glassBlurPx(cardPxWidth) {
  return Math.max(2, Math.min(10, cardPxWidth * 0.025));
}
// padding scales down with card size -- fixed padding was taller than the
// whole card on the smallest ones, clipping the subheading out entirely
function panelPaddingPx(cardPxWidth) {
  return {
    x: Math.max(6, Math.min(20, cardPxWidth * 0.06)),
    y: Math.max(5, Math.min(24, cardPxWidth * 0.05)),
  };
}

// shared easing across the panel move + subheading fade -- same smooth
// deceleration curve used elsewhere on the site's hover animations
const REVEAL_EASE = "cubic-bezier(0.46, 1, 0.3, 1)";

// ---- typewriter: types `text` out a character at a time while `active`,
// resets instantly back to empty the moment `active` goes false ----
function useTypewriter(text, active, speedMs = 16) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active || !text) {
      setTyped("");
      return;
    }
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [active, text, speedMs]);

  return typed;
}
function CardContent({ card, cardPxWidth, hovered, isMobile = false }) {
  // NEW: mobile gets a smaller multiplier so text doesn't feel oversized
  // relative to the compact 240px slider card
  const fontSize = headingFontSize(cardPxWidth) * (isMobile ? 1.15 : 1.5);
  const subFontSize = subheadingFontSize(cardPxWidth) * (isMobile ? 1.1 : 1.5);
  const badgeSize = badgeFontSize(cardPxWidth);
  const blurPx = glassBlurPx(cardPxWidth);
  const pad = panelPaddingPx(cardPxWidth);

  // NEW: mobile has no hover, so once a card becomes active (`hovered` is
  // driven by isCenter from the slider) wait 1s before revealing the panel —
  // gives it a beat to settle into center first
  const [mobileRevealed, setMobileRevealed] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    if (!hovered) {
      setMobileRevealed(false);
      return;
    }
    const id = setTimeout(() => setMobileRevealed(true), 1000);
    return () => clearTimeout(id);
  }, [isMobile, hovered]);

  // typewriter only starts once the panel is actually revealed
  const typingActive = isMobile ? mobileRevealed : hovered;
  const typedSubheading = useTypewriter(card.subheading, typingActive);
  const stillTyping = typingActive && typedSubheading.length < (card.subheading?.length ?? 0);

  // on mobile this replaces group-hover as what drives the panel open state
  const panelRevealed = isMobile ? mobileRevealed : hovered;

  return (
    <div
      className={`relative w-full h-full old-standard-tt-regular transition-transform duration-500 ease-out will-change-transform ${
        isMobile ? "" : "group-hover:scale-[1.015]"
      }`}
      style={{
        background: GLASS_MESH,
        transformStyle: "preserve-3d",
        transform: isMobile && panelRevealed ? "scale(1.015)" : undefined,
      }}
    >
      {/* frosted glass panel -- blur scales with card size so small cards
          don't get their colors smeared into a muddy average */}
      <div
        className="pointer-events-none absolute inset-0 bg-white/[0.05]"
        style={{ backdropFilter: `blur(${blurPx}px)`, WebkitBackdropFilter: `blur(${blurPx}px)` }}
      />

      {/* top glassy highlight + soft inner shadow, gives the bevelled 3D edge */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-16px_28px_rgba(0,0,0,0.35)]" />

      {/* border */}
      <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/15" />

      {/* commits badge -- top right */}
      {card.commits != null && card.commits !== 0 && (
        <div className="old-standard-tt-regular absolute top-5 md:top-10 left-2.5 flex items-center gap-1 px-2 py-1">
          <span className="text-white/50 tracking-tight" style={{ fontSize: badgeSize + 6 }}>
            {card.commits} Commits
          </span>
        </div>
      )}

      {/* bottom text panel -- padding scales with card size; on mobile the
          "group-hover" position toggle is replaced with an inline style
          driven by the 1s-delayed panelRevealed state */}
      <div
        className={`absolute left-0 right-0 transition-[bottom] duration-500 ease-out ${
          isMobile ? "" : "bottom-[10%] group-hover:bottom-[15%]"
        }`}
        style={{
          paddingLeft: pad.x,
          paddingRight: pad.x,
          paddingBottom: pad.y,
          paddingTop: pad.y,
          transitionTimingFunction: REVEAL_EASE,
          bottom: isMobile ? (panelRevealed ? "15%" : "10%") : undefined,
        }}
      >
        <h3
          className={`text-white old-standard-tt-regular font-medium leading-tight transition-transform duration-500 ease-out ${
            isMobile ? "" : "group-hover:-translate-y-0.5"
          }`}
          style={{
            fontSize,
            transitionTimingFunction: REVEAL_EASE,
            transform: isMobile && panelRevealed ? "translateY(-2px)" : undefined,
          }}
        >
          {card.heading}
        </h3>

        {/* subheading -- fades in + types out; on mobile driven by the
            1s-delayed timer instead of group-hover */}
        <div
          className={`overflow-visible transition-opacity duration-300 ease-out ${
            isMobile ? "" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            transitionTimingFunction: REVEAL_EASE,
            transitionDelay: "80ms",
            opacity: isMobile ? (panelRevealed ? 1 : 0) : undefined,
          }}
        >
          <p
            className="text-white/80 leading-tight pt-0.5"
            style={{ fontSize: subFontSize }}
          >
            {typedSubheading}
            {stillTyping && (
              <span className="inline-block w-[2px] ml-[1px] align-[-0.1em] bg-white/80 animate-pulse" style={{ height: "1em" }} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
// ---- ProjectCard (desktop spiral) -- unchanged ----
function ProjectCard({
  card,
  cardPxWidth,
  cardPxHeight,
  left,
  top,
  zIndex,
  revealed,
  dx,
  dy,
  scaleRatio,
  originRotate,
  delay,
}) {
  const [hovered, setHovered] = useState(false);

  const transform = revealed
    ? `translate(-50%, -50%) rotate(${card.rotate}deg) scale(1)`
    : `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${originRotate}deg) scale(${scaleRatio})`;

  return (
    <div
      className="group absolute rounded-xl border border-black/10 shadow-md overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        left,
        top,
        width: cardPxWidth,
        height: cardPxHeight,
        transform,
        transformOrigin: "center center",
        transitionProperty: "transform",
        transitionDuration: "2000ms",
        transitionTimingFunction: REVEAL_EASE,
        transitionDelay: `${delay}ms`,
        willChange: "transform",
        zIndex,
      }}
    >
      <CardContent card={card} cardPxWidth={cardPxWidth} hovered={hovered} />
    </div>
  );
}

/* =========================================================================
   NEW: mobile infinite center-focus card slider
   -------------------------------------------------------------------------
   Only shows cards with commits > 0. All cards are identical size.
   Center card: scale 1 / opacity 1. Immediate neighbors: scale 0.8 /
   opacity 0.7. Anything further is hidden. Circular index math makes it
   wrap around infinitely in both directions. Reuses CardContent so the
   glass styling + typewriter subheading stay consistent with desktop.
   ========================================================================= */
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_HEIGHT = MOBILE_CARD_WIDTH * CARD_ASPECT;
const MOBILE_CARD_SPACING = MOBILE_CARD_WIDTH * 0.58;
const SWIPE_THRESHOLD = 40;

// shortest signed distance from `index` to `active`, wrapping around `total`
function getCircularOffset(index, active, total) {
  let diff = index - active;
  const half = total / 2;
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  if (diff === -half) diff = half; // keep the boundary card on one consistent side
  return diff;
}

function MobileGithubSlider({ cards }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const total = cards.length;

  const go = (dir) => setActive((prev) => (prev + dir + total) % total);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) go(-1);
    else if (deltaX < -SWIPE_THRESHOLD) go(1);
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full py-16">
      <div
        className="relative w-full flex items-center justify-center overflow-hidden select-none"
        style={{ height: MOBILE_CARD_HEIGHT + 24 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {cards.map((card, i) => {
          const offset = getCircularOffset(i, active, total);
          const abs = Math.abs(offset);
          const isCenter = offset === 0;
          const hidden = abs > 1;

          const scale = isCenter ? 1 : 0.8;
          const opacity = hidden ? 0 : isCenter ? 1 : 0.7;
          const translateX = offset * MOBILE_CARD_SPACING;
          const zIndex = 10 - abs;

          return (
            <button
              key={card.heading}
              type="button"
              aria-label={isCenter ? card.heading : `Show ${card.heading}`}
              onClick={() => !isCenter && setActive(i)}
              className="group absolute rounded-xl border border-black/10 shadow-md overflow-hidden text-left"
              style={{
                width: MOBILE_CARD_WIDTH,
                height: MOBILE_CARD_HEIGHT,
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                transitionProperty: "transform, opacity",
                transitionDuration: "500ms",
                transitionTimingFunction: REVEAL_EASE,
                cursor: isCenter ? "default" : "pointer",
              }}
            >
              <CardContent card={card} cardPxWidth={MOBILE_CARD_WIDTH} hovered={isCenter} isMobile />
            </button>
          );
        })}
      </div>

      {/* dot indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to project ${i + 1}`}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 20 : 7,
              height: 7,
              backgroundColor: i === active ? "#0c0c0c" : "rgba(12,12,12,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---- "My Week in Code" -- unchanged ----
const weekData = [
  { day: "Sunday", hours: 7 },
  { day: "Monday", hours: 5 },
  { day: "Tuesday", hours: 3.5 },
  { day: "Wednesday", hours: 3.5 },
  { day: "Thursday", hours: 3.5 },
  { day: "Friday", hours: 3 },
  { day: "Saturday", hours: 6.5 },
];

function useInView(options = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bch = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bch})`;
}

const GRADIENT_START = "#1e3a8a";
const GRADIENT_END = "#3b82f6";
const BLOCK_HOURS = 0.5;




function WeekInCode() {
  const [headingRef, headingVisible] = useScrollReveal({ threshold: 1 });
  const [ref, inView] = useInView({ threshold: 0.25 });
  const isMobile = useIsMobile(); // NEW

  const maxHours = Math.max(...weekData.map((d) => d.hours));
  const bestDay = weekData.reduce((best, d) => (d.hours > best.hours ? d : best), weekData[0]);
  const totalBlocks = Math.round(maxHours / BLOCK_HOURS);

  // NEW: smaller block size + tighter gap on mobile so a 13-block row
  // (max hours 7 / 0.5) doesn't overflow a narrow screen
  const blockSize = isMobile ? "1.35vh" : "2.3vh";
  const blockGap = isMobile ? "0.25vh" : "0.4vh";

  return (
    <div ref={ref} className="relative md:absolute text-black top-[60%] left-[5%] w-[42%] ">
      <div className="flex items-baseline justify-between mb-0 md:mb-8">
        <h2
          ref={headingRef}
          className={`reveal-wipe ${headingVisible ? "is-visible" : ""} text-black text-[10vw] md:text-[4.4vw]  invert leading-none font-[800]`}
        >
          My Week in Code
        </h2>
      </div>

      <div className="flex flex-col gap-[1.3vh] pointer-events-none">
        {weekData.map((entry, i) => {
          const filledBlocks = Math.min(totalBlocks, Math.round(entry.hours / BLOCK_HOURS));

          return (
            <div key={entry.day} className="group flex items-center gap-4 py-[1.5vh]">
              <span
                className="text-[2.8vh] leading-none w-[80%] shrink-0 transition-colors duration-300 text-end text-black/70 group-hover:text-black"
              >
                {entry.day}
              </span>

              <div className="flex items-center flex-1" style={{ gap: blockGap }}>
                {Array.from({ length: totalBlocks }).map((_, bIdx) => {
                  const filled = bIdx < filledBlocks;
                  const color = filled
                    ? lerpColor(GRADIENT_START, GRADIENT_END, bIdx / Math.max(1, totalBlocks - 1))
                    : undefined;

                  return (
                    <div
                      key={bIdx}
                      className={`rounded-[3px] ${filled ? "" : "bg-black/[0.00]"}`}
                      style={{
                        width: blockSize,
                        height: blockSize,
                        backgroundColor: color,
                        opacity: inView ? 1 : 0,
                        transform: inView ? "scale(1)" : "scale(0.4)",
                        transitionProperty: "opacity, transform",
                        transitionDuration: "420ms",
                        transitionDelay: `${i * 90 + bIdx * 22}ms`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




const SPRING_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const LETTER_DURATION = 600;
const LETTER_DELAY_STEP = 60;
const LOGO_DURATION = 700;

function renderLetters(text, startIndex, visible) {
  return text.split("").map((char, i) => (
    <span
      key={startIndex + i}
      style={{
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0px, 0px)" : "translate(0px, 110px)",
        transitionProperty: "transform, opacity",
        transitionDuration: `${LETTER_DURATION}ms`,
        transitionDelay: `${(startIndex + i) * LETTER_DELAY_STEP}ms`,
        transitionTimingFunction: SPRING_EASE,
        willChange: "transform, opacity",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function GithubSection() {
  const containerRef = useRef(null);
  const headingRefUnused = null; // (kept for parity, unused)
  const [headingRef, headingVisible] = useScrollReveal({ threshold: 1 });

  const isMobile = useIsMobile(); // NEW

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [revealed, setRevealed] = useState(false);

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const part1 = "A Few From";
  const part2 = "GitHub";

  const logoStyle = {
    opacity: visible ? 0.5 : 0,
    transform: visible ? "scale(1) translateY(0px)" : "scale(0.3) translateY(20px)",
    transitionProperty: "transform, opacity",
    transitionDuration: `${LOGO_DURATION}ms`,
    transitionTimingFunction: SPRING_EASE,
    willChange: "transform, opacity",
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const dotX = width * DOT_X_RATIO;
  const dotY = height * DOT_Y_RATIO;
  const seed = cards[cards.length - 1];

  // NEW: mobile only shows cards that actually have commits
  const featuredCards = cards.filter((c) => c.commits > 0);

  return (
    <div
      className="relative w-full pb-[40vh]"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: "radial-gradient(circle,rgba(145, 145, 145, 0.64) 1px, transparent 0.5px)",
        backgroundSize: "30px 30px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{ background: "linear-gradient(to bottom,#F2F0EF, transparent 40%)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{ background: "linear-gradient(to right,#F2F0EF, transparent 30%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{ background: "linear-gradient(to left,#F2F0EF, transparent 30%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{ background: "linear-gradient(to top,#F2F0EF, transparent 30%, transparent)" }}
      />

    <div ref={sectionRef} className="relative text-center py-10">
      <Image
        width={600}
        height={500}
        src="/Assets/git.png"
        alt="github logo"
        style={logoStyle}
        className="w-[600px] h-[auto] invert object-contain absolute -right-70 -top-40 hidden md:block"
      />

      <h1 className="relative z-10 flex items-center justify-center gap-5 font-bold text-[8vw] md:text-[4vw] text-[#0c0c0c] p-[30px]">
        <span>{renderLetters(part1, 0, visible)}</span>
        <span className="text-elegant-red">
          {renderLetters(part2, part1.length, visible)}
        </span>
      </h1>
    </div>

      {isMobile ? (
        // -------- mobile: identical-size infinite center-focus slider --------
        <div ref={containerRef} className="relative w-full">
          <MobileGithubSlider cards={featuredCards} />
        </div>
      ) : (
        // -------- desktop: unchanged spiral scatter --------
        <div ref={containerRef} className="relative w-full pb-10" style={{ height: "170vh" }}>
          {width > 0 && (
            <>
              {/* dot / logo, spiral origin */}
              <div
                className="absolute rounded-full overflow-visible"
                style={{
                  left: dotX,
                  top: dotY,
                  width: Math.max(width * 0.045, 36),
                  height: Math.max(width * 0.045, 36),
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                <div className="absolute inset-[-35%] rounded-full  blur-xl" />
                <div className="absolute inset-0 rounded-full bg-white ">
                  <a href="https://github.com/Seojkc">
                    <Image
                      src="/Assets/git.png"
                      alt="Logo"
                      fill
                      sizes="80px"
                      className="object-contain invert"
                    />
                  </a>
                </div>
              </div>

              {cards.map((card, i) => {
                const w = width * card.w;
                const h = w * CARD_ASPECT;
                const left = width * card.x;
                const top = height * card.y;

                const isSeed = i === cards.length - 1;
                const originLeft = width * seed.x;
                const originTop = height * seed.y;
                const originW = width * seed.w;

                const dx = isSeed ? 0 : originLeft - left;
                const dy = isSeed ? 0 : originTop - top;
                const scaleRatio = isSeed ? 1 : originW / w;
                const originRotate = isSeed ? card.rotate : seed.rotate;

                const delay = (cards.length - 1 - i) * 70;

                return (
                  <ProjectCard
                    key={i}
                    card={card}
                    cardPxWidth={w}
                    cardPxHeight={h}
                    left={left}
                    top={top}
                    zIndex={10 + i}
                    revealed={revealed}
                    dx={dx}
                    dy={dy}
                    scaleRatio={scaleRatio}
                    originRotate={originRotate}
                    delay={delay}
                  />
                );
              })}
            </>
          )}
        </div>
      )}

      <WeekInCode />
    </div>
  );
}