"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() 
{
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500
        ${
          scrolled
            ? "bg-black/55 backdrop-blur-l shadow-xl "
            : "bg-transparent py-5"
        }`}
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-center px-6">
        

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/80 transition hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        
      </nav>
    </header>
  );
}
