"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TypingSequence from "../Components/Typingsequence";

// Config for the net effect — tweak freely
const SPACING = 70;          // distance between grid points
const RADIUS = 160;          // mouse influence radius
const PULL_STRENGTH = 0.85;  // how far points get pulled toward the mouse (0-1)
const EASE = 0.12;           // how quickly points ease toward their target each frame
const LINE_ALPHA = 0.12;
const LINE_ALPHA_NEAR = 0.35;
const DOT_ALPHA = 0.35;
const DOT_ALPHA_NEAR = 0.9;
const DOT_RADIUS = 1.2;

// Defaults for any attractor that doesn't specify its own radius/strength
const DEFAULT_ATTRACTOR_RADIUS = 220;
const DEFAULT_ATTRACTOR_STRENGTH = 1.7;








/**
 * attractors: array of { ref, radius?, strength? }
 *   ref       — React ref to the DOM element the net should permanently pull toward
 *   radius    — influence radius in px (defaults to DEFAULT_ATTRACTOR_RADIUS)
 *   strength  — pull strength 0-1 (defaults to DEFAULT_ATTRACTOR_STRENGTH)
 */
function NetBackground({ attractors = [] }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");

    let width, height, cols, rows, points = [];
    let dpr = Math.max(window.devicePixelRatio || 1, 1);
    let frameId;

    // resolved { x, y, radius, strength } for each permanent attractor,
    // recalculated whenever the container resizes
    let attractorPoints = [];

    const mouse = { x: -9999, y: -9999, active: false };

    function buildGrid() {
      cols = Math.ceil(width / SPACING) + 2;
      rows = Math.ceil(height / SPACING) + 2;
      points = [];
      for (let j = 0; j < rows; j++) {
        const row = [];
        for (let i = 0; i < cols; i++) {
          const ox = i * SPACING;
          const oy = j * SPACING;
          row.push({ ox, oy, x: ox, y: oy });
        }
        points.push(row);
      }
    }

    function measureAttractors() {
      const containerRect = container.getBoundingClientRect();
      attractorPoints = attractors
        .map((a) => {
          const el = a.ref?.current;
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            radius: a.radius ?? DEFAULT_ATTRACTOR_RADIUS,
            strength: a.strength ?? DEFAULT_ATTRACTOR_STRENGTH,
          };
        })
        .filter(Boolean);
    }

    function resize() {
      dpr = Math.max(window.devicePixelRatio || 1, 1);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
      measureAttractors();
    }

    // returns { offsetX, offsetY, t } combining the mouse pull + all permanent attractors
    function influenceAt(ox, oy) {
      let offsetX = 0;
      let offsetY = 0;
      let t = 0;

      if (mouse.active) {
        const dx = mouse.x - ox;
        const dy = mouse.y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * PULL_STRENGTH;
          offsetX += dx * force;
          offsetY += dy * force;
          t = Math.max(t, 1 - dist / RADIUS);
        }
      }

      for (let k = 0; k < attractorPoints.length; k++) {
        const a = attractorPoints[k];
        const dx = a.x - ox;
        const dy = a.y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < a.radius) {
          const force = (1 - dist / a.radius) * a.strength;
          offsetX += dx * force;
          offsetY += dy * force;
          t = Math.max(t, 1 - dist / a.radius);
        }
      }

      return { offsetX, offsetY, t };
    }

    function update() {
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = points[j][i];
          const { offsetX, offsetY } = influenceAt(p.ox, p.oy);
          const targetX = p.ox + offsetX;
          const targetY = p.oy + offsetY;

          p.x += (targetX - p.x) * EASE;
          p.y += (targetY - p.y) * EASE;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = points[j][i];
          const { t } = influenceAt(p.ox, p.oy);
          const lineAlpha = LINE_ALPHA + (LINE_ALPHA_NEAR - LINE_ALPHA) * t;

          if (i < cols - 1) {
            const p2 = points[j][i + 1];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(122, 122, 122,${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          if (j < rows - 1) {
            const p2 = points[j + 1][i];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(122, 122, 122,${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = points[j][i];
          const { t } = influenceAt(p.ox, p.oy);
          const dotAlpha = DOT_ALPHA + (DOT_ALPHA_NEAR - DOT_ALPHA) * t;

          ctx.beginPath();
          ctx.arc(p.x, p.y, DOT_RADIUS + t * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(122, 122, 122,${dotAlpha})`;
          ctx.fill();
        }
      }
    }

    function loop() {
      update();
      draw();
      frameId = requestAnimationFrame(loop);
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    function handleTouchMove(e) {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    }

    resize();
    loop();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    // also watch each attractor element itself — its size/position can
    // change (e.g. once an image finishes loading) independently of the
    // container ever resizing
    attractors.forEach((a) => {
      if (a.ref?.current) resizeObserver.observe(a.ref.current);
    });

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attractors]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-black">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}



export default function Introduction() {
  const imageWrapperRef = useRef(null);
  const boundaryRef = useRef(null); // the container the shuttle must stay inside

  // null = "use default CSS position (bottom-200 right-100)"
  const [position, setPosition] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragMeComment,setDragMeComment] = useState(true);

  const draggingRef = useRef(false);
  const mouseOffset = useRef({ x: 0, y: 0 });


  
  function dragStart(e) {
    const rect = imageWrapperRef.current.getBoundingClientRect();
    mouseOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    draggingRef.current = true;
    setDragging(true);
    if(dragMeComment){
      setDragMeComment(!dragMeComment)
    }
  }

  function dragMove(e) {

    

    if (!draggingRef.current) return;

    const boundary = boundaryRef.current.getBoundingClientRect();
    const el = imageWrapperRef.current.getBoundingClientRect();

    let x = e.clientX - mouseOffset.current.x - boundary.left;
    let y = e.clientY - mouseOffset.current.y - boundary.top;

    // keep it fully inside the boundary container
    x = Math.min(Math.max(x, 0), boundary.width - el.width);
    y = Math.min(Math.max(y, 0), boundary.height - el.height);

    setPosition({ x, y });
  }

  function dragEnd() {
    draggingRef.current = false;
    setDragging(false);
  }

  useEffect(() => {
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);

    return () => {
      window.removeEventListener("mousemove", dragMove);
      window.removeEventListener("mouseup", dragEnd);
    };
  }, []); // attach once — refs keep everything current, no stale state needed

  return (
    <>
      <div ref={boundaryRef} className="relative h-[50rem] overflow-hidden ">
        <NetBackground
          attractors={[
            { ref: imageWrapperRef, radius: 240, strength:0.8 },
          ]}
        />
       

        <div className="relative z-10 pointer-events-none h-full">

          

          <div
            ref={imageWrapperRef}
            className={`absolute pointer-events-auto bottom-[230px] right-[170px] ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={
              position
                ? { left: position.x, top: position.y, right: "auto", bottom: "auto" }
                : undefined
            }
            onMouseDown={dragStart}
          >
            <Image
              alt="space shuttle"
              width={700}
              height={500}
              className="w-[34vw] z-1 h-auto rotate-340"
              src="/Assets/space_shuttle.png"
              draggable={false}
            />

            
          </div>


  
          <div className="absolute mt-20 ml-20 agdasima-regular">
            <div className="flex align-down">
              <h1 className="  text-[10vw]   ">code</h1>
              <h1 className=" mt-26 ml-6 text-[5vw]  ">without</h1>
            </div>
            <h1 className=" text-[15vw]  mt-[-150px] ml-[-5px]">Limits</h1>
            <h1 className=" text-[2vw]  mt-[-80px] ml-[10px] text-red-500">Building with code, creativity, and curiosity.
            </h1>

          </div>
         
          { dragMeComment && <Image
              alt="space shuttle"
              width={100}
              height={500}
              className="absolute bottom-[500px] z-0 right-[530px] opacity-70"
              src="/Assets/drag_me1.png"
             

            />}
         

        </div>
      </div>
    </>
  );
}