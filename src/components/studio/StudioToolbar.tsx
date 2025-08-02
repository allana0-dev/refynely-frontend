// src/components/studio/StudioToolbar.tsx - Fixed to use api library
"use client";

import React, { useState } from "react";
import {
  Type,
  Image as ImageIcon,
  Zap,
  ArrowUpLeft,
  ArrowUpRight,
  Save,
  Loader2,
} from "lucide-react";
import { useStudioStore } from "../../lib/studioStore";
import api from "@/lib/api";

interface StudioToolbarProps {
  deckId: string;
  currentSlideId?: string;
}

export default function StudioToolbar({
  deckId,
  currentSlideId,
}: StudioToolbarProps) {
  const slides = useStudioStore((s) => s.slides);
  const activeIndex = useStudioStore((s) => s.activeSlideIndex);
  const updateElement = useStudioStore((s) => s.updateElement);
  const setSlides = useStudioStore((s) => s.setSlides);

  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Update deck via API using the api library
  const updateDeck = async (updatedSlides: any[]) => {
    if (!deckId) {
      console.error("No deckId provided for update");
      return;
    }

    try {
      console.log(
        "Updating deck:",
        deckId,
        "with slides:",
        updatedSlides.length
      );

      const updatedDeck = await api.put(`decks/${deckId}/slides`, {
        slides: updatedSlides.map((slide) => ({
          id: slide.id,
          title: slide.title,
          content: slide.content,
          speakerNotes: slide.speakerNotes,
          layout: slide.layout || {
            elements: slide.elements || [],
          },
          orderIndex: slide.orderIndex,
        })),
      });

      console.log("Deck updated successfully:", updatedDeck);
      return updatedDeck;
    } catch (error) {
      console.error("Failed to update deck:", error);
      throw error;
    }
  };

  // Add a new text element
  const addText = async () => {
    const newEl = {
      id: crypto.randomUUID(),
      type: "text" as const,
      content: "New text",
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      style: { fontSize: 18, color: "#000000" },
    };

    // Update local state immediately
    const copy = [...slides];
    copy[activeIndex].elements.push(newEl);
    setSlides(copy);

    // Sync with backend
    try {
      await updateDeck(copy);
    } catch (error) {
      // Revert on error
      setSlides(slides);
      console.error("Failed to add text element:", error);
    }
  };

  // Add a new image element
  const addImage = async () => {
    const newEl = {
      id: crypto.randomUUID(),
      type: "image" as const,
      src: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150", // Add url property for consistency
      position: { x: 100, y: 100 },
      size: { width: 150, height: 100 },
    };

    // Update local state immediately
    const copy = [...slides];
    copy[activeIndex].elements.push(newEl);
    setSlides(copy);

    // Sync with backend
    try {
      await updateDeck(copy);
    } catch (error) {
      // Revert on error
      setSlides(slides);
      console.error("Failed to add image element:", error);
    }
  };

  // AI regenerate current slide
  const runAI = async () => {
    if (!currentSlideId) {
      console.error("No current slide to regenerate");
      return;
    }

    setRegenerating(true);
    try {
      console.log("Regenerating slide:", currentSlideId);

      const regeneratedSlide = await api.post<any>(
        `decks/${deckId}/slides/${currentSlideId}/regenerate`,
        {
          currentContent: slides[activeIndex].content,
          slideTitle: slides[activeIndex].title,
          prompt: "Regenerate this slide with improved content",
        }
      );

      console.log("Slide regenerated successfully:", regeneratedSlide);

      // Type check and handle the regenerated slide data
      if (regeneratedSlide && typeof regeneratedSlide === "object") {
        const updatedSlides = [...slides];
        const currentSlide = updatedSlides[activeIndex];

        // Safely update the slide with proper type checking
        updatedSlides[activeIndex] = {
          ...currentSlide,
          id: currentSlide.id, // Preserve original ID
          title: regeneratedSlide.title || currentSlide.title,
          content: regeneratedSlide.content || currentSlide.content,
          speakerNotes:
            regeneratedSlide.speakerNotes || currentSlide.speakerNotes,
          deckId: currentSlide.deckId,
          userId: currentSlide.userId,
          orderIndex: currentSlide.orderIndex,
          layout: regeneratedSlide.layout || currentSlide.layout,
          elements:
            regeneratedSlide.layout?.elements ||
            regeneratedSlide.elements ||
            currentSlide.elements ||
            [],
        };

        setSlides(updatedSlides);
      } else {
        console.error("Invalid regenerated slide data:", regeneratedSlide);
      }
    } catch (error) {
      console.error("Failed to regenerate slide:", error);
    } finally {
      setRegenerating(false);
    }
  };

  // Save entire presentation state
  const save = async () => {
    setSaving(true);
    try {
      console.log("Saving presentation...");

      await updateDeck(slides);

      console.log("Presentation saved successfully!");
      // Optionally show success notification
    } catch (error) {
      console.error("Failed to save presentation:", error);
      // Optionally show error notification
    } finally {
      setSaving(false);
    }
  };

  // Undo functionality (implement with history in store)
  const undo = () => {
    console.log("Undo - implement with history state");
  };

  // Redo functionality
  const redo = () => {
    console.log("Redo - implement with history state");
  };

  return (
    <div className="flex items-center space-x-4 bg-white border-b border-gray-200 px-6 py-3">
      <button
        onClick={addText}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Add Text"
      >
        <Type size={20} />
      </button>

      <button
        onClick={addImage}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Add Image"
      >
        <ImageIcon size={20} />
      </button>

      <button
        onClick={runAI}
        disabled={regenerating || !currentSlideId}
        className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Regenerate with AI"
      >
        {regenerating ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Zap size={20} />
        )}
      </button>

      <div className="border-l border-gray-300 h-6" />

      <button
        onClick={undo}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Undo"
      >
        <ArrowUpLeft size={20} />
      </button>

      <button
        onClick={redo}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Redo"
      >
        <ArrowUpRight size={20} />
      </button>

      <button
        onClick={save}
        disabled={saving}
        className="ml-auto p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Save"
      >
        {saving ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save size={20} />
            Save
          </>
        )}
      </button>
    </div>
  );
}
