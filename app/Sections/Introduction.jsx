"use client";

import Image from "next/image";
import { useState,useRef,useEffect } from "react";
import PetrovaLines from "../Components/PetrovaLines";
import CurvedText from "../Components/CurvedText";



export  function MusicCard({
  src,
  bgImage,
  heading,
  setCurrentSong,
  setPlay,
  className = "",
}) {
  const handleClick = () => {
    setCurrentSong(src);
    setPlay(true);
  };

  return (
<div
  onClick={handleClick}
  className={`
    absolute
    w-[150px]
    h-[150px]
    rounded-[25px]
    overflow-hidden
    cursor-pointer

    opacity-0
    scale-0

    group-hover:opacity-100
    group-hover:scale-100

    transition-all
    duration-300

    ${className}
  `}
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",

    boxShadow: `
      inset 8px 8px 15px rgba(0, 0, 0, 0.35),
      inset -10px -14px 15px rgba(0, 0, 0, 0.86)
    `,
  }}
>
  <div className="absolute inset-0 bg-black/10" />

  <div className="absolute inset-0 flex items-end justify-center z-10">
    <h3
      className=" pointer-events-none
        text-white
        text-[18px]
        font-medium
        tracking-[2px]
        text-center
        pb-2
        drop-shadow-lg
      "
    >
      {heading}
    </h3>
  </div>
</div>
  );
}





export default function Introduction()
{


  const [wordChange,setWordChange]=useState(false);

  const [play, setPlay] = useState(true);

  const [currentSong, setCurrentSong] = useState(
    "/Assets/mp3/glorious-purpose.mp3"
  );

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

          




        <div className="text-[#C4C4C4] items-center flex justify-center mb-[20%]">
            
            <h3 className="text-4xl mt-[20%] bree-serif-regular  w-[900px] text-center">
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

          <div className="relative my-[10%] w-full h-[150px] items-center flex">
               


              <div className="absolute left-[20%]  -translate-x-1/2 w-[250px] h-[250px]">

                  <CurvedText
                    text=" ✿ CAPTURE ✿ MOMENTS ✿ STORIES ✿ MEMORIES"
                    letterSpacing={3}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/Assets/Intro/camera.png"
                      width={150}
                      height={100}
                      alt="headphones"
                      className="rotate-[349deg]"
                    />
                  </div>

              </div>


              <div className="absolute left-[50%] -translate-x-1/2 w-[250px] h-[250px]">

{/* Everything controlled by headphone hover */}
<div className="absolute inset-0 flex items-center justify-center group">

  {/* Curved text */}
  <div className="
    absolute inset-0
    transition-all duration-300
    group-hover:opacity-0
    group-hover:scale-90
  ">
    <CurvedText
      text="✦ MUSIC ✦ PLAY ✦ PAUSE ✦ REWIND ✦ REPEAT"
    />
  </div>

  {/* TOP CARD */}
  <MusicCard
    src="/Assets/mp3/Sign-of-the-Times.mp3"
    bgImage="/Assets/mp3/Sign-of-the-Times-cover.png"
    heading="Sign of the Times"
    setCurrentSong={setCurrentSong}
    setPlay={setPlay}
    className="
      -top-[110px]
      left-1/2
      -translate-x-1/2
    "
  />

  {/* RIGHT CARD */}
  <MusicCard
    src="/Assets/mp3/Marakkavillayae.mp3"
    bgImage="/Assets/mp3/Marakkavillayae-cover.png"
    heading="Marakkavillayae"
    setCurrentSong={setCurrentSong}
    setPlay={setPlay}
    className="
      -right-[110px]
      top-1/2
      -translate-y-1/2
      delay-75
    "
  />

  {/* BOTTOM CARD */}
  <MusicCard
    src="/Assets/glorious-purpose.mp3"
    bgImage="/Assets/mp3/glorious-purpose-cover.png"
    heading="Purpose is Glorious"
    setCurrentSong={setCurrentSong}
    setPlay={setPlay}
    className="
      -bottom-[110px]
      left-1/2
      -translate-x-1/2
      delay-150
    "
  />

  {/* LEFT CARD */}
  <MusicCard
    src="/Assets/mp3/aaro-nenjil.mp3"
    bgImage="/Assets/mp3/aaro-nenjil-cover.png"
    heading="Aaro Nenjil"
    setCurrentSong={setCurrentSong}
    setPlay={setPlay}
    className="
      -left-[110px]
      top-1/2
      -translate-y-1/2
      delay-200
    "
  />

  {/* HEADPHONE */}
  <Image
    src="/Assets/Intro/headphone.png"
    width={150}
    height={100}
    alt="headphones"
    className="
      relative
      z-20
      rotate-[349deg]
      transition-transform
      duration-300
      group-hover:scale-105
    "
  />

</div>

</div>

              <div className=" pointer-events-none absolute left-[82%] -translate-x-1/2 w-[35vw] aspect-[4/2]">

                  {/* MP3 background */}
                  <Image
                    src="/Assets/Intro/mp3-background-1.png"
                    alt="mp3 player"
                    fill
                    className="object-contain"
                  />

                   {/* Vinyl */}
                    <Image
                      src="/Assets/Intro/vinyl-disc.png"
                      alt="vinyl disc"
                      width={150}
                      height={100}
                      className={`
                        absolute
                        left-[35%]
                        top-[15%]
                        w-[25%]
                        h-auto

                        transition-all duration-700

                        ${play ? "animate-spin" : ""}
                      `}
                    />

                    <Image
                        src="/Assets/Intro/needle.png"
                        alt="needle"
                        width={250}
                        height={100}
                        className={`
                          absolute
                          left-[44%]
                          top-[-15%]
                          w-[32.5%]
                          h-auto

                          transition-transform duration-300

                          ${play ? "rotate-10" : "-rotate-20"}
                        `}
                      />

                    {/* Pause */}
                    <Image
                      src="/Assets/Intro/pause-button.png"
                      alt="pause"
                      width={50}
                      height={100}
                      className={`
                        pointer-events-auto
                        absolute
                        left-[35%]
                        top-[73%]
                        w-[8%]
                        h-auto
                        cursor-pointer
                        ${play ? "scale-100" :  "scale-90 invert"}
                      `}
                      onClick={() => setPlay(false)}
                    />

                    {/* Play */}
                    <Image
                      src="/Assets/Intro/play-button.png"
                      alt="play"
                      width={50}
                      height={100}
                      className={`
                        pointer-events-auto
                        absolute
                        left-[44%]
                        top-[73%]
                        w-[8%]
                        h-auto
                        cursor-pointer

                        
                        transition-transform duration-200
                        ${play ? "scale-90 invert" : "scale-100"}
                      `}
                      onClick={() => setPlay(true)}
                    />
                 
                </div>
            </div>
                  
              



            

              <div className="relative z-10 flex justify-evenly mb-[100px]">
                {/* <div>
                    <Image
                        src="/Assets/bug-1.png"
                        width={100}
                        height={100}
                        alt="myself"
                        className="absolute z-20 mt-50 rotate-349 "
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
                        
                    </div> */}
                
                {/* <div>
                    <MusicPlayer className="mt-[80%]" />

                </div> */}
            </div>

            

            

            

            


          

            
      
      
    </section>
        
        </>
    )

}