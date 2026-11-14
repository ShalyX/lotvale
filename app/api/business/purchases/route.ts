import {
  currentUser,
  ownedBusiness,
  db,
  mutationBody,
  apiError,
} from "@/lib/business";
import { emptyProject } from "@/lib/schema";
import { z } from "zod";
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json(
        { error: "Sign in to your workspace." },
        { status: 401 },
      );
    const rows = await db.query(
      "SELECT p.id,jsonb_build_object('title',p.document->'title','currency',p.document->'currency','budgetCents',p.document->'budgetCents','deadline',p.document->'deadline','itemCount',jsonb_array_length(p.document->'items'),'quoteCount',jsonb_array_length(p.document->'quotes'),'reviewedCount',(SELECT count(*) FROM jsonb_array_elements(p.document->'quotes') q WHERE q->>'confirmed'='true')) AS document,p.revision,p.updated_at FROM lotvale_purchases p JOIN lotvale_businesses b ON b.id=p.business_id WHERE b.owner_id=$1 ORDER BY p.updated_at DESC LIMIT 200",
      [user.id],
    );
    return Response.json(
      { purchases: rows.rows },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json(
        { error: "Sign in to your workspace." },
        { status: 401 },
      );
    const b = await ownedBusiness(user.id);
    if (!b)
      return Response.json(
        { error: "Set up your business first." },
        { status: 409 },
      );
    const input = z
      .object({
        id: z.string().uuid(),
        title: z.string().trim().min(1).max(160),
      })
      .parse(await mutationBody(request));
    const p = {
      ...emptyProject(),
      id: input.id,
      title: input.title,
      currency: b.currency,
      buyer: { name: b.name, address: b.address, email: b.contact_email },
    };
    const row = await db.query(
      "INSERT INTO lotvale_purchases(id,business_id,document) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING RETURNING id",
      [input.id, b.id, JSON.stringify(p)],
    );
    if (!row.rowCount) {
      const existing = await db.query(
        "SELECT id FROM lotvale_purchases WHERE id=$1 AND business_id=$2",
        [input.id, b.id],
      );
      if (!existing.rowCount)
        return Response.json(
          { error: "Please start a new purchase." },
          { status: 409 },
        );
    }
    return Response.json({ id: input.id }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
