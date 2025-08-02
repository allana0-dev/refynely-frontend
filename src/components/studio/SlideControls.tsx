"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Trash, Plus } from "lucide-react";
import { useStudioStore } from "../../lib/studioStore";

export function SlideControls() {
  const { slides, activeSlideIndex, setActiveSlideIndex, addSlide } =
    useStudioStore();

  const prev = () => {
    if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1);
  };

  const next = () => {
    if (activeSlideIndex < slides.length - 1)
      setActiveSlideIndex(activeSlideIndex + 1);
  };

  const remove = () => {
    // remove current slide
    const newSlides = slides.filter((_, i) => i !== activeSlideIndex);
    useStudioStore.setState({
      slides: newSlides,
      activeSlideIndex: Math.max(0, activeSlideIndex - 1),
    });
  };

  return (
    <div className="flex items-center space-x-4 bg-white border-t border-gray-200 px-6 py-3">
      <button
        onClick={prev}
        className="p-2 hover:bg-gray-100 rounded"
        title="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm">
        Slide {activeSlideIndex + 1} of {slides.length}
      </span>
      <button
        onClick={next}
        className="p-2 hover:bg-gray-100 rounded"
        title="Next Slide"
      >
        <ChevronRight size={20} />
      </button>
      <div className="border-l border-gray-300 h-6" />
      <button
        onClick={remove}
        className="p-2  ml-auto hover:bg-red-100 text-red-600 rounded"
        title="Delete Slide"
      >
        <Trash size={20} />
      </button>
    </div>
  );
}
