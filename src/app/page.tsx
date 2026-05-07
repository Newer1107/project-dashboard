import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveUserFromHeaders } from "@/lib/resolve-user";

export default async function HomePage() {
  const requestHeaders = await headers();
  const user = await resolveUserFromHeaders(requestHeaders);

  if (!user) {
    redirect("http://localhost:3000/login?callbackUrl=http://localhost:3000/");
    const forwardedProto = requestHeaders.get("x-forwarded-proto");
    const forwardedHost = requestHeaders.get("x-forwarded-host");
    const host = forwardedHost ?? requestHeaders.get("host");
    const protocol =
      forwardedProto ?? (host?.includes("localhost") ? "http" : "https");
    const requestOrigin = host ? `${protocol}://${host}` : "";
    const authBaseUrl =
      process.env.NEXT_PUBLIC_AUTH_BASE_URL?.replace(/\/$/, "") ||
      requestOrigin;
    const callbackUrl = `${requestOrigin}/`;
    redirect(
      `${authBaseUrl}/login?${new URLSearchParams({ callbackUrl }).toString()}`,
    );
  }

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "TEACHER") redirect("/teacher");
  redirect("/student");
}
