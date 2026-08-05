"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { skills } from "./skills-data";

// ---------------- Starfield ----------------
function StarField() {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
 

  // ambient twinkling stars, generated once on mount (client only, avoids SSR mismatch)
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

  // shooting stars, spawned on a loop with randomized timing/position/angle
  useEffect(() => {
    let timeoutId;

    const spawn = () => {
      const id = Date.now() + Math.random();
      const star = {
        id,
        top: `${Math.random() * 45}%`,
        left: `${Math.random() * 70}%`,
        angle: 25 + Math.random() * 360, // degrees, roughly top-left -> bottom-right
        duration: (Math.random() * 0.9 + 1.1).toFixed(2),
        length: Math.round(Math.random() * 200 + 90),
      };

      setShootingStars((prev) => [...prev, star]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, parseFloat(star.duration) * 1000 + 100);

      timeoutId = setTimeout(spawn, Math.random() * 3500 + 1800);
    };

    timeoutId = setTimeout(spawn, 800);
    return () => clearTimeout(timeoutId);
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

      {shootingStars.map((s) => (
        <span
          key={s.id}
          className="absolute shooting-star"
          style={{
            top: s.top,
            left: s.left,
            transform: `rotate(${s.angle}deg)`,
            animationDuration: `${s.duration}s`,
            // @ts-ignore
            "--trail-length": `${s.length}px`,
          }}
        />
      ))}

      <style jsx>{`
        .space-gradient {
          background: radial-gradient(
              ellipse at 20% 15%,
              rgba(120, 40, 60, 0.18) 0%,
              rgba(0, 0, 0, 0) 45%
            ),
            radial-gradient(
              ellipse at 80% 70%,
              rgba(40, 70, 130, 0.16) 0%,
              rgba(0, 0, 0, 0) 50%
            ),
            #07070a;
        }

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

        .shooting-star {
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.9);
          animation-name: shoot;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
        .shooting-star::before {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          width: var(--trail-length);
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0)
          );
        }
        @keyframes shoot {
          0% {
            opacity: 0;
            transform: translateX(0) scale(0.4);
          }
          8% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(520px) scale(0.6);
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
        backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1.5px)`,
        backgroundSize: `${dotSize}px ${dotSize}px`,
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 15%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 15%, transparent 100%)",
      }}
    />
  );
}

// ---------------- Skill card ----------------
function SkillCard({ name, logo }) {



  return (
    <div className="skill-card group relative flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-8">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-xl badge">
        {logo ? (
          <Image
            src={logo}
            alt={`${name} logo`}
            width={40}
            height={40}
            className="object-contain"
          />
        ) : (
          <span className="text-xl font-semibold text-white/80">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <span className="text-sm font-medium tracking-wide text-white/85">
        {name}
      </span>

      <style jsx>{`
        .skill-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(6px);
          transition: transform 0.35s ease, border-color 0.35s ease,
            box-shadow 0.35s ease, background 0.35s ease;
        }
        .skill-card:hover {
          transform: translateY(-6px);
          border-color: rgba(224, 32, 43, 0.55);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px -8px rgba(224, 32, 43, 0.35);
        }
        .badge {
          background: linear-gradient(
            145deg,
            rgba(224, 32, 43, 0.18),
            rgba(255, 255, 255, 0.04)
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

// ---------------- Section ----------------
export default function SkillsSection() {

  const [petrovaLine,setPetrovaLine] =useState(false);

  

  return (

    
    <section
      style={{
        ...(petrovaLine 
          ? { backgroundColor: "rgb(12,12,12)" } 
          : { backgroundImage: "url('/Assets/adrian-zoom.png')" }
        ),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="relative w-full h-200 overflow-hidden   opacity-80"
    >
      <DotFadeOverlay/>



      

      <div className="absolute inset-0  bg-gradient-to-b from-[rgba(12,12,12,1)]  transparent" />  
      <div className="absolute inset-0  bg-gradient-to-t from-black/30 transparent" />
    
      
      



      
      <StarField />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map((skill) => (
            <SkillCard key={skill.name} name={skill.name} logo={skill.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}