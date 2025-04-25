"use client"

import { Settings, Menu, Sun, Flower, SidebarClose, SidebarOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  text: string
  theme: "light" | "sepia"
  toggleTheme: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  toggleSettings: () => void
  isMobile: boolean
}

export default function Header({
  text,
  theme,
  toggleTheme,
  sidebarOpen,
  toggleSidebar,
  toggleSettings,
}: HeaderProps) {
  return (
    <header className="p-4 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Left section - empty or for future controls */}
      <div className="w-24">
        {text && (
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleSettings} aria-label="Settings">
              <Settings size={20} />
            </Button>
          </div>
        )}
      </div>
      
      {/* Center section - tool name with beta badge */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative inline-block">
          <h1 className="text-xl font-medium text-center select-none">
            <span className="text-black">Active</span> <span className="text-[#ffbd59]">Dictionary</span>
          </h1>
          <span className="absolute -top-3 -right-8 bg-black text-white text-[9px] px-1 py-0.5 rounded font-medium select-none"
            style={{
              pointerEvents: 'none'
            }}
          >
            Alpha
          </span>
        </div>
      </div>
      
      {/* Right section - controls */}
      <div className="w-24 flex justify-end">
        {text && (
          <>
            {/* Mobile buttons */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <Menu size={20} />
              </Button>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="default" size="sm" onClick={toggleTheme}>
                {theme === "light" ? <Sun size={18} /> : <Flower size={18} />}
              </Button>
              <Button variant="default" size="sm" onClick={toggleSidebar}>
                {sidebarOpen ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}