export default function CurvedText({
    text,
    fontSize = 20,
    letterSpacing = 4,
    speed = 15,
    radius = 100,
  }) {
    const size = radius * 2 + 40;
    const center = size / 2;
  
    // Repeat text so it completely surrounds the circle
    const repeatedText = `${text} • ${text} • ${text} • `;
  
    return (
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          <defs>
            <path
              id="circlePath"
              d={`
                M ${center},${center}
                m -${radius},0
                a ${radius},${radius} 0 1,1 ${radius * 2},0
                a ${radius},${radius} 0 1,1 -${radius * 2},0
              `}
              fill="none"
            />
          </defs>
  
          <g
            style={{
              transformOrigin: `${center}px ${center}px`,
              animation: `spin ${speed}s linear infinite`,
            }}
          >
            <text
              fontSize={fontSize}
              letterSpacing={letterSpacing}
              className="fill-white uppercase"
            >
              <textPath
                href="#circlePath"
                startOffset="0%"
              >
                {repeatedText}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    );
  }