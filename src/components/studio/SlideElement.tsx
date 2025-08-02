// SlideElement.tsx with proper API integration
"use client";

import React, { useState, useRef } from "react";
import { SlideElement as ElementType } from "../../lib/studioStore";
import { useStudioStore } from "../../lib/studioStore";
import api from "@/lib/api";

interface Props {
  element: ElementType;
  slideId: string;
  deckId: string;
}

export default function SlideElement({ element, slideId, deckId }: Props) {
  const updateElement = useStudioStore((state) => state.updateElement);
  const [editing, setEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [updating, setUpdating] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const updateSlideContent = async (newContent: string) => {
    if (!slideId) {
      console.error("No slideId provided for update");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/slides/${slideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContent,
          layout: {
            ...element.layout,
            elements: element.layout?.elements?.map((el: any) =>
              el.id === element.id ? { ...el, content: newContent } : el
            ),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update slide: ${response.statusText}`);
      }

      const updatedSlide = await response.json();
      console.log("Slide updated successfully:", updatedSlide);

      updateElement(element.id, { content: newContent });
    } catch (error) {
      console.error("Failed to update slide:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Handle content updates using slide API
  const onBlur = async () => {
    if (divRef.current && element.id) {
      const newContent = divRef.current.innerText;

      // Only update if content actually changed
      if (newContent !== element.content) {
        console.log(
          `Updating slide ${slideId}, element ${element.id} with content:`,
          newContent
        );
        await updateSlideContent(newContent);
      }
    }
    setEditing(false);
  };

  // Handle image generation with slide update
  const handleGenerateImage = async (prompt: string) => {
    // if (!slideId || !deckId) {
    //   console.error("Missing slideId or deckId for image generation");
    //   return;
    // }
    // setGeneratingImage(true);
    // try {
    //   console.log("Generating image with prompt:", prompt);
    //   // Call your existing image generation endpoint
    //   const response = await api.post(
    //     `/api/decks/${deckId}/slides/${slideId}/generate-image`,
    //     {
    //       imagePrompt: prompt,
    //     }
    //   );
    //   const updatedSlide = await response;
    //   console.log("Image generated and slide updated:", updatedSlide);
    //   // Update local state with the new image data from the API response
    //   // The backend should return the updated slide with the new image URL
    //   updateElement(element.id, {
    //     url: updatedSlide.layout?.elements?.find(
    //       (el: any) => el.type === "image"
    //     )?.url,
    //     type: "image",
    //   });
    // } catch (error) {
    //   console.error("Failed to generate image:", error);
    //   // Optionally show error notification to user
    // } finally {
    //   setGeneratingImage(false);
    // }
  };

  // Handle different element types
  if (element.type === "image") {
    const imageUrl = element.url || element.src;

    if (!imageUrl) {
      return (
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-2">No image generated yet</p>
            {element.imagePrompt && (
              <p className="text-xs text-gray-500 mb-3 italic">
                "{element.imagePrompt}"
              </p>
            )}
            <button
              onClick={() =>
                element.imagePrompt && handleGenerateImage(element.imagePrompt)
              }
              disabled={!element.imagePrompt || generatingImage}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {generatingImage ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={element.imagePrompt || "Slide image"}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            console.error("Image failed to load:", imageUrl);
            e.currentTarget.src =
              "https://via.placeholder.com/400x200?text=Image+Not+Found";
            setImageError(true);
          }}
          onLoad={() => {
            console.log("Image loaded successfully");
            setImageError(false);
          }}
        />
        {/* Overlay for regenerating image */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <button
            onClick={() =>
              element.imagePrompt && handleGenerateImage(element.imagePrompt)
            }
            disabled={generatingImage}
            className="px-3 py-2 bg-white text-gray-800 text-sm rounded shadow-lg hover:bg-gray-100 disabled:bg-gray-300"
          >
            {generatingImage ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      </div>
    );
  }

  // Handle image suggestions element type
  if (element.type === "imageSuggestions") {
    const suggestions = element.suggestions || element.imageSuggestions || [];

    return (
      <div
        className="w-full h-full rounded-lg p-3 flex flex-col overflow-hidden"
        style={{
          backgroundColor: element.style?.backgroundColor || "#f8f9fa",
          border: element.style?.border || "2px dashed #dee2e6",
          borderRadius: element.style?.borderRadius || "8px",
          fontSize: element.style?.fontSize || 14,
          minHeight: "250px",
        }}
      >
        {/* Header */}
        <div className="text-center mb-2 flex-shrink-0">
          <svg
            className="mx-auto h-5 w-5 text-gray-500 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs font-medium text-gray-700 mb-1">
            Image Suggestions
          </p>
          <p className="text-xs text-gray-500">Click any option to generate:</p>
        </div>

        {/* Suggestions Container */}
        <div className="flex-1 overflow-y-auto mb-2">
          {suggestions.length > 0 ? (
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors border border-blue-200 text-left"
                  onClick={() => handleGenerateImage(suggestion)}
                  title={`Generate image: ${suggestion}`}
                  disabled={generatingImage}
                >
                  <span className="text-blue-600 font-mono mr-1">
                    {index + 1}.
                  </span>
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center">
              No suggestions available
            </div>
          )}
        </div>

        {/* Original Prompt Section */}
        {element.imagePrompt && (
          <div className="border-t border-gray-300 pt-2 flex-shrink-0">
            <div className="text-xs text-gray-400 mb-1">Original prompt:</div>
            <div className="text-xs text-gray-600 mb-2 bg-white p-1 rounded border max-h-8 overflow-hidden">
              "{element.imagePrompt}"
            </div>
            <button
              onClick={() => handleGenerateImage(element.imagePrompt || "")}
              disabled={generatingImage}
              className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {generatingImage ? "Generating..." : "Generate Original"}
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {generatingImage && (
          <div className="mt-2 text-center flex-shrink-0">
            <div className="inline-flex items-center text-xs text-gray-600">
              <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
              Generating image...
            </div>
          </div>
        )}

        {/* Summary Info */}
        {suggestions.length > 0 && !generatingImage && (
          <div className="text-xs text-gray-400 text-center mt-1 flex-shrink-0">
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}{" "}
            available
          </div>
        )}
      </div>
    );
  }

  // Handle speaker notes (read-only display)
  if (element.type === "speakerNotes") {
    return (
      <div className="w-full h-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg overflow-y-auto">
        <div className="text-xs font-medium text-yellow-800 mb-2">
          Speaker Notes:
        </div>
        <div className="text-xs text-yellow-700 whitespace-pre-wrap">
          {element.content || "No speaker notes available"}
        </div>
      </div>
    );
  }

  // Handle slide number (read-only)
  if (element.type === "slideNumber") {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          fontSize: element.style?.fontSize || 12,
          color: element.style?.color || "#999999",
        }}
      >
        {element.content}
      </div>
    );
  }

  // Handle logo placeholder
  if (element.type === "logo") {
    return (
      <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
        <span className="text-xs text-gray-400">Logo</span>
      </div>
    );
  }

  // Handle text, title, and subtitle elements (editable)
  return (
    <div
      ref={divRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onFocus={() => setEditing(true)}
      onBlur={onBlur}
      className={`w-full h-full outline-none ${
        editing ? "border border-blue-300 rounded bg-blue-50" : ""
      } ${updating ? "opacity-50" : ""} ${
        element.type === "title" ? "font-bold" : ""
      }`}
      style={{
        fontSize: element.style?.fontSize,
        color: element.style?.color,
        fontWeight: element.style?.fontWeight,
        textAlign: element.style?.textAlign as any,
        padding: editing ? "4px" : "0",
        cursor: "text",
      }}
    >
      {element.content}
    </div>
  );
}
