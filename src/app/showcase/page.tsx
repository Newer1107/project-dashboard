// import Link from "next/link";
// import { auth } from "@/lib/auth";
// import { PublicShowcaseNavbar } from "@/components/showcase/PublicShowcaseNavbar";
// import { ShowcaseGalleryClient } from "@/components/showcase/ShowcaseGalleryClient";
// import { Spotlight } from "@/components/ui/spotlight";
// import { SplineScene } from "@/components/ui/splite";
// import { getPublicShowcaseProjects } from "@/server/actions/showcase";

// export const dynamic = "force-dynamic";

// export default async function PublicShowcasePage() {
//   const session = await auth();
//   const projects = await getPublicShowcaseProjects();

//   return (
//     <main className="premium-showcase-surface min-h-screen text-slate-100">
//       <PublicShowcaseNavbar
//         viewer={
//           session?.user
//             ? {
//                 name: session.user.name,
//                 role: (session.user as any).role,
//               }
//             : null
//         }
//       />

//       <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
//         <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,47,73,0.85),rgba(30,41,59,0.82)_42%,rgba(49,46,129,0.82))] px-6 py-12 sm:px-10 sm:py-16">
//           <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
//           <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-indigo-500/25 blur-3xl" />

//           <div className="relative grid animate-fade-up gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
//             <div className="space-y-6">
//               <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">
//                 Curated Innovation Collection
//               </p>
//               <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
//                 University Project Showcase
//               </h1>
//               <p className="max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
//                 Discover ambitious research, engineering, and product
//                 experiments built by students and faculty. Every project is
//                 presented as a polished case study with outcomes, approach, and
//                 technical depth.
//               </p>
//               <div className="flex flex-wrap items-center gap-3 pt-2">
//                 <a
//                   href="#explore"
//                   className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
//                 >
//                   Explore Projects
//                 </a>
//                 <Link
//                   href="/showcase/my-projects"
//                   className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
//                 >
//                   Submit Project
//                 </Link>
//               </div>
//             </div>

//             <div className="premium-panel relative h-[320px] overflow-hidden rounded-3xl sm:h-[380px]">
//               <Spotlight className="-left-16 -top-28" fill="#a5f3fc" />
//               <SplineScene
//                 scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
//                 className="h-full w-full"
//               />
//             </div>
//           </div>
//         </section>

//         <div id="categories" className="mt-12">
//           <ShowcaseGalleryClient projects={projects as any} />
//         </div>
//       </div>
//     </main>
//   );
// }

// app/showcase/page.tsx (Adjust path to match your structure)
// import { auth } from "@/lib/auth";
// import { PublicShowcaseNavbar } from "@/components/showcase/PublicShowcaseNavbar";
// import { getPublicShowcaseProjects } from "@/server/actions/showcase";
// import AnimatedShowcase from "@/components/showcase/AnimatedShowcase";
// import Footer from "@/components/ui/Footer";

// export const dynamic = "force-dynamic";

// export default async function PublicShowcasePage() {
//   const session = await auth();
//   const projects = await getPublicShowcaseProjects();

//   return (
//     <main className="bg-[#FAFAFA] dark:bg-[#050505] min-h-screen relative z-10">
//       <PublicShowcaseNavbar
//         viewer={
//           session?.user
//             ? {
//                 name: session.user.name,
//                 role: (session.user as any).role,
//               }
//             : null
//         }
//       />

//       {/* Pass the dynamically fetched projects into the animated client component */}
//       <AnimatedShowcase projects={projects || []} />

//       <Footer />
//     </main>
//   );
// }

import { auth } from "@/lib/auth";
import { PublicShowcaseNavbar } from "@/components/showcase/PublicShowcaseNavbar";
import { getPublicShowcaseProjects } from "@/server/actions/showcase";
import AnimatedShowcase from "@/components/showcase/AnimatedShowcase";
import LabStats from "@/components/showcase/LabStats"; // Adjust path if you saved it elsewhere
import Footer from "@/components/ui/Footer";

export const dynamic = "force-dynamic";

export default async function PublicShowcasePage() {
  const session = await auth();
  const projects = await getPublicShowcaseProjects();

  return (
    // Wrap everything in a fragment or empty div
    <div className="relative min-h-screen bg-[#E5E5E5] dark:bg-[#050505]">
      {/* MAIN CONTENT CURTAIN
        Must have a solid background and a higher z-index (z-10).
        The mb-[80vh] matches the footer height to allow scrolling past it.
      */}
      <main className="relative z-10 bg-[#FAFAFA] dark:bg-[#111111] mb-[80vh] transition-colors duration-500">
        {/* <PublicShowcaseNavbar
          viewer={
            session?.user
              ? {
                  name: session.user.name,
                  role: (session.user as any).role,
                }
              : null
          }
        /> */}

        {/* The Hero & Vertical Project Reel */}
        <AnimatedShowcase projects={projects || []} />

        {/* The GSAP Animated Bento Box Stats */}
        <LabStats />
      </main>

      {/* FIXED FOOTER 
        Sits safely outside the main stacking context, pinned to the bottom (z-0)
      */}
      <Footer />
    </div>
  );
}
