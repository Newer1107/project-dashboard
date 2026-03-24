// components/showcase/FloatingPillNavbar.tsx
import Link from "next/link";
import { HomeIcon } from "lucide-react";

export default function FloatingPillNavbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
      <div className="flex items-center gap-4 sm:gap-6 px-5 sm:px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
        <nav className="flex items-center gap-4 sm:gap-6 font-montreal text-xs md:text-sm uppercase tracking-widest text-black/60 dark:text-white/60">
          {/* HOME */}
          <Link
            href="/showcase"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 flex items-center justify-center group"
            title="Home"
          >
            <HomeIcon className="w-5 h-5" />
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

          {/* MAJOR PROJECTS (LAB) */}
          <Link
            href="/majorprojects"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 group"
          >
            <span className="hidden sm:inline-block">Major Projects</span>
            <span className="sm:hidden">Major</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

          {/* RBL PROJECTS */}
          <Link
            href="/rblprojects-te"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 group"
          >
            <span className="hidden sm:inline-block">RBL Projects</span>
            <span className="sm:hidden">RBL</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

          {/* ANALYTICS */}
          <Link
            href="/analytics"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 group"
          >
            <span>Analytics</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
