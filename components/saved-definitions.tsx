"use client"

import { Bookmark, BookOpen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

interface SavedDefinition {
  word: string
  definition: string
  chatMessages: Array<{ sender: string; text: string }>
  position: { x: number; y: number }
}

interface SavedDefinitionsProps {
  definitions: SavedDefinition[]
  onRemove: (index: number) => void
  onOpenDefinition: (definition: SavedDefinition) => void
  isOpen: boolean
  onToggle: () => void
}

export default function SavedDefinitions({
  definitions,
  onRemove,
  onOpenDefinition,
  isOpen,
  onToggle,
}: SavedDefinitionsProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-lg z-40 flex flex-col"
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Bookmark className="h-5 w-5 mr-2 text-blue-600" />
          Saved Definitions ({definitions.length})
        </h3>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {definitions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p>Drag definitions here to save them</p>
          </div>
        ) : (
          <div className="space-y-3">
            {definitions.map((def, index) => (
              <motion.div
                key={`${def.word}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-3 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm mb-1">{def.word}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-500 hover:text-red-500"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-2">{def.definition}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => onOpenDefinition(def)}
                >
                  Open Definition
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </motion.div>
  )
}