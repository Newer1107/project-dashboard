// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// interface LabStatsProps {
//   images?: string[];
// }

// export default function LabStats({ images = [] }: LabStatsProps) {
//   const statsRef = useRef<HTMLElement>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const totalSlides = images.length;

//   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const prevSlideRef = useRef(0);

//   useEffect(() => {
//     let ctx = gsap.context(() => {
//       const counters = gsap.utils.toArray<HTMLElement>(".counter");
//       counters.forEach((counter) => {
//         const targetAttr = counter.getAttribute("data-target");
//         const target = targetAttr ? parseFloat(targetAttr) : 0;
//         gsap.to(counter, {
//           innerHTML: target,
//           duration: 2,
//           snap: { innerHTML: 1 },
//           ease: "power2.out",
//           scrollTrigger: { trigger: counter, start: "top 85%" },
//         });
//       });
//     }, statsRef);

//     return () => ctx.revert();
//   }, []);

//   useEffect(() => {
//     imageRefs.current.forEach((img, index) => {
//       if (img) gsap.set(img, { opacity: index === 0 ? 1 : 0 });
//     });
//   }, [images]);

//   useEffect(() => {
//     if (totalSlides <= 1) return;

//     const currentImg = imageRefs.current[prevSlideRef.current];
//     const nextImg = imageRefs.current[currentSlide];

//     if (currentSlide !== prevSlideRef.current && currentImg && nextImg) {
//       gsap.to(currentImg, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
//       gsap.to(nextImg, { opacity: 1, duration: 1.5, ease: "power2.inOut" });
//     }

//     prevSlideRef.current = currentSlide;
//   }, [currentSlide, totalSlides]);

//   const nextSlide = useCallback(() => {
//     setCurrentSlide((prev) => (prev + 1) % totalSlides);
//   }, [totalSlides]);

//   const prevSlide = useCallback(() => {
//     setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
//   }, [totalSlides]);

//   useEffect(() => {
//     if (totalSlides <= 1) return;
//     const interval = setInterval(nextSlide, 5000);
//     return () => clearInterval(interval);
//   }, [nextSlide, totalSlides]);

//   return (
//     <section
//       ref={statsRef}
//       className="px-6 md:px-20 py-16 md:py-32 max-w-7xl mx-auto"
//     >
//       <div className="mb-16">
//         <h2 className="font-monument text-3xl md:text-5xl text-[#111111] dark:text-white uppercase transition-colors duration-500">
//           Behind the Screens
//         </h2>
//         <p className="font-montreal text-gray-500 mt-4 max-w-md transition-colors duration-500">
//           The culture, the caffeine, and the raw metrics that power our college
//           labs.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto] gap-4 md:h-[600px]">
//         {/* BOX 1: BADA DIBBA (SLIDESHOW W/ ARROWS) */}
//         <div className="md:col-span-2 md:row-span-2 overflow-hidden relative group border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 h-[350px] sm:h-[400px] md:h-auto md:min-h-0 ">
//           {" "}
//           {images.length > 0 ? (
//             images.map((src, index) => (
//               <div
//                 key={src}
//                 ref={(el) => {
//                   imageRefs.current[index] = el;
//                 }}
//                 className="absolute inset-0 w-full h-full"
//               >
//                 <Image
//                   src={src}
//                   alt={`Lab photo ${index + 1}`}
//                   fill
//                   unoptimized
//                   className="object-cover object-center transition-all duration-[2000ms]"
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="absolute inset-0 flex items-center justify-center text-gray-500">
//               Drop images in public/images-rollingdisplay
//             </div>
//           )}
//           {/* ARROW CONTROLS (Hide on mobile, show on hover for desktop) */}
//           {images.length > 1 && (
//             <>
//               <button
//                 onClick={prevSlide}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
//                 aria-label="Previous image"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={nextSlide}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
//                 aria-label="Next image"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
//             </>
//           )}
//           {/* TEXT OVERLAY */}
//           <div className="absolute inset-0 bg-black/30 p-8 flex items-end z-10 pointer-events-none">
//             <p className="font-montreal text-white drop-shadow-md text-lg md:text-xl">
//               {/* Late night hackathons. <br /> */}
//               <span className="text-tcet-orange font-bold drop-shadow-lg">
//                 The culture of creation.
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* BOX 2: PROJECTS DEPLOYED */}
//         <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300  ">
//           <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
//             Projects Deployed
//           </p>
//           <h3 className="font-monument text-5xl md:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
//             <span className="counter" data-target="142">
//               0
//             </span>
//             +
//           </h3>
//         </div>

//         {/* BOX 3: ACTIVE BUILDERS */}
//         <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300  ">
//           <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
//             Active Builders
//           </p>
//           <h3 className="font-monument text-5xl md:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
//             <span className="counter" data-target="350">
//               0
//             </span>
//             +
//           </h3>
//         </div>

//         {/* BOX 4: FREELANCE PROJECTS */}
//         <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300  ">
//           <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
//             Freelance Projects
//           </p>
//           <h3 className="font-monument text-5xl md:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
//             <span className="counter" data-target="20">
//               0
//             </span>
//             +
//           </h3>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LabStatsProps {
  images?: string[];
}

export default function LabStats({ images = [] }: LabStatsProps) {
  const statsRef = useRef<HTMLElement>(null);

  // Naye refs for our two scrolling columns
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  // Agar images kam hain, toh unko multiply kar rahe hain taaki infinite scroll kabhi khatam na ho
  const safeImages = images.length > 0 ? images : ["/tcetlogo.png"];
  const scrollData = [
    ...safeImages,
    ...safeImages,
    ...safeImages,
    ...safeImages,
  ];
  // Column 2 ke liye array reverse kar diya taaki dono columns alag dikhein
  const scrollDataReversed = [...scrollData].reverse();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // ==========================================
      // 1. NUMBER COUNTERS
      // ==========================================
      const counters = gsap.utils.toArray<HTMLElement>(".counter");
      counters.forEach((counter) => {
        const targetAttr = counter.getAttribute("data-target");
        const target = targetAttr ? parseFloat(targetAttr) : 0;
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          scrollTrigger: { trigger: counter, start: "top 85%" },
        });
      });

      const col1 = col1Ref.current;
      const col2 = col2Ref.current;

      if (col1 && col2) {
        // Col 1 goes UP (yPercent: -50 means it scrolls exactly half its height, then seamlessly repeats)
        const tl1 = gsap.to(col1, {
          yPercent: -50,
          repeat: -1,
          duration: 25, // Speed of the scroll
          ease: "linear",
        });

        // Col 2 goes DOWN (Starts at -50% in CSS, tweens to 0%)
        const tl2 = gsap.to(col2, {
          yPercent: 50,
          repeat: -1,
          duration: 25,
          ease: "linear",
        });

        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            gsap.to([tl1, tl2], {
              timeScale: self.direction === 1 ? 1 : -1,
              duration: 0.5, // Smooth ease jab direction palte
              overwrite: true,
            });
          },
        });
      }
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={statsRef}
      className="px-6 md:px-20 py-16 md:py-32 max-w-7xl mx-auto"
    >
      <div className="mb-16">
        <h2 className="font-monument text-3xl md:text-5xl text-[#111111] dark:text-white uppercase transition-colors duration-500">
          Behind the Screens
        </h2>
        <p className="font-montreal text-gray-500 mt-4 max-w-md transition-colors duration-500">
          The culture, the caffeine, and the raw metrics that power our college
          labs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto] gap-4 md:h-[600px]">
        {/* ==========================================
            BOX 1: DRIBBBLE STYLE MARQUEE
            Fix: h-[450px] forcefully gives it height on mobile!
        ========================================== */}
        <div className="md:col-span-2 md:row-span-2 overflow-hidden relative group border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 h-[450px] md:h-full rounded-xl flex gap-4 p-4">
          {/* COLUMN 1: Scrolls Up */}
          <div ref={col1Ref} className="flex-1 flex flex-col gap-4 min-w-0">
            {scrollData.map((src, index) => (
              <div
                key={`col1-${index}`}
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shrink-0 shadow-sm"
              >
                <Image
                  src={src}
                  alt={`Lab photo col 1 - ${index}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* COLUMN 2: Scrolls Down (Offset in CSS by -50% so it can tween to 0) */}
          <div
            ref={col2Ref}
            className="flex-1 flex flex-col gap-4 min-w-0 -translate-y-1/2"
          >
            {scrollDataReversed.map((src, index) => (
              <div
                key={`col2-${index}`}
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shrink-0 shadow-sm"
              >
                <Image
                  src={src}
                  alt={`Lab photo col 2 - ${index}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* TEXT OVERLAY (Glassmorphism look) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex items-end z-10 pointer-events-none">
            <p className="font-montreal text-white drop-shadow-md text-lg md:text-xl">
              <span className="text-tcet-orange font-bold drop-shadow-lg">
                The culture of creation.
              </span>
            </p>
          </div>
        </div>

        {/* BOX 2: PROJECTS DEPLOYED */}
        <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300 rounded-xl">
          <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
            Projects Deployed
          </p>
          <h3 className="font-monument text-5xl md:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="142">
              0
            </span>
            +
          </h3>
        </div>

        {/* BOX 3: ACTIVE BUILDERS */}
        <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300 rounded-xl">
          <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
            Active Builders
          </p>
          <h3 className="font-monument text-5xl md:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="350">
              0
            </span>
            +
          </h3>
        </div>

        {/* BOX 4: FREELANCE PROJECTS */}
        <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300 rounded-xl">
          <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
            Freelance Projects
          </p>
          <h3 className="font-monument text-5xl md:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="20">
              0
            </span>
            +
          </h3>
        </div>
      </div>
    </section>
  );
}
