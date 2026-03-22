// // components/showcase/FloatingPillNavbar.tsx
// import Link from "next/link";
// import { ClipboardListIcon, HomeIcon } from "lucide-react";

// export default function FloatingPillNavbar() {
//   return (
//     <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
//       <div className="flex items-center gap-8 px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
//         {/* Brand/Logo */}
//         {/* <Link
//           href="/"
//           className="font-monument text-sm md:text-base uppercase tracking-widest font-bold text-[#111111] dark:text-[#E5E5E5]"
//         >
//           TCET PROJECTS
//         </Link> */}

//         {/* Links - Hidden on very small screens to keep the pill compact */}
//         <nav className="hidden sm:flex items-center gap-6 font-montreal text-xs md:text-sm uppercase tracking-widest text-black/60 dark:text-white/60">
//           <Link
//             href="/showcase"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300"
//           >
//             <HomeIcon />
//           </Link>
//           <Link
//             href="/lab"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300"
//           >
//             Lab
//           </Link>
//           <Link
//             href="/projectlist"
//             className="hover:text-black dark:hover:text-white transition-colors duration-300"
//           >
//             <ClipboardListIcon />
//           </Link>
//         </nav>

//         {/* Minimalist Mobile Menu Trigger (Optional) */}
//         <button className="sm:hidden flex flex-col gap-1.5 p-2">
//           <div className="w-5 h-[1px] bg-black dark:bg-white" />
//           <div className="w-5 h-[1px] bg-black dark:bg-white" />
//         </button>
//       </div>
//     </div>
//   );
// }

// components/showcase/FloatingPillNavbar.tsx
import Link from "next/link";
import { ClipboardListIcon, HomeIcon } from "lucide-react";

export default function FloatingPillNavbar() {
  return (
    // Note: Kept it absolutely centered, but you can change 'fixed' to 'absolute'
    // depending on how you want it to behave when scrolling.
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
      <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
        {/* Links - Always visible now */}
        <nav className="flex items-center gap-6 font-montreal text-xs md:text-sm uppercase tracking-widest text-black/60 dark:text-white/60">
          <Link
            href="/showcase"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 flex items-center justify-center"
          >
            <HomeIcon className="w-5 h-5" />
          </Link>

          <Link
            href="/lab"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 font-semibold"
          >
            LAB
          </Link>

          <Link
            href="/projectlist"
            className="hover:text-black dark:hover:text-white transition-colors duration-300 flex items-center justify-center"
          >
            <ClipboardListIcon className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
