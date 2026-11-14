import { redirect, notFound } from "next/navigation";
import { currentUser, ownedPurchase } from "@/lib/business";
import { projectSchema } from "@/lib/schema";
import { Workspace } from "@/components/workspace";
export const dynamic = "force-dynamic";
export default async function PurchasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in");
  const row = await ownedPurchase(user.id, (await params).id);
  if (!row) notFound();
  return (
    <Workspace
      initialProject={projectSchema.parse(row.document)}
      cloudId={row.id}
      initialRevision={row.revision}
    />
  );
}
