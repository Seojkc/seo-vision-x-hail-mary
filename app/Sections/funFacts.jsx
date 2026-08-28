"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import useScrollReveal from "../Components/useScrollReveal"
import CurvedText from "../Components/CurvedText";

/* =========================================================================
   Mobile breakpoint hook
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

/* =========================================================================
   Skills marquee (unchanged)
   ========================================================================= */
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

  const REPEAT = 4;
  const baseSet = Array.from({ length: REPEAT }, () => skills).flat();
  const loopItems = [...baseSet, ...baseSet];

  const trackRef = useRef(null);
  const position = useRef(0);
  const velocity = useRef(1);
  const boost = useRef(0);
  const sectionRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frameId;
    function animate() {
      position.current += velocity.current + boost.current;
      boost.current *= 0.2;

      if (trackRef.current) {
        const halfWidth = trackRef.current.scrollWidth / 2;
        if (position.current >= halfWidth) position.current -= halfWidth;
        trackRef.current.style.transform = `translateX(-${position.current}px)`;
      }
      frameId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative w-full p-[10px] pt-[50px] md:p-[20px] md:pt-[100px]">
      <div className="absolute mt-8 mb-[50px] inset-0 flex items-center justify-center">
        <div style={{ transform: "rotate(0deg)" }}>
          <div
            ref={trackRef}
            className="flex w-max flex-nowrap animate-marquee-left"
          >
            {loopItems.map((skill, i) => (
              <span key={i} className="mx-4 md:mx-8 flex items-center flex-shrink-0">
                <span className="text-[#0c0c0c] text-3xl md:text-6xl font-black tracking-tight">
                  {skill}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ScaledScene
   ========================================================================= */
const SCENE_WIDTH = 1600;
const SCENE_HEIGHT = 860;

const MOBILE_SCENE_WIDTH = 420;
// Increased to fit the extra bottom padding added between mobile items
const MOBILE_SCENE_HEIGHT = 2300;

function ScaledScene({
  children,
  visible,
  sceneWidth = SCENE_WIDTH,
  sceneHeight = SCENE_HEIGHT,
}) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.offsetWidth;
      setScale(Math.min(1, w / sceneWidth));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sceneWidth]);

  return (
    <div
      ref={outerRef}
      className="relative w-full"
      style={{ height: sceneHeight * scale, overflow: "hidden" }}
    >
      <div
        style={{
          width: sceneWidth,
          height: sceneHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}




function SceneItem({
  x,
  y,
  w,
  rotate = 0,
  delay = 0,
  visible,
  label,
  labelPos = "bottom",
  labelRotate = -2,
  revealThreshold=0.5, // NEW: when set, this item gets its own scroll-triggered reveal at this threshold
  slideDistance = 24, // NEW: how far it slides up on reveal (desktop keeps default 24)
  children,
}) {
  // Only used when revealThreshold is provided (mobile items)
  const [ownRef, ownRevealed] = useScrollReveal({ threshold: revealThreshold ?? 1 });
  const gateActive = revealThreshold != null;
  const effectiveVisible = gateActive ? visible && ownRevealed : visible;

  return (
    <div
      ref={gateActive ? ownRef : undefined}
      className="absolute"
      style={{
        left: x,
        top: y,
        width: w,
        transform: effectiveVisible
          ? `translateY(0px) rotate(${rotate}deg)`
          : `translateY(${slideDistance}px) rotate(${rotate}deg)`,
        opacity: effectiveVisible ? 1 : 0,
        transition: `opacity 700ms ease-in ${delay}ms, transform 700ms ease-in ${delay}ms`,
      }}
    >
      {label && labelPos === "top" && (
        <span
          className="scene-label"
          style={{ bottom: "100%", marginBottom: 10, transform: `rotate(${labelRotate}deg)` }}
        >
          {label}
        </span>
      )}

      {children}

      {label && labelPos === "bottom" && (
        <span
          className="scene-label"
          style={{ top: "100%", marginTop: 10, transform: `rotate(${labelRotate}deg)` }}
        >
          {label}
        </span>
      )}

      {label && labelPos === "right" && (
        <span className="scene-label">{label}</span>
      )}

      <style jsx>{`
        .scene-label {
          position: absolute;
          left: 6px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #0c0c0c;
          white-space: nowrap;
          padding: 2px 0;
          border-bottom: 1.5px dashed rgba(12, 12, 12, 0.55);
        }
      `}</style>
    </div>
  );
}




/* CoffeeToggle — unchanged */
const GIF_SRC = "/Assets/FunFact/coffee-mug-video-2.gif";
const GIF_DURATION_MS = 1200;
const DISPLAY_WIDTH = 150;

export function CoffeeToggle({ visible = true }) {
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
      className="relative cursor-pointer"
      style={{ width: DISPLAY_WIDTH, aspectRatio }}
    >
      <div
        className="speech-bubble"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate(-50%, 0px) scale(1)"
            : "translate(-50%, 8px) scale(0.85)",
        }}
      >
        take a sip
        <span className="speech-bubble-tail" />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {isPlaying && (
        <img
          key={replayKey}
          src={`${GIF_SRC}?play=${replayKey}`}
          alt="fun-fact-note"
          className="absolute inset-0 w-full h-full"
        />
      )}

      <style jsx>{`
        .speech-bubble {
          position: absolute;
          left: 50%;
          top: -56px;
          background: #ffffff;
          color: #0c0c0c;
          font-weight: 700;
          font-size: 14px;
          padding: 8px 14px;
          border-radius: 14px;
          border: 2px dotted #0c0c0c;
          white-space: nowrap;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.12);
          transition: opacity 700ms ease-in 260ms, transform 700ms ease-in 260ms;
          pointer-events: none;
          z-index: 5;
        }
        .speech-bubble-tail {
          position: absolute;
          bottom: -9px;
          left: 24px;
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-right: 2px dotted #0c0c0c;
          border-bottom: 2px dotted #0c0c0c;
          transform: rotate(45deg);
        }
      `}</style>
    </div>
  );
}

const CAPTIONS = ["Amaze", "Fist my Bump", "🎵", "Question", "it is time go"];

const DISTANCE_OPACITY_STOPS = [
  { distance: 5, opacity: 0.9 },
  { distance: 20, opacity: 0.5 },
];

function getOpacityForDistance(distance) {
  const [near, far] = DISTANCE_OPACITY_STOPS;
  if (distance <= near.distance) return near.opacity;
  if (distance >= far.distance) return far.opacity;
  const t = (distance - near.distance) / (far.distance - near.distance);
  return near.opacity + t * (far.opacity - near.opacity);
}

/* =========================================================================
   FunFacts
   ========================================================================= */
export default function FunFacts() {
  const isMobile = useIsMobile();

  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [headingRef, headingVisible] = useScrollReveal({ threshold: 1 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [popups, setPopups] = useState([]);
  const idRef = useRef(0);
  const intervalRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const spawnCaption = useCallback(() => {
    const id = idRef.current++;
    const text = CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];

    const rect = imageWrapperRef.current?.getBoundingClientRect();
    const imageRadius = rect ? Math.max(rect.width, rect.height) / 2 : 80;

    const angle = Math.random() * 2 * Math.PI;
    const distance = 5 + Math.random() * 15;
    const totalOffset = imageRadius + distance;
    const x = Math.cos(angle) * totalOffset;
    const y = Math.sin(angle) * totalOffset;
    const rotate = -25 + Math.random() * 50;
    const scale = 0.8 + Math.random() * 0.6;
    const targetOpacity = getOpacityForDistance(distance);

    setPopups((prev) => [
      ...prev,
      { id, text, x, y, rotate, scale, targetOpacity, visible: false },
    ]);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPopups((prev) =>
          prev.map((p) => (p.id === id ? { ...p, visible: true } : p))
        );
      });
    });

    setTimeout(() => {
      setPopups((prev) =>
        prev.map((p) => (p.id === id ? { ...p, visible: false } : p))
      );
    }, 500);

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 500 + 200);
  }, []);

  const handleMouseEnter = () => {
    spawnCaption();
    intervalRef.current = setInterval(spawnCaption, 350);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div
      className="relative w-full pb-[10vh] pt-[15vh] md:pb-[20vh] md:pt-[30vh]"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `
          linear-gradient(to right, rgba(41,41,41,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(41,41,41,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "98px 98px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{ background: "linear-gradient(to bottom,#F2F0EF, transparent 20%)" }}
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

      <div
        ref={sectionRef}
        className={`relative w-full flex justify-center items-center pt-0 pb-30 transition-all duration-700 ease-out ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={imageWrapperRef} className="relative animate-spin-vibrate">
          <Image
            width={900}
            height={900}
            src="/Assets/rocky.png"
            alt="rocky amazzeee"
            className="object-contain w-[50vw] md:w-[12vw]"
          />
        </div>

        {popups.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap font-bold text-black drop-shadow-md transition-all duration-600 ease-out"
            style={{
              transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg) scale(${p.visible ? p.scale : p.scale * 0.5})`,
              opacity: p.visible ? p.targetOpacity : 0,
              fontSize: `${16 * p.scale}px`,
            }}
          >
            {p.text}
          </span>
        ))}
      </div>

      <div ref={wrapperRef} className="relative w-full">
        <ScaledScene
          visible={visible}
          sceneWidth={isMobile ? MOBILE_SCENE_WIDTH : SCENE_WIDTH}
          sceneHeight={isMobile ? MOBILE_SCENE_HEIGHT : SCENE_HEIGHT}
        >
          {isMobile ? (
            <>
              {/* -------- mobile: smaller images + more bottom padding between items -------- */}
              <SceneItem
                x={70}
                y={90}
                w={260}
                delay={0}
                visible={visible}
                label="burning the midnight oil"
                labelPos="bottom"
                labelRotate={-1.5}
              >
                <Image
                  width={320}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/night-window.png"
                />
              </SceneItem>

              <SceneItem
                x={155}
                y={440}
                w={110}
                delay={80}
                visible={visible}
                label="daily drivers"
                labelPos="bottom"
                labelRotate={2}
              >
                <Image
                  width={160}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/claude-gpt.png"
                />
              </SceneItem>

              <SceneItem
                x={140}
                y={700}
                w={140}
                delay={140}
                visible={visible}
                label="tiny jungle"
                labelPos="bottom"
                labelRotate={-1.5}
              >
                <Image
                  width={250}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/wall-decor-4.png"
                />
              </SceneItem>

              <SceneItem
                x={100}
                y={980}
                w={200}
                rotate={-8}
                delay={200}
                visible={visible}
                label="one of my ❤️"
                labelPos="bottom"
                labelRotate={-6}
              >
                <Image
                  width={300}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/wall-poster-2.png"
                />
              </SceneItem>

              <SceneItem x={175} y={1320} w={90} delay={260} visible={visible}>
                <CoffeeToggle visible={visible} />
              </SceneItem>

              <SceneItem
                x={105}
                y={1520}
                w={190}
                rotate={-2}
                delay={320}
                visible={visible}
                label="works on my machine"
                labelPos="bottom"
                labelRotate={-2}
              >
                <Image
                  width={220}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/bug-fix.png"
                />
              </SceneItem>

              <SceneItem
                x={100}
                y={1800}
                w={200}
                delay={380}
                visible={visible}
                label="9999+ Bugs Fixed"
                labelPos="bottom"
                labelRotate={2}
              >
                <Image
                  width={320}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/console-log-1.png"
                />
              </SceneItem>

              <SceneItem
                x={135}
                y={2080}
                w={140}
                delay={440}
                visible={visible}
              >
                <div className="relative">
                  <Image
                    width={70}
                    height={500}
                    className="absolute z-10 -top-6 -right-6 w-[35%] h-auto butterfly-wiggle"
                    alt="butterfly"
                    src="/Assets/FunFact/butter-fly.png"
                  />
                  <Image
                    width={200}
                    height={500}
                    className="w-full h-auto -rotate-6"
                    alt="flower pot"
                    src="/Assets/FunFact/flower-pot.png"
                  />
                </div>
              </SceneItem>
            </>
          ) : (
            <>
              {/* -------- desktop: unchanged -------- */}
              <SceneItem
                x={80}
                y={80}
                w={350}
                delay={0}
                visible={visible}
                label="burning the midnight oil"
                labelPos="bottom"
                labelRotate={-1.5}
              >
                <Image
                  width={320}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/night-window.png"
                />
              </SceneItem>

              <SceneItem
                x={600}
                y={100}
                w={130}
                delay={80}
                visible={visible}
                label="daily drivers"
                labelPos="bottom"
                labelRotate={2}
              >
                <Image
                  width={160}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/claude-gpt.png"
                />
              </SceneItem>

              <SceneItem
                x={1250}
                y={150}
                w={200}
                delay={140}
                visible={visible}
                label="tiny jungle"
                labelPos="top"
                labelRotate={-1.5}
              >
                <Image
                  width={250}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/wall-decor-4.png"
                />
              </SceneItem>

              <SceneItem
                x={1500}
                y={90}
                w={350}
                rotate={-10}
                delay={200}
                visible={visible}
                label="one of my ❤️"
                labelPos="bottom"
                labelRotate={-8}
              >
                <Image
                  width={300}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/wall-poster-2.png"
                />
              </SceneItem>

              <SceneItem x={1000} y={550} w={100} delay={260} visible={visible}>
                <CoffeeToggle visible={visible} />
              </SceneItem>

              <SceneItem
                x={440}
                y={610}
                w={250}
                rotate={-2}
                delay={320}
                visible={visible}
                label="works on my machine"
                labelPos="right"
                labelRotate={-2}
              >
                <Image
                  width={220}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/bug-fix.png"
                />
              </SceneItem>

              <SceneItem
                x={200}
                y={470}
                w={200}
                delay={380}
                visible={visible}
                label="9999+ Bugs Fixed"
                labelPos="bottom"
                labelRotate={2}
              >
                <Image
                  width={320}
                  height={500}
                  className="w-full h-auto"
                  alt="fun-fact-note"
                  src="/Assets/FunFact/console-log-1.png"
                />
              </SceneItem>

              <SceneItem
                x={1400}
                y={620}
                w={200}
                delay={440}
                visible={visible}
                label=""
                labelPos="bottom"
                labelRotate={1.5}
              >
                <div className="relative">
                  <Image
                    width={70}
                    height={500}
                    className="absolute z-10 -top-10 -right-10 w-[35%] h-auto butterfly-wiggle"
                    alt="butterfly"
                    src="/Assets/FunFact/butter-fly.png"
                  />
                  <Image
                    width={200}
                    height={500}
                    className="w-full h-auto -rotate-6"
                    alt="flower pot"
                    src="/Assets/FunFact/flower-pot.png"
                  />
                </div>
              </SceneItem>
            </>
          )}
        </ScaledScene>

        <div
          className="absolute z-20 will-change-transform transition-all ease-out"
          style={{
            left: "50%",
            top: isMobile ? "3%" : "36%",
            transitionDuration: "700ms",
            transform: visible
              ? `translate(-50%, -50%) scale(${isMobile ? 0.85 : 1.15})`
              : `translate(-50%, -50%) scale(${isMobile ? 0.45 : 0.6})`,
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="relative text-center py-10 overflow-hidden">
            <h1
              ref={headingRef}
              className={`reveal-wipe ${
                headingVisible ? "is-visible" : ""
              } invert relative z-10 text-[8vw] md:text-[4vw] text-[#0c0c0c] p-[30px]`}
            >
              Fun Fact
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-[60px] md:mt-[120px]">
        <SkillsMarquee />
      </div>
    </div>
  );
}