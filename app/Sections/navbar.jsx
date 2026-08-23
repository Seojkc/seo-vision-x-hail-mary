"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Projects", href: "#Projects" },
  { label: "Skills", href: "#Skills" },
  { label: "Playgound", href: "#Playgound" },
  { label: "Contact", href: "#contact" },
];


export function Logo({ theme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const full = "SeoVision";
  const short = "SeV";
  const textColor = theme === "light" ? "text-[#0c0c0c]" : "text-[#C4C4C4]";

  return (
    <h1
      className={`
        fixed top-8 left-8 z-50 cookie-regular
        text-[2vw] font-semibold leading-none
        transition-transform duration-700 ${textColor}
      `}
      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      <span className="relative inline-block">
        {/* full wordmark */}
        <span className="inline-flex">
          {full.split("").map((ch, i) => (
            <span
              key={`full-${i}`}
              className="inline-block transition-all " 
              style={{
                transitionDuration: "450ms",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: scrolled ? `${i * 12}ms` : "0ms",
                opacity: scrolled ? 0 : 1,
                filter: scrolled ? "blur(6px)" : "blur(0px)",
                transform: scrolled
                  ? "translateY(-6px) scale(0.9)"
                  : "translateY(0) scale(1)",
              }}
            >
              {ch}
            </span>
          ))}
        </span>

        {/* short wordmark, absolutely stacked on top */}
        <span className="absolute inset-0 inline-flex">
          {short.split("").map((ch, i) => (
            <span
              key={`short-${i}`}
              className="inline-block transition-all "
              style={{
                transitionDuration: "450ms",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: scrolled ? `${150 + i * 40}ms` : "0ms",
                opacity: scrolled ? 1 : 0,
                filter: scrolled ? "blur(0px)" : "blur(6px)",
                transform: scrolled
                  ? "translateY(0) scale(1)"
                  : "translateY(6px) scale(0.9)",
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}


function useNavbarTheme(offset = 80) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-navbar-theme]"));
    if (sections.length === 0) return;

    let raf = null;

    const measure = () => {
      // Walk sections in DOM order; the "current" one is the last whose
      // top edge has already scrolled past the navbar line.
      let current = sections[0];
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          current = el;
        } else {
          break;
        }
      }
      const next = current.dataset.navbarTheme;
      setTheme((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offset]);

  return theme; // "dark" | "light"
}


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const theme = useNavbarTheme(80); // 80 ≈ navbar height; tune to match

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = theme === "light";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <Logo theme={theme} />

      <div
        className={[
          scrolled ? "glass-notch" : "glass-notch-top",
          isLight ? "glass-notch--light" : "glass-notch--dark",
          "transition-colors duration-500",
        ].join(" ")}
      >
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-center px-6">
          <ul className="hidden items-center gap-[60px] md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                
                <a  href={link.href}
                  className={[
                    "text-[18px] font-medium transition-colors duration-500",
                    isLight
                      ? "text-black/60 hover:text-black"
                      : "text-white/60 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}