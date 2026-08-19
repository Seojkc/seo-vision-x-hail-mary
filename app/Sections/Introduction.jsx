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
}) {
  const isActive = currentSong === src;
  const isPlaying = isActive && play;

  const handleClick = () => {
    if (isActive) {
      setPlay((prev) => !prev);
    } else {
      setCurrentSong(src);
      setPlay(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group/card
        absolute
        w-[150px]
        h-[150px]
        p-2
        rounded-[10px]
        overflow-hidden
        cursor-pointer
      
        opacity-0
        scale-0
        blur-sm
      
        group-hover:opacity-100
        group-hover:scale-100
        group-hover:blur-none
      
        active:scale-95
      
        transition-[transform,opacity,filter,box-shadow]
        duration-500
        ease-[cubic-bezier(0.34,1.56,0.64,1)]
      
        ${isActive ? "scale-110 z-30" : "hover:scale-105"}
      
        ${className}
      `}
      style={{
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

function PhotoGrid({ image = "/Assets/Intro/photo-memories.png", className = "" }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div
        className="wave-mask relative w-full h-full"
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
          className="wave-image object-contain pointer-events-none"
        />
      </div>

      <style jsx>{`
        .wave-mask {
          clip-path: var(--hidden-clip);
          /* sweep in, then hand off to the looping ripple once revealed */
          transition: clip-path 1100ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        :global(.group:hover) .wave-mask {
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
        :global(.group:hover) .wave-image {
          opacity: 1;
          transform: scale(1);
          filter: blur(0px);
        }

        /* subtle looping ripple across the four phase-shifted frames,
           keeps the edge feeling alive instead of static once revealed */
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

export default function Introduction() {

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

  const handleSectionMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  

  // track which song is actually loaded into the <audio> element right now,
  // so we know whether a song change happened vs just a play/pause toggle
  const loadedSongRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // guards against a stale async callback (from a previous click) touching
    // the audio element after a newer click has already taken over
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
          className="fixed z-[990] pointer-events-none border-black select-none rounded-full bg-white px-4 py-2 text-[20px] font-medium text-black shadow-lg transition-opacity duration-150 whitespace-nowrap"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-50%, -100%)",
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
            className="absolute inset-x-0 top-0 h-400"
            style={{ background: "linear-gradient(to right,rgb(12, 12, 12), transparent 30%)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-400"
            style={{ background: "linear-gradient(to left,rgb(12, 12, 12), transparent 30%)" }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-300 "
          style={{
            background: "linear-gradient(to top,rgb(12, 12, 12), transparent 30%)",
          }}
        />



<div className="text-[#C4C4C4] items-center flex justify-center pb-[20%]">
  <h3
    ref={headingRef}
    className={`reveal-wipe ${headingVisible ? "is-visible" : ""} text-4xl mt-[20%] gabriela-regular w-[900px] text-center`}
  >
    Hi, I'm <span className="text-6xl text-[#ff0000]">Seo James</span>, a passionate {" "}
    <span className="text-[#ff0000] inline-block w-[200px] text-left">
      {typedWord}
      <span className="animate-pulse">|</span>
    </span>{" "}
    who builds things with purpose, curiosity, and a love for making ideas real.
  </h3>
</div>



        <div className="relative my-[10%] w-full h-[150px] items-center flex gabriela-regular">
          <div className="absolute left-[20%]  -translate-x-1/2 w-[250px] h-[250px]">
            {/* Everything controlled by camera hover */}
            <div className="absolute inset-0 flex items-center justify-center group">
              {/* Curved text */}
              <div
                className="
                  absolute inset-0
                  transition-all duration-300
                  group-hover:opacity-0
                  group-hover:scale-90
                "
              >
                <CurvedText
                  text=" ✿ CAPTURE ✿ MOMENTS ✿ STORIES ✿ MEMORIES"
                  letterSpacing={3}
                />
              </div>

              {/* PHOTO GRID */}
              <PhotoGrid
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

              {/* CAMERA */}
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
                "
              />
            </div>
          </div>

          <div className="absolute left-[50%] -translate-x-1/2 w-[250px] h-[250px]">
            {/* Everything controlled by headphone hover */}
            <div className="absolute inset-0 flex items-center justify-center group">
              {/* Curved text */}
              <div
                className="
                  absolute inset-0
                  transition-all duration-300
                  group-hover:opacity-0
                  group-hover:scale-90
                "
              >
                <CurvedText text="✦ MUSIC ✦ PLAY ✦ PAUSE ✦ REWIND ✦ REPEAT" />
              </div>

              {/* TOP CARD */}
              <MusicCard
                src="/Assets/mp3/Sign-of-the-Times.mp3"
                bgImage="/Assets/mp3/Sign-of-the-Times-cover.png"
                heading="Sign of the  Times"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="
      -top-[110px]
      left-1/2
      -translate-x-1/2
    "
              />

              {/* RIGHT CARD */}
              <MusicCard
                src="/Assets/mp3/Marakkavillayae.mp3"
                bgImage="/Assets/mp3/Marakkavillayae-cover.png"
                heading="Marakkavillayae"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="
      -right-[110px]
      top-1/2
      -translate-y-1/2
      delay-75
    "
              />

              {/* BOTTOM CARD */}
              <MusicCard
                src="/Assets/mp3/glorious-purpose.mp3"
                bgImage="/Assets/mp3/glorious-purpose-cover.png"
                heading="Purpose is Glorious"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="
      -bottom-[110px]
      left-1/2
      -translate-x-1/2
      delay-150
    "
              />

              {/* LEFT CARD */}
              <MusicCard
                src="/Assets/mp3/aaro-nenjil.mp3"
                bgImage="/Assets/mp3/aaro-nenjil-cover.png"
                heading="Aaro Nenjil"
                currentSong={currentSong}
                play={play}
                setCurrentSong={setCurrentSong}
                setPlay={setPlay}
                className="
      -left-[110px]
      top-1/2
      -translate-y-1/2
      delay-200
    "
              />

              {/* HEADPHONE */}
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
    "
              />
            </div>
          </div>

          <div className="  cursor-point pointer-events-none absolute left-[82%] -translate-x-1/2 w-[35vw] aspect-[4/2]">


        


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