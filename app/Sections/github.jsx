"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ---- Every card is the same shape now ----
//   image     -> background image src
//   heading   -> always shown
//   subheading-> revealed on hover, when the heading nudges up
//   x, y      -> center position, ratio of container width/height
//   w         -> width, ratio of container width
//   rotate    -> degrees

const cards = [
  {
    image: "/Assets/projects/project-1111.png",
    heading: "Money Compass",
    subheading: "Next.js · Tailwind",
    x: 0.13,
    y: 0.27,
    w: 0.2,
    rotate: -10,
  },
  {
    image: "/repos/repo-02.png",
    heading: "portfolio-site",
    subheading: "Next.js · Tailwind",
    x: 0.38,
    y: 0.255,
    w: 0.18,
    rotate: 0,
  },
  {
    image: "/repos/repo-03.png",
    heading: "main-dashboard",
    subheading: "React · Node",
    x: 0.59,
    y: 0.29,
    w: 0.16,
    rotate: 10,
  },
  {
    image: "/repos/repo-04.png",
    heading: "flagship-app",
    subheading: "React Native",
    x: 0.8,
    y: 0.41,
    w: 0.14,
    rotate: 35,
  },
  {
    image: "/repos/repo-05.png",
    heading: "cli-toolkit",
    subheading: "Go",
    x: 0.91,
    y: 0.62,
    w: 0.09,
    rotate: 60,
  },
  {
    image: "/repos/repo-06.png",
    heading: "api-wrapper",
    subheading: "TypeScript",
    x: 0.94,
    y: 0.8,
    w: 0.075,
    rotate: 90,
  },
  {
    image: "/repos/repo-07.png",
    heading: "auth-service",
    subheading: "Node",
    x: 0.87,
    y: 0.934,
    w: 0.07,
    rotate: 150,
  },
  {
    image: "/repos/repo-08.png",
    heading: "data-pipeline",
    subheading: "Python",
    x: 0.75,
    y: 0.96,
    w: 0.06,
    rotate: 180,
  },
  {
    image: "/repos/repo-09.png",
    heading: "micro-utils",
    subheading: "TypeScript",
    x: 0.67,
    y: 0.89,
    w: 0.04,
    rotate: 235,
  },
  {
    image: "/repos/repo-10.png",
    heading: "ui-components",
    subheading: "React",
    x: 0.66,
    y: 0.8,
    w: 0.035,
    rotate: 270,
  },
];

// dot position, ratio of container
const DOT_X_RATIO = 0.75;
const DOT_Y_RATIO = 0.8;

const CARD_ASPECT = 1.3; // height = width * this

// font size scales with the card's actual rendered width (px), clamped so
// the biggest cards stay readable and the smallest cards don't overflow
function headingFontSize(cardPxWidth) {
  return Math.max(9, Math.min(20, cardPxWidth * 0.11));
}
function subheadingFontSize(cardPxWidth) {
  return Math.max(7, Math.min(13, cardPxWidth * 0.075));
}

function CardContent({ card, cardPxWidth }) {
  const fontSize = headingFontSize(cardPxWidth)*1.7;
  const subFontSize = subheadingFontSize(cardPxWidth);

  return (
    <div className="relative w-full h-full bg-[#002e78]">
      <Image
        src={card.image}
        alt={card.heading}
        fill
        sizes="20vw"
        className="object-cover"
      />

      {/* bottom text panel -- heading always visible, subheading revealed on hover */}
      <div className="absolute bottom-0 left-0 right-0  px-5 py-10">
        <h3
          className="  transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          style={{ fontSize }}
        >
          {card.heading}
        </h3>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: "0fr" }}
        >
          <style jsx>{`
            .group:hover & {
              grid-template-rows: 1fr;
            }
          `}</style>
          <div className="overflow-hidden">
            <p
              className="text-white/80 leading-tight pt-0.5"
              style={{ fontSize: subFontSize }}
            >
              {card.subheading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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

      <div className="relative text-center py-10">
        <Image
          width={600}
          height={500}
          src="/Assets/Git.png"
          alt="github logo"
          className="w-[600px] h-[auto] invert object-contain absolute -right-70 -top-40 opacity-50"
        />

        <h1 className="relative z-10 flex items-center justify-center gap-5 bree-serif-regular text-[4vw] text-[#0c0c0c] p-[30px]">
          A Few From GitHub
        </h1>
      </div>

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
                <Image
                  src="/Assets/Git.png"
                  alt="Logo"
                  fill
                  sizes="80px"
                  className="object-contain invert"
                />
              </div>
            </div>

            {cards.map((card, i) => {
              const w = width * card.w;
              const h = w * CARD_ASPECT;
              const left = width * card.x;
              const top = height * card.y;

              return (
                <div
                  key={i}
                  className="group absolute rounded-xl border border-black/10 shadow-md overflow-hidden transition-transform duration-300"
                  style={{
                    left,
                    top,
                    width: w,
                    height: h,
                    transform: `translate(-50%, -50%) rotate(${card.rotate}deg)`,
                    zIndex: 10 + i,
                  }}
                >
                  <CardContent card={card} cardPxWidth={w} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}