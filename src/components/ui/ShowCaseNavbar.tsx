// // components/showcase/FloatingPillNavbar.tsx
// import Link from "next/link";
// import { HomeIcon } from "lucide-react";

// export default function FloatingPillNavbar() {
//   return (
//     <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
//       <div className="flex items-center gap-4 sm:gap-6 px-5 sm:px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
//         <nav className="flex items-center gap-4 sm:gap-6 font-montreal text-xs md:text-sm uppercase tracking-widest text-black/60 dark:text-white/60">
//           {/* HOME */}
//           <Link
//             href="/showcase"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300 flex items-center justify-center group"
//             title="Home"
//           >
//             <HomeIcon className="w-5 h-5" />
//           </Link>

//           {/* Vertical Divider */}
//           <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

//           {/* MAJOR PROJECTS (LAB) */}
//           <Link
//             href="/majorprojects"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 group"
//           >
//             <span className="hidden sm:inline-block">Major Projects</span>
//             <span className="sm:hidden">Major</span>
//           </Link>

//           {/* Vertical Divider */}
//           <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

//           {/* RBL PROJECTS */}
//           <Link
//             href="/rblprojects-te"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 group"
//           >
//             <span className="hidden sm:inline-block">RBL Projects</span>
//             <span className="sm:hidden">RBL</span>
//           </Link>

//           {/* Vertical Divider */}
//           <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

//           {/* ANALYTICS */}
//           <Link
//             href="/analytics"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 group"
//           >
//             <span>Analytics</span>
//           </Link>
//         </nav>
//       </div>
//     </div>
//   );
// }

// components/showcase/FloatingPillNavbar.tsx
import Link from "next/link";
import Image from "next/image"; // Added Image import for the logo
import { HomeIcon } from "lucide-react";

export default function FloatingPillNavbar() {
  return (
    // Added max-w-[95vw] so it doesn't touch the screen edges on very small phones
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-max max-w-[95vw]">
      {/* This is the main pill container. 
        Using items-center here guarantees the logo and text will NEVER un-align.
      */}
      <div className="flex items-center gap-3 sm:gap-6 p-2 sm:px-6 sm:py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#0A0A0A]/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
        {/* LOGO SLOT */}
        {/* Replace '/logo.png' with your actual TCET logo path */}
        <Link
          href="/"
          className="flex items-center justify-center shrink-0 bg-white rounded-full w-8 h-8 sm:w-9 sm:h-9 overflow-hidden"
        >
          <img
            src="/tcetlogo.png"
            alt="TCET Logo"
            className="w-full h-full object-contain p-1"
          />
        </Link>

        {/* Divider between Logo and Links */}
        <div className="w-[1px] h-5 sm:h-6 bg-black/20 dark:bg-white/20" />

        {/* NAVIGATION */}
        <nav className="flex items-center gap-3 sm:gap-6 font-montreal text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-black/60 dark:text-white/60 pr-2 sm:pr-0">
          {/* HOME */}
          <Link
            href="/showcase"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 flex items-center justify-center group"
            title="Home"
          >
            <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] h-3 sm:h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

          {/* MAJOR PROJECTS */}
          <Link
            href="/majorprojects"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center group"
          >
            <span className="hidden sm:inline-block">Major Projects</span>
            <span className="sm:hidden">Major</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] h-3 sm:h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

          {/* RBL PROJECTS */}
          <Link
            href="/rblprojects-te"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center group"
          >
            <span className="hidden sm:inline-block">RBL Projects</span>
            <span className="sm:hidden">RBL</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] h-3 sm:h-4 bg-black/20 dark:bg-white/20 hidden sm:block" />

          {/* ANALYTICS */}
          <Link
            href="/analytics"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold flex items-center group"
          >
            {/* Kept abbreviated on mobile if needed, but 'Analytics' usually fits */}
            <span>Analytics</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
