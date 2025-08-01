// src/app/(protected)/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/SideBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  const showSidebar =
    pathname === "/presentations/me" || pathname === "/templates";

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
