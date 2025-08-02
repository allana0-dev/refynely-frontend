// src/app/(protected)/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SlideSidebar from "@/components/studio/SlidesSideBar";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  return (
    <div className="flex h-screen">
      <SlideSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
