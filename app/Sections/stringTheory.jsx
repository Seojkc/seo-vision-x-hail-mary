"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import TypingSequence from "../Components/Typingsequence";

// Config for the net effect — tweak freely
const SPACING = 70;
const RADIUS = 160;
const PULL_STRENGTH = 0.85;
const EASE = 0.12;
const LINE_ALPHA = 0.12;
const LINE_ALPHA_NEAR = 0.35;
const DOT_ALPHA = 0.35;
const DOT_ALPHA_NEAR = 0.9;
const DOT_RADIUS = 1.2;

const DEFAULT_ATTRACTOR_RADIUS = 220;
const DEFAULT_ATTRACTOR_STRENGTH = 1.7;

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
      measureAttractors();
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
  const boundaryRef = useRef(null);
  const followerWrapperRef = useRef(null); // xenon-ship

  const [position, setPosition] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [followerPosition, setFollowerPosition] = useState(null); // eased follower pos
  const [dragging, setDragging] = useState(false);
  const [dragMeComment, setDragMeComment] = useState(true);

  const draggingRef = useRef(false);
  const mouseOffset = useRef({ x: 0, y: 0 });

  const targetPos = useRef(null);
  const currentPos = useRef(null);
  const currentAngle = useRef(0);
  const rafId = useRef(null);

  // follower-specific refs
  const followerCurrentPos = useRef(null);
  const followerTargetPos = useRef(null);

  const BASE_ROTATION = 0;
  const MAX_TILT = 25;
  const POSITION_EASE = 0.08;
  const ROTATION_EASE = 0.006;

  // How slowly the follower catches up, and where "under" the ship means.
  // Tweak FOLLOWER_OFFSET to match how far below/right you want it to sit.
  const FOLLOWER_EASE = 0.005;
  const FOLLOWER_OFFSET = { x: 20, y: 220 };

  const attractors = useMemo(
    () => [{ ref: imageWrapperRef, radius: 240, strength: 0.8 }],
    []
  );

  // Seed the follower's starting position from wherever it's rendered by
  // default CSS, so it doesn't jump when it first gets an inline position.
  useEffect(() => {
    if (followerWrapperRef.current && boundaryRef.current) {
      const rect = followerWrapperRef.current.getBoundingClientRect();
      const boundary = boundaryRef.current.getBoundingClientRect();
      const startX = rect.left - boundary.left;
      const startY = rect.top - boundary.top;
      followerCurrentPos.current = { x: startX, y: startY };
      followerTargetPos.current = { x: startX, y: startY };
    }
  }, []);

  function dragStart(e) {
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const boundary = boundaryRef.current.getBoundingClientRect();

    mouseOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const startX = rect.left - boundary.left;
    const startY = rect.top - boundary.top;
    currentPos.current = { x: startX, y: startY };
    targetPos.current = { x: startX, y: startY };

    draggingRef.current = true;
    setDragging(true);
    if (dragMeComment) setDragMeComment(false);
    // note: no follower logic needed here — the animate loop's
    // `!draggingRef.current` check freezes the follower automatically.
  }

  function dragMove(e) {
    if (!draggingRef.current || !boundaryRef.current || !imageWrapperRef.current) return;

    const boundary = boundaryRef.current.getBoundingClientRect();
    const el = imageWrapperRef.current.getBoundingClientRect();

    let x = e.clientX - mouseOffset.current.x - boundary.left;
    let y = e.clientY - mouseOffset.current.y - boundary.top;

    x = Math.min(Math.max(x, 0), boundary.width - el.width);
    y = Math.min(Math.max(y, 0), boundary.height - el.height);

    targetPos.current = { x, y };
  }

  function dragEnd() {
    draggingRef.current = false;
    setDragging(false);

    // Only now — on drop — does the follower get a new destination.
    // targetPos.current already holds the ship's final release point.
    if (followerWrapperRef.current && boundaryRef.current && targetPos.current) {
      const boundary = boundaryRef.current.getBoundingClientRect();
      const followerRect = followerWrapperRef.current.getBoundingClientRect();

      let fx = targetPos.current.x + FOLLOWER_OFFSET.x;
      let fy = targetPos.current.y + FOLLOWER_OFFSET.y;

      fx = Math.min(Math.max(fx, 0), boundary.width - followerRect.width);
      fy = Math.min(Math.max(fy, 0), boundary.height - followerRect.height);

      followerTargetPos.current = { x: fx, y: fy };
    }
  }

  useEffect(() => {
    function animate() {
      // --- ship easing ---
      if (targetPos.current && currentPos.current) {
        const dx = targetPos.current.x - currentPos.current.x;
        const dy = targetPos.current.y - currentPos.current.y;

        currentPos.current.x += dx * POSITION_EASE;
        currentPos.current.y += dy * POSITION_EASE;

        const dist = Math.hypot(dx, dy);
        if (dist > 0.5) {
          const angleToTarget = Math.atan2(dy, dx) * (180 / Math.PI);
          const tilt = Math.max(Math.min(angleToTarget, MAX_TILT), -MAX_TILT);
          const desiredAngle = BASE_ROTATION + tilt;

          let angleDiff = desiredAngle - currentAngle.current;
          angleDiff = (((angleDiff + 180) % 360) + 360) % 360 - 180;
          currentAngle.current += angleDiff * ROTATION_EASE;
        }

        setPosition({ x: currentPos.current.x, y: currentPos.current.y });
        setRotation(currentAngle.current);
      }

      // --- follower easing ---
      // Freezes the instant a new drag starts (draggingRef.current becomes
      // true), because this block simply stops updating while it's true.
      // It only resumes once dragEnd sets a new followerTargetPos.
      if (
        !draggingRef.current &&
        followerCurrentPos.current &&
        followerTargetPos.current
      ) {
        const fdx = followerTargetPos.current.x - followerCurrentPos.current.x;
        const fdy = followerTargetPos.current.y - followerCurrentPos.current.y;

        followerCurrentPos.current.x += fdx * FOLLOWER_EASE;
        followerCurrentPos.current.y += fdy * FOLLOWER_EASE;

        setFollowerPosition({
          x: followerCurrentPos.current.x,
          y: followerCurrentPos.current.y,
        });
      }

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);
    return () => {
      window.removeEventListener("mousemove", dragMove);
      window.removeEventListener("mouseup", dragEnd);
    };
  }, []);

  return (
    <>
      <div ref={boundaryRef} className="relative h-[80rem] overflow-hidden ">
        <NetBackground attractors={attractors} />

        <div className="relative z-10 pointer-events-none h-full">
          {/* main draggable ship — higher z-index so the follower sits under it */}
          <div
            ref={imageWrapperRef}
            className={`absolute pointer-events-auto z-22 top-[16vw] right-[4vw] ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={
              position
                ? {
                    left: position.x,
                    top: position.y,
                    right: "auto",
                    bottom: "auto",
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }
                : { transform: `rotate(${BASE_ROTATION}deg)` }
            }
            onMouseDown={dragStart}
          >
            <Image
              alt="space shuttle"
              width={700}
              height={500}
              className="w-[24vw] h-auto"
              src="/Assets/space_shuttle.png"
              draggable={false}
            />
          </div>

          {/* follower ship — lower z-index, placed underneath */}
          <div
            ref={followerWrapperRef}
            className="absolute pointer-events-auto z-10 top-[26vw] right-[4vw]"
            style={
              followerPosition
                ? {
                    left: followerPosition.x,
                    top: followerPosition.y,
                    right: "auto",
                    bottom: "auto",
                  }
                : undefined
            }
          >
            <Image
              alt="xenon ship"
              width={300}
              height={500}
              className="w-[18vw] h-auto rotate-50"
              src="/Assets/xenon-ship.png"
              draggable={false}
            />
          </div>

          <div className="absolute mt-[16vw] ml-20 z-20 agdasima-regular">
            <div className="flex align-down">
              <h1 className="  text-[10vw]   ">code</h1>
              <h1 className=" mt-26 ml-6 text-[5vw]  ">without</h1>
            </div>
            <h1 className=" text-[15vw]  mt-[-150px] ml-[-5px]">Limits</h1>
            <h1 className=" text-[2vw]  mt-[-80px] ml-[10px] text-red-500">
              Building with code, creativity, and curiosity.
            </h1>
          </div>

          {dragMeComment && (
            <Image
              alt="space shuttle"
              width={100}
              height={500}
              style={
                followerPosition
                  ? {
                      left: followerPosition.x,
                      top: followerPosition.y,
                      right: "auto",
                      bottom: "auto",
                    }
                  : undefined
              }
              className="absolute z-24  opacity-70"
              src="/Assets/drag_me1.png"
            />
          )}
        </div>
      </div>
    </>
  );
}