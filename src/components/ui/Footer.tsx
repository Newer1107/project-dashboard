"use client";

import Link from "next/link";
import Magnetic from "./Magnetic";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[50vh] md:h-[80vh] bg-[#E5E5E5] dark:bg-[#050505] text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 flex flex-col items-center justify-center z-0">
      <div className="flex flex-col items-center text-center px-6 w-full max-w-4xl mx-auto">
        <p className="font-montreal text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 md:mb-6 transition-colors duration-500">
          Leave Your Mark
        </p>

        <h2 className="font-monument text-[45px] sm:text-[60px] md:text-[120px] leading-[0.9] tracking-tighter uppercase w-full text-center mb-8 md:mb-12">
          BUILD <br /> SOMETHING <br /> BETTER.
        </h2>

        <div className="flex justify-center w-full mb-8 z-10">
          <Magnetic>
            <Link
              href="/register"
              className="inline-flex  bg-black dark:bg-white text-white dark:text-black items-center justify-center border border-black/30 dark:border-white/30 px-8 py-4 md:px-10 md:py-5 font-montreal text-xs md:text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 backdrop-blur-md whitespace-nowrap"
            >
              SUBMIT YOUR PROJECT
            </Link>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
