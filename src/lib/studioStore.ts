// src/lib/studioStore.ts - Fixed types and interface

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

// Types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Style {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  border?: string;
  padding?: string;
  borderRadius?: string;
  textAlign?: string;
  fontWeight?: string;
}

export type ElementType =
  | "title"
  | "text"
  | "image"
  | "imageSuggestions"
  | "speakerNotes"
  | "slideNumber"
  | "logo";

export interface SlideElement {
  id: string;
  type: ElementType;
  content?: string;
  src?: string;
  position: Position;
  imageSuggestions?: string[];
  suggestions?: string[];
  imagePrompt?: string;
  size: Size;
  layout?: any;
  style?: Style;
  url?: string;
}

export interface Slide {
  id: string;
  elements: SlideElement[];
  title: string;
  content: string;
  speakerNotes?: string; // Make optional
  deckId?: string; // Make optional
  userId?: string; // Make optional
  orderIndex?: number; // Make optional
  layout?: any;
}

interface StudioState {
  slides: Slide[];
  activeSlideIndex: number;
  isLoading: boolean;

  // Actions
  setSlides: (slides: Slide[]) => void;
  setActiveSlideIndex: (idx: number) => void;
  addSlide: () => void;
  updateElement: (id: string, props: Partial<SlideElement>) => void;
  setLoading: (loading: boolean) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  slides: [],
  activeSlideIndex: 0,
  isLoading: false,

  setSlides: (slides: Slide[]) => set({ slides }),
  setActiveSlideIndex: (idx: number) => set({ activeSlideIndex: idx }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  addSlide: () => {
    const newSlide: Slide = {
      id: uuidv4(),
      elements: [],
      title: "New Slide",
      content: "",
      speakerNotes: "",
      deckId: "",
      userId: "",
      orderIndex: 0,
      layout: {},
    };
    set((state: StudioState) => ({
      slides: [...state.slides, newSlide],
      activeSlideIndex: state.slides.length,
    }));
  },

  updateElement: (elementId: string, props: Partial<SlideElement>) => {
    set((state: StudioState) => {
      const { slides, activeSlideIndex } = state;
      const updatedSlides = slides.map((slide, idx) => {
        if (idx !== activeSlideIndex) return slide;
        return {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === elementId ? { ...el, ...props } : el
          ),
        };
      });
      return { slides: updatedSlides };
    });
  },
}));
