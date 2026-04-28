import jwt, { JwtPayload } from "jsonwebtoken";

type CoeRole = "ADMIN" | "FACULTY" | "STUDENT" | "INDUSTRY";
type CoeStatus = "ACTIVE" | "PENDING" | "REJECTED";

type CoeTokenPayload = {
  email: string;
  role: CoeRole;
  status: CoeStatus;
};

export function mapCoERoleToDashboard(role: string | null | undefined) {
  if (role === "ADMIN") return "ADMIN";
  if (role === "FACULTY") return "TEACHER";
  if (role === "STUDENT") return "STUDENT";
  return null;
}

export function verifyCoEToken(token: string | null | undefined): CoeTokenPayload | null {
  if (!token) return null;

  const secret = process.env.COE_JWT_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    if (!decoded || typeof decoded !== "object") return null;

    const email = decoded.email as string | undefined;
    const role = decoded.role as CoeRole | undefined;
    const status = decoded.status as CoeStatus | undefined;

    if (!email || !role || !status) return null;
    if (!mapCoERoleToDashboard(role)) return null;

    return { email, role, status };
  } catch {
    return null;
  }
}
