// Updated SlideCanvas.tsx with fixed type handling
"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Rnd } from "react-rnd";
import SlideElement from "./SlideElement";
import StudioToolbar from "./StudioToolbar";
import { SlideControls } from "./SlideControls";
import { useStudioStore, Slide } from "../../lib/studioStore";
import api from "@/lib/api";

// Define the deck types to match your backend structure
interface DeckSlide {
  id: string;
  title: string;
  content: string;
  layout?: {
    frontend?: {
      type: string;
      hasImage: boolean;
      imagePosition?: string;
    };
    export?: {
      layout: string;
      imagePosition?: string;
      emphasize?: string;
    };
    imageUrl?: string;
    imagePrompt?: string;
    slideType?: string;
    elements?: Array<{
      type: string;
      content?: string;
      imagePrompt?: string;
      url?: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      style?: any;
      suggestions?: string[];
    }>;
  };
  speakerNotes?: string;
  orderIndex: number;
}

interface Deck {
  id: string;
  title: string;
  slides: DeckSlide[];
  createdAt: string;
}

export default function SlideCanvas() {
  const { id: deckId } = useParams();

  const {
    slides,
    activeSlideIndex,
    setActiveSlideIndex,
    addSlide,
    updateElement,
    setSlides,
    isLoading,
    setLoading,
  } = useStudioStore();

  // Get current slide info
  const activeSlide = slides[activeSlideIndex];
  const currentSlideId = activeSlide?.id;

  // Load deck data on mount
  useEffect(() => {
    async function loadDeck() {
      if (!deckId) return;

      setLoading(true);
      try {
        const deck = await api.get<Deck>(`/decks/${deckId}`);

        // Convert deck slides to studio format
        const studioSlides: Slide[] = deck.slides
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((slide: DeckSlide): Slide => {
            // Handle new hybrid layout structure
            if (slide.layout) {
              // Check if it has the new structure
              if (slide.layout.frontend || slide.layout.export) {
                const elements = [];

                // Add title element
                elements.push({
                  id: `title-${slide.id}`,
                  type: "title" as const,
                  content: slide.title,
                  position: { x: 50, y: 40 },
                  size: { width: 800, height: 60 },
                  style: {
                    fontSize: 32,
                    color: "#1e3a8a",
                    fontWeight: "bold",
                  },
                });

                // Add content element
                elements.push({
                  id: `content-${slide.id}`,
                  type: "text" as const,
                  content: slide.content,
                  position: { x: 50, y: 120 },
                  size: { width: 800, height: 300 },
                  style: { fontSize: 16, color: "#374151" },
                });

                // Add image element if available
                if (slide.layout.imageUrl) {
                  const imagePosition =
                    slide.layout.frontend?.imagePosition ||
                    slide.layout.export?.imagePosition ||
                    "right";
                  const imageX =
                    imagePosition === "right"
                      ? 450
                      : imagePosition === "left"
                      ? 50
                      : 200;
                  const imageY =
                    imagePosition === "top"
                      ? 80
                      : imagePosition === "bottom"
                      ? 200
                      : 200;

                  elements.push({
                    id: `image-${slide.id}`,
                    type: "image" as const,
                    content: "",
                    position: { x: imageX, y: imageY },
                    size: { width: 400, height: 200 },
                    style: {},
                    imagePrompt: slide.layout.imagePrompt || "",
                    url: slide.layout.imageUrl,
                    src: slide.layout.imageUrl,
                  });
                }
                // Add image suggestions if no actual image but suggestions exist
                else if (
                  slide.layout.frontend?.hasImage ||
                  slide.layout.imagePrompt
                ) {
                  elements.push({
                    id: `imageSuggestions-${slide.id}`,
                    type: "imageSuggestions" as const,
                    content: "",
                    position: { x: 450, y: 250 },
                    size: { width: 400, height: 200 },
                    style: {
                      fontSize: 14,
                      backgroundColor: "#f8f9fa",
                      border: "2px dashed #dee2e6",
                      padding: "16px",
                      borderRadius: "8px",
                    },
                    imagePrompt: slide.layout.imagePrompt || "",
                    suggestions: [
                      "business chart",
                      "professional graphic",
                      "corporate image",
                      "presentation visual",
                    ],
                  });
                }

                return {
                  id: slide.id,
                  title: slide.title,
                  content: slide.content,
                  speakerNotes: slide.speakerNotes || "",
                  elements: elements,
                  deckId: deckId as string,
                  userId: "", // Will be populated from user context
                  orderIndex: slide.orderIndex,
                  layout: slide.layout,
                };
              }

              // Handle legacy elements structure
              else if (slide.layout.elements) {
                const elements = slide.layout.elements.map(
                  (element, index) => ({
                    id: `${element.type}-${slide.id}-${index}`,
                    type: element.type as any,
                    content: element.content || "",
                    position: element.position,
                    size: element.size,
                    style: element.style,
                    imagePrompt: element.imagePrompt,
                    url: element.url,
                    src: element.url,
                    suggestions: element.suggestions,
                  })
                );

                return {
                  id: slide.id,
                  title: slide.title,
                  content: slide.content,
                  speakerNotes: slide.speakerNotes || "",
                  elements: elements,
                  deckId: deckId as string,
                  userId: "",
                  orderIndex: slide.orderIndex,
                  layout: slide.layout,
                };
              }
            }

            // Fallback to basic structure
            return {
              id: slide.id,
              title: slide.title,
              content: slide.content,
              speakerNotes: slide.speakerNotes || "",
              deckId: deckId as string,
              userId: "",
              orderIndex: slide.orderIndex,
              elements: [
                {
                  id: `title-${slide.id}`,
                  type: "title" as const,
                  content: slide.title,
                  position: { x: 50, y: 40 },
                  size: { width: 800, height: 60 },
                  style: {
                    fontSize: 32,
                    color: "#1e3a8a",
                    fontWeight: "bold",
                  },
                },
                {
                  id: `content-${slide.id}`,
                  type: "text" as const,
                  content: slide.content,
                  position: { x: 50, y: 120 },
                  size: { width: 800, height: 300 },
                  style: { fontSize: 16, color: "#374151" },
                },
              ],
            };
          });

        console.log("Loaded slides with layout data:", studioSlides);
        setSlides(studioSlides);
      } catch (error) {
        console.error("Failed to load deck:", error);
        // Fallback to sample slide with proper typing
        const fallbackSlides: Slide[] = [
          {
            id: "slide-1",
            title: "Welcome to Your Presentation",
            content: "Welcome to Your Presentation",
            speakerNotes: "Welcome to Your Presentation",
            deckId: deckId as string,
            userId: "",
            orderIndex: 0,
            elements: [
              {
                id: "el-1",
                type: "title",
                content: "Welcome to Your Presentation",
                position: { x: 50, y: 40 },
                size: { width: 400, height: 60 },
                style: { fontSize: 32, color: "#1e3a8a", fontWeight: "bold" },
              },
            ],
          },
        ];
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    }

    loadDeck();
  }, [deckId, setSlides, setLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your presentation...</p>
        </div>
      </div>
    );
  }

  // Don't render if we don't have required data
  if (!activeSlide || !deckId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            {!deckId ? "Invalid deck ID" : "No active slide"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main canvas area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar with all required props */}
        <StudioToolbar
          deckId={deckId as string}
          currentSlideId={currentSlideId}
        />

        {/* Canvas container */}
        <div className="flex-1 bg-gray-100 p-6 flex justify-center items-center">
          <div
            className="relative bg-white shadow-lg rounded-lg"
            style={{ width: 960, height: 540 }}
          >
            {activeSlide.elements.map((el) => (
              <Rnd
                key={el.id}
                default={{
                  x: el.position.x,
                  y: el.position.y,
                  width: el.size.width,
                  height: el.size.height,
                }}
                bounds="parent"
                onDragStop={(_, d) =>
                  updateElement(el.id, { position: { x: d.x, y: d.y } })
                }
                onResizeStop={(_, __, ref) =>
                  updateElement(el.id, {
                    size: { width: ref.offsetWidth, height: ref.offsetHeight },
                  })
                }
              >
                {/* Pass all required props to SlideElement */}
                <SlideElement
                  element={el}
                  slideId={currentSlideId}
                  deckId={deckId as string}
                />
              </Rnd>
            ))}
          </div>
        </div>

        {/* Slide controls */}
        <SlideControls />
      </div>
    </div>
  );
}
