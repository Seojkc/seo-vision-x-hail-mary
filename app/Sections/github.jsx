"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ---- Each card is fully self-described ----
// Shared fields (every card needs these):
//   x, y      -> center position, ratio of container width/height
//   w         -> width, ratio of container width
//   rotate    -> degrees
//   variant   -> "image" | "color"
//
// variant: "image"
//   image        -> src path
//   url          -> link (optional, defaults "#")
//   heading      -> optional overlay title
//   subheading   -> optional overlay subtitle, shown under heading
//
// variant: "color"
//   bg           -> tailwind bg class OR hex (use bgColor for hex)
//   bgColor      -> optional raw hex/rgb, overrides `bg`
//   heading      -> optional label text
//   subheading   -> optional label subtext
//   textColor    -> tailwind text class, default "text-white"

const cards = [
  {
    variant: "image",
    image: "/repos/repo-01.png",
    url: "#",
    heading: "design-system",
    x: 0.13,
    y: 0.27,
    w: 0.2,
    rotate: -10,
  },
  {
    variant: "image",
    image: "/repos/repo-02.png",
    url: "#",
    heading: "portfolio-site",
    subheading: "Next.js · Tailwind",
    x: 0.38,
    y: 0.255,
    w: 0.18,
    rotate: 0,
  },
  {
    variant: "color",
    bg: "bg-[#aba1c2]",
    heading: "main-dashboard",
    x: 0.59,
    y: 0.29,
    w: 0.16,
    rotate: 10,
  },
  {
    variant: "color",
    bg: "bg-[#aba1c2]",
    x: 0.8,
    y: 0.41,
    w: 0.14,
    rotate: 35,
  },
  {
    variant: "color",
    bg: "bg-[#9684bd]",
    x: 0.91,
    y: 0.62,
    w: 0.09,
    rotate: 60,
  },
  {
    variant: "color",
    bg: "bg-[#785cb8]",
    textColor: "text-black",
    x: 0.94,
    y: 0.8,
    w: 0.075,
    rotate: 90,
  },
  
  {
    variant: "color",
    bg: "bg-[#6c4cb5]",
    x: 0.87,
    y: 0.934,
    w: 0.07,
    rotate: 150,
  },
  {
    variant: "color",
    bg: "bg-[#5c38b0]",
    x: 0.75,
    y: 0.96,
    w: 0.06,
    rotate: 180,
  },
  {
    variant: "color",
    bg: "bg-[#4e26ab]",
    x: 0.67,
    y: 0.89,
    w: 0.04,
    rotate: 235,
  },
  {
    variant: "color",
    bg: "bg-[#3a0ca3]",
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

function CardContent({ card }) {
  if (card.variant === "color") {
    return (
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center text-center p-2 ${card.bg ?? ""} ${card.textColor ?? "text-white"}`}
        style={card.bgColor ? { backgroundColor: card.bgColor } : undefined}
      >
        {card.heading && (
          <span className="text-sm font-semibold leading-tight">{card.heading}</span>
        )}
        {card.subheading && (
          <span className="text-xs opacity-80 mt-1">{card.subheading}</span>
        )}
      </div>
    );
  }

  // variant === "image"
  return (
    <div className="relative w-full h-full">
      <Image src={card.image} alt={card.heading ?? "repo"} fill sizes="20vw" className="object-cover" />
      {(card.heading || card.subheading) && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2">
          {card.heading && <div className="font-semibold leading-tight">{card.heading}</div>}
          {card.subheading && <div className="text-xs opacity-80 mt-0.5">{card.subheading}</div>}
        </div>
      )}
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

              const Wrapper = card.variant === "image" ? "a" : "div";
              const wrapperProps =
                card.variant === "image"
                  ? { href: card.url ?? "#", target: "_blank", rel: "noopener noreferrer" }
                  : {};

              return (
                <Wrapper
                  key={i}
                  {...wrapperProps}
                  className="absolute rounded-xl border border-black/10 shadow-md overflow-hidden transition-transform duration-300"
                  style={{
                    left,
                    top,
                    width: w,
                    height: h,
                    transform: `translate(-50%, -50%) rotate(${card.rotate}deg)`,
                    zIndex: 10 + i,
                  }}
                >
                  <CardContent card={card} />
                </Wrapper>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}