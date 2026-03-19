import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PublicShowcaseNavbar } from "@/components/showcase/PublicShowcaseNavbar";
import { getPublicShowcaseProjectById } from "@/server/actions/showcase";

export const dynamic = "force-dynamic";

export default async function ShowcaseProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  const { projectId } = await params;
  const project = await getPublicShowcaseProjectById(projectId);

  if (!project) {
    notFound();
  }

  const screenshots = project.assets.filter((asset) => asset.kind === "SCREENSHOT");
  const docs = project.assets.filter((asset) => asset.kind === "DOCUMENTATION");
  const heroVisual = screenshots[0]?.accessUrl || screenshots[0]?.fileUrl;

  return (
    <main className="premium-showcase-surface min-h-screen text-slate-100">
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/showcase" className="text-xs uppercase tracking-[0.18em] text-slate-400 transition hover:text-slate-200">
            Back to Showcase
          </Link>
        </div>

        <section className="premium-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 top-0 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-fade-up space-y-5">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{project.projectDomain.replace("_", " ")}</p>
              <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">{project.title}</h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-200">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-2">
                {((project.techStack as string[]) ?? []).map((tech) => (
                  <span key={tech} className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400">Published by {project.owner.name || "Unknown author"}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80">
              {heroVisual ? (
                <img src={heroVisual} alt={project.title} className="h-64 w-full object-cover sm:h-full" />
              ) : (
                <div className="h-64 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_40%),radial-gradient(circle_at_80%_5%,rgba(99,102,241,0.5),transparent_35%),linear-gradient(160deg,#0f172a,#020617)] sm:h-full" />
              )}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <DetailSection title="Overview" content={project.fullDescription} />
            <DetailSection title="Problem" content={project.problemStatement} />
            <DetailSection title="Approach" content={project.methodology} />
            <DetailSection title="Objectives" content={project.objectives} />
            <DetailTags title="Features" items={(project.keyFeatures as string[]) ?? []} />
            <DetailSection title="Architecture" content={project.architectureDescription} />
            <DetailSection title="Database" content={project.databaseUsed} />
            <DetailTags title="Integrations" items={(project.apiIntegrations as string[]) ?? []} />

            <section className="premium-panel rounded-3xl p-6">
              <h2 className="text-lg font-semibold">Screenshots</h2>
              {screenshots.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No screenshots uploaded.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {screenshots.map((shot) => (
                    <a
                      key={shot.id}
                      href={shot.accessUrl || shot.fileUrl}
                      target="_blank"
                      className="group overflow-hidden rounded-2xl border border-white/15"
                    >
                      <img
                        src={shot.accessUrl || shot.fileUrl}
                        alt={shot.fileName || "Project screenshot"}
                        className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="premium-panel rounded-3xl p-6">
              <h2 className="text-lg font-semibold">Project Sidebar</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Team</p>
                  <div className="mt-2 space-y-2">
                    {project.teamMembers.length === 0 ? (
                      <p className="text-slate-400">No team members listed.</p>
                    ) : (
                      project.teamMembers.map((member) => (
                        <div key={member.id}>
                          <p className="font-medium text-slate-100">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.role}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Mentor</p>
                  {project.mentorName ? (
                    <>
                      <p className="mt-2 font-medium text-slate-100">{project.mentorName}</p>
                      {project.mentorEmail ? <p className="text-xs text-slate-400">{project.mentorEmail}</p> : null}
                    </>
                  ) : (
                    <p className="mt-2 text-slate-400">Not provided</p>
                  )}
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Links</p>
                  <div className="mt-2 space-y-2">
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" className="block text-cyan-300 transition hover:text-cyan-200">
                        GitHub Repository
                      </a>
                    ) : null}
                    {project.liveDemoUrl ? (
                      <a href={project.liveDemoUrl} target="_blank" className="block text-cyan-300 transition hover:text-cyan-200">
                        Live Demo
                      </a>
                    ) : null}
                    {project.documentationUrl ? (
                      <a href={project.documentationUrl} target="_blank" className="block text-cyan-300 transition hover:text-cyan-200">
                        Documentation Link
                      </a>
                    ) : null}
                    {docs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.accessUrl || doc.fileUrl}
                        target="_blank"
                        className="block text-cyan-300 transition hover:text-cyan-200"
                      >
                        {doc.fileName || "Documentation file"}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Categories</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {((project.categories as string[]) ?? []).length === 0 ? (
                      <p className="text-slate-400">No categories</p>
                    ) : (
                      ((project.categories as string[]) ?? []).map((category) => (
                        <span key={category} className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-slate-200">
                          {category}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function DetailSection({ title, content }: { title: string; content?: string | null }) {
  return (
    <section className="premium-panel rounded-3xl p-6">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{content?.trim() || "Not provided"}</p>
    </section>
  );
}

function DetailTags({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="premium-panel rounded-3xl p-6">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">Not provided</p>
        ) : (
          items.map((item) => (
            <span key={item} className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
              {item}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
