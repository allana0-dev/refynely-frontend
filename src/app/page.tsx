import React from "react";
import { Play, Copy, Settings, Maximize2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 leading-tight mb-8">
            Generate AI Powered Pitch Decks in Seconds.
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create working pitch decks you can refine and customize in under a
            minute, using our powerful AI generator.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors w-fit mb-8">
            Get Started
          </button>
          <p className="text-gray-500 text-lg">
            Over{" "}
            <span className="font-semibold text-blue-900">250 million</span>{" "}
            presentations, websites, social posts, and documents generated.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            {/* <div className="bg-blue-900 rounded-t-2xl p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">R</span>
                </div>
                <span className="font-medium">Presentations</span>
              </div>
              <Copy className="w-5 h-5" />
            </div>

            <div className="bg-white rounded-b-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Generate
                </h3>
                <p className="text-gray-600 mb-6">
                  What would you like to create today?
                </p>

                <div className="flex justify-center space-x-2 mb-6">
                  <button className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium">
                    Presentation
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    Website
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    Document
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    Social
                  </button>
                </div>

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="A presentation about galaxies and how they are formed"
                    className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="A presentation about galaxies and how they are formed"
                  />
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center space-x-2 w-full">
                  <span>+ Generate outline</span>
                </button>
              </div>

              <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <Play className="w-16 h-16 text-white bg-red-600 rounded-full p-4" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
                  <div className="flex items-center space-x-2">
                    <button>
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="opacity-50">
                      <Settings className="w-4 h-4" />
                    </button>
                    <span>1:03 / 1:03</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="opacity-50">
                      <Settings className="w-4 h-4" />
                    </button>
                    <span className="text-xs">YouTube</span>
                    <button>
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8">
        
          </div>

          <div>
            <p className="text-gray-500 text-lg mb-4">
              Engage users on any device
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
              Turn text into polished presentations in one click
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
