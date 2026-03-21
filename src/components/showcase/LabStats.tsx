"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LabStats() {
  // 1. Typed the ref as an HTMLElement
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 2. Typed the GSAP array to explicitly expect HTMLElements
      const counters = gsap.utils.toArray<HTMLElement>(".counter");

      counters.forEach((counter) => {
        // 3. Added null safety for the data attribute
        const targetAttr = counter.getAttribute("data-target");
        const target = targetAttr ? parseFloat(targetAttr) : 0;

        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
          },
        });
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    // Changed to <section> since we typed the ref as HTMLElement (or you can use HTMLDivElement if you change this to a div)
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

      {/* BENTO BOX GRID */}
      {/* ... (keep your existing imports and useEffect) ... */}

      {/* BENTO BOX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto] gap-4 md:h-150">
        {/* Box 1: Large Stat - Swapped to Projects Deployed for more impact */}
        <div className="md:col-span-2 md:row-span-2 bg-black/5 dark:bg-white/5 p-8    flex flex-col justify-end border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300">
          <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
            Projects Deployed
          </p>
          <h3 className="font-monument text-[80px] md:text-[120px] leading-none text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="142">
              0
            </span>
            +
          </h3>
        </div>

        {/* Box 2: Image Reveal - (Keep this exactly as is) */}
        <div className="md:col-span-2 h-75 md:h-auto    overflow-hidden relative group">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
            alt="Students working"
            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-black/40 p-8 flex items-end">
            <p className="font-montreal text-white text-lg">
              Late night hackathons. 3AM deploys.
            </p>
          </div>
        </div>

        {/* Box 3: Small Stat - Focus on Community */}
        <div className="bg-black/5 dark:bg-white/5 p-8    flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300">
          <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
            Active Builders
          </p>
          <h3 className="font-monument text-5xl text-[#111111] dark:text-white transition-colors duration-500">
            <span className="counter" data-target="350">
              0
            </span>
            +
          </h3>
        </div>

        {/* Box 4: Small Stat - The Culture Metric */}
        <div className="bg-black/5 dark:bg-white/5 p-8    flex flex-col justify-end border border-black/10 dark:border-white/10 transition-colors duration-300">
          <p className="font-montreal text-sm text-gray-500 uppercase tracking-widest mb-2">
            Freelance Projects
          </p>
          <h3 className="font-monument text-5xl text-[#111111] dark:text-white transition-colors duration-500">
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
