import { auth } from "@/auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
