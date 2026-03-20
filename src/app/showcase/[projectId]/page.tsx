import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PublicShowcaseNavbar } from "@/components/showcase/PublicShowcaseNavbar";
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

  // Type definition fallback for the assets
  const screenshots =
    project.assets?.filter((asset: any) => asset.kind === "SCREENSHOT") || [];
  const docs =
    project.assets?.filter((asset: any) => asset.kind === "DOCUMENTATION") ||
    [];
  const heroVisual = screenshots[0]?.accessUrl || screenshots[0]?.fileUrl;

  return (
    <div className="relative min-h-screen bg-[#E5E5E5] dark:bg-[#050505]">
      {/* MAIN CONTENT CURTAIN
        Matches the layout of the main showcase page, allowing the footer to reveal underneath
      */}
      <main className="relative z-10 bg-[#FAFAFA] dark:bg-[#050505] text-[#111111] dark:text-[#E5E5E5] transition-colors duration-500 mb-[80vh] pb-24">
        <PublicShowcaseNavbar
          viewer={
            session?.user
              ? {
                  name: session.user.name,
                  role: (session.user as any).role,
                }
              : null
          }
        />

        <div className="mx-auto max-w-7xl px-6 md:px-20 pt-12">
          {/* BACK BUTTON */}
          <div className="mb-8">
            <Link
              href="/showcase"
              className="font-montreal text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              ← Back to Showcase
            </Link>
          </div>

          {/* HERO SECTION */}
          <section className="mb-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
              <div className="space-y-6">
                <p className="font-montreal text-xs md:text-sm text-gray-500 uppercase tracking-widest">
                  {project.projectDomain?.replace("_", " ") || "Project"}
                </p>
                <h1 className="font-monument text-4xl sm:text-5xl lg:text-7xl leading-none uppercase tracking-tight break-words">
                  {project.title}
                </h1>
                <p className="max-w-xl font-montreal text-base md:text-lg text-gray-600 dark:text-gray-400">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {((project.techStack as string[]) ?? []).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-black/10 dark:border-white/20 px-4 py-2 font-montreal text-xs text-black dark:text-white bg-black/5 dark:bg-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="font-montreal text-xs text-gray-500 uppercase tracking-widest pt-4">
                  Published by {project.owner?.name || "Unknown author"}
                </p>
              </div>

              {/* HERO IMAGE */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10">
                {heroVisual ? (
                  <img
                    src={heroVisual}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-montreal text-sm text-gray-400 uppercase tracking-widest">
                    No Preview Available
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CONTENT GRID */}
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            {/* MAIN DETAILS */}
            <div className="space-y-8">
              <DetailSection
                title="Overview"
                content={project.fullDescription}
              />
              <DetailSection
                title="Problem"
                content={project.problemStatement}
              />
              <DetailSection title="Approach" content={project.methodology} />
              <DetailSection title="Objectives" content={project.objectives} />
              <DetailTags
                title="Features"
                items={(project.keyFeatures as string[]) ?? []}
              />
              <DetailSection
                title="Architecture"
                content={project.architectureDescription}
              />
              <DetailSection title="Database" content={project.databaseUsed} />
              <DetailTags
                title="Integrations"
                items={(project.apiIntegrations as string[]) ?? []}
              />

              {/* SCREENSHOTS GALLERY */}
              <section className="bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl p-8 transition-colors duration-500">
                <h2 className="font-monument text-2xl uppercase tracking-tight mb-6">
                  Screenshots
                </h2>
                {screenshots.length === 0 ? (
                  <p className="font-montreal text-sm text-gray-500">
                    No screenshots uploaded.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {screenshots.map((shot: any) => (
                      <a
                        key={shot.id}
                        href={shot.accessUrl || shot.fileUrl}
                        target="_blank"
                        className="block group overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
                      >
                        <img
                          src={shot.accessUrl || shot.fileUrl}
                          alt={shot.fileName || "Project screenshot"}
                          className="h-48 w-full object-cover transition duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-8">
              <section className="sticky top-24 bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl p-8 transition-colors duration-500">
                <h2 className="font-monument text-2xl uppercase tracking-tight mb-8">
                  Project Info
                </h2>

                <div className="space-y-8 font-montreal">
                  {/* TEAM */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                      Team
                    </p>
                    <div className="space-y-3">
                      {project.teamMembers?.length === 0 ? (
                        <p className="text-sm text-gray-400">
                          No team members listed.
                        </p>
                      ) : (
                        project.teamMembers?.map((member: any) => (
                          <div
                            key={member.id}
                            className="pb-3 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0"
                          >
                            <p className="text-sm text-black dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.role}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* MENTOR */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                      Mentor
                    </p>
                    {project.mentorName ? (
                      <div>
                        <p className="text-sm text-black dark:text-white">
                          {project.mentorName}
                        </p>
                        {project.mentorEmail && (
                          <p className="text-xs text-gray-500">
                            {project.mentorEmail}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Not provided</p>
                    )}
                  </div>

                  {/* LINKS */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                      Links
                    </p>
                    <div className="space-y-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          className="block text-sm hover:underline decoration-1 underline-offset-4"
                        >
                          GitHub Repository ↗
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          className="block text-sm hover:underline decoration-1 underline-offset-4"
                        >
                          Live Demo ↗
                        </a>
                      )}
                      {project.documentationUrl && (
                        <a
                          href={project.documentationUrl}
                          target="_blank"
                          className="block text-sm hover:underline decoration-1 underline-offset-4"
                        >
                          Documentation ↗
                        </a>
                      )}
                      {docs.map((doc: any) => (
                        <a
                          key={doc.id}
                          href={doc.accessUrl || doc.fileUrl}
                          target="_blank"
                          className="block text-sm hover:underline decoration-1 underline-offset-4"
                        >
                          {doc.fileName || "Documentation file"} ↗
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* CATEGORIES */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {((project.categories as string[]) ?? []).length === 0 ? (
                        <p className="text-sm text-gray-400">No categories</p>
                      ) : (
                        ((project.categories as string[]) ?? []).map(
                          (category) => (
                            <span
                              key={category}
                              className="border border-black/10 dark:border-white/20 px-3 py-1 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ),
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* THEME REVEAL FOOTER */}
      <Footer />
    </div>
  );
}

// --- HELPER COMPONENTS ---

function DetailSection({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) {
  if (!content) return null; // Don't render empty sections
  return (
    <section className="bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl p-8 transition-colors duration-500">
      <h2 className="font-monument text-2xl uppercase tracking-tight mb-4">
        {title}
      </h2>
      <p className="font-montreal text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
        {content.trim()}
      </p>
    </section>
  );
}

function DetailTags({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null; // Don't render empty tag sections
  return (
    <section className="bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-2xl p-8 transition-colors duration-500">
      <h2 className="font-monument text-2xl uppercase tracking-tight mb-4">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-black/10 dark:border-white/20 px-4 py-2 font-montreal text-xs bg-black/5 dark:bg-white/5 text-black dark:text-white transition-colors duration-300"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
