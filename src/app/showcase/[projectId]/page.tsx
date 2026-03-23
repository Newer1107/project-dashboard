import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import Image from "next/image";
import FloatingPillNavbar from "@/components/ui/ShowCaseNavbar";
import { getPublicShowcaseProjectById } from "@/server/actions/showcase";
import Footer from "@/components/ui/Footer";
import { ExternalLink, Github } from "lucide-react";

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
  const heroVisual = screenshots[0]?.accessUrl || screenshots[0]?.fileUrl;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 font-sans">
      <FloatingPillNavbar />

      {/* HEADER / BRANDING */}
      <header className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-zinc-800 pt-24 pb-8 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Row: Logo & Breadcrumbs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Image
                src="/tcetlogo.png"
                alt="TCET Logo"
                width={48}
                height={48}
                unoptimized
                className="object-contain"
              />
              <div>
                <h2 className="text-sm font-bold tracking-tight">TCET</h2>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Centre of Excellence For Research Culture Development
                </p>
              </div>
            </div>

            {/* Breadcrumb Navigation - Domain Removed */}
            <nav className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Link
                href="/showcase"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                ← Back to Showcase
              </Link>
            </nav>
          </div>

          {/* Project Title Area */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              {project.shortDescription ||
                "An academic project developed by the students of TCET."}
            </p>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: PROJECT REPORT (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Image - ONLY renders if heroVisual exists */}
            {heroVisual && (
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-200 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm">
                <img
                  src={heroVisual}
                  alt={`${project.title} preview`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Academic Sections */}
            <article className="prose prose-blue dark:prose-invert max-w-none space-y-10">
              {project.fullDescription && (
                <section>
                  <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4">
                    Abstract / Overview
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.fullDescription}
                  </p>
                </section>
              )}

              {project.problemStatement && (
                <section>
                  <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4">
                    Problem Statement
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.problemStatement}
                  </p>
                </section>
              )}

              {project.objectives && (
                <section>
                  <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4">
                    Objectives
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.objectives}
                  </p>
                </section>
              )}

              {project.methodology && (
                <section>
                  <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4">
                    Proposed Methodology
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.methodology}
                  </p>
                </section>
              )}

              {project.architectureDescription && (
                <section>
                  <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4">
                    System Architecture
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.architectureDescription}
                  </p>
                </section>
              )}

              {/* Gallery Grid - ONLY renders if there are multiple screenshots */}
              {screenshots.length > 1 && (
                <section>
                  <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2 mb-6">
                    Project Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {screenshots.slice(1).map((shot: any) => (
                      <a
                        key={shot.id}
                        href={shot.accessUrl || shot.fileUrl}
                        target="_blank"
                        className="block group overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm"
                      >
                        {/* Removed hover:opacity-90 and added group-hover:scale-105 for a clean zoom effect at full opacity */}
                        <img
                          src={shot.accessUrl || shot.fileUrl}
                          alt="Project screenshot"
                          className="w-full aspect-video object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>

          {/* RIGHT COLUMN: SIDEBAR (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Action Card: Links */}
            {(project.liveDemoUrl || project.githubUrl) && (
              <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Project Links
                </h3>
                <div className="flex flex-col gap-3">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-zinc-700"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Team Card */}
            <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Project Team
              </h3>
              <ul className="space-y-4">
                {project.teamMembers?.length ? (
                  project.teamMembers.map((member: any) => (
                    <li key={member.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold border border-blue-200 dark:border-blue-800">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">
                    No team members listed.
                  </li>
                )}
              </ul>

              {project.mentorName && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Faculty Mentor
                  </h4>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.mentorName}
                  </p>
                  {project.mentorEmail && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {project.mentorEmail}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Tech Stack Card */}
            {project.techStack &&
              (project.techStack as string[]).length > 0 && (
                <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(project.techStack as string[]).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium border border-gray-200 dark:border-zinc-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Quick Specs Card */}
            {(project.databaseUsed ||
              (project.apiIntegrations &&
                (project.apiIntegrations as string[]).length > 0)) && (
              <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Technical Specs
                </h3>
                <dl className="space-y-4">
                  {project.databaseUsed && (
                    <div>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Database
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-gray-300 mt-1">
                        {project.databaseUsed}
                      </dd>
                    </div>
                  )}
                  {project.apiIntegrations &&
                    (project.apiIntegrations as string[]).length > 0 && (
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
                          Integrations
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-gray-300 mt-1">
                          {(project.apiIntegrations as string[]).join(", ")}
                        </dd>
                      </div>
                    )}
                </dl>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
