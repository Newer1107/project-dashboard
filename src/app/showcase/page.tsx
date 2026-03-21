import { auth } from "@/lib/auth";
import { PublicShowcaseNavbar } from "@/components/showcase/PublicShowcaseNavbar";
import { getPublicShowcaseProjects } from "@/server/actions/showcase";
import AnimatedShowcase from "@/components/showcase/AnimatedShowcase";
import LabStats from "@/components/showcase/LabStats";
import Footer from "@/components/ui/Footer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar"; // Import the toggle

export const dynamic = "force-dynamic";

export default async function PublicShowcasePage() {
  const session = await auth();
  const projects = await getPublicShowcaseProjects();

  return (
    <div className="relative min-h-screen bg-[#E5E5E5] dark:bg-[#050505]">
      {/* SPACING FIX: Changed mb-[80vh] to mb-[50vh] for mobile, 
        and kept md:mb-[80vh] fo  r desktop.
      */}
      <FloatingPillNavbar />
      <ThemeToggle />
      <main className="relative z-10 pt-32 sm:pt-40 md:pt-0 bg-[#FAFAFA] dark:bg-[#111111] mb-[50vh] md:mb-[80vh] transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {" "}
        {/* Floating Theme Toggle */}
        <AnimatedShowcase projects={projects || []} />
        <LabStats />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
