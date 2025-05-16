"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ResizeHandleProps {
  onResize: (delta: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
  position: number
  side?: "left" | "right"
  className?: string
}

export function ResizeHandle({
  onResize,
  onResizeStart,
  onResizeEnd,
  position,
  side = "left",
  className,
}: ResizeHandleProps) {
  const isDragging = useRef(false)
  const startX = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const delta = side === "left" ? e.clientX - startX.current : startX.current - e.clientX

      onResize(delta)
      startX.current = e.clientX
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return

      isDragging.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""

      if (onResizeEnd) onResizeEnd()

      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    if (isDragging.current) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [onResize, onResizeEnd, side])

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return

      const touch = e.touches[0]
      const delta = side === "left" ? touch.clientX - startX.current : startX.current - touch.clientX

      onResize(delta)
      startX.current = touch.clientX

      // Prevent scrolling while resizing
      e.preventDefault()
    }

    const handleTouchEnd = () => {
      if (!isDragging.current) return

      isDragging.current = false
      document.body.style.userSelect = ""

      if (onResizeEnd) onResizeEnd()

      // Remove event listeners
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    if (isDragging.current) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [onResize, onResizeEnd, side])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    startX.current = e.clientX
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"

    if (onResizeStart) onResizeStart()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return

    isDragging.current = true
    startX.current = e.touches[0].clientX
    document.body.style.userSelect = "none"

    if (onResizeStart) onResizeStart()

    // Prevent scrolling while resizing
    e.preventDefault()
  }

  return (
    <div
      className={cn("absolute top-0 bottom-0 w-4 cursor-col-resize z-30 group", className)}
      style={{
        [side]: `${position}px`,
        transform: side === "left" ? "translateX(-50%)" : "translateX(50%)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16 rounded-full bg-gray-300 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"></div>
    </div>
  )
}
