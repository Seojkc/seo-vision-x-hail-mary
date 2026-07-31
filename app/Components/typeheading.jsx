"use client";

import { useEffect, useState } from "react";

export default function TypingHeading({
  text = "I'm Seo James",
  speed = 5000,          // ms per character while typing
  pauseAfter = 10000,    // ms to pause once fully typed (only used when loop=true)
  loop = true,          // set false to type once and stop (needed for sequences)
  active = true,        // when false, this instance stays empty and waits
  showCursor = true,
  onComplete,           // called once, right after typing finishes (loop=false only)
  className = "",
  as: Tag = "p",
  style=""
}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // "typing" | "pausing" | "deleting" | "done"

  // reset if this instance gets (re)activated
  useEffect(() => {
    if (active) {
      setDisplayed("");
      setPhase("typing");
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    let timeout;

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, speed);
      } else if (loop) {
        timeout = setTimeout(() => setPhase("pausing"), pauseAfter);
      } else {
        setPhase("done");
        onComplete?.();
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, speed / 2);
      } else {
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, phase, active]);

  return (
    <Tag className={className}>
      {displayed}
      {showCursor && phase !== "done" && <span className="animate-pulse">|</span>}
    </Tag>
  );
}