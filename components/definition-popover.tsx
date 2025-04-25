"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { X, BookOpen, MousePointer, Sparkles, Move, Volume2, VolumeX, Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { useMediaQuery } from "@/app/hooks/use-media-query"

interface DefinitionPopoverProps {
  word: string
  definition: string
  loading: boolean
  position: { x: number; y: number }
  onClose: () => void
  isHoverMode?: boolean
}

export default function DefinitionPopover({
  word,
  definition,
  loading,
  position,
  onClose,
  isHoverMode = false,
}: DefinitionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [popoverDimensions, setPopoverDimensions] = useState({ width: 340, height: 240 })
  const [hasBeenManuallyPositioned, setHasBeenManuallyPositioned] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFullDefinition, setShowFullDefinition] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Constants for text truncation
  const MAX_WORD_CHARS = 25 // Max characters for word before truncation
  const MAX_DEFINITION_CHARS = 180 // Max characters for definition before truncation
  const isDefinitionTruncated = definition.length > MAX_DEFINITION_CHARS && !showFullDefinition

  // Format the selected word with truncation if needed
  const formattedWord = word.length > MAX_WORD_CHARS 
    ? `${word.substring(0, MAX_WORD_CHARS)}...` 
    : word

  // Format definition with truncation if needed
  const formattedDefinition = isDefinitionTruncated 
    ? `${definition.substring(0, MAX_DEFINITION_CHARS)}...` 
    : definition

  // Initialize speech synthesis
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Adjust dimensions for mobile
  useEffect(() => {
    if (isMobile) {
      setPopoverDimensions({
        width: Math.min(340, window.innerWidth - 32),
        height: Math.min(240, window.innerHeight * 0.4),
      })
    } else {
      setPopoverDimensions({ width: 340, height: 240 })
    }
  }, [isMobile])

  const speakDefinition = () => {
    if (!definition || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(definition)
    speechSynthesisRef.current = utterance

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      const preferredVoice = 
        voices.find(v => v.name.includes("Female")) || 
        voices.find(v => v.lang.includes("en")) || 
        voices[0]
      utterance.voice = preferredVoice
    }

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const toggleSpeech = () => {
    isSpeaking ? stopSpeaking() : speakDefinition()
  }

  const toggleExpand = () => {
    if (isExpanded) {
      setPopoverDimensions({
        width: isMobile ? Math.min(340, window.innerWidth - 32) : 340,
        height: isMobile ? Math.min(240, window.innerHeight * 0.4) : 240,
      })
    } else {
      setPopoverDimensions({
        width: isMobile ? Math.min(window.innerWidth - 32, 500) : Math.min(600, window.innerWidth * 0.8),
        height: isMobile ? Math.min(window.innerHeight * 0.7, 400) : Math.min(400, window.innerHeight * 0.7),
      })
    }
    setIsExpanded(!isExpanded)
    setTimeout(updatePosition, 50)
  }

  // Update position on mount and when position changes
  useEffect(() => {
    setIsVisible(true)
    setTimeout(() => updatePosition(), 0)
  }, [position])

  // Measure actual popover dimensions after render
  useEffect(() => {
    if (popoverRef.current && isVisible) {
      updatePosition()
    }
  }, [isVisible, popoverDimensions, isExpanded])

  const updatePosition = () => {
    if (!popoverRef.current || (hasBeenManuallyPositioned && !isDragging)) return

    const { width, height } = popoverDimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = position.x
    let y = position.y

    // Mobile positioning - center and adjust based on available space
    if (isMobile) {
      x = viewportWidth / 2
      
      // Check if there's enough space below
      const spaceBelow = viewportHeight - y
      const spaceNeeded = height + 20
      
      if (spaceBelow < spaceNeeded) {
        // Position above if not enough space below
        y = Math.max(height / 2 + 20, y - 20)
      } else {
        // Position below with some margin
        y = Math.min(viewportHeight - height / 2 - 20, y + 20)
      }
    } 
    // Desktop positioning
    else {
      // Horizontal boundary check
      x = Math.max(width / 2 + 10, Math.min(x, viewportWidth - width / 2 - 10))
      
      // Vertical positioning with smart flipping
      const spaceBelow = viewportHeight - y
      const spaceNeeded = height + 20

      if (spaceBelow < spaceNeeded && y > spaceNeeded) {
        y = y - 20 // Position above
      } else {
        y = y + 20 // Position below
      }

      y = Math.max(10, Math.min(y, viewportHeight - 10))
    }

    setDragPosition({ x, y })
  }

  // Handle scroll and window resize
  useEffect(() => {
    const handleScroll = () => {
      if (!isDragging && isVisible && !hasBeenManuallyPositioned) {
        updatePosition()
      }
    }

    const handleResize = () => {
      if (isVisible) {
        if (hasBeenManuallyPositioned) {
          const { width, height } = popoverDimensions
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          let x = dragPosition.x
          let y = dragPosition.y

          x = Math.max(width / 2 + 10, Math.min(x, viewportWidth - width / 2 - 10))
          y = Math.max(10, Math.min(y, viewportHeight - 10))

          setDragPosition({ x, y })
        } else {
          updatePosition()
        }
      }
    }

    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleResize)
    }
  }, [isDragging, isVisible, position, popoverDimensions, hasBeenManuallyPositioned, dragPosition])

  const handleClose = () => {
    stopSpeaking()
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  const handleDrag = (_: any, info: PanInfo) => {
    setDragPosition({
      x: dragPosition.x + info.delta.x,
      y: dragPosition.y + info.delta.y,
    })
    setHasBeenManuallyPositioned(true)
  }

  const resetPosition = () => {
    setHasBeenManuallyPositioned(false)
    setPopoverDimensions({
      width: isMobile ? Math.min(340, window.innerWidth - 32) : 340,
      height: isMobile ? Math.min(240, window.innerHeight * 0.4) : 240,
    })
    setIsExpanded(false)
    updatePosition()
  }

  const toggleDefinitionLength = () => {
    setShowFullDefinition(!showFullDefinition)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 select-none"
          style={{
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
            transform: "translate(-50%, -50%)",
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
            // Prevent popover from being clipped by viewport edges
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
          drag
          dragConstraints={{
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
          }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false)
            setHasBeenManuallyPositioned(true)
          }}
        >
          <Card
            ref={popoverRef}
            className={`shadow-xl border overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300 ease-out ${
              isHoverMode
                ? "border-blue-300/80 bg-gradient-to-b from-blue-50 to-blue-100/50"
                : "border-slate-200/80 bg-gradient-to-b from-white to-slate-50"
            }`}
            style={{
              width: `${popoverDimensions.width}px`,
              maxWidth: 'calc(100vw - 32px)',
              height: `${popoverDimensions.height}px`,
              maxHeight: 'calc(100vh - 32px)',
            }}
          >
            <div
              className={`px-3 md:px-4 py-2 md:py-3 flex justify-between items-center ${
                isHoverMode ? "bg-blue-100/30 border-b border-blue-200/50" : "bg-slate-50/70 border-b border-slate-100"
              }`}
            >
              <div className="flex items-center min-w-0"> {/* Added min-w-0 to allow text truncation */}
                <motion.div className="mr-2 cursor-move" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Move className="h-4 w-4" />
                </motion.div>
                {isHoverMode ? (
                  <MousePointer className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                ) : (
                  <BookOpen className="h-4 w-4 mr-2 text-slate-700 flex-shrink-0" />
                )}
                <div className="min-w-0"> {/* Wrapper div for better truncation */}
                  <h3 
                    className="font-medium text-sm md:text-base truncate"
                    title={word} // Show full text on hover
                  >
                    {formattedWord}
                  </h3>
                </div>
                {isHoverMode && (
                  <span className="ml-2 text-xs py-0.5 px-2 bg-blue-200/80 text-blue-800 rounded-full flex-shrink-0">
                    hover
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={toggleSpeech}
                  className={`rounded-full p-1 transition-colors ${
                    isHoverMode ? "hover:bg-blue-200/50" : "hover:bg-slate-200/50"
                  }`}
                  aria-label={isSpeaking ? "Stop speech" : "Read aloud"}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4 text-red-500" />
                  ) : (
                    <Volume2 className={`h-4 w-4 ${isHoverMode ? "text-blue-600" : "text-slate-600"}`} />
                  )}
                </button>
                <button
                  onClick={toggleExpand}
                  className={`rounded-full p-1 transition-colors ${
                    isHoverMode ? "text-blue-600 hover:bg-blue-200/50" : "text-slate-500 hover:bg-slate-200/50"
                  }`}
                  aria-label={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={resetPosition}
                  className={`rounded-full p-1 transition-colors ${
                    isHoverMode ? "text-blue-600 hover:bg-blue-200/50" : "text-slate-500 hover:bg-slate-200/50"
                  }`}
                  aria-label="Reset position"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  onClick={handleClose}
                  className={`rounded-full p-1 transition-colors ${
                    isHoverMode ? "text-blue-600 hover:bg-blue-200/50" : "text-slate-500 hover:bg-slate-200/50"
                  }`}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div 
              className="p-3 md:p-5 overflow-y-auto" 
              style={{ 
                height: `calc(100% - ${isMobile ? '72px' : '96px'})`,
                WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
              }}
            >
              {loading ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center py-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                    className={`h-5 w-5 border-2 border-t-transparent rounded-full mr-3 ${
                      isHoverMode ? "border-blue-500" : "border-slate-600"
                    }`}
                  />
                  <span className={isHoverMode ? "text-blue-700" : "text-slate-600"}>Finding definition...</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="h-full"
                >
                  <div className="flex flex-col">
                    <p className={`text-sm leading-relaxed ${isHoverMode ? "text-blue-900" : "text-slate-800"}`}>
                      {formattedDefinition}
                    </p>
                    
                    {definition.length > MAX_DEFINITION_CHARS && (
                      <button 
                        onClick={toggleDefinitionLength}
                        className={`flex items-center text-xs mt-2 self-start ${
                          isHoverMode ? "text-blue-600 hover:text-blue-800" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {showFullDefinition ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div
              className={`px-3 md:px-4 py-2 text-xs flex items-center justify-between ${
                isHoverMode
                  ? "border-t border-blue-200/50 bg-blue-50/50 text-blue-600"
                  : "border-t border-slate-100 bg-slate-50/50 text-slate-500"
              }`}
            >
              <span className="text-[10px] md:text-xs">
                {isMobile ? "Drag to move" : "Drag to move • Context-aware definition"}
              </span>
              <Sparkles className={`h-3 w-3 ${isHoverMode ? "text-blue-400" : "text-slate-400"}`} />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}