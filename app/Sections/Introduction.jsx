"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import PetrovaLines from "../Components/PetrovaLines";
import CurvedText from "../Components/CurvedText";
import useScrollReveal from "../Components/useScrollReveal"

export function MusicCard({
  src,
  bgImage,
  heading,
  currentSong,
  play,
  setCurrentSong,
  setPlay,
  className = "",
  forceOpen = false,       // NEW — mobile: always-visible instead of hover-driven
  positionClass = "absolute", // NEW — "relative" for the mobile grid layout
  fluid = false,           // NEW — true: size via className (w-full aspect-square) instead of fixed px
}) {
  const isActive = currentSong === src;
  const isPlaying = isActive && play;

  const handleClick = (e) => {
    e.stopPropagation(); // don't let this bubble up and close the toggle / trigger outside-click
    if (isActive) {
      setPlay((prev) => !prev);
    } else {
      setCurrentSong(src);
      setPlay(true);
    }
  };

  const visibilityClasses = forceOpen
    ? "opacity-100 scale-100 blur-none"
    : "opacity-0 scale-0 blur-sm group-hover:opacity-100 group-hover:scale-100 group-hover:blur-none";

  return (
    <div
      onClick={handleClick}
      className={`
        group/card
        ${positionClass}
        ${fluid ? "w-full aspect-square" : ""}
        p-2
        rounded-[10px]
        overflow-hidden
        cursor-pointer

        ${visibilityClasses}

        active:scale-95

        transition-[transform,opacity,filter,box-shadow]
        duration-500
        ease-[cubic-bezier(0.34,1.56,0.64,1)]

        ${isActive ? "scale-110 z-30" : "hover:scale-105"}

        ${className}
      `}
      style={{
        ...(fluid ? {} : { width: 150, height: 150 }),
        boxShadow: isPlaying
          ? `0 0 0 2px rgba(255,255,255,0.9),
             0 0 28px 6px rgba(255,255,255,0.35),
             inset 8px 8px 15px rgba(0,0,0,0.35),
             inset -10px -14px 15px rgba(0,0,0,0.86)`
          : isActive
          ? `0 0 0 2px rgba(255,255,255,0.55),
             inset 8px 8px 15px rgba(0,0,0,0.35),
             inset -10px -14px 15px rgba(0,0,0,0.86)`
          : `inset 8px 8px 15px rgba(0,0,0,0.35),
             inset -10px -14px 15px rgba(0,0,0,0.86)`,
      }}
    >
      {/* cover image, slowly breathes/zooms while playing */}
      <div
        className={`absolute inset-0 transition-transform duration-[3000ms] ease-linear ${
          isPlaying ? "scale-110" : "scale-100"
        }`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* darken overlay — lifts when the card is active/selected */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isActive ? "bg-black/0" : "bg-black/25"
        }`}
      />

      {/* live equalizer bars, only while actually playing */}
      {isPlaying && (
        <div className="absolute top-3 left-3 z-20 flex items-end gap-[3px] h-4">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] bg-white rounded-full eq-bar"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {/* paused-but-selected indicator */}
      {isActive && !isPlaying && (
        <div className="absolute top-3 right-3 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
        </div>
      )}

      {/* bottom gradient for legibility, brighter while playing */}
      <div
        className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none transition-opacity duration-500 ${
          isPlaying ? "opacity-90" : "opacity-60"
        }`}
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
      />

      <div className="absolute inset-0 flex items-end justify-center z-10">
        <h3
          className={`
            pointer-events-none
            text-white
            text-[15px]
            font-medium
            tracking-[2px]
            text-center
            pb-2
            bree-serif-regular 
            drop-shadow-lg
            transition-transform duration-300
            ${isActive ? "translate-y-0" : "translate-y-1 group-hover/card:translate-y-0"}
          `}
        >
          {heading}
        </h3>
      </div>

      <style jsx>{`
        .eq-bar {
          animation: eq 0.8s ease-in-out infinite;
        }
        @keyframes eq {
          0%,
          100% {
            height: 4px;
          }
          50% {
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}


// ---- Builds a smooth sine-curve clip-path boundary (elegant wipe, not zig-zag) ----
function buildWaveClipPath(boundaryX, amplitude, rows, diagonal = 0, phase = 0) {
  const points = [`0% 0%`];
  for (let i = 0; i <= rows; i++) {
    const t = i / rows;
    const y = t * 100;
    const drift = t * diagonal;
    const amp = Math.sin(t * Math.PI * 2 + phase) * amplitude;
    const x = boundaryX + drift + amp;
    
    points.push(`${x.toFixed(4)}% ${y.toFixed(4)}%`);
  }
  points.push(`0% 100%`);
  return `polygon(${points.join(", ")})`;
}

// entrance sweep: wave starts off-screen left, travels fully past the right
const WAVE_HIDDEN_CLIP = buildWaveClipPath(-8, 6, 32, 14, 0);
const WAVE_VISIBLE_CLIP = buildWaveClipPath(112, 6, 32, 14, 0);

// idle ripple frames: same reveal position, phase cycled for a gentle
// continuous "wave still moving" feel once fully visible
const RIPPLE_FRAMES = [0, 0.5, 1, 1.5].map((p) =>
  buildWaveClipPath(112, 6, 32, 14, p * Math.PI)
);


function PhotoGrid({ image = "/Assets/Intro/photo-memories.png", className = "", open = false }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div
        className={`wave-mask relative w-full h-full ${open ? "is-open" : ""}`}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%)",
          "--hidden-clip": WAVE_HIDDEN_CLIP,
          "--visible-clip": WAVE_VISIBLE_CLIP,
          "--ripple-0": RIPPLE_FRAMES[0],
          "--ripple-1": RIPPLE_FRAMES[1],
          "--ripple-2": RIPPLE_FRAMES[2],
          "--ripple-3": RIPPLE_FRAMES[3],
        }}
      >
        <Image
          src={image}
          alt=""
          fill
          className={`wave-image object-contain pointer-events-none ${open ? "is-open" : ""}`}
        />
      </div>

      <style jsx>{`
        .wave-mask {
          clip-path: var(--hidden-clip);
          transition: clip-path 1100ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        :global(.group:hover) .wave-mask,
        .wave-mask.is-open {
          clip-path: var(--visible-clip);
          animation: ripple 4200ms ease-in-out 1100ms infinite;
        }

        .wave-image {
          opacity: 0;
          transform: scale(1.06);
          filter: blur(6px);
          transition:
            opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 1100ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        :global(.group:hover) .wave-image,
        .wave-image.is-open {
          opacity: 1;
          transform: scale(1);
          filter: blur(0px);
        }

        @keyframes ripple {
          0%   { clip-path: var(--visible-clip); }
          25%  { clip-path: var(--ripple-1); }
          50%  { clip-path: var(--ripple-2); }
          75%  { clip-path: var(--ripple-3); }
          100% { clip-path: var(--visible-clip); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wave-mask,
          .wave-image {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function useTypewriter(words, typingSpeed = 80, deletingSpeed = 20, pauseTime = 1200) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];

    let timeout;

    if (!isDeleting && text === currentWord) {
      // finished typing, pause then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      // finished deleting, move to next word
      setIsDeleting(false);
      setWordIndex((prev) => prev + 1);
    } else {
      const nextText = isDeleting
        ? currentWord.slice(0, text.length - 1)
        : currentWord.slice(0, text.length + 1);

      timeout = setTimeout(
        () => setText(nextText),
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

// shared elegant deceleration curve, consistent with the rest of the site
const POP_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const TEXT_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // slight overshoot, feels alive on scale-in

const POP_DURATION = 900;
const POP_STAGGER = 160;

const TEXT_START_OFFSET = 550;
const TEXT_DURATION = 750;



export default function Introduction() {




  const [isMobile, setIsMobile] = useState(false);
const [cameraOpen, setCameraOpen] = useState(false);
const [headphoneOpen, setHeadphoneOpen] = useState(false);
const cameraGroupRef = useRef(null);
const headphoneGroupRef = useRef(null);

useEffect(() => {
  const mq = window.matchMedia("(max-width: 767px)");
  const update = () => setIsMobile(mq.matches);
  update();
  mq.addEventListener("change", update);
  return () => mq.removeEventListener("change", update);
}, []);

// tap anywhere outside an open group closes it — mirrors "click again to close"
useEffect(() => {
  const handleOutsideClick = (e) => {
    if (cameraGroupRef.current && !cameraGroupRef.current.contains(e.target)) {
      setCameraOpen(false);
    }
    if (headphoneGroupRef.current && !headphoneGroupRef.current.contains(e.target)) {
      setHeadphoneOpen(false);
    }
  };
  document.addEventListener("click", handleOutsideClick);
  return () => document.removeEventListener("click", handleOutsideClick);
}, []);







  const [headingRef, headingVisible] = useScrollReveal({threshold:1})
  const [play, setPlay] = useState(true);
  const typedWord = useTypewriter(["Developer", "Designer"]);
  const [currentSong, setCurrentSong] = useState(
    "/Assets/mp3/glorious-purpose.mp3"
  );

  const audioRef = useRef(null);

  // custom "hover the icons" cursor bubble, follows the mouse anywhere over the section
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const sectionRef = useRef(null); // NEW — needed to check bounds on scroll

  const handleSectionMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  // mouseenter/mouseleave never fire on scroll, only on pointer movement —
  // so if the user scrolls past this section with the mouse held still,
  // showCursor stays stuck `true` and the bubble floats over whatever
  // section scrolled up underneath it. This watches scroll directly and
  // hides the bubble the moment the last known cursor position falls
  // outside the section's current bounding box.
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside =
        cursorPos.x >= rect.left &&
        cursorPos.x <= rect.right &&
        cursorPos.y >= rect.top &&
        cursorPos.y <= rect.bottom;
      if (!inside) setShowCursor(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cursorPos]);

  const [rowRef, rowVisible] = useScrollReveal({ threshold: 0.2 });

  // index 0 = camera, 1 = headphones, 2 = mp3 player
  const popDelay = (i) => i * POP_STAGGER;
  const textDelay = (i) => popDelay(i) + TEXT_START_OFFSET;

  const popStyle = (i) => ({
    opacity: rowVisible ? 1 : 0,
    transform: rowVisible ? "translateY(0px) scale(1)" : "translateY(120px)  scale(0)",
    transitionProperty: "transform, opacity",
    transitionDuration: `${POP_DURATION}ms`,
    transitionTimingFunction: POP_EASE,
    transitionDelay: `${popDelay(i)}ms`,
    willChange: "transform, opacity",
  });

  const textRevealStyle = (i) => ({
    opacity: rowVisible ? 1 : 0,
    transform: rowVisible ? "scale(1)" : "scale(0)",
    transformOrigin: "center center",
    transitionProperty: "transform, opacity",
    transitionDuration: `${TEXT_DURATION}ms`,
    transitionTimingFunction: TEXT_EASE,
    transitionDelay: `${textDelay(i)}ms`,
    willChange: "transform, opacity",
  });

  const loadedSongRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let ignore = false;

    const songChanged = loadedSongRef.current !== currentSong;

    if (songChanged) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = currentSong;
      audio.load();
      loadedSongRef.current = currentSong;
    }

    if (play) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (ignore) return;
          // ignore benign interruption errors caused by a rapid pause()/src change
          if (err?.name === "AbortError") return;
          // real autoplay block or other failure -- reflect that in the UI
          setPlay(false);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      ignore = true;
    };
  }, [currentSong, play]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full h-auto overflow-hidden border-top-cardboard cursor-none"
        onMouseMove={handleSectionMouseMove}
        onMouseEnter={() => setShowCursor(true)}
        onMouseLeave={() => setShowCursor(false)}
        style={{
          backgroundColor: "rgb(12, 12, 12)",
          backgroundImage: `
              linear-gradient(to right, rgba(200, 200, 200, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(200, 200, 200, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: "98px 98px",
        }}
      >
        {/* custom cursor bubble -- replaces the native pointer while hovering this section */}
        <div
        className="hidden md:block fixed z-[990] pointer-events-none select-none rounded-full bg-white px-4 py-2 text-[20px] font-medium text-black shadow-lg whitespace-nowrap transition-[opacity,transform] duration-300 ease-out"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: `translate(-50%, -100%) scale(${showCursor ? 1 : 0.85})`,
          opacity: showCursor ? 1 : 0,
        }}
      >
              Hover the icons 🙂
      </div>


       
        {/* actual audio element -- drives all the visual play/pause state above */}
        <audio ref={audioRef} src={currentSong} onEnded={() => setPlay(false)} />

        <div className="relative z-10 text-[#218a13]">
          <PetrovaLines lineCount={8} starCount={40} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute inset-x-0 top-0 h-400"
            style={{ background: "linear-gradient(to bottom,rgb(12, 12, 12), transparent 30%)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-400 hidden md:block"
            style={{ background: "linear-gradient(to right,rgb(12, 12, 12), transparent 30%)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-400 hidden md:block"
            style={{ background: "linear-gradient(to left,rgb(12, 12, 12), transparent 30%)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-400  block md:hidden"
            style={{ background: "linear-gradient(to right,rgb(12, 12, 12), transparent 10%)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-400   block md:hidden"
            style={{ background: "linear-gradient(to left,rgb(12, 12, 12), transparent 10%)" }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-300 "
          style={{
            background: "linear-gradient(to top,rgb(12, 12, 12), transparent 30%)",
          }}
        />



<div className="text-[#C4C4C4] items-center flex justify-center md:pb-[20%] md:py-[0%] py-[20%]">
<h3
    ref={headingRef}
    className={`reveal-wipe ${headingVisible ? "is-visible" : ""} md:text-4xl text-2xl mt-[50%] md:mt-[20%] gabriela-regular w-[80%] md:w-[900px] text-center`}
>
    Hi, I'm <span className="text-4xl md:text-6xl text-[#ff0000]">Seo James</span>, a passionate
    <br className="md:hidden" />
    <span className="text-[#ff0000] block md:inline-block w-auto md:w-[200px]  text-center md:text-left">
        {typedWord}
        <span className="animate-pulse">|</span>
    </span>
    who builds things with purpose, curiosity, and a love for making ideas real.
</h3>
</div>



<div className="md:hidden text-center text-white/40 ">
          <h3>click icons</h3>
</div>


<div
    ref={rowRef}
    className="relative py-[10%] pb-[20%] w-full h-auto md:h-[200px] flex flex-col md:flex-row items-center gabriela-regular"
>
    {/* ===================== CAMERA GROUP ===================== */}
    <div
    ref={cameraGroupRef}
    className="relative md:absolute mt-[45%] md:mt-[0%] mx-auto md:mx-0 left-auto md:left-[20%] translate-x-0 md:-translate-x-1/2 w-[250px] h-[250px] pb-16 md:pb-0"
    style={popStyle(0)}
    onClick={(e) => {
        if (isMobile) {
            e.stopPropagation();
            setCameraOpen((prev) => !prev);
        }
    }}
>
    <div className="absolute inset-0 flex items-center justify-center group">
        <div className="absolute inset-0" style={textRevealStyle(0)}>
            <div
                className={`
                    absolute inset-0
                    transition-all duration-300
                    ${isMobile
                        ? (cameraOpen ? "opacity-0 scale-90" : "opacity-100 scale-100")
                        : "group-hover:opacity-0 group-hover:scale-90"}
                `}
            >
                <CurvedText
                    text=" ✿ CAPTURE ✿ MOMENTS ✿ STORIES ✿ MEMORIES"
                    letterSpacing={3}
                />
            </div>
        </div>

        <PhotoGrid
            open={isMobile && cameraOpen}
            className="
                right-1/2
                top-1/2
                z-21
                translate-x-[50%]
                -translate-y-1/2
                w-[900px]
                h-[550px]
            "
        />

        <Image
            src="/Assets/Intro/camera.png"
            width={150}
            height={100}
            alt="camera"
            className="
                relative
                z-20
                rotate-[349deg]
                transition-transform
                duration-300
                group-hover:scale-105
                cursor-pointer
            "
        />
    </div>
</div>



      {/* ===================== HEADPHONE GROUP ===================== */}




<div
    ref={headphoneGroupRef}
    className="relative md:absolute mt-[45%] md:mt-[0%] mx-auto md:mx-0 left-auto md:left-[50%] translate-x-0 md:-translate-x-1/2 w-[250px] h-[250px] pb-16 md:pb-0"
    style={popStyle(1)}
    onClick={(e) => {
        if (isMobile) {
            e.stopPropagation();
            setHeadphoneOpen((prev) => !prev);
        }
    }}
>
    <div className="absolute inset-0 flex items-center justify-center group">
        <div className="absolute inset-0" style={textRevealStyle(1)}>
            <div
                className={`
                    absolute inset-0
                    transition-all duration-300
                    ${isMobile
                        ? (headphoneOpen ? "opacity-0 scale-90" : "opacity-100 scale-100")
                        : "group-hover:opacity-0 group-hover:scale-90"}
                `}
            >
                <CurvedText text="✦ MUSIC ✦ PLAY ✦ PAUSE ✦ REWIND ✦ REPEAT" />
            </div>
        </div>

        {/* Desktop-only hover cards — untouched, just wrapped so mobile never renders them */}
        <div className="hidden md:contents">
            <MusicCard
                src="/Assets/mp3/Sign-of-the-Times.mp3"
                bgImage="/Assets/mp3/Sign-of-the-Times-cover.png"
                heading="Sign of the  Times"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="-top-[110px] left-1/2 -translate-x-1/2"
            />
            <MusicCard
                src="/Assets/mp3/Marakkavillayae.mp3"
                bgImage="/Assets/mp3/Marakkavillayae-cover.png"
                heading="Marakkavillayae"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="-right-[110px] top-1/2 -translate-y-1/2 delay-75"
            />
            <MusicCard
                src="/Assets/mp3/glorious-purpose.mp3"
                bgImage="/Assets/mp3/glorious-purpose-cover.png"
                heading="Purpose is Glorious"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="-bottom-[110px] left-1/2 -translate-x-1/2 delay-150"
            />
            <MusicCard
                src="/Assets/mp3/aaro-nenjil.mp3"
                bgImage="/Assets/mp3/aaro-nenjil-cover.png"
                heading="Aaro Nenjil"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="-left-[110px] top-1/2 -translate-y-1/2 delay-200"
            />
        </div>

        {/* Mobile-only toggle grid — fits within the viewport width */}
        {isMobile && (
            <div
                className={`
                    md:hidden
                    absolute left-1/2 -translate-x-1/2 top-[30px]
                    grid grid-cols-2 gap-3
                    w-[70vw] max-w-[280px]
                    z-30
                    transition-all duration-300
                    ${headphoneOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}
                `}
            >
                <MusicCard
                    src="/Assets/mp3/Sign-of-the-Times.mp3"
                    bgImage="/Assets/mp3/Sign-of-the-Times-cover.png"
                    heading="Sign of the  Times"
                    currentSong={currentSong}
                    play={play}
                    setCurrentSong={setCurrentSong}
                    setPlay={setPlay}
                    forceOpen
                    positionClass="relative"
                    fluid
                />
                <MusicCard
                    src="/Assets/mp3/Marakkavillayae.mp3"
                    bgImage="/Assets/mp3/Marakkavillayae-cover.png"
                    heading="Marakkavillayae"
                    currentSong={currentSong}
                    play={play}
                    setCurrentSong={setCurrentSong}
                    setPlay={setPlay}
                    forceOpen
                    positionClass="relative"
                    fluid
                />
                <MusicCard
                    src="/Assets/mp3/glorious-purpose.mp3"
                    bgImage="/Assets/mp3/glorious-purpose-cover.png"
                    heading="Purpose is Glorious"
                    currentSong={currentSong}
                    play={play}
                    setCurrentSong={setCurrentSong}
                    setPlay={setPlay}
                    forceOpen
                    positionClass="relative"
                    fluid
                />
                <MusicCard
                    src="/Assets/mp3/aaro-nenjil.mp3"
                    bgImage="/Assets/mp3/aaro-nenjil-cover.png"
                    heading="Aaro Nenjil"
                    currentSong={currentSong}
                    play={play}
                    setCurrentSong={setCurrentSong}
                    setPlay={setPlay}
                    forceOpen
                    positionClass="relative"
                    fluid
                />
            </div>
        )}

        <Image
            src="/Assets/Intro/headphone.png"
            width={150}
            height={100}
            alt="headphones"
            className="
                relative
                z-20
                rotate-[349deg]
                transition-transform
                duration-300
                group-hover:scale-105
                cursor-pointer
            "
        />
    </div>
</div>



      {/* ===================== MP3 PLAYER ===================== */}
      <div
    className="cursor-pointer pointer-events-none relative md:absolute mt-[45%] md:mt-[0%] md:left-[82%] md:-translate-x-1/2 w-[120vw] md:w-[35vw] aspect-[4/2] pb-16 md:pb-0"
    style={popStyle(2)}
>
        {/* MP3 background */}
        <Image
          src="/Assets/Intro/mp3-background-1.png"
          alt="mp3 player"
          fill
          className="object-contain"
        />

        {/* Vinyl */}
        <Image
          src="/Assets/Intro/vinyl-disc.png"
          alt="vinyl disc"
          width={150}
          height={100}
          className={`
            absolute
            left-[35%]
            top-[15%]
            w-[25%]
            h-auto
            transition-all duration-700
            ${play ? "animate-spin" : ""}
          `}
        />

        <Image
          src="/Assets/Intro/needle.png"
          alt="needle"
          width={250}
          height={100}
          className={`
            absolute
            left-[44%]
            top-[-15%]
            w-[32.5%]
            h-auto
            transition-transform duration-300
            ${play ? "rotate-10" : "-rotate-20"}
          `}
        />

        {/* Pause */}
        <Image
          src="/Assets/Intro/pause-button.png"
          alt="pause"
          width={50}
          height={100}
          className={`
            pointer-events-auto
            absolute
            left-[35%]
            top-[73%]
            w-[8%]
            h-auto
            cursor-pointer
            ${play ? "scale-100" : "scale-90 invert"}
          `}
          onClick={() => setPlay(false)}
        />

        {/* Play */}
        <Image
          src="/Assets/Intro/play-button.png"
          alt="play"
          width={50}
          height={100}
          className={`
            pointer-events-auto
            absolute
            left-[44%]
            top-[73%]
            w-[8%]
            h-auto
            cursor-pointer
            transition-transform duration-200
            ${play ? "scale-90 invert" : "scale-100"}
          `}
          onClick={() => setPlay(true)}
        />
      </div>
    </div>

        
      </section>
    </>
  );
}