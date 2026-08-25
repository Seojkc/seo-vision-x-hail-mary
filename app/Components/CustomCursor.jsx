'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleLeave = () => cursor.classList.add('cursor-hidden');
    const handleEnter = () => cursor.classList.remove('cursor-hidden');

    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;
      cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      raf.current = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    raf.current = requestAnimationFrame(loop);

    const interactive = document.querySelectorAll('a, button, [data-cursor-hover]');
    const onEnter = () => cursor.classList.add('cursor-hover');
    const onLeave = () => cursor.classList.remove('cursor-hover');

    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}