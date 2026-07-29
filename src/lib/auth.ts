import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "liora_fallback_secret"
);

export async function signToken(payload: {
  userId: number;
  email: string;
}): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ userId: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: number; email: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("liora_token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));
  return user || null;
}

export async function checkAndConsumeCredit(
  userId: number
): Promise<{ ok: boolean; message?: string }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return { ok: false, message: "User not found" };

  // Pro users get 300 credits/month
  const limit = user.plan === "pro" ? 300 : 5;

  // Reset credits monthly
  const resetAt = new Date(user.creditsResetAt);
  const now = new Date();
  const monthDiff =
    (now.getFullYear() - resetAt.getFullYear()) * 12 +
    (now.getMonth() - resetAt.getMonth());

  if (monthDiff >= 1) {
    await db
      .update(users)
      .set({ creditsUsed: 1, creditsLimit: limit, creditsResetAt: now })
      .where(eq(users.id, userId));
    return { ok: true };
  }

  if (user.creditsUsed >= limit) {
    return {
      ok: false,
      message:
        user.plan === "free"
          ? "Limite gratuite atteinte (20/mois). Passez à Pro pour 300 générations/mois."
          : "Limite mensuelle atteinte (300/mois). Renouvellement le mois prochain.",
    };
  }

  await db
    .update(users)
    .set({ creditsUsed: user.creditsUsed + 1, creditsLimit: limit })
    .where(eq(users.id, userId));
  return { ok: true };
}
