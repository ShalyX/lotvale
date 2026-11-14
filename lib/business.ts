import "server-only";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { auth } from "@/lib/auth/server";
import { z } from "zod";
const globalDb = globalThis as unknown as { lotvalePool?: Pool };
export const db =
  globalDb.lotvalePool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 4,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 15000,
  });
if (!globalDb.lotvalePool) {
  globalDb.lotvalePool = db;
  attachDatabasePool(db);
}
export const businessSchema = z.object({
  name: z.string().trim().min(1).max(160),
  currency: z.string().regex(/^[A-Z]{3}$/),
  address: z.string().max(1000),
  contact_email: z
    .string()
    .max(200)
    .refine(
      (v) => !v || z.string().email().safeParse(v).success,
      "Use a valid contact email",
    ),
});
export async function currentUser() {
  // Revalidate with the provider so reset/revocation is not delayed by the cached cookie.
  const { data: session } = await auth.getSession({
    query: { disableCookieCache: "true" },
  });
  return session?.user?.emailVerified ? session.user : null;
}
export async function ownedBusiness(userId: string) {
  return (
    (
      await db.query(
        "SELECT id,name,currency,address,contact_email FROM lotvale_businesses WHERE owner_id=$1",
        [userId],
      )
    ).rows[0] ?? null
  );
}
export async function ownedPurchase(userId: string, id: string) {
  if (!z.string().uuid().safeParse(id).success) return null;
  return (
    (
      await db.query(
        "SELECT p.id,p.document,p.revision,p.updated_at FROM lotvale_purchases p JOIN lotvale_businesses b ON b.id=p.business_id WHERE p.id=$1 AND b.owner_id=$2",
        [id, userId],
      )
    ).rows[0] ?? null
  );
}
export async function mutationBody(request: Request) {
  const origin = request.headers.get("origin");
  const target = new URL(request.url);
  const hostOrigin = `${target.protocol}//${request.headers.get("host")}`;
  if (origin && origin !== target.origin && origin !== hostOrigin)
    throw new Error("ORIGIN");
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("FORMAT");
  const raw = await request.text();
  if (raw.length > 400000) throw new Error("SIZE");
  return JSON.parse(raw);
}
export function apiError(error: unknown) {
  if (
    error instanceof z.ZodError ||
    error instanceof SyntaxError ||
    (error instanceof Error &&
      ["ORIGIN", "FORMAT", "SIZE"].includes(error.message))
  )
    return Response.json(
      { error: "Check the submitted details and try again." },
      { status: 400 },
    );
  console.error(
    "Business request failed",
    error instanceof Error ? error.name : "UnknownError",
  );
  return Response.json(
    {
      error:
        "The workspace could not be saved or loaded. Your open edits are preserved; please retry.",
    },
    { status: 503 },
  );
}
