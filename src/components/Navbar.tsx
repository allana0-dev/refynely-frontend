"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-900 dark:text-white"
          >
            REFYNELY
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="nav-link">
              Features
            </Link>
            <Link href="/pricing" className="nav-link">
              Pricing <span className="ml-1 text-sm text-green-600">Free</span>
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/docs" className="nav-link">
              Docs
            </Link>
            <Link href="/support" className="nav-link">
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label="Toggle dark mode"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            )}

            <Link href="/login" className="nav-link hidden md:inline">
              Login
            </Link>
            <Link href="/signup" className="btn-primary hidden md:inline">
              Get Started
            </Link>

            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {[
            "features",
            "pricing",
            "about",
            "docs",
            "support",
            "login",
            "signup",
          ].map((p) => {
            const label =
              p === "pricing"
                ? "Pricing (Free)"
                : p.charAt(0).toUpperCase() + p.slice(1);
            const href = `/${p}`;
            return (
              <Link
                key={p}
                href={href}
                className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
