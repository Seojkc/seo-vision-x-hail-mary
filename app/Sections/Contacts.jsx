import React from "react";

/**
 * ElegantFooter — a dark, editorial-style portfolio footer.
 *
 * Edit the CONTENT block below with your own name, role, tagline,
 * resume link, email, and social URLs. Everything else (styles,
 * layout, hover interactions) works as-is.
 *
 * Responsive behavior:
 *  - Desktop (≥769px): unchanged — single row, no wrapping.
 *  - Mobile (≤768px): stacks into three rows (name → resume/email → social),
 *    with all sizes scaled down for smaller screens.
 */

const CONTENT = {
  firstName: "Seo",
  lastName: "James",
  resumeHref: "Assets/resume-1.pdf",
  email: "seojameskc007@gmail.com",
  year: new Date().getFullYear(),
  badgeText: "OPEN TO WORK • OPEN TO WORK • ",
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Seojkc",
      path: "M12 .5C5.73.5.98 5.24.98 11.52c0 4.97 3.22 9.18 7.7 10.67.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.13.68-3.79-1.34-3.79-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.72-1.5-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.66 0c2.16-1.46 3.11-1.16 3.11-1.16.61 1.57.23 2.73.11 3.02.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.65.78.54A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/seo-james-2084461bb/",
      path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.11 20.45H3.56V9h3.55v11.45z",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/seo_jmz_/",
      path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.23.41.51.19.9.44 1.3.83.39.4.63.78.83 1.3.17.42.36 1.05.41 2.22.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.41 2.22-.2.52-.44.9-.83 1.3-.4.39-.79.64-1.3.83-.43.17-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.23-.41a3.55 3.55 0 0 1-1.3-.83 3.55 3.55 0 0 1-.83-1.3c-.17-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.41-2.22.2-.52.44-.9.83-1.3.4-.39.79-.64 1.3-.83.43-.17 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.7 5.7 0 0 0-2.07 1.35A5.7 5.7 0 0 0 .72 3.05c-.3.76-.5 1.63-.56 2.91C.1 7.24.09 7.65.09 10.9v2.2c0 3.26.01 3.66.07 4.94.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.35 2.07.61.63 1.28 1.04 2.07 1.35.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.66-.01 4.94-.07c1.28-.06 2.15-.26 2.91-.56a5.7 5.7 0 0 0 2.07-1.35 5.7 5.7 0 0 0 1.35-2.07c.3-.76.5-1.63.56-2.91.06-1.28.07-1.68.07-4.94v-2.2c0-3.25-.01-3.66-.07-4.94-.06-1.28-.26-2.15-.56-2.91a5.7 5.7 0 0 0-1.35-2.07A5.7 5.7 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
    },
  ],
};

export default function Contacts() {
  return (
    <footer className="ef-root">
      <style>{`
        .ef-root{
          --black:#000000;
          --ivory:#f3efe7;
          --ivory-dim:#8c887f;
          --brass:#c8a866;
          --brass-dim:#7a6a45;
          --hairline:#232220;

          background:var(--black);
          color:var(--ivory);
          font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;
          padding:5.5rem clamp(1.5rem,5vw,4rem) 2.5rem;
          overflow-x:auto; /* if the single row runs out of room, scroll rather than wrap */
        }

        .ef-inner{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:clamp(2rem,6vw,8rem);
          flex-wrap:nowrap;      /* force everything onto one row */
          width:max-content;
          min-width:100%;
          padding-right:4%;
          
        }

        .ef-name-col{
          flex:0 0 auto;
          min-width:0;
          position:relative; /* anchor for the badge */
          padding:0px 30px;
        }

        .ef-eyebrow{
          display:flex;
          align-items:center;
          gap:0.7rem;
          font-size:0.72rem;
          letter-spacing:0.32em;
          text-transform:uppercase;
          color:var(--ivory-dim);
          margin-bottom:1.1rem;
        }
        .ef-eyebrow .ef-dot{
          width:5px;height:5px;border-radius:50%;
          background:var(--brass);
          box-shadow:0 0 8px 1px rgba(200,168,102,0.6);
        }

        .ef-name{
          margin:0;
          font-family:Georgia,"Cormorant Garamond",serif;
          font-weight:600;
          line-height:0.95;
          font-size:clamp(3.4rem,5.2vw,7rem);
          letter-spacing:0.04em;
         
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
          white-space:nowrap;
          position:relative;
          z-index:2; /* name sits ABOVE the badge */
        }

        /* Rotating curved-text badge, parked at the end of the name,
           overlapping it by exactly 25% of the badge's own width. */
        .ef-badge{
          position:absolute;
          top:50%;
          left:100%;
          width:clamp(5rem, 7vw, 8rem);
          height:clamp(5rem, 7vw, 8rem);
          transform:translate(-25%, -50%);
          z-index:1; /* behind the name */
          pointer-events:none;
          animation:ef-spin 14s linear infinite;
        }

       
        .ef-badge svg{ width:100%; height:100%; overflow:visible; }
        .ef-badge text{
          font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;
          font-size:8.6px;
          letter-spacing:0.15em;
          fill:var(--brass);
          text-transform:uppercase;
        }
        .ef-badge .ef-badge-dot{
          fill:var(--brass);
        }

        @keyframes ef-spin{
          from{ transform:translate(-25%, -50%) rotate(0deg); }
          to{ transform:translate(-25%, -50%) rotate(360deg); }
        }

        .ef-contact-col{
          flex:0 0 auto;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:1.4rem;
        }

        .ef-resume{
          display:inline-flex;
          align-items:center;
          gap:0.6rem;
          padding:0.8rem 1.5rem;
          border:1px solid var(--brass-dim);
          border-radius:999px;
          color:var(--ivory);
          text-decoration:none;
          font-size:0.78rem;
          letter-spacing:0.06em;
          text-transform:uppercase;
          font-weight:400;
          white-space:nowrap;
          transition:border-color .35s ease, background .35s ease, color .35s ease, transform .35s ease;
        }
        .ef-resume svg{ width:13px; height:13px; stroke:var(--brass); transition:stroke .35s ease; }
        .ef-resume:hover{
          background:var(--brass);
          border-color:var(--brass);
          color:#0b0a08;
          transform:translateY(-2px);
        }
        .ef-resume:hover svg{ stroke:#0b0a08; }

        .ef-email{
          display:inline-flex;
          align-items:baseline;
          color:var(--ivory-dim);
          text-decoration:none;
          font-size:0.9rem;
          font-weight:300;
          letter-spacing:0.01em;
          white-space:nowrap;
          position:relative;
          padding-bottom:2px;
        }
        .ef-email::after{
          content:"";
          position:absolute;
          left:0; bottom:0;
          width:100%; height:1px;
          background:var(--brass-dim);
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .4s ease, background .4s ease;
        }
        .ef-email:hover{ color:var(--ivory); }
        .ef-email:hover::after{ transform:scaleX(1); background:var(--brass); }

        .ef-social-col{
          flex:0 0 auto;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:0.9rem;
        }

        .ef-social-heading{
          font-size:0.72rem;
          letter-spacing:0.28em;
          text-transform:uppercase;
          color:var(--ivory-dim);
          padding-bottom:0.7rem;
          border-bottom:1px solid var(--hairline);
          width:100%;
          white-space:nowrap;
        }

        .ef-socials{
          display:flex;
          align-items:center;
          gap:0.6rem;
        }
        .ef-socials a{
          width:38px;height:38px;
          display:flex;align-items:center;justify-content:center;
          border:1px solid var(--hairline);
          border-radius:50%;
          color:var(--ivory-dim);
          text-decoration:none;
          transition:border-color .35s ease, color .35s ease, transform .35s ease;
        }
        .ef-socials a svg{ width:15px; height:15px; fill:currentColor; }
        .ef-socials a:hover{
          border-color:var(--brass);
          color:var(--brass);
          transform:translateY(-3px);
        }

        .ef-bottom{
          margin-top:3.5rem;
          padding-top:1.6rem;
          border-top:1px solid var(--hairline);
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          justify-content:space-between;
          gap:1rem;
          font-size:0.76rem;
          color:#54524c;
          letter-spacing:0.02em;
        }

        .ef-totop{
          display:inline-flex;
          align-items:center;
          gap:0.5rem;
          color:#54524c;
          background:none;
          border:none;
          cursor:pointer;
          padding:0;
          font-family:inherit;
          font-size:0.76rem;
          letter-spacing:0.08em;
          text-transform:uppercase;
          transition:color .3s ease, gap .3s ease;
        }
        .ef-totop svg{ width:12px; height:12px; stroke:currentColor; transition:transform .3s ease; }
        .ef-totop:hover{ color:var(--brass); gap:0.75rem; }
        .ef-totop:hover svg{ transform:translateY(-2px); }

        @media (prefers-reduced-motion: reduce){
          .ef-resume, .ef-email::after, .ef-socials a, .ef-totop, .ef-totop svg, .ef-badge{
            transition:none !important;
            animation:none !important;
          }
        }

        .ef-root a:focus-visible, .ef-root button:focus-visible{
          outline:1px solid var(--brass);
          outline-offset:3px;
        }

        /* ============================================================
           MOBILE — everything above this point is untouched (desktop
           stays exactly as-is). Below 769px the single row becomes
           three stacked rows: name → resume/email → social, with
           sizes scaled down to fit small screens.
           ============================================================ */
        @media (max-width: 768px){
          .ef-root{
            padding:3.5rem 1.5rem 2rem;
            overflow-x:hidden;
          }

          .ef-inner{
            flex-direction:column;
            flex-wrap:wrap;
            align-items:center;
            justify-content:flex-start;
            width:100%;
            min-width:0;
            padding-right:0;
            gap:2.25rem;
          }

          /* Row 1: name */
          .ef-name-col{
            width:100%;
            display:flex;
            justify-content:center;
            padding-right:0;
          }
          .ef-name{
            font-size:clamp(2.2rem, 12vw, 3.2rem);
            white-space:normal;
            text-align:center;
          }
          .ef-badge{
            width:clamp(3.6rem, 18vw, 4.6rem);
            height:clamp(3.6rem, 18vw, 4.6rem);
          }
          .ef-badge text{ font-size:7.4px; }

          /* Row 2: resume + email */
          .ef-contact-col{
            width:100%;
            align-items:center;
            gap:1rem;
          }
          .ef-resume{
            padding:0.7rem 1.3rem;
            font-size:0.72rem;
          }
          .ef-email{
            font-size:0.82rem;
          }

          /* Row 3: social */
          .ef-social-col{
            width:100%;
            align-items:center;
            gap:0.7rem;
          }
          .ef-social-heading{
            width:auto;
            text-align:center;
            border-bottom:none;
            padding-bottom:0;
          }
          .ef-socials a{
            width:34px;height:34px;
          }
          .ef-socials a svg{ width:13px; height:13px; }

          .ef-bottom{
            margin-top:2.5rem;
            padding-top:1.25rem;
            justify-content:center;
            text-align:center;
            font-size:0.7rem;
          }
        }
      `}</style>

      <div className="ef-inner overflow-hidden py-[100px]">
        <div className="ef-name-col ">
          <h1 className="ef-name bg-[linear-gradient(to_right,#cfcfcf_20%,transparent_120%)] md:bg-[linear-gradient(to_right,#cfcfcf_10%,transparent_100%)]">{CONTENT.firstName} {CONTENT.lastName}</h1>

          
          <div className="ef-badge hidden md:block " >
            <svg viewBox="0 0 100 100">
              <defs>
                <path
                  id="ef-badge-circle"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text>
                <textPath href="#ef-badge-circle" startOffset="0%">
                  {CONTENT.badgeText.repeat(3)}
                </textPath>
              </text>
              <circle className="ef-badge-dot" cx="50" cy="50" r="2.4" />
            </svg>
          </div>


        </div>

        <div className="ef-contact-col py-[50px]">
          <a className="ef-resume" href={CONTENT.resumeHref} download>
            Resume
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13m0 0l-4-4m4 4l4-4" />
              <path d="M5 19h14" />
            </svg>
          </a>
          <a className="ef-email" href={`mailto:${CONTENT.email}`}>
            {CONTENT.email}
          </a>
        </div>

        <div className="ef-social-col">
          <span className="ef-social-heading">Social</span>
          <div className="ef-socials" aria-label="Social links">
            {CONTENT.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <svg viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}