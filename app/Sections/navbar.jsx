"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#Resume" },
  { label: "Contact", href: "#contact" },
];


export  function Logo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <h1
      className={`
        fixed top-10 left-10 z-50
        text-2xl font-semibold
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${scrolled
          ? "scale-90 opacity-90 tracking-tight"
          : "scale-100 opacity-100 tracking-normal"
        }
      `}
    >
      <span
        className={`
          inline-block transition-all duration-500
          ${scrolled ? "opacity-0 -translate-y-2 absolute" : "opacity-100 translate-y-0"}
        `}
      >
        SeoVision
      </span>

      <span
        className={`
          inline-block transition-all duration-500
          ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
      >
        SeV
      </span>
    </h1>
  );
}




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

      <Logo/>


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
