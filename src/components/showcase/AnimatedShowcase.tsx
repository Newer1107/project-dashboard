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
  const heroImageRef = useRef<HTMLDivElement>(null);
  const maskTextGroupRef = useRef<SVGGElement>(null);
  const maskLineRefs = useRef<Array<SVGTextElement | null>>([]);
  const maskSvgRef = useRef<SVGSVGElement>(null);
  const overlayRef = useRef<SVGRectElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const textBgWashRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // 1. SMOOTH SCROLL SETUP (Lenis + GSAP Sync)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
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

  // Replace the GSAP animations section with this improved version:

  useGSAP(
    () => {
      const [lineOne, lineTwo, lineThree] = maskLineRefs.current;
      if (!lineOne || !lineTwo || !lineThree) return;

      // ==========================================
      // IMPROVED RESPONSIVE MATH
      // ==========================================
      const isDesktop = window.innerWidth >= 768;
      const isMobile = window.innerWidth < 768;

      // Better mobile positioning - move text higher up and tighter spacing
      const textCenterY = isDesktop ? 640 : 420; // Much higher on mobile
      const textGap = isDesktop ? 180 : 85; // Tighter spacing on mobile

      // Set the Y coordinates directly via GSAP
      gsap.set(lineOne, { attr: { y: textCenterY - textGap } });
      gsap.set(lineTwo, { attr: { y: textCenterY } });
      gsap.set(lineThree, { attr: { y: textCenterY + textGap } });

      gsap.set(heroContentRef.current, { opacity: 0, y: 80 });
      gsap.set(maskSvgRef.current, { opacity: 1, filter: "blur(0px)" });
      gsap.set(maskTextGroupRef.current, {
        transformBox: "view-box",
        transformOrigin: "50% 50%",
        x: 0,
        y: 0,
      });
      gsap.set([lineOne, lineTwo, lineThree], { x: 0, y: 0, rotation: 0 });

      // Gentle bounce animation for the scroll helper
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 1.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // CRITICAL FIX: Much longer scroll distance on mobile
          end: isMobile ? "+=800vh" : "+=400vh", // Double the scroll distance on mobile
          scrub: isMobile ? 2.5 : 1.5, // Slower scrub on mobile for more control
          pin: true,
        },
      });

      // Immediately fade out the scroll indicator on scroll
      tl.to(
        scrollIndicatorRef.current,
        { opacity: 0, duration: 0.05, ease: "power2.out" },
        0,
      );

      // Camera settles slightly while text rushes toward the viewer.
      tl.fromTo(
        heroImageRef.current,
        { scale: 1.22, yPercent: 2 },
        { scale: 1.02, yPercent: -1, ease: "none" },
        0,
      )
        .to(
          maskTextGroupRef.current,
          {
            // Reduced scale on mobile so text doesn't get too big
            scale: isMobile ? 120 : 165,
            opacity: 0.78,
            svgOrigin: `960 ${textCenterY}`,
            ease: "power3.in",
          },
          0,
        )
        // Peeling text effect - start later on mobile for better pacing
        .to(
          lineOne,
          {
            x: isMobile ? -25 : -40,
            y: isMobile ? -5 : -8,
            rotation: -2,
            transformOrigin: "50% 50%",
            ease: "power2.inOut",
          },
          isMobile ? 0.25 : 0.14,
        )
        .to(
          lineTwo,
          {
            x: isMobile ? 22 : 36,
            y: isMobile ? 4 : 6,
            rotation: 1.4,
            transformOrigin: "50% 50%",
            ease: "power2.inOut",
          },
          isMobile ? 0.25 : 0.14,
        )
        .to(
          lineThree,
          {
            x: isMobile ? -20 : -32,
            y: isMobile ? 4 : 7,
            rotation: -1.6,
            transformOrigin: "50% 50%",
            ease: "power2.inOut",
          },
          isMobile ? 0.25 : 0.14,
        )
        .to(
          maskSvgRef.current,
          { filter: "blur(9px)", ease: "power2.in" },
          isMobile ? 0.55 : 0.42,
        )
        .to(
          overlayRef.current,
          { opacity: 0, ease: "power2.out", duration: 0.75 },
          isMobile ? 0.65 : 0.52,
        )
        .to(
          maskSvgRef.current,
          { opacity: 0, ease: "power2.out", duration: 0.65 },
          isMobile ? 0.75 : 0.64,
        )
        .to(
          textBgWashRef.current,
          { opacity: 0.95, ease: "power2.inOut", duration: 0.9 },
          isMobile ? 0.8 : 0.7,
        )
        .fromTo(
          heroContentRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 1 },
          isMobile ? 0.95 : 0.9,
        );
    },
    { scope: containerRef },
  );

  return (
    <div className="text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 w-full overflow-x-hidden bg-white dark:bg-[#050505]">
      {/* Reverted to h-screen to fix mobile address-bar jitter */}
      <section
        ref={containerRef}
        className="relative h-screen w-full bg-white dark:bg-[#050505]"
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            ref={heroImageRef}
            className="absolute inset-0 w-full h-full z-0"
          >
            <Image
              src="/tcetimage.png"
              alt="TCET campus building"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          <div
            ref={textBgWashRef}
            className="absolute inset-0 z-10 opacity-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-[4px] transition-colors duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-[85vh] md:h-[75vh] bg-gradient-to-t from-white via-white/85 to-transparent dark:from-[#050505] dark:via-[#050505]/85 transition-colors duration-500" />
          </div>

          {/* SVG MASK OVERLAY (z-20) */}
          <svg
            ref={maskSvgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="dive-mask">
                <rect width="1920" height="1080" fill="white" />
                <g ref={maskTextGroupRef}>
                  {/* The Y coordinates are now perfectly injected by GSAP on load! */}
                  <text
                    ref={(el) => {
                      maskLineRefs.current[0] = el;
                    }}
                    x="960"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="black"
                    className="font-monument font-black text-[clamp(3.5rem,11vw,13rem)] tracking-tight"
                  >
                    EVERY
                  </text>
                  <text
                    ref={(el) => {
                      maskLineRefs.current[1] = el;
                    }}
                    x="960"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="black"
                    className="font-monument font-black text-[clamp(3.5rem,11vw,13rem)] tracking-tight"
                  >
                    PROJECT
                  </text>
                  <text
                    ref={(el) => {
                      maskLineRefs.current[2] = el;
                    }}
                    x="960"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="black"
                    className="font-monument font-black text-[clamp(3.5rem,11vw,13rem)] tracking-tight"
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

          {/* SCROLL HELPER INDICATOR */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-20 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-40 pointer-events-none"
          >
            <span className="font-montreal text-[10px] sm:text-xs tracking-[0.2em] uppercase text-black/60 dark:text-white/60 font-medium drop-shadow-sm">
              Scroll to explore
            </span>
            <div className="w-[1px] h-10 sm:h-12 bg-black/20 dark:bg-white/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-black dark:bg-white animate-[bounce_2s_infinite]" />
            </div>
          </div>

          {/* REVEALED CONTENT (z-30) */}
          <div className="absolute inset-0 z-30 flex flex-col justify-end px-5 sm:px-10 lg:px-20 pb-10 sm:pb-12 lg:pb-12 pointer-events-none">
            <div
              ref={heroContentRef}
              className="w-full max-w-5xl pointer-events-auto opacity-0"
            >
              <p className="font-montreal text-[10px] sm:text-xs lg:text-xl uppercase tracking-[0.25em] text-slate-900 dark:text-cyan-400 font-bold mb-3 sm:mb-4 drop-shadow-sm">
                TCET Research Culture Development Cell
              </p>

              <h1 className="font-sans text-4xl sm:text-5xl lg:text-[clamp(3.5rem,6vw,5.5rem)] leading-[1.15] lg:leading-[0.95] tracking-tight text-slate-900 dark:text-white mb-5 lg:mb-6 drop-shadow-sm">
                From Research to Real-World Impact
              </h1>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-10">
                <p className="max-w-2xl font-montreal text-sm sm:text-base lg:text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed text-slate-700 dark:text-slate-200">
                  The TCET Research Culture Development Cell fosters high-impact
                  research through funded projects, industry collaborations, and
                  publication-driven innovation, enabling students and faculty
                  to solve real-world challenges.
                </p>

                <div className="flex flex-col w-full sm:w-auto sm:flex-row sm:flex-wrap gap-3 sm:gap-4 shrink-0">
                  <Magnetic>
                    <Link
                      href="https://coe.raunakcodes.me/"
                      className="flex items-center justify-center rounded-full bg-slate-900 dark:bg-white px-6 sm:px-8 py-3.5 sm:py-4 font-montreal text-xs sm:text-sm font-bold text-white dark:text-black transition-transform hover:scale-105"
                    >
                      Explore Centre Of Excellence
                    </Link>
                  </Magnetic>
                  <Link
                    href="/majorprojects"
                    className="flex items-center justify-center rounded-full border border-slate-300 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-md px-6 sm:px-8 py-3.5 sm:py-4 font-montreal text-xs sm:text-sm font-medium text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    View Publications
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 sm:gap-12 lg:gap-20 pt-8 mt-8 lg:pt-10 lg:mt-10 border-t border-slate-300/60 dark:border-white/10">
                <div>
                  <p className="font-monument text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white">
                    45+
                  </p>
                  <p className="font-montreal text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-1 sm:mt-2 font-medium">
                    Faculty Guides
                  </p>
                </div>
                <div>
                  <p className="font-monument text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white">
                    280+
                  </p>
                  <p className="font-montreal text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-1 sm:mt-2 font-medium">
                    Researchers
                  </p>
                </div>
                <div>
                  <p className="font-monument text-2xl sm:text-3xl lg:text-4xl text-cyan-600 dark:text-cyan-400">
                    18
                  </p>
                  <p className="font-montreal text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-1 sm:mt-2 font-medium">
                    Collaborations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT GRID REEL */}
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
