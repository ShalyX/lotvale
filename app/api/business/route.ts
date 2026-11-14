import {
  currentUser,
  ownedBusiness,
  db,
  businessSchema,
  mutationBody,
  apiError,
} from "@/lib/business";
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json(
        { error: "Sign in to your workspace." },
        { status: 401 },
      );
    return Response.json(
      { business: await ownedBusiness(user.id) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json(
        { error: "Sign in to your workspace." },
        { status: 401 },
      );
    const b = businessSchema.parse(await mutationBody(request));
    const result = await db.query(
      "INSERT INTO lotvale_businesses(owner_id,name,currency,address,contact_email) VALUES($1,$2,$3,$4,$5) ON CONFLICT(owner_id) DO UPDATE SET name=$2,currency=$3,address=$4,contact_email=$5,updated_at=now() RETURNING id,name,currency,address,contact_email",
      [user.id, b.name, b.currency, b.address, b.contact_email],
    );
    return Response.json({ business: result.rows[0] });
  } catch (e) {
    return apiError(e);
  }
}
