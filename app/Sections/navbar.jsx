"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#Resume" },
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
    <header className="fixed inset-x-0 top-0 z-50  flex justify-center " >
      <div  className={scrolled ? "glass-notch" : "glass-notch-top"}>

        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-center px-6">
          

          <ul className="hidden items-center gap-[100px] md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[18px] font-medium text-white/60 transition hover:text-white"
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
