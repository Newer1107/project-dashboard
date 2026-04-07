// components/showcase/AnimatedShowcase.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- MAIN SHOWCASE COMPONENT ---
export default function AnimatedShowcase({ projects }: { projects: any[] }) {
  const displayProjects = projects?.length > 0 ? projects : [];

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const maskTextGroupRef = useRef<SVGGElement>(null);
  const overlayRef = useRef<SVGRectElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const textBgWashRef = useRef<HTMLDivElement>(null); // NEW: Readability wash ref

  // 1. SMOOTH SCROLL SETUP (Lenis + GSAP Sync)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // 2. GSAP ANIMATIONS
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200vh",
          scrub: 1,
          pin: true,
        },
      });

      // Dive through the text
      tl.to(
        maskTextGroupRef.current,
        {
          scale: 120,
          transformOrigin: "50% 50%",
          ease: "power2.inOut",
        },
        0,
      )
        // Fade out the mask completely
        .to(
          overlayRef.current,
          {
            opacity: 0,
            ease: "power2.in",
          },
          0.6,
        )
        // NEW: Fade in the readability blur & gradient ONLY after the dive clears
        .to(
          textBgWashRef.current,
          {
            opacity: 1,
            ease: "power2.inOut",
            duration: 1,
          },
          0.6,
        )
        // Slide up the fully integrated text
        .fromTo(
          heroContentRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 1 },
          0.8,
        );
    },
    { scope: containerRef },
  );

  return (
    <div className="text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 w-full overflow-x-hidden bg-white dark:bg-[#050505]">
      {/* ========================================
          1. CINEMATIC HERO DIVE
          ======================================== */}
      <section
        ref={containerRef}
        className="relative h-screen w-full bg-white dark:bg-[#050505]"
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* BASE IMAGE (z-0) */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/tcetimage.png"
              alt="TCET campus building"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-105"
            />
          </div>

          {/* DYNAMIC READABILITY WASH (z-10) - Starts transparent, fades in with text */}
          <div
            ref={textBgWashRef}
            className="absolute inset-0 z-10 opacity-0 pointer-events-none"
          >
            {/* Soft full-screen blur to push the building back */}
            <div className="absolute inset-0 bg-white/40 dark:bg-black/50 backdrop-blur-[8px] transition-colors duration-500" />
            {/* Taller gradient to perfectly contrast the text */}
            <div className="absolute inset-x-0 bottom-0 h-[85vh] bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#050505] dark:via-[#050505]/95 transition-colors duration-500" />
          </div>

          {/* SVG MASK OVERLAY (z-20) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="dive-mask">
                <rect width="100%" height="100%" fill="white" />
                <g ref={maskTextGroupRef}>
                  <text
                    x="50%"
                    y="28%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="black"
                    className="font-monument font-black text-[clamp(4rem,14vw,16rem)] tracking-tight"
                  >
                    EVERY
                  </text>
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="black"
                    className="font-monument font-black text-[clamp(4rem,14vw,16rem)] tracking-tight"
                  >
                    PROJECT
                  </text>
                  <text
                    x="50%"
                    y="72%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="black"
                    className="font-monument font-black text-[clamp(4rem,14vw,16rem)] tracking-tight"
                  >
                    MATTERS.
                  </text>
                </g>
              </mask>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <g ref={overlayRef} className="transition-colors duration-500">
              <rect
                width="100%"
                height="100%"
                className="fill-[#fafafa] dark:fill-[#050505]"
                mask="url(#dive-mask)"
              />
              <rect
                width="100%"
                height="100%"
                fill="url(#grid)"
                mask="url(#dive-mask)"
              />
            </g>
          </svg>

          {/* REVEALED CONTENT (z-30) */}
          <div className="absolute inset-0 z-30 flex flex-col justify-end px-6 sm:px-10 lg:px-20 pb-16 lg:pb-24 pointer-events-none">
            <div
              ref={heroContentRef}
              className="w-full max-w-5xl pointer-events-auto opacity-0"
            >
              <p className="font-montreal text-xs sm:text-sm uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-400 font-bold mb-4 drop-shadow-sm">
                TCET Research Culture Development Cell
              </p>
              <h1 className="font-monument text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm">
                Building India's Next <br className="hidden lg:block" />{" "}
                Research Breakthroughs.
              </h1>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <p className="max-w-2xl font-montreal text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed text-slate-700 dark:text-slate-200">
                  A future-forward academic ecosystem where engineering rigor,
                  publication excellence, and innovation programs converge to
                  shape impactful technology for society.
                </p>

                <div className="flex flex-wrap gap-4 shrink-0">
                  <Magnetic>
                    <Link
                      href="https://coe.raunakcodes.me/"
                      className="flex items-center justify-center rounded-full bg-slate-900 dark:bg-white px-8 py-4 font-montreal text-sm font-bold text-white dark:text-black transition-transform hover:scale-105"
                    >
                      Explore Centre Of Excellence
                    </Link>
                  </Magnetic>
                  <Link
                    href="/majorprojects"
                    className="flex items-center justify-center rounded-full border border-slate-300 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-md px-8 py-4 font-montreal text-sm font-medium text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    View Publications
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-12 sm:gap-20 pt-10 mt-10 border-t border-slate-300/60 dark:border-white/10">
                <div>
                  <p className="font-monument text-3xl sm:text-4xl text-slate-900 dark:text-white">
                    45+
                  </p>
                  <p className="font-montreal text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-2 font-medium">
                    Funded Tracks
                  </p>
                </div>
                <div>
                  <p className="font-monument text-3xl sm:text-4xl text-slate-900 dark:text-white">
                    120+
                  </p>
                  <p className="font-montreal text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-2 font-medium">
                    Researchers
                  </p>
                </div>
                <div>
                  <p className="font-monument text-3xl sm:text-4xl text-cyan-600 dark:text-cyan-400">
                    18
                  </p>
                  <p className="font-montreal text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-2 font-medium">
                    Collaborations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          2. PROJECT GRID REEL
          ======================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-20 py-8 sm:py-16 mb-24 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
          {displayProjects.map((p, i) => {
            const preview = (p.assets ?? [])[0];
            const projectImage = preview?.accessUrl || preview?.fileUrl || "";

            return (
              <div
                key={p.id || i}
                className="group flex flex-col bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-900">
                  {projectImage ? (
                    <img
                      src={projectImage}
                      alt={p.title}
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.35),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.4),transparent_36%),linear-gradient(160deg,#0f172a,#020617)]" />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <div className="flex-1">
                    <h2 className="font-monument text-lg sm:text-xl uppercase tracking-tight line-clamp-2 mb-4">
                      {p.title}
                    </h2>
                  </div>

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
