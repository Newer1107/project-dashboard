"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ShowcaseAsset = {
  id: string;
  fileUrl: string;
  accessUrl?: string;
};

type ShowcaseProject = {
  id: string;
  title: string;
  shortDescription: string;
  projectDomain: string;
  owner: { name: string | null };
  updatedAt: Date | string;
  liveDemoUrl?: string | null;
  techStack: unknown;
  assets: ShowcaseAsset[];
};

const statusOptions = ["ALL", "COMPLETED", "ONGOING"] as const;
type StatusFilter = (typeof statusOptions)[number];

function toTagArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function inferProgress(project: ShowcaseProject): Exclude<StatusFilter, "ALL"> {
  if (project.liveDemoUrl) return "COMPLETED";
  if ((project.assets ?? []).length >= 2) return "COMPLETED";
  return "ONGOING";
}

export function ShowcaseGalleryClient({ projects }: { projects: ShowcaseProject[] }) {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const domains = useMemo(() => {
    const values = new Set(projects.map((project) => project.projectDomain));
    return ["ALL", ...Array.from(values).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesDomain = domain === "ALL" || project.projectDomain === domain;
      const matchesStatus = status === "ALL" || inferProgress(project) === status;

      if (!query) {
        return matchesDomain && matchesStatus;
      }

      const tags = toTagArray(project.techStack).join(" ").toLowerCase();
      const haystack = `${project.title} ${project.shortDescription} ${project.owner.name || ""} ${tags}`.toLowerCase();
      const matchesSearch = haystack.includes(query);

      return matchesDomain && matchesStatus && matchesSearch;
    });
  }, [projects, search, domain, status]);

  if (projects.length === 0) {
    return (
      <div className="premium-panel rounded-3xl p-12 text-center text-slate-300">
        No public showcase projects are published yet.
      </div>
    );
  }

  return (
    <section id="explore" className="space-y-8">
      <div className="premium-panel rounded-3xl p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.6fr]">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Department</span>
            <select
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60"
            >
              {domains.map((domainValue) => (
                <option key={domainValue} value={domainValue}>
                  {domainValue === "ALL" ? "All Departments" : domainValue.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Status</span>
            <div className="grid h-11 grid-cols-3 rounded-xl border border-white/10 bg-slate-900/60 p-1">
              {statusOptions.map((value) => {
                const active = status === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={`rounded-lg text-xs font-medium tracking-wide transition ${
                      active
                        ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950"
                        : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Search</span>
            <div className="h-11 rounded-xl border border-white/10 bg-slate-900/60 px-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects, author, or stack"
                className="h-full w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project, index) => {
          const preview = (project.assets ?? [])[0];
          const imageSrc = preview?.accessUrl || preview?.fileUrl || "";
          const tags = toTagArray(project.techStack).slice(0, 5);

          return (
            <Link
              key={project.id}
              href={`/showcase/${project.id}`}
              className="group premium-card animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-[0_25px_60px_-40px_rgba(14,116,144,0.7)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-35px_rgba(99,102,241,0.75)]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative h-52 overflow-hidden">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.35),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.4),transparent_36%),linear-gradient(160deg,#0f172a,#020617)]" />
                )}
                <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur">
                  {project.projectDomain.replaceAll("_", " ")}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="line-clamp-2 text-xl font-semibold text-slate-50">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300/90">{project.shortDescription}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.length === 0 ? (
                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-slate-400">No tech tags</span>
                  ) : (
                    tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100">
                        {tag}
                      </span>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                  <span>{project.owner.name || "Unknown author"}</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="premium-panel rounded-2xl p-8 text-center text-sm text-slate-300">
          No projects match your current filters.
        </div>
      ) : null}
    </section>
  );
}
