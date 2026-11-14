import { redirect } from "next/navigation";
import { currentUser } from "@/lib/business";
import { BusinessDesk } from "@/components/business-desk";
export const dynamic = "force-dynamic";
export default async function BusinessPage() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in");
  return <BusinessDesk />;
}
