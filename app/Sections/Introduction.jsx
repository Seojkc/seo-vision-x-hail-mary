"use client";

import Image from "next/image";
import { useState,useRef,useEffect } from "react";
import PetrovaLines from "../Components/PetrovaLines";


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





export default function Introduction()
{


  const [wordChange,setWordChange]=useState(false);

  useEffect(
    ()=>{
      const interval = setInterval(()=>{ setWordChange((prep)=>!prep)},1500);

      return () => clearInterval(interval);
    },[]);


    return(
        <>
        
        <section
        className="relative w-full h-auto overflow-hidden border-top-cardboard"
        style={{
            backgroundColor: "rgb(12, 12, 12)",
            backgroundImage: `
              linear-gradient(to right, rgba(200, 200, 200, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(200, 200, 200, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "98px 98px",
        }}
        >
          <div className="relative z-10 text-[#218a13]">
            <PetrovaLines lineCount={8} starCount={40} />
          </div>

           <div className="pointer-events-none absolute inset-0 z-0">
            <div
              className="absolute inset-x-0 top-0 h-400"
              style={{ background: "linear-gradient(to bottom,rgb(12, 12, 12), transparent 30%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-400"
              style={{ background: "linear-gradient(to right,rgb(12, 12, 12), transparent 30%)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-400"
              style={{ background: "linear-gradient(to left,rgb(12, 12, 12), transparent 30%)" }}
            />
          </div>

          <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-300 "
          style={{
            background: "linear-gradient(to top,rgb(12, 12, 12), transparent 30%)",
          }}
        />

          


            <p className="relative z-10 text-[#218a13] mt-23 ml-10 font-section-underline">
            _// Section One : Introduction //_
              </p>            
              <div className="relative z-10 flex justify-evenly mb-[100px]">
                <div>
                    <Image
                        src="/Assets/bug-1.png"
                        width={100}
                        height={100}
                        alt="myself"
                        className="absolute z-20 mt-50 rotate-349 "
                        />
                        <Image
                        src="/Assets/headphone.png"
                        width={100}
                        height={100}
                        alt="myself"
                        className="absolute z-20  mt-[5%] ml-[15%]   rotate-349 "
                        />
                        <Image
                        src="/Assets/camera-sticker.png"
                        width={180}
                        height={100}
                        alt="myself"
                        className="absolute z-20   mt-[35%]  rotate-349 "
                        />
                        <Image
                        src="/Assets/sun-sticker.png"
                        width={150}
                        height={100}
                        alt="myself"
                        className="absolute mt-[30%] ml-[15%] z-20  rotate-349 "
                        />
                    <Image
                        src="/Assets/myself-1.png"
                        width={400}
                        height={100}
                        alt="myself"
                        className="z-10 mt-[50%]  rotate-349 "
                        />
                        
                    </div>
                <div className="text-[#C4C4C4]">
                    
                <h3 className="text-4xl mt-[30%] bree-serif-regular  w-[900px] text-center">
                  Hi, I'm <span className="text-6xl">Seo James</span>, a passionate

                  <span className="inline-flex perspective align-middle mx-2">
                    <span
                      className="relative inline-block w-[220px]  preserve-3d transition-transform duration-700"
                      style={{
                        transform: wordChange ? "rotateX(180deg)" : "rotateX(0deg)",
                      }}
                    >
                      {/* Developer */}
                      <span
                        className="absolute inset-0 flex items-center justify-center "
                        style={{
                          transform: "translateZ(30px)",
                          backfaceVisibility:"hidden"
                        }}
                      >
                        Developer
                      </span>

                      {/* Designer */}
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: "rotateX(180deg) translateZ(30px)",
                           backfaceVisibility:"hidden"
                        }}
                      >
                        Designer
                      </span>
                    </span>
                  </span>

                   who builds things with purpose, curiosity, and a love for making ideas real.
                  
                  </h3>
                </div>
                <div>
                    <MusicPlayer className="mt-[80%]" />

                </div>
            </div>

            

            

            

            


          

            
      
      
    </section>
        
        </>
    )

}