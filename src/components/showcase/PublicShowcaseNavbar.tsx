import Link from "next/link";

type Viewer = {
  name?: string | null;
  role?: string | null;
};

function dashboardHref(role?: string | null): string {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/student";
}

export function PublicShowcaseNavbar({ viewer }: { viewer?: Viewer | null }) {
  const initials = viewer?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/showcase" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-indigo-500 text-sm font-bold text-slate-950 shadow-[0_10px_30px_-12px_rgba(99,102,241,0.8)]">
            U
          </span>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Innovation Portal</p>
            <p className="text-sm font-semibold text-slate-100">University Showcase</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/showcase" className="text-sm text-slate-200 transition hover:text-white">Showcase</Link>
          <a href="#explore" className="text-sm text-slate-300 transition hover:text-white">Explore</a>
          <a href="#categories" className="text-sm text-slate-300 transition hover:text-white">Categories</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {viewer ? (
            <>
              <span className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 sm:inline-flex">
                {viewer.name || "User"}
              </span>
              <Link
                href={dashboardHref(viewer.role)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20"
              >
                Dashboard
              </Link>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-slate-100">
                {initials}
              </span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/15"
              >
                Login
              </Link>
              <Link
                href="/showcase/my-projects"
                className="hidden rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:inline-flex"
              >
                Submit Project
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
