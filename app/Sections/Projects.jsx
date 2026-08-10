"use client";
import { useState, useEffect, useRef } from "react";
import PetrovaLines from "../Components/PetrovaLines";
import Image from "next/image";

const PROJECTS = [
  {
    code: "01",
    title: "Money Compass",
    desc: "A modern personal finance app that turns everyday spending into clear insights, helping users budget smarter and stay in control of their money.",
    tags: ["React","Python", "TypeScript","Postgres","Tailwind CSS"],
    status: "live", // "live" | "archived"
    href: "https://money-compass-navy.vercel.app/",
    image: "/Assets/projects/project-111.png",
  },
  {
    code: "02",
    title: "Arrive Alert",
    desc: "Arrive Alert is a smart notification platform designed to help users stay informed about important arrivals and events with timely, reliable alerts.",
    tags: ["React Native", "Kotlin", "Ruby", "Swift", "Python"],
    status: "live",
    href: "https://github.com/Seojkc/GPSAlarmApp",
    image: "/Assets/projects/project-2222.png",
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useReveal();
  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`project-row flex flex-col md:flex-nowrap items-center basis-full ${
        reversed ? "md:flex-row-reverse" : "md:flex-row"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
      }}
    >
      <Image
        alt={project.title}
        width={500}
        height={500}
        className="w-full md:w-[30%] h-auto z-24 p-5"
        src={project.image}
      />

      <div className="flex-1 w-full">
        
        <a  href={project.href}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative block  p-6 min-h-[220px] mb-[20px] mx-[10%] transition-colors duration-300"
        >
          {/* corner brackets */}
          <span
            className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t border-l transition-all duration-300 group-hover:w-5 group-hover:h-5"
            style={{ borderColor: hovered ? "#0f6b64" : "#292929" }}
          />
          <span
            className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-300 group-hover:w-5 group-hover:h-5"
            style={{ borderColor: hovered ? "#0f6b64" : "#292929" }}
          />
          <span
            className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b border-l transition-all duration-300 group-hover:w-5 group-hover:h-5"
            style={{ borderColor: hovered ? "#0f6b64" : "#292929" }}
          />
          <span
            className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b border-r transition-all duration-300 group-hover:w-5 group-hover:h-5"
            style={{ borderColor: hovered ? "#0f6b64" : "#292929" }}
          />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-widest text-[#C4C4C4]/60">
              <span>PRJ-{project.code}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: project.status === "live" ? "#0f6b64" : "transparent",
                    border: project.status === "live" ? "none" : "1px solid #292929",
                  }}
                />
                {project.status === "live" ? "LIVE" : "ARCHIVED"}
              </span>
            </div>

            <h3 className="mt-6 text-[5vw] bodoni-moda-regular font-semibold text-[#C4C4C4] tracking-tight">
              {project.title}
            </h3>
            <p className="mt-2 pt-10 text-[1vw] leading-relaxed text-[#C4C4C4]/70 flex-1">
              {project.desc}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-7 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bodoni-moda-regular text-[1vw] tracking-wide px-2 py-1 text-[#C4C4C4]/70"
                    style={{ border: "1px solid rgba(196, 196, 196,0.3)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[12px] text-[#0f6b64] flex items-center gap-1">
                VIEW
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}export default function Projects() {
    return (
      <div className="bg-[#0c0c0c]">
        {/* Hero — unchanged, stays on top */}
        <div className="relative  text-center py-30 overflow-hidden">
          <h1 className="relative z-10 bree-serif-regular text-[4vw] my-[4vw] text-[#C4C4C4] p-[30px]">
                  Built From Scratch | Time Go Fishing
          </h1>
        </div>




        <div className="flex px-[5%] items-center pt-[2vw] justify-between mb-10 font-mono text-[12px] tracking-[0.2em] text-[#C4C4C4]/60">
            <span className="bree-serif-regular text-[16px] tracking-normal text-[#C4C4C4]">
              Selected Work
            </span>
            <span>{String(PROJECTS.length).padStart(2, "0")} TRANSMISSIONS</span>
          </div>


  
        {/* Projects list */}
        <section
          className="relative px-6 md:px-16 pb-32"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(200, 200, 200, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(200, 200, 200, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "98px 98px",
          }}
        >
          {/* soft fade at the top so the grid doesn't hard-cut against the hero */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full "
            style={{
              background: "linear-gradient(to bottom,#0c0c0c, transparent 10%, transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full "
            style={{
              background: "linear-gradient(to right,#0c0c0c, transparent 30%, transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full "
            style={{
              background: "linear-gradient(to top,#0c0c0c, transparent 30%, transparent)",
            }}
          />
           <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full "
            style={{
              background: "linear-gradient(to left,#0c0c0c, transparent 50%, transparent)",
            }}
          />
  
          
  
          <div className="flex flex-col gap-16">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.code} project={p} index={i} />
            ))}
          </div>
        </section>
  
        <style jsx>{`
          .project-row {
            transition: opacity 0.7s ease-out, transform 0.7s ease-out;
          }
          @media (prefers-reduced-motion: reduce) {
            .project-row {
              transition: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>
      </div>
    );
  }