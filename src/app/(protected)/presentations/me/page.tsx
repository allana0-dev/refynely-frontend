"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import {
  Plus,
  Bot,
  Calendar,
  FileText,
  Search,
  Filter,
  Grid,
  List,
  LayoutGrid,
} from "lucide-react";
import router from "next/router";

interface Deck {
  id: string;
  title: string;
  createdAt: string;
  slides: { id: string }[];
}

export default function MyPresentationsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "title" | "slides">("date");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [step, setStep] = useState<"choose" | "aiForm">("choose");

  // form state
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [elevatorPitch, setElevatorPitch] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [differentiator, setDifferentiator] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState<"Professional" | "Playful" | "Data-driven">(
    "Professional"
  );
  const [slideCount, setSlideCount] = useState<number>(10);

  useEffect(() => {
    let cancelled = false;

    async function fetchDecks() {
      try {
        const decks = await api.get<Deck[]>("/decks");
        if (!cancelled) {
          setDecks(decks);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load presentations.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDecks();

    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setStep("choose");
    setShowCreateModal(true);
  };
  const closeCreate = () => setShowCreateModal(false);

  const handleAiChoice = () => setStep("aiForm");
  const handleTemplateChoice = () => {
    console.log("Navigate to templates");
  };
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        company: companyName,
        industry: industry,
        problem: problem,
        solution: solution,
        businessModel: "", // You might want to add this field to your form
        financials: "", // You might want to add this field to your form
        // Include the optional fields you have
        tagline: tagline,
        elevatorPitch: elevatorPitch,
        targetCustomer: targetCustomer,
        differentiator: differentiator,
        goal: goal,
        tone: tone,
        slideCount: slideCount,
      };

      console.log("Sending payload:", payload); // Add for debugging

      const slideOutline = await api.post<any[]>(
        "/ai/generate-outline",
        payload
      );

      console.log("Received outline:", slideOutline); // Add for debugging

      const newDeck = await api.post<{ id: string; title: string }>("/decks", {
        title: companyName || "Untitled Presentation",
        slides: slideOutline,
      });

      console.log("Created deck:", newDeck); // Add for debugging

      closeCreate();

      // 4) Navigate to the studio - keep your existing navigation
      window.location.href = `/presentations/${newDeck.id}`;
    } catch (error: any) {
      console.error("Failed to generate presentation:", error);
      setError(
        error.message || "Something went wrong generating your presentation."
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Filter and sort decks
  const filteredAndSortedDecks = decks
    .filter((deck) =>
      deck.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "slides":
          return b.slides.length - a.slides.length;
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-slate-600">
                Loading your presentations...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Presentations
              </h1>
              <p className="text-gray-600">
                Create, manage, and share your pitch decks
              </p>
            </div>
            <button
              onClick={() => {
                openCreate();
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Plus size={20} />
              <span>Create New Presentation</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search presentations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "date" | "title" | "slides")
                    }
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="slides">Sort by Slides</option>
                  </select>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredAndSortedDecks.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            {searchTerm ? (
              // Search results empty state
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    No presentations found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    No presentations match "{searchTerm}". Try adjusting your
                    search.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              // Empty state with large create box
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div
                  className="relative group cursor-pointer"
                  onClick={() => {
                    openCreate();
                  }}
                >
                  <div className="border-3 border-dashed border-blue-300 hover:border-blue-500 rounded-3xl p-16 bg-gradient-to-br from-blue-50/50 to-purple-50/50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-shadow"
                      >
                        <Plus className="w-12 h-12 text-white" />
                      </motion.div>

                      <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                        Create Your First Presentation
                      </h2>

                      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Get started with our AI-powered pitch deck generator.
                        Create professional presentations in minutes.
                      </p>

                      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>AI-Generated Content</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Professional Templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Easy Export</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements for visual interest */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-200 rounded-full opacity-40 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute top-1/2 -right-8 w-6 h-6 bg-green-200 rounded-full opacity-50 group-hover:opacity-90 transition-opacity"></div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-500 text-sm">
                    Click anywhere in the box above to get started
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }
          >
            {filteredAndSortedDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: viewMode === "grid" ? 1.02 : 1.01 }}
                className={`bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden transition-all group ${
                  viewMode === "list" ? "flex items-center p-4" : ""
                }`}
              >
                <Link href={`/presentations/${deck.id}`} className="block">
                  {viewMode === "grid" ? (
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {deck.title}
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(deck.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                          {deck.slides.length}{" "}
                          {deck.slides.length === 1 ? "slide" : "slides"}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-blue-600 font-medium">
                            View →
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {deck.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(deck.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {deck.slides.length} slides
                          </span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm text-blue-600 font-medium">
                          View →
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {decks.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {decks.length}
                </div>
                <div className="text-sm text-gray-600">Total Presentations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {decks.reduce((sum, deck) => sum + deck.slides.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Slides</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {Math.round(
                    decks.reduce((sum, deck) => sum + deck.slides.length, 0) /
                      decks.length
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Avg. Slides per Deck
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Presentation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {step === "choose"
                    ? "Create a New Presentation"
                    : "Tell us about your company"}
                </h2>
                <button
                  onClick={closeCreate}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              {step === "choose" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.button
                    onClick={handleAiChoice}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center p-8 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all group"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-gray-900 mb-2">
                      AI Generated
                    </span>
                    <p className="text-center text-gray-600 text-sm leading-relaxed">
                      Let our AI create a professional pitch deck tailored to
                      your business
                    </p>
                  </motion.button>

                  <motion.button
                    onClick={handleTemplateChoice}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center p-8 bg-green-50 hover:bg-green-100 rounded-xl border-2 border-transparent hover:border-green-200 transition-all group"
                  >
                    <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <LayoutGrid className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-gray-900 mb-2">
                      Use a Template
                    </span>
                    <p className="text-center text-gray-600 text-sm leading-relaxed">
                      Start with a pre-designed template and customize it to
                      your needs
                    </p>
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="companyName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Company Name *
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Refynely"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="industry"
                        className="text-sm font-medium text-gray-700"
                      >
                        Industry *
                      </label>
                      <input
                        id="industry"
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g., SaaS, FinTech, HealthTech"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tagline"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tagline
                    </label>
                    <input
                      id="tagline"
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g., AI-Powered Pitch Decks in Seconds"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="elevatorPitch"
                      className="text-sm font-medium text-gray-700"
                    >
                      Elevator Pitch *
                    </label>
                    <textarea
                      id="elevatorPitch"
                      value={elevatorPitch}
                      onChange={(e) => setElevatorPitch(e.target.value)}
                      placeholder="Describe your company in 1-2 sentences..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="targetCustomer"
                      className="text-sm font-medium text-gray-700"
                    >
                      Target Customer *
                    </label>
                    <input
                      id="targetCustomer"
                      type="text"
                      value={targetCustomer}
                      onChange={(e) => setTargetCustomer(e.target.value)}
                      placeholder="e.g., B2B SaaS companies, SMEs, Enterprise"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="problem"
                        className="text-sm font-medium text-gray-700"
                      >
                        Problem You're Solving *
                      </label>
                      <textarea
                        id="problem"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="What problem does your product solve?"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="solution"
                        className="text-sm font-medium text-gray-700"
                      >
                        Solution *
                      </label>
                      <textarea
                        id="solution"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="How does your product solve this problem?"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="differentiator"
                      className="text-sm font-medium text-gray-700"
                    >
                      What Makes You Different *
                    </label>
                    <textarea
                      id="differentiator"
                      value={differentiator}
                      onChange={(e) => setDifferentiator(e.target.value)}
                      placeholder="What sets you apart from competitors?"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="goal"
                        className="text-sm font-medium text-gray-700"
                      >
                        Goal
                      </label>
                      <input
                        id="goal"
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Raise $1M"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="tone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Tone
                      </label>
                      <select
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Playful">Playful</option>
                        <option value="Data-driven">Data-driven</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="slideCount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Slides
                      </label>
                      <input
                        id="slideCount"
                        type="number"
                        min="5"
                        max="20"
                        value={slideCount}
                        onChange={(e) => setSlideCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => setStep("choose")}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      ← Back
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={closeCreate}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={
                          loading ||
                          !companyName ||
                          !elevatorPitch ||
                          !industry ||
                          !targetCustomer ||
                          !problem ||
                          !solution ||
                          !differentiator
                        }
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {loading ? "Generating..." : "Generate Presentation"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
