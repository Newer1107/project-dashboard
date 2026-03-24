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
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  // --- FIX 1: MASSIVE ARRAY PADDING ---
  // If you only pass 3 images, the container might be taller than the images.
  // We repeat the base images several times to create one very long list,
  // then duplicate THAT list exactly once to make the -50% loop trick bulletproof.
  const baseImages = images.length > 0 ? images : ["/tcetlogo.png"];
  const longSet = [...baseImages, ...baseImages, ...baseImages, ...baseImages];

  const scrollData = [...longSet, ...longSet];
  const scrollDataReversed = [...longSet].reverse();
  const reversedScrollData = [...scrollDataReversed, ...scrollDataReversed];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. NUMBER COUNTERS (Unchanged, works perfectly)
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

      // 2. BULLETPROOF INFINITE SCROLL
      const col1 = col1Ref.current;
      const col2 = col2Ref.current;

      if (col1 && col2) {
        // --- FIX 2: PURE LINEAR LOOP ---
        // Removed the ScrollTrigger direction-flipper that was causing it to stall.
        // It now just runs endlessly without interruption.

        gsap.to(col1, {
          yPercent: -50,
          repeat: -1,
          duration: 15, // Speed of column 1 (higher = slower)
          ease: "none",
        });

        gsap.fromTo(
          col2,
          { yPercent: -50 },
          {
            yPercent: 0,
            repeat: -1,
            duration: 15, // Must match col1 duration
            ease: "none",
          },
        );
      }
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={statsRef}
      className="px-6 md:px-20 py-16 md:py-32 max-w-7xl mx-auto"
    >
      <div className="mb-8 sm:mb-12 md:mb-16">
        <h2 className="font-monument text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] dark:text-white uppercase transition-colors duration-500">
          Behind the Screens
        </h2>
        <p className="font-montreal text-gray-500 mt-4 max-w-md transition-colors duration-500">
          The culture, the caffeine, and the raw metrics that power our college
          labs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto] gap-4 md:h-[600px]">
        {/* ==========================================
            BOX 1: TRUE INFINITE MARQUEE
        ========================================== */}
        <div className="md:col-span-2 md:row-span-2 overflow-hidden relative group border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 h-[300px] sm:h-[350px] md:h-full rounded-xl flex gap-2 sm:gap-4 p-2 sm:p-4">
          {/* COLUMN 1: Scrolls Up (-50%) */}
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

          {/* COLUMN 2: Scrolls Down (From -50% to 0%) */}
          <div ref={col2Ref} className="flex-1 flex flex-col gap-4 min-w-0">
            {reversedScrollData.map((src, index) => (
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

          {/* TEXT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 sm:p-8 flex items-end z-10 pointer-events-none">
            <p className="font-montreal text-white drop-shadow-md text-base sm:text-lg md:text-xl">
              <span className="text-tcet-orange font-bold drop-shadow-lg">
                The culture of creation.
              </span>
            </p>
          </div>
        </div>

        {/* BOX 2: PROJECTS DEPLOYED */}
        <div className="bg-black/5 dark:bg-white/5 p-3 sm:p-4 md:p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300 rounded-xl">
          <p className="font-montreal text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-widest mb-2">
            Projects Deployed
          </p>
          <h3 className="font-monument text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="142">
              0
            </span>
            +
          </h3>
        </div>

        {/* BOX 3: ACTIVE BUILDERS */}
        <div className="bg-black/5 dark:bg-white/5 p-3 sm:p-4 md:p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300 rounded-xl">
          <p className="font-montreal text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-widest mb-2">
            Active Builders
          </p>
          <h3 className="font-monument text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="350">
              0
            </span>
            +
          </h3>
        </div>

        {/* BOX 4: FREELANCE PROJECTS */}
        <div className="bg-black/5 dark:bg-white/5 p-3 sm:p-4 md:p-8 flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300 rounded-xl">
          <p className="font-montreal text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-widest mb-2">
            Freelance Projects
          </p>
          <h3 className="font-monument text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111111] dark:text-white transition-colors duration-500">
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
