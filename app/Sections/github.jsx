"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ---- Replace with your real repos ----
// x / y are ratios of the container width/height (0 = left/top, 1 = right/bottom)
// w is a ratio of container width. rotate is in degrees.
const cards = [
  {
    title: "design-system",
    image: "/repos/repo-01.png",
    url: "#",
    x: 0.13,
    y: 0.27,
    w: 0.2,
    rotate: -10,
  },
  {
    title: "portfolio-site",
    image: "/repos/repo-02.png",
    url: "#",
    x: 0.38,
    y: 0.255,
    w: 0.18,
    rotate: 0,
  },
  {
    title: "main-dashboard",
    image: "/repos/repo-03.png",
    url: "#",
    x: 0.59,
    y: 0.29,
    w: 0.16,
    rotate: 10,
  },
  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.8,
    y: 0.41,
    w: 0.14,
    rotate: 35,
  },
  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.91,
    y: 0.62,
    w: 0.09,
    rotate: 60,
  },
  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.94,
    y: 0.8,
    w: 0.075,
    rotate: 90,
  },
  


  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.75,
    y: 0.96,
    w: 0.06,
    rotate: 180,
  },
  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.87,
    y: 0.934,
    w: 0.07,
    rotate: 150,
  },

  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.67,
    y: 0.89,
    w: 0.04,
    rotate: 235,
  },
  {
    title: "flagship-app",
    image: "/repos/repo-04.png",
    url: "#",
    x: 0.66 ,
    y: 0.8,
    w: 0.035,
    rotate: 270,
  },
];

// dot position, ratio of container
const DOT_X_RATIO = 0.75;
const DOT_Y_RATIO = 0.8;

const CARD_ASPECT = 1.3; // height = width * this

export default function GithubSection() {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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

  const { width, height } = size;
  const dotX = width * DOT_X_RATIO;
  const dotY = height * DOT_Y_RATIO;

  return (
    <div
      className="relative w-full"
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
        style={{ background: "linear-gradient(to top,#F2F0EF, transparent 10%, transparent)" }}
      />
      <div className="relative text-center py-10 overflow-hidden">
        <h1 className="relative z-10 bree-serif-regular text-[4vw] text-[#0c0c0c] p-[30px]">
            A Few From GitHub
        </h1>
      </div>

      <div ref={containerRef} className="relative w-full pb-10" style={{ height: "170vh" }}>
        {width > 0 && (
          <>
            {/* dot / logo, spiral origin */}
            <div
              className="absolute rounded-full overflow-hidden shadow-lg bg-white"
              style={{
                left: dotX,
                top: dotY,
                width: Math.max(width * 0.045, 36),
                height: Math.max(width * 0.045, 36),
                transform: "translate(-50%, -50%)",
                zIndex: 5,
              }}
            >
              <Image src="/logo.png" alt="Logo" fill sizes="80px" className="object-contain" />
            </div>

            {cards.map((card, i) => {
              const w = width * card.w;
              const h = w * CARD_ASPECT;
              const left = width * card.x;
              const top = height * card.y;

              return (
                
              <a    key={i}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute rounded-xl border  border-black/10 bg-white shadow-md overflow-hidden transition-transform duration-300 "
                  style={{
                    left,
                    top,
                    width: w,
                    height: h,
                    transform: `translate(-50%, -50%) rotate(${card.rotate}deg)`,
                    zIndex: 10 + i,
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image src={card.image} alt={card.title} fill sizes="20vw" className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2">
                      {card.title}
                    </div>
                  </div>
                </a>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}