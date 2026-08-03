"use client";

import Image from "next/image";
import { useState,useRef,useEffect } from "react";

function MusicPlayer(props) {
  
  const [playing, setPlaying] = useState(false);
  const vinylImage = "/Assets/music-player1.png";

  const audioRef = useRef(null);

    useEffect(() => {
    audioRef.current = new Audio("/Assets/Sign_of_the_Times.mpeg");
    }, []);

    const handlePlay = () => {
        if (!playing) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      
        setPlaying(!playing);
      };
  
  return (
    <div className={props.className}>
      <div className="bg-[#1f1f1f]  rounded-[40px] p-5 w-65 text-center shadow-2xl">
        <div className="w-48 h-48 mt-5 mx-auto mb-6 rounded-full overflow-hidden">
          <img
            src={vinylImage}
            alt="Vinyl record"
            className={`w-full h-full object-cover transition-transform ${
              playing ? "animate-spin-slow" : ""
            }`}
          />
        </div>
 
        <p className="text-white text-[20px] text-left mt-15 mb-1">
          Sign of Times
        </p>
 
        <p className="text-left text-[14px] ">Project Hail Mary</p>
 
        <div>
          <button
            onClick={handlePlay}
            className="w-15 h-15 russo-one-regular  rounded-full  flex items-center justify-center mx-auto mt-5"
          >
            {playing ? (
              <span className="text-white text-[30px]">&#10074;&#10074;</span>
            ) : (
              <span className="text-white text-[30px]">&#9654;</span>
            )}
          </button>
        </div>
      </div>
 
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}



function SkillsMarquee() {
    const skills = [
        "Creative",
        "Innovative",
        "Adaptive",
        "Curious",
        "Strategic",
        "Aesthetic",
        "Explorative",
      ];
     
      // Repeat the base list so one "set" is wider than the strip itself —
      // that's what keeps the loop from ever showing a blank gap.
      const REPEAT = 4;
      const baseSet = Array.from({ length: REPEAT }, () => skills).flat();
      const loopItems = [...baseSet, ...baseSet];
     
      const trackRef = useRef(null);
      const offset = useRef(0);
      const halfWidth = useRef(0);

      const position = useRef(0);
      const velocity = useRef(1); // base speed

      const lastScrollY = useRef(0);
      const boost = useRef(0);


      useEffect(() => {

        let frameId;
      
        function animate() {
      
          position.current += velocity.current + boost.current;
      
          boost.current *= 0.94; // smooth decay
      
          if (trackRef.current) {
      
            const halfWidth =
              trackRef.current.scrollWidth / 2;
      
            if (position.current >= halfWidth) {
              position.current -= halfWidth;
            }
      
            trackRef.current.style.transform =
              `translateX(-${position.current}px)`;
          }
      
          frameId = requestAnimationFrame(animate);
        }
      
        animate();
      
        return () => cancelAnimationFrame(frameId);
      
      }, []);

      useEffect(() => {

        lastScrollY.current = window.scrollY;
      
        function handleScroll() {
      
          const currentY = window.scrollY;
      
          const delta =
            Math.abs(currentY - lastScrollY.current);
      
          lastScrollY.current = currentY;
      
          boost.current += delta * 0.03;
        }
      
        window.addEventListener("scroll", handleScroll);
      
        return () =>
          window.removeEventListener("scroll", handleScroll);
      
      }, []);

     
      return (
        <>

        <div className="relative w-full p-[20px] pt-[100px] ">
          <div className="absolute mt-8 inset-0 flex items-center justify-center">
            <div style={{ transform: "rotate(0deg)" }}>
              <div className=" overflow-hidden">
                <div ref={trackRef} className="flex w-max flex-nowrap animate-marquee-left" >
                  {loopItems.map((skill, i) => (
                    <span
                      key={i}
                      className="mx-8 flex items-center  flex-shrink-0"
                    >
                      <span className="text-[#DBDBDB] text-6xl md:text-8xl font-black uppercase tracking-tight">
                        {skill}
                      </span>
                    
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        



        </>
        
      );
  }




export default function Introduction()
{
    return(
        <>
        
        <section
        className="relative w-full h-auto overflow-hidden border-top-cardboard"
        style={{
            backgroundColor: "rgb(12, 12, 12)",
            backgroundImage: "radial-gradient(circle,rgba(49, 49, 49, 0.64) 1px, transparent 0.5px)",
            backgroundSize: "18px 18px",
        }}
        >

            <p className="text-[#DBDBDB]  mt-14 ml-10">- Section One : Introduction</p>
            <div className="flex justify-evenly">
                <div>
                    <Image
                        src="/Assets/myself-1.png"
                        width={400}
                        height={100}
                        alt="myself"
                        className="z-10 mt-[50%]  rotate-349 "
                        />
                    </div>
                <div className="text-[#C4C4C4]">
                    <h1 className="text-4xl font-bold  mt-[20%]  russo-one-regular">
                        Hi, I'm <span className="text-6xl">Seo James</span>
                    </h1>
                    <h3 className="text-4xl mt-[10%]  russo-one-regular w-200 text-justify ">
                    I am passionate about creating digital experiences that inspire, engage, 
                    and solve real-world problems. My approach blends thoughtful design, modern
                    development practices, and a constant drive to innovate. I strive to build 
                    products that not only work exceptionally well but also leave a lasting impression.
                    </h3>
                </div>
                <div>
                    <MusicPlayer className="mt-[80%]" />

                </div>
            </div>

            <div className="mt-40 mb-20">
                <SkillsMarquee/>

            </div>

            <div className="flex mt-[20%] mb-[20%]">

                <Image
                width={350}
                height={200}
                alt="grace-suit"
                src="/Assets/grace-suit.png"
                className="ml-[10%]"
                />
                <Image
                width={400}
                height={200}
                alt="grace-suit"
                src="/Assets/space-door.png"
                className="right-[0%] absolute"
                />

            </div>

            

            


          

            
      
      
    </section>
        
        </>
    )

}