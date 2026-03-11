import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  logger: {
    error(error: any) {
      // CredentialsSignin is expected when users enter wrong credentials — not a real error
      const name =
        error?.name ?? error?.error?.name ?? error?.type ?? "";
      if (name === "CredentialsSignin") return;
      console.error("[auth][error]", error);
    },
    warn(code: string) {
      console.warn("[auth][warn]", code);
    },
    debug(message: string, metadata?: unknown) {
      // silent in production
      if (process.env.NODE_ENV === "development") {
        console.debug("[auth][debug]", message, metadata);
      }
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        if (!user.isActive) {
          console.warn(
            `[auth] Login attempt for inactive account: ${email}`
          );
          return null;
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user?.id) {
        // Record last-login timestamp without blocking the response
        prisma.user
          .update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
          })
          .catch(() => {});
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
