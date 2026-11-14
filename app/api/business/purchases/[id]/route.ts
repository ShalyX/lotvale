import {
  currentUser,
  ownedPurchase,
  db,
  mutationBody,
  apiError,
} from "@/lib/business";
import { projectSchema } from "@/lib/schema";
import { z } from "zod";
type Context = { params: Promise<{ id: string }> };
export async function GET(_: Request, context: Context) {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json(
        { error: "Sign in to your workspace." },
        { status: 401 },
      );
    const p = await ownedPurchase(user.id, (await context.params).id);
    return p
      ? Response.json(p, { headers: { "Cache-Control": "no-store" } })
      : Response.json({ error: "Purchase not found." }, { status: 404 });
  } catch (e) {
    return apiError(e);
  }
}
export async function PUT(request: Request, context: Context) {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json(
        { error: "Sign in to your workspace." },
        { status: 401 },
      );
    const id = z
      .string()
      .uuid()
      .parse((await context.params).id);
    const input = z
      .object({
        revision: z.number().int().positive(),
        document: projectSchema,
      })
      .parse(await mutationBody(request));
    const row = await db.query(
      "UPDATE lotvale_purchases p SET document=$1,revision=p.revision+1,updated_at=now() FROM lotvale_businesses b WHERE p.business_id=b.id AND b.owner_id=$2 AND p.id=$3 AND p.revision=$4 RETURNING p.revision,p.updated_at",
      [JSON.stringify({ ...input.document, id }), user.id, id, input.revision],
    );
    if (!row.rowCount) {
      const owned = await ownedPurchase(user.id, id);
      return Response.json(
        {
          error: owned
            ? "This purchase changed in another tab. Back up your edits, then reload before saving."
            : "Purchase not found.",
        },
        { status: owned ? 409 : 404 },
      );
    }
    return Response.json(row.rows[0]);
  } catch (e) {
    return apiError(e);
  }
}
