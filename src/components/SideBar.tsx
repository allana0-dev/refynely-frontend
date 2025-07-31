// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const items = [
  { label: "My Presentations", href: "/presentations/me" },
  { label: "Pitch Templates", href: "/templates" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <nav className="w-64 bg-white border-r flex flex-col h-screen">
      <div className="p-6 text-2xl font-bold">REFYNELY</div>
      <ul className="flex-1">
        {items.map((item) => {
          const isActive = path === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-6 py-3 hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-semibold" : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        onClick={handleLogout}
        className="w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-100 border-t"
      >
        Logout
      </button>
    </nav>
  );
}
