import { auth } from "@/lib/auth";
import Image from "next/image";
import { getPublicShowcaseProjects } from "@/server/actions/showcase";
import AnimatedShowcase from "@/components/showcase/AnimatedShowcase";
import LabStats from "@/components/showcase/LabStats";
import Footer from "@/components/ui/Footer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

export default async function PublicShowcasePage() {
  const session = await auth();
  const projects = await getPublicShowcaseProjects();

  const imgDir = path.join(process.cwd(), "public/images-rollingdisplay");
  let slideshowImages: string[] = [];

  try {
    const files = fs.readdirSync(imgDir);
    slideshowImages = files
      .filter((file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
      // Path is configured relative to the public slideshow images folder
      .map((file) => `/images-rollingdisplay/${file}`);
  } catch (error) {
    console.error("[showcase-page] Failed to read slideshow images directory:", error);
  }

  return (
    <div className="relative min-h-screen bg-[#E5E5E5] dark:bg-[#050505]">
      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-50 flex items-center gap-2 sm:gap-3">
        {/* Using a white/dark background pill to make the logo pop against any grid/lines */}
        <div className="bg-white p-1.5 sm:p-2 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-800">
          <Image
            src="/tcetlogo.png"
            alt="TCET Logo"
            width={48}
            height={48}
            unoptimized
            className="object-contain sm:w-16 sm:h-16"
          />
        </div>
        {/* Optional text next to logo */}
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-widest">
            TCET
          </span>
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            Centre of Excellence For Research Culture Development
          </span>
        </div>
      </div>
      <FloatingPillNavbar />
      <ThemeToggle />
      <main className="relative z-10 pt-24 sm:pt-32 md:pt-40 lg:pt-0 bg-[#FAFAFA] dark:bg-[#111111] mb-[45vh] sm:mb-[50vh] md:mb-[80vh] transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {" "}
        {/* Floating Theme Toggle */}
        <AnimatedShowcase projects={projects || []} />
        <LabStats images={slideshowImages} />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
