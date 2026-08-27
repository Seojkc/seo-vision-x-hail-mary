"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollSlideUp({
  children,
  className = "",
  threshold = 0.2,
  duration = 1000,
  delay = 0,
  distance = "translate-y-20",
  once = true,
}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={sectionRef}
      className={`transition-all ease-out ${
        isVisible ? "opacity-100 translate-y-0" : `opacity-0 ${distance}`
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}