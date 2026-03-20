// components/ui/Footer.tsx
"use client";

import Magnetic from "./Magnetic";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[80vh] bg-[#E5E5E5] dark:bg-[#050505] text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 flex flex-col items-center justify-center z-0">
      {/* ADDED: flex flex-col items-center to force the Magnetic block to center */}
      <div className="flex flex-col items-center text-center px-4">
        <p className="font-montreal text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 transition-colors duration-500">
          Leave Your Mark
        </p>
        <h2 className="font-monument text-[50px] md:text-[120px] leading-[0.9] tracking-tighter uppercase mb-12">
          BUILD <br /> SOMETHING <br /> BETTER.
        </h2>

        <Magnetic>
          <a
            href="mailto:submit@college.edu"
            className="inline-block border border-black/30 dark:border-white/30 px-10 py-5 font-montreal text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 backdrop-blur-md "
          >
            SUBMIT YOUR PROJECT
          </a>
        </Magnetic>
      </div>

      <div className="absolute bottom-10 w-full flex justify-between px-10 font-montreal text-xs text-gray-500 uppercase transition-colors duration-500">
        <p>© {new Date().getFullYear()} TCET College Labs</p>
        <p></p>
      </div>
    </footer>
  );
}
