"use client";

import { useSession } from "next-auth/react";
import { ReactNode, Suspense, useState } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Toaster } from "@/components/ui/toaster";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = useSession();
  if (session.data === null) {
    redirect("/sign-in");
  }

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 pl-6 mt-2 overflow-y-scroll">
          <div className="mx-auto">{children}</div>
        </main>
        <Toaster />
      </div>
    </div>
  );
}
