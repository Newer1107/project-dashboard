// components/showcase/AnimatedShowcase.tsx
"use client";

import Link from "next/link";
import Magnetic from "@/components/ui/Magnetic"; // Adjust path if needed
import { SplineScene } from "@/components/ui/splite";

// --- MAIN SHOWCASE COMPONENT ---
export default function AnimatedShowcase({ projects }: { projects: any[] }) {
  const displayProjects = projects?.length > 0 ? projects : [];

  return (
    <div className="text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 lg:py-24 max-w-7xl mx-auto min-h-[55vh] lg:min-h-[85vh] flex items-center justify-center">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] gap-8 sm:gap-10 lg:gap-16 items-center w-full">
          <div className="w-full z-10 text-center lg:text-left">
            <h1 className="font-monument font-extralight text-[clamp(2.7rem,7vw,6.5rem)] leading-[0.92] tracking-tighter break-words">
              EVERY <br /> PROJECT MATTERS.
            </h1>
            <p className="font-montreal text-gray-500 dark:text-gray-400 mt-5 sm:mt-6 mx-auto lg:mx-0 max-w-[44ch] text-[clamp(0.98rem,1.25vw,1.22rem)] leading-relaxed">
              A collection of digital products and systems designed with a focus
              on performance, structure and clarity by the students of TCET.
            </p>
          </div>
          <div className="relative w-full max-w-[520px] aspect-[4/5] min-h-[320px] sm:min-h-[380px] lg:min-h-0 overflow-hidden rounded-3xl border border-black/15 dark:border-white/10 bg-[#1a1f2e] dark:bg-[#0e1117]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="h-full w-full saturate-[0.10] contrast-[0.95] hue-rotate-[200deg]"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>
        </div>
      </section>

      {/* 2. PROJECT GRID REEL */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-20 py-8 sm:py-16 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
          {displayProjects.map((p, i) => {
            // DYNAMIC IMAGE LOGIC
            const preview = (p.assets ?? [])[0];
            const projectImage = preview?.accessUrl || preview?.fileUrl || "";

            return (
              <div
                key={p.id || i}
                className="group flex flex-col bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {/* CARD IMAGE CONTAINER */}
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-900">
                  {projectImage ? (
                    <img
                      src={projectImage}
                      alt={p.title}
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    // Fallback gradient if no image is available
                    <div className="w-full h-full bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.35),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.4),transparent_36%),linear-gradient(160deg,#0f172a,#020617)]" />
                  )}
                  {/* Subtle dark overlay that lifts on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <div className="flex-1">
                    <h2 className="font-monument text-lg sm:text-xl uppercase tracking-tight line-clamp-2 mb-4">
                      {p.title}
                    </h2>
                  </div>

                  {/* VIEW WORK BUTTON (Pushed to bottom using mt-auto from flex-1 above) */}
                  <div className="mt-4 w-full">
                    <Magnetic>
                      <Link
                        href={`/showcase/${p.slug || p.id}`}
                        className="flex justify-center items-center w-full border border-black/10 dark:border-white/20 px-6 py-3 font-montreal text-xs font-semibold tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                      >
                        VIEW WORK
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
