import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import { getPublicShowcaseProjectById } from "@/server/actions/showcase";
import Footer from "@/components/ui/Footer";

export const dynamic = "force-dynamic";

export default async function ShowcaseProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  const { projectId } = await params;
  const project = await getPublicShowcaseProjectById(projectId);

  if (!project) {
    notFound();
  }

  const screenshots =
    project.assets?.filter((asset: any) => asset.kind === "SCREENSHOT") || [];
  const docs =
    project.assets?.filter((asset: any) => asset.kind === "DOCUMENTATION") ||
    [];
  const heroVisual = screenshots[0]?.accessUrl || screenshots[0]?.fileUrl;

  return (
    <div className="relative min-h-screen bg-[#E5E5E5] dark:bg-[#050505]">
      {/* MAIN CONTENT CURTAIN 
        Kept your mb-[50vh] md:mb-[80vh] so the footer reveal works perfectly!
      */}
      <main className="relative z-10 bg-[#FAFAFA] dark:bg-[#111111] text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 mb-[50vh] md:mb-[80vh] pb-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-3xl md:rounded-b-[4rem]">
        {/* Subtle grid background for tech vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-b-3xl md:rounded-b-[4rem]"></div>

        <div className="relative z-10">
          <FloatingPillNavbar />

          <div className="mx-auto max-w-7xl px-6 md:px-20 pt-8 md:pt-12">
            {/* BACK BUTTON */}
            <div className="mb-12">
              <Link
                href="/showcase"
                className="group inline-flex items-center font-montreal text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">
                  ←
                </span>
                Back to Showcase
              </Link>
            </div>

            {/* CRAZY HERO SECTION */}
            <section className="relative mb-24 md:mb-32">
              <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 items-center">
                {/* Text Block - Spans 7 cols, z-index brings it above the image */}
                <div className="lg:col-span-7 z-20 w-full">
                  <p className="font-montreal text-xs md:text-sm text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-gray-400"></span>
                    {project.projectDomain?.replace("_", " ") || "Project"}
                  </p>
                  <h1 className="font-monument text-[50px] sm:text-[70px] lg:text-[100px] leading-[0.85] tracking-tighter uppercase break-words mb-8 mix-blend-difference dark:mix-blend-normal">
                    {project.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 pt-4 mb-8">
                    {((project.techStack as string[]) ?? []).map((tech) => (
                      <span
                        key={tech}
                        className="backdrop-blur-md rounded-full border border-black/20 dark:border-white/20 px-5 py-2 font-montreal text-xs tracking-wider text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Block - Spans 5 cols, offset to overlap */}
                <div className="lg:col-span-5 w-full relative group">
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-3xl transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                  <div className="w-full aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden bg-gray-200 dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 relative z-10">
                    {heroVisual ? (
                      <img
                        src={heroVisual}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-montreal text-sm text-gray-400 uppercase tracking-widest">
                        No Preview Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* BENTO BOX CONTENT GRID */}
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              {/* MAIN DETAILS (BENTO) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                {/* Overview spans full width */}
                <DetailSection
                  title="Overview"
                  content={project.fullDescription}
                  className="md:col-span-2 bg-black text-white dark:bg-white dark:text-black"
                  // Inverted colors for the main description block to make it pop
                />

                <DetailSection
                  title="Problem"
                  content={project.problemStatement}
                  className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                />

                <DetailSection
                  title="Approach"
                  content={project.methodology}
                  className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                />

                <DetailSection
                  title="Objectives"
                  content={project.objectives}
                  className="md:col-span-2 border-black/10 dark:border-white/10"
                />

                <DetailTags
                  title="Key Features"
                  items={(project.keyFeatures as string[]) ?? []}
                  className="md:col-span-2 border-black/10 dark:border-white/10"
                />

                <DetailSection
                  title="Architecture"
                  content={project.architectureDescription}
                  className="border-black/10 dark:border-white/10"
                />

                <DetailSection
                  title="Database"
                  content={project.databaseUsed}
                  className="border-black/10 dark:border-white/10"
                />

                <DetailTags
                  title="Integrations"
                  items={(project.apiIntegrations as string[]) ?? []}
                  className="md:col-span-2 bg-black/5 dark:bg-white/5"
                />

                {/* SCREENSHOTS GALLERY */}
                <section className="md:col-span-2 border border-black/10 dark:border-white/10 rounded-3xl p-8 transition-colors duration-500">
                  <h2 className="font-monument text-2xl uppercase tracking-tight mb-8 flex items-center gap-4">
                    Gallery{" "}
                    <span className="flex-1 h-[1px] bg-black/10 dark:bg-white/10"></span>
                  </h2>
                  {screenshots.length === 0 ? (
                    <p className="font-montreal text-sm text-gray-500">
                      No screenshots uploaded.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {screenshots.map((shot: any) => (
                        <a
                          key={shot.id}
                          href={shot.accessUrl || shot.fileUrl}
                          target="_blank"
                          className="block group overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 relative aspect-video"
                        >
                          <img
                            src={shot.accessUrl || shot.fileUrl}
                            alt={shot.fileName || "Project screenshot"}
                            className="w-full h-full object-cover transition duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 font-montreal text-white text-xs uppercase tracking-widest transition-opacity duration-300">
                              View Full
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* SIDEBAR */}
              <aside className="relative">
                <section className="sticky top-24 bg-white dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl transition-colors duration-500">
                  <h2 className="font-monument text-xl uppercase tracking-tight mb-8 border-b border-black/10 dark:border-white/10 pb-4">
                    Project Meta
                  </h2>

                  <div className="space-y-8 font-montreal">
                    {/* LINKS WITH ARROWS */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        Resources
                      </p>
                      <div className="flex flex-col gap-2">
                        {project.githubUrl && (
                          <SidebarLink
                            href={project.githubUrl}
                            label="GitHub Repository"
                          />
                        )}
                        {project.liveDemoUrl && (
                          <SidebarLink
                            href={project.liveDemoUrl}
                            label="Live Demo"
                          />
                        )}
                        {project.documentationUrl && (
                          <SidebarLink
                            href={project.documentationUrl}
                            label="Documentation"
                          />
                        )}
                      </div>
                    </div>

                    {/* TEAM */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        Core Team
                      </p>
                      <div className="space-y-4">
                        {project.teamMembers?.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No team members listed.
                          </p>
                        ) : (
                          project.teamMembers?.map((member: any) => (
                            <div
                              key={member.id}
                              className="group flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs font-monument">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm text-black dark:text-white font-medium group-hover:text-gray-500 transition-colors">
                                  {member.name}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* MENTOR */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        Mentor
                      </p>
                      {project.mentorName ? (
                        <div>
                          <p className="text-sm text-black dark:text-white font-medium">
                            {project.mentorName}
                          </p>
                          {project.mentorEmail && (
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                              {project.mentorEmail}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Not provided</p>
                      )}
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// --- UPGRADED HELPER COMPONENTS ---

function DetailSection({
  title,
  content,
  className = "border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A]",
}: {
  title: string;
  content?: string | null;
  className?: string;
}) {
  if (!content) return null;
  return (
    <section
      className={`rounded-3xl p-8 md:p-10 transition-all duration-500 ${className}`}
    >
      <h2 className="font-monument text-lg md:text-xl uppercase tracking-tight mb-6 opacity-80">
        {title}
      </h2>
      <p className="font-montreal text-sm md:text-base leading-relaxed opacity-90 whitespace-pre-wrap">
        {content.trim()}
      </p>
    </section>
  );
}

function DetailTags({
  title,
  items,
  className = "border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A]",
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section
      className={`rounded-3xl p-8 md:p-10 transition-all duration-500 ${className}`}
    >
      <h2 className="font-monument text-lg md:text-xl uppercase tracking-tight mb-6 opacity-80">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-black/20 dark:border-white/20 px-4 py-2 font-montreal text-xs backdrop-blur-sm transition-colors duration-300"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      className="group flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
    >
      <span className="font-montreal text-sm font-medium">{label}</span>
      <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
        ↗
      </span>
    </a>
  );
}
