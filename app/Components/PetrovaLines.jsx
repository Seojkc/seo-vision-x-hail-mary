"use client";

// Deterministic pseudo-random generator so results are varied but
// stable across re-renders (no reshuffle on every paint).
function seededRandom(seed) {
    const x = Math.sin(seed * 9973 + 1) * 10000;
    return x - Math.floor(x);
}

function generateStrand(index, total) {
    const rand = (offset) => seededRandom(index * 17 + offset);

    const baseY = 10 + (index / Math.max(total - 1, 1)) * 210;

    const amp1 = 20 + rand(1) * 40;
    const amp2 = 20 + rand(2) * 40;
    const dir1 = rand(3) > 0.5 ? 1 : -1;
    const dir2 = rand(4) > 0.5 ? 1 : -1;

    const y0 = baseY;
    const y1 = baseY + amp1 * dir1;
    const y2 = baseY - amp2 * dir2;

    const d = `M -50 ${y0} C 150 ${y1}, 320 ${y2}, 500 ${baseY} S 740 ${y1}, 900 ${y2} S 1020 ${baseY}, 1050 ${y0}`;

    const strokeWidth = 0.8 + rand(5) * 2.5;
    const opacity = 0.3 + rand(6) * 0.7;
    const useStrongGlow = rand(7) > 0.5;
    const duration = 9 + rand(8) * 8;
    const reverse = rand(9) > 0.5;
    const driftVariant = rand(10) > 0.5 ? "A" : "B";

    return {
        id: `strand-${index}`,
        d,
        strokeWidth,
        opacity,
        filter: useStrongGlow ? "url(#glowStrong)" : "url(#glowSoft)",
        animationName: `drift${driftVariant}`,
        duration,
        direction: reverse ? "reverse" : "normal",
    };
}

export default function PetrovaLines({
    lineCount = 6,
    starCount = 40,
    height = 200,
}) {
    const strands = Array.from({ length: lineCount }, (_, i) =>
        generateStrand(i, lineCount)
    );
    return (
        <div
            className="absolute -top-10 left-0 w-full pointer-events-none pb-10"
            style={{ height: `${height}px` }}
        >
            

            <svg
                className="absolute top-0 left-0 w-full h-full"
                viewBox="0 0 1000 290"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="petrovaFade" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff2020" stopOpacity="0" />
                        <stop offset="15%" stopColor="#ff2020" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#ff6666" stopOpacity="1" />
                        <stop offset="85%" stopColor="#ff2020" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ff2020" stopOpacity="0" />
                    </linearGradient>

                    <filter id="glowSoft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.2" result="b1" />
                        <feMerge>
                            <feMergeNode in="b1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="glowStrong" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="5" result="b1" />
                        <feMerge>
                            <feMergeNode in="b1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g stroke="url(#petrovaFade)" fill="none" strokeLinecap="round">
                    {strands.map((s) => (
                        <path
                            key={s.id}
                            d={s.d}
                            filter={s.filter}
                            strokeWidth={s.strokeWidth}
                            opacity={s.opacity}
                            style={{
                                strokeDasharray: 1600,
                                animation: `${s.animationName} ${s.duration}s ease-in-out infinite ${s.direction}`,
                            }}
                        />
                    ))}
                </g>
            </svg>

            <style jsx>{`
                @keyframes driftA {
                    0%   { transform: translateX(0) translateY(0); }
                    50%  { transform: translateX(-5%) translateY(1.5%); }
                    100% { transform: translateX(0) translateY(0); }
                }
                @keyframes driftB {
                    0%   { transform: translateX(0) translateY(0); }
                    50%  { transform: translateX(5%) translateY(-1.5%); }
                    100% { transform: translateX(0) translateY(0); }
                }

                .star {
                    position: absolute;
                    border-radius: 50%;
                    background: #ffdede;
                    animation: twinkle 4s ease-in-out infinite;
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; }
                    50%      { opacity: 1; }
                }
            `}</style>
        </div>
    );
}