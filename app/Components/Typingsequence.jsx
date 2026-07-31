"use client";

import { useState } from "react";
import TypingHeading from "./typeheading";

/**
 * Runs a list of TypingHeading items one after another.
 * Each one starts only after the previous one finishes typing.
 *
 * items: [{ text: "I'm Seo James", className: "text-4xl font-bold" }, ...]
 */
export default function TypingSequence({ items, speed = 80, as = "h1" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {items.map((item, i) => {
        if (i > activeIndex) return null; // not started yet — render nothing

        const isActive = i === activeIndex;

        return (
          <TypingHeading
            key={i}
            style={item.style}
            text={item.text}
            className={item.className}
            speed={item.speed ?? speed}
            as={item.as ?? as}
            loop={false}
            active={isActive}
            showCursor={isActive}
            onComplete={() => setActiveIndex((prev) => prev + 1)}
          />
        );
      })}
    </div>
  );
}