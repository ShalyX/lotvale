import { AuthScreen } from "@/components/auth-screen";
import { notFound } from "next/navigation";
export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  if (
    !["sign-in", "sign-up", "forgot-password", "reset-password"].includes(path)
  )
    notFound();
  return <AuthScreen mode={path} />;
}
