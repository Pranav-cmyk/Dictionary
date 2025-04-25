"use client"

import { X, FileText, Layout, FileIcon, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isMobile: boolean
  fileName: string
  fileStats: { words: number; chars: number; pages: number } | null
  viewMode: "page" | "continuous"
  setViewMode: (mode: "page" | "continuous") => void
  fontSize: number
  adjustFontSize: (delta: number) => void
  lineHeight: number
  setLineHeight: (height: number) => void
  fontFamily: string
  setFontFamily: (family: string) => void
  hoverMode: boolean
  setHoverMode: (mode: boolean) => void
  handleNewFile: () => void
}

export default function DocumentSidebar({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  fileName,
  fileStats,
  viewMode,
  setViewMode,
  fontSize,
  adjustFontSize,
  lineHeight,
  setLineHeight,
  fontFamily,
  setFontFamily,
  hoverMode,
  setHoverMode,
  handleNewFile,
}: DocumentSidebarProps) {
  if (!sidebarOpen) return null

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside
        className={`
          ${isMobile ? "fixed right-0 top-0 bottom-0 w-[85%] max-w-xs z-50 shadow-xl" : "w-64 flex-shrink-0"} 
          transition-all duration-300 ease-in-out
          border-l overflow-y-auto bg-white border-slate-200
        `}
      >
        <div className="p-4">
          {/* Mobile sidebar header with close button */}
          {isMobile && (
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-medium">Document Info</h3>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </Button>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-500 text-amber-700 truncate max-w-[180px]">
                {fileName.length > 20 ? `${fileName.substring(0, 17)}...` : fileName}
              </h2>
              <Button variant="outline" size="sm" onClick={handleNewFile} className="flex items-center text-xs">
                <FileIcon size={14} className="mr-1" />
                New File
              </Button>
            </div>
            {fileStats && (
              <div className="text-xs mt-1 text-slate-500">
                <div>
                  {fileStats.pages} pages • {fileStats.words} words
                </div>
              </div>
            )}
          </div>

          {/* View settings - only show on desktop or in mobile sidebar */}
          <div className="mb-6">
            <div className="text-sm font-medium mb-2 text-slate-700">View Mode</div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "page" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("page")}
                className={`flex-1 ${
                  viewMode === "page"
                    ? "bg-black text-white hover:bg-black hover:text-white"
                    : "bg-white text-black hover:bg-white hover:text-black"
                }`}
              >
                <FileText className="h-4 w-4 mr-1" />
                Page
              </Button>
              <Button
                variant={viewMode === "continuous" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("continuous")}
                className={`flex-1 ${
                  viewMode === "continuous"
                    ? "bg-black text-white hover:bg-black hover:text-white"
                    : "bg-white text-black hover:bg-white hover:text-black"
                }`}
              >
                <Layout className="h-4 w-4 mr-1" />
                Flow
              </Button>
            </div>
          </div>

          {/* Reading preferences */}
          <div className="mb-6">
            <div className="text-sm font-medium mb-2 text-slate-700">Reading Preferences</div>

            {/* Font size */}
            <div className="mb-3">
              <div className="text-xs mb-1 text-slate-500">Font Size: {fontSize}px</div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-0 w-6 h-6"
                  onClick={() => adjustFontSize(-1)}
                  disabled={fontSize <= 12}
                >
                  <Minus size={12} />
                </Button>
                <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200">
                  <div
                    className="h-1 rounded-full bg-blue-500"
                    style={{ width: `${((fontSize - 12) / 12) * 100}%` }}
                  ></div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-0 w-6 h-6"
                  onClick={() => adjustFontSize(1)}
                  disabled={fontSize >= 24}
                >
                  <Plus size={12} />
                </Button>
              </div>
            </div>

            {/* Line height */}
            <div className="mb-3">
              <div className="text-xs mb-1 text-slate-500">Line Height: {lineHeight.toFixed(1)}</div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-0 w-6 h-6"
                  onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
                  disabled={lineHeight <= 1.2}
                >
                  <Minus size={12} />
                </Button>
                <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200">
                  <div
                    className="h-1 rounded-full bg-blue-500"
                    style={{ width: `${((lineHeight - 1.2) / 0.8) * 100}%` }}
                  ></div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-0 w-6 h-6"
                  onClick={() => setLineHeight(Math.min(2.0, lineHeight + 0.1))}
                  disabled={lineHeight >= 2.0}
                >
                  <Plus size={12} />
                </Button>
              </div>
            </div>

            {/* Font family */}
            <div>
              <div className="text-xs mb-1 text-slate-500">Font Family</div>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant={fontFamily === "'Georgia', serif" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    fontFamily === "'Georgia', serif"
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : "bg-white text-black hover:bg-white hover:text-black"
                  }`}
                  onClick={() => setFontFamily("'Georgia', serif")}
                >
                  Georgia
                </Button>
                <Button
                  variant={fontFamily === "'Times New Roman', serif" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    fontFamily === "'Times New Roman', serif"
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : "bg-white text-black hover:bg-white hover:text-black"
                  }`}
                  onClick={() => setFontFamily("'Times New Roman', serif")}
                >
                  Times
                </Button>
                <Button
                  variant={fontFamily === "'Arial', sans-serif" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    fontFamily === "'Arial', sans-serif"
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : "bg-white text-black hover:bg-white hover:text-black"
                  }`}
                  onClick={() => setFontFamily("'Arial', sans-serif")}
                >
                  Arial
                </Button>
                <Button
                  variant={fontFamily === "'Verdana', sans-serif" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    fontFamily === "'Verdana', sans-serif"
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : "bg-white text-black hover:bg-white hover:text-black"
                  }`}
                  onClick={() => setFontFamily("'Verdana', sans-serif")}
                >
                  Verdana
                </Button>
              </div>
            </div>
          </div>

          {/* Definition mode */}
          <div className="mb-6">
            <div className="text-sm font-medium mb-2 text-slate-700">Definition Mode</div>
            <div className="flex space-x-2">
              <Button
                variant={!hoverMode ? "default" : "outline"}
                size="sm"
                onClick={() => setHoverMode(false)}
                className={`flex-1 ${
                  !hoverMode
                    ? "bg-black text-white hover:bg-black hover:text-white"
                    : "bg-white text-black hover:bg-white hover:text-black"
                }`}
              >
                Selection
              </Button>
              <Button
                variant={hoverMode ? "default" : "outline"}
                size="sm"
                onClick={() => setHoverMode(true)}
                className={`flex-1 ${
                  hoverMode
                    ? "bg-black text-white hover:bg-black hover:text-white"
                    : "bg-white text-black hover:bg-white hover:text-black"
                }`}
              >
                Hover
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-md p-3 text-xs bg-blue-50 text-blue-800">
            <div className="font-medium mb-1">Tip</div>
            <p>
              {hoverMode
                ? "Hover over any word for 2 seconds to see its definition based on the document context."
                : "Select any text to see its definition based on the document context."}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
