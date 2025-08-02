// src/app/(protected)/presentations/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import SlideCanvas from "@/components/studio/SlideCanvas";
import api from "@/lib/api";

interface Deck {
  id: string;
  title: string;
  createdAt: string;
  slides: Array<{
    id: string;
    title: string;
    content: string;
    orderIndex: number;
  }>;
}

export default function PresentationStudioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeck() {
      if (!id) return;

      try {
        setLoading(true);
        const deckData = await api.get<Deck>(`/decks/${id}`);
        setDeck(deckData);
      } catch (err: any) {
        console.error("Failed to fetch deck:", err);
        setError(err.message || "Failed to load presentation");
      } finally {
        setLoading(false);
      }
    }

    fetchDeck();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center px-6 py-4 bg-white border-b">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">
            Loading...
          </h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading presentation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center px-6 py-4 bg-white border-b">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">Error</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Presentation Not Found
            </h3>
            <p className="text-red-600 mb-4">
              {error ||
                "This presentation does not exist or you do not have access to it."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go Back
              </button>
              <Link
                href="/presentations/me"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                My Presentations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar with back and title */}
      <header className="flex items-center px-6 py-4 bg-white border-b">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-xl font-semibold text-gray-900">{deck.title}</h1>
          <p className="text-sm text-gray-500">
            {deck.slides.length} slide{deck.slides.length !== 1 ? "s" : ""} •
            Last updated {new Date(deck.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Save indicator */}
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Saved
          </div>
          <Link
            href="/presentations/me"
            className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            My Presentations
          </Link>
        </div>
      </header>

      {/* Slide Studio Canvas */}
      <div className="flex-1 overflow-hidden">
        <SlideCanvas />
      </div>
    </div>
  );
}
