"use client"

import { X, FileText, Layout, Sun, Flower, Minus, Plus, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileSettingsProps {
  showSettings: boolean
  setShowSettings: (show: boolean) => void
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
  theme: "light" | "sepia"
  toggleTheme: () => void
  fileStats: { words: number; chars: number; pages: number } | null
  fileName: string
  handleNewFile: () => void
}

export default function MobileSettings({
  showSettings,
  setShowSettings,
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
  theme,
  toggleTheme,
  fileStats,
  fileName,
  handleNewFile,
}: MobileSettingsProps) {
  if (!showSettings) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowSettings(false)}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Reading Settings</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
            <X size={20} />
          </Button>
        </div>

        {/* View Mode */}
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

        {/* Font size */}
        <div className="mb-4">
          <div className="text-xs mb-1 text-slate-500">Font Size: {fontSize}px</div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={() => adjustFontSize(-1)}
              disabled={fontSize <= 12}
            >
              <Minus size={16} />
            </Button>
            <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200">
              <div className="h-1 rounded-full bg-blue-500" style={{ width: `${((fontSize - 12) / 12) * 100}%` }}></div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={() => adjustFontSize(1)}
              disabled={fontSize >= 24}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Line height */}
        <div className="mb-4">
          <div className="text-xs mb-1 text-slate-500">Line Height: {lineHeight.toFixed(1)}</div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="p-0 w-8 h-8"
              onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}  disabled={lineHeight <= 1.2}
            >
              <Minus size={16} />
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
              className="p-0 w-8 h-8"
              onClick={() => setLineHeight(Math.min(2.0, lineHeight + 0.1))}
              disabled={lineHeight >= 2.0}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Font family */}
        <div className="mb-4">
          <div className="text-xs mb-1 text-slate-500">Font Family</div>
          <div className="grid grid-cols-2 gap-2">
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

        {/* Definition mode */}
        <div className="mb-4">
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

        {/* Theme toggle */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 text-slate-700">Theme</div>
          <Button variant="outline" size="sm" onClick={toggleTheme} className="w-full flex items-center justify-center">
            {theme === "light" ? (
              <>
                <Sun size={16} className="mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Flower size={16} className="mr-2" />
                <span>Sepia Mode</span>
              </>
            )}
          </Button>
        </div>

        {/* File info */}
        {fileStats && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                {fileName.length > 20 ? `${fileName.substring(0, 17)}...` : fileName}
              </div>
              <Button variant="outline" size="sm" onClick={handleNewFile} className="flex items-center text-xs">
                <FileIcon size={14} className="mr-1" />
                New File
              </Button>
            </div>
            <div className="text-xs mt-1 text-slate-500">
              {fileStats.pages} pages • {fileStats.words} words
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
