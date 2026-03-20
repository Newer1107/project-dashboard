// components/showcase/AnimatedShowcase.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Line } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";
import Magnetic from "@/components/ui/Magnetic"; // Adjust path if needed

// --- 3D LAB SCENE COMPONENTS ---
function LabTable({ position }: { position: [number, number, number] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const lineColor = isDark ? "#444444" : "#bbbbbb";

  return (
    <group position={position}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3, 0.1, 1.5)]} />
        <lineBasicMaterial color={lineColor} />
      </lineSegments>
      {[
        [-1.4, -0.4, -0.7],
        [1.4, -0.4, -0.7],
        [-1.4, -0.4, 0.7],
        [1.4, -0.4, 0.7],
      ].map((pos, i) => (
        <Line
          key={i}
          points={[
            [pos[0], pos[1], pos[2]],
            [pos[0], pos[1] - 0.7, pos[2]],
          ]}
          color={lineColor}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

function Equipment({ position, color = "#ff4500" }: any) {
  return (
    <group position={position}>
      <Box args={[0.4, 0.3, 0.3]}>
        <meshBasicMaterial color={color} />
      </Box>
    </group>
  );
}

function Monitor({ position }: any) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <group position={position}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.5, 0.05)]} />
        <lineBasicMaterial color={isDark ? "#666666" : "#999999"} />
      </lineSegments>
      <Box args={[0.75, 0.45, 0.01]} position={[0, 0, 0.03]}>
        <meshBasicMaterial color={isDark ? "#001122" : "#e6f2ff"} />
      </Box>
    </group>
  );
}

function ServerRack({ position }: any) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <group position={position}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.6, 1.8, 0.6)]} />
        <lineBasicMaterial color={isDark ? "#555555" : "#aaaaaa"} />
      </lineSegments>
      {[0.6, 0.3, 0, -0.3, -0.6].map((y, i) => (
        <lineSegments key={i} position={[0, y, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.08, 0.55)]} />
          <lineBasicMaterial color={isDark ? "#777777" : "#888888"} />
        </lineSegments>
      ))}
      {[0.6, 0.3, 0, -0.3, -0.6].map((y, i) => (
        <Box
          key={`led-${i}`}
          args={[0.02, 0.02, 0.02]}
          position={[0.25, y, 0.28]}
        >
          <meshBasicMaterial color="#00ff00" />
        </Box>
      ))}
    </group>
  );
}

function WallOutline() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const wallColor = isDark ? "#333333" : "#cccccc";

  return (
    <group>
      <Line
        points={[
          [-5, -3, -4],
          [5, -3, -4],
          [5, 3, -4],
          [-5, 3, -4],
          [-5, -3, -4],
        ]}
        color={wallColor}
        lineWidth={1}
      />
      <Line
        points={[
          [-5, -3, -4],
          [-5, -3, 4],
          [-5, 3, 4],
          [-5, 3, -4],
        ]}
        color={wallColor}
        lineWidth={1}
      />
      <Line
        points={[
          [5, -3, -4],
          [5, -3, 4],
          [5, 3, 4],
          [5, 3, -4],
        ]}
        color={wallColor}
        lineWidth={1}
      />
    </group>
  );
}

function LabScene3D() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <WallOutline />
      <gridHelper
        args={[
          10,
          20,
          isDark ? "#222222" : "#dddddd",
          isDark ? "#111111" : "#eeeeee",
        ]}
        position={[0, -3, 0]}
      />
      <LabTable position={[-2, -2.5, 0]} />
      <LabTable position={[2, -2.5, 0]} />
      <LabTable position={[0, -2.5, -2]} />
      <Equipment position={[-2, -2.3, 0.2]} color="#ff4500" />
      <Equipment position={[2, -2.3, -0.3]} color="#00ff88" />
      <Equipment position={[0.5, -2.3, -2]} color="#4a90e2" />
      <Monitor position={[-1.5, -2.1, -2]} />
      <Monitor position={[1.5, -2.1, -2]} />
      <ServerRack position={[-4, -1.1, -1]} />
      <ServerRack position={[4, -1.1, -1]} />
    </>
  );
}

function LabScene() {
  return (
    <Canvas camera={{ position: [8, 4, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <LabScene3D />
      <OrbitControls
        enableZoom={true}
        target={[0, 0, 0]}
        autoRotate={true}
        autoRotateSpeed={2}
        enablePan={true}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

// --- MAIN SHOWCASE COMPONENT ---
export default function AnimatedShowcase({ projects }: { projects: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth Scroll Trigger Logic
  useEffect(() => {
    const handleScroll = () => {
      const windowCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(windowCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fallback if no projects exist
  const displayProjects = projects?.length > 0 ? projects : [];

  return (
    <div className="text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="px-6 md:px-20 py-24 md:py-32 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full">
          <div className="w-full z-10 text-center md:text-left">
            <h1 className="font-monument font-extralight text-[40px] md:text-[80px] lg:text-[100px] leading-[0.9] tracking-tighter break-words">
              PROJECTS <br /> THAT MATTER.
            </h1>
            <p className="font-montreal text-gray-500 dark:text-gray-400 mt-6 mx-auto md:mx-0 max-w-md text-base md:text-lg">
              A collection of digital products and systems designed with a focus
              on performance, structure and clarity.
            </p>
          </div>
          <div className="relative h-[40vh] md:h-[60vh] w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing">
            <LabScene />
          </div>
        </div>
      </section>

      {/* 2. VERTICAL TIMELINE REEL */}
      <section className="relative w-full max-w-7xl mx-auto px-6 md:px-20">
        <div className="flex w-full relative">
          {/* Timeline Track */}
          <div className="hidden md:flex flex-col items-center w-16 shrink-0 relative">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10 dark:bg-white/10 z-0" />
            <div className="sticky top-1/2 -translate-y-1/2 h-[400px] flex flex-col items-center justify-between z-10 py-10 bg-transparent">
              {displayProjects.map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center h-8 w-8 bg-transparent"
                >
                  <div
                    className={`rounded-full transition-all duration-500 ${
                      activeIndex === i
                        ? "w-3 h-3 bg-black dark:bg-white"
                        : "w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cards Container */}
          <div className="flex-1 flex flex-col gap-12 md:gap-24 py-[35vh]">
            {displayProjects.map((p, i) => {
              const isActive = activeIndex === i;
              const isAdjacent = Math.abs(activeIndex - i) === 1;

              return (
                <div
                  key={p.id || i}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center"
                  style={{
                    opacity: isActive ? 1 : isAdjacent ? 0.3 : 0.05,
                    transform: `scale(${isActive ? 1 : isAdjacent ? 0.9 : 0.8})`,
                  }}
                >
                  <div className="w-full max-w-4xl mx-auto bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl overflow-hidden group">
                    <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-xl mb-6 bg-gray-100 dark:bg-zinc-900">
                      {/* Using standard img to prevent Next Image domain config issues out of the box */}
                      <img
                        src={
                          p.image ||
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                        }
                        alt={p.title}
                        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                          isActive
                            ? "grayscale-0 scale-100"
                            : "grayscale scale-110"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 bg-black transition-opacity duration-700 ${isActive ? "opacity-0" : "opacity-30"}`}
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                      <div className="flex-1">
                        <p className="font-montreal text-xs md:text-sm text-gray-500 mb-1 uppercase tracking-widest">
                          {p.category || "Project"}
                        </p>
                        <h2 className="font-monument text-xl md:text-4xl uppercase tracking-tight">
                          {p.title}
                        </h2>
                      </div>
                      <div className="shrink-0">
                        <Magnetic>
                          {/* Change /project/ to /showcase/ */}
                          <Link
                            href={`/showcase/${p.slug || p.id}`}
                            className={`inline-block border border-black/10 dark:border-white/20 px-8 py-4 font-montreal text-xs md:text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 whitespace-nowrap ${
                              isActive
                                ? "pointer-events-auto"
                                : "pointer-events-none"
                            }`}
                          >
                            VIEW WORK
                          </Link>
                        </Magnetic>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
