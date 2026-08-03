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

            <p className="text-[#DBDBDB]  mt-30 ml-10  font-section-underline">_// Section One : Introduction //_</p>
            <div className="flex justify-evenly mb-[100px]">
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

            

            

            

            


          

            
      
      
    </section>
        
        </>
    )

}