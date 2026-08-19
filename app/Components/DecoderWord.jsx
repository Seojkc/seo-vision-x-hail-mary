"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export default function DecoderWord({
  words,
  interval = 2000,      // how long each word holds before scrambling to the next
  scrambleFrames = 10,   // how many random frames play during the transition
  scrambleSpeed = 40,    // ms between each scramble frame
  className = "",
}) {
  const [display, setDisplay] = useState(words[0]);
  const indexRef = useRef(0);
  const holdTimeout = useRef(null);
  const frameTimeout = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const runScramble = () => {
      const fromWord = words[indexRef.current % words.length];
      const toWord = words[(indexRef.current + 1) % words.length];
      indexRef.current += 1;

      // find how many leading characters are shared -- these stay fixed,
      // never scrambled (e.g. "De" in "Developer" / "Designer")
      let lockedPrefix = 0;
      const shortest = Math.min(fromWord.length, toWord.length);
      while (lockedPrefix < shortest && fromWord[lockedPrefix] === toWord[lockedPrefix]) {
        lockedPrefix++;
      }

      const maxLen = Math.max(fromWord.length, toWord.length);
      let frame = 0;

      const tick = () => {
        if (!mounted.current) return;
        frame++;

        if (frame >= scrambleFrames) {
          setDisplay(toWord);
          holdTimeout.current = setTimeout(runScramble, interval);
          return;
        }

        let out = toWord.slice(0, lockedPrefix);
        for (let i = lockedPrefix; i < maxLen; i++) {
          out += i < toWord.length ? randomChar() : "";
        }
        setDisplay(out);
        frameTimeout.current = setTimeout(tick, scrambleSpeed);
      };

      tick();
    };

    holdTimeout.current = setTimeout(runScramble, interval);

    return () => {
      mounted.current = false;
      clearTimeout(holdTimeout.current);
      clearTimeout(frameTimeout.current);
    };
  }, [words, interval, scrambleFrames, scrambleSpeed]);

  return <span className={className}>{display}</span>;
}