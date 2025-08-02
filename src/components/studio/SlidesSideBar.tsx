"use client";

import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useStudioStore } from "../../lib/studioStore";

export default function SlideSidebar() {
  const slides = useStudioStore((state) => state.slides);
  const activeIndex = useStudioStore((state) => state.activeSlideIndex);
  const setActive = useStudioStore((state) => state.setActiveSlideIndex);
  const addSlide = useStudioStore((state) => state.addSlide);

  return (
    <aside className="w-24 bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col items-center py-4">
      {slides.map((slide, idx) => (
        <motion.div
          key={slide.id}
          onClick={() => setActive(idx)}
          className={`w-16 h-10 mb-2 cursor-pointer rounded ${
            idx === activeIndex
              ? "border-2 border-blue-500 bg-white"
              : "hover:bg-gray-100"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
            {idx + 1}
          </div>
        </motion.div>
      ))}

      <motion.button
        onClick={addSlide}
        className="mt-auto mb-4 w-16 h-12 border-2 border-dashed border-gray-400 rounded bg-transparent hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center group"
        title="Add Slide"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus
          size={20}
          className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
        />
      </motion.button>
    </aside>
  );
}
