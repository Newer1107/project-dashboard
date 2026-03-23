// components/showcase/AnimatedShowcase.tsx
"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Line, Grid } from "@react-three/drei";
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
      <Grid
        position={[0, -3, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.7}
        cellColor={isDark ? "#222222" : "#e5e5e5"}
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor={isDark ? "#444444" : "#bbbbbb"}
        fadeDistance={12}
        fadeStrength={1.5}
        infiniteGrid={true}
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
    <Canvas
      camera={{ position: [8, 4, 8], fov: 50 }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.5} />
      <LabScene3D />

      <OrbitControls
        enableZoom={false}
        target={[0, 0, 0]}
        autoRotate={true}
        autoRotateSpeed={2}
        enablePan={false}
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
  const displayProjects = projects?.length > 0 ? projects : [];

  return (
    <div className="text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="px-4 sm:px-6 md:px-20 py-12 sm:py-16 md:py-32 max-w-7xl mx-auto min-h-[50vh] md:min-h-screen flex items-center justify-center">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center w-full">
          <div className="w-full z-10 text-center md:text-left">
            <h1 className="font-monument font-extralight text-[40px] md:text-[80px] lg:text-[100px] leading-[0.9] tracking-tighter break-words">
              EVERY <br /> PROJECT MATTERS.
            </h1>
            <p className="font-montreal text-gray-500 dark:text-gray-400 mt-6 mx-auto md:mx-0 max-w-md text-base md:text-lg">
              A collection of digital products and systems designed with a focus
              on performance, structure and clarity by the students of TCET.
            </p>
          </div>
          <div className="relative h-[40vh] md:h-[60vh] w-full rounded-2xl overflow-hidden">
            <div className="absolute inset-0 z-10 touch-pan-y block md:hidden" />
            <div className="relative w-full h-full z-0 md:cursor-grab md:active:cursor-grabbing">
              <LabScene />
            </div>
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
