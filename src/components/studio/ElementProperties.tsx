// Updated ElementProperties.tsx for new layout structure
"use client";

import { SlideElement as ElementType } from "../../lib/studioStore";
import { useStudioStore } from "../../lib/studioStore";

interface Props {
  element: ElementType;
}

export function ElementProperties({ element }: Props) {
  const updateElement = useStudioStore((s) => s.updateElement);

  const onChangeStyle = (key: string, value: string | number) => {
    updateElement(element.id, { style: { ...element.style, [key]: value } });
  };

  const onChangeProperty = (key: string, value: string) => {
    updateElement(element.id, { [key]: value });
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 space-y-4">
      <h3 className="text-lg font-semibold">Properties</h3>

      {/* Element Type Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Element Type
        </label>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {element.type}
        </span>
      </div>

      {/* Content for text and title elements */}
      {(element.type === "text" || element.type === "title") && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={element.content}
              onChange={(e) => onChangeProperty("content", e.target.value)}
              className="mt-1 w-full px-2 py-1 border rounded text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="number"
              value={element.style?.fontSize || 16}
              onChange={(e) =>
                onChangeStyle("fontSize", Number(e.target.value))
              }
              className="mt-1 w-full px-2 py-1 border rounded"
              min="8"
              max="72"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={element.style?.color || "#000000"}
              onChange={(e) => onChangeStyle("color", e.target.value)}
              className="mt-1 w-full h-8 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Weight
            </label>
            <select
              value={element.style?.fontWeight || "normal"}
              onChange={(e) => onChangeStyle("fontWeight", e.target.value)}
              className="mt-1 w-full px-2 py-1 border rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Light</option>
            </select>
          </div>
        </>
      )}

      {/* Image properties */}
      {element.type === "image" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={element.url || element.src || ""}
              onChange={(e) => {
                updateElement(element.id, {
                  url: e.target.value,
                  src: e.target.value, // Update both for compatibility
                });
              }}
              className="mt-1 w-full px-2 py-1 border rounded text-sm"
              placeholder="Enter image URL or generate with AI"
            />
          </div>

          {element.imagePrompt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Prompt
              </label>
              <textarea
                value={element.imagePrompt}
                onChange={(e) =>
                  onChangeProperty("imagePrompt", e.target.value)
                }
                className="mt-1 w-full px-2 py-1 border rounded text-sm"
                rows={2}
                placeholder="Describe the image for AI generation"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                // TODO: Implement image generation API call
                console.log("Generate image with prompt:", element.imagePrompt);
              }}
              disabled={!element.imagePrompt}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Generate Image
            </button>
          </div>
        </>
      )}

      {/* Image suggestions properties */}
      {element.type === "imageSuggestions" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suggestions
            </label>
            <div className="space-y-1">
              {element.imageSuggestions?.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <span className="flex-1">{suggestion}</span>
                  <button
                    onClick={() => {
                      // TODO: Generate image with this suggestion
                      console.log(
                        "Generate image with suggestion:",
                        suggestion
                      );
                    }}
                    className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Use
                  </button>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">
                  No suggestions available
                </p>
              )}
            </div>
          </div>

          {element.imagePrompt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Prompt
              </label>
              <textarea
                value={element.imagePrompt}
                onChange={(e) =>
                  onChangeProperty("imagePrompt", e.target.value)
                }
                className="mt-1 w-full px-2 py-1 border rounded text-sm"
                rows={2}
              />
              <button
                onClick={() => {
                  // TODO: Generate image with original prompt
                  console.log(
                    "Generate image with original prompt:",
                    element.imagePrompt
                  );
                }}
                className="mt-2 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Generate from Prompt
              </button>
            </div>
          )}
        </>
      )}

      {/* Position and Size (for all elements) */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Position & Size
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600">X</label>
            <input
              type="number"
              value={element.position.x}
              onChange={(e) =>
                updateElement(element.id, {
                  position: { ...element.position, x: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Y</label>
            <input
              type="number"
              value={element.position.y}
              onChange={(e) =>
                updateElement(element.id, {
                  position: { ...element.position, y: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-xs text-gray-600">Width</label>
            <input
              type="number"
              value={element.size.width}
              onChange={(e) =>
                updateElement(element.id, {
                  size: { ...element.size, width: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Height</label>
            <input
              type="number"
              value={element.size.height}
              onChange={(e) =>
                updateElement(element.id, {
                  size: { ...element.size, height: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
