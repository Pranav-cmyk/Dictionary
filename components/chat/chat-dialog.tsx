"use client"

import { Button } from "@/components/ui/button"
import { SendHorizontal, X, Bot, User, GripVertical, ImagePlus, Paperclip, Sparkles, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, RefreshCw } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import TextareaAutosize from 'react-textarea-autosize'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatDialog({ isOpen, onClose }: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you understand this document better?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [width, setWidth] = useState(600) // Increased default width
  const [isResizing, setIsResizing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [messages, isOpen])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = e.clientX
      setWidth(Math.min(Math.max(400, newWidth), 1000)) // Wider min/max
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.classList.remove('resizing')
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.classList.add('resizing')
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('resizing')
    }
  }, [isResizing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${input}". This is a simulated response to your question. In a real implementation, this would be replaced with the actual response from your AI model. The interface is designed to mimic modern AI assistants like Claude and ChatGPT, with a clean, professional appearance and intuitive interactions.`,
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Failed to get AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Focus the textarea when the component loads
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const copyMessageToClipboard = (message: string) => {
    navigator.clipboard.writeText(message)
      .then(() => {
        // Could show a toast notification here
        console.log('Message copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy message: ', err)
      })
  }

  if (!isOpen) return null

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-white shadow-lg flex flex-col z-40",
        "border-r border-gray-200 transition-colors duration-200",
        isResizing ? 'select-none cursor-ew-resize' : ''
      )}
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="border-b py-3 px-4 flex items-center justify-between bg-white">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Assistant
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className={cn(
          "absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize",
          "hover:bg-blue-500/10 transition-colors",
          "after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2",
          "after:w-4 after:h-8 after:-mr-1.5 after:opacity-0",
          "after:hover:opacity-100 after:transition-opacity",
          "after:bg-blue-500/5 after:rounded-sm after:border after:border-blue-500/10",
          isResizing ? 'bg-blue-500/10' : ''
        )}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizing(true)
        }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 p-1">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Redesigned Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "group w-full",
              message.role === 'user' ? 'mb-6' : 'mb-8'
            )}
          >
            {/* User Message */}
            {message.role === 'user' && (
              <div className="flex flex-col space-y-2 max-w-3xl mx-auto">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-sm text-gray-700">You</span>
                </div>
                <div className="pl-9 prose prose-slate prose-p:my-1 prose-pre:my-0 prose-pre:bg-gray-800 prose-pre:text-gray-100">
                  <p>{message.content}</p>
                </div>
              </div>
            )}

            {/* AI Message */}
            {message.role === 'assistant' && (
              <div className="flex flex-col space-y-2 max-w-3xl mx-auto">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-sm text-gray-700">AI Assistant</span>
                </div>
                <div className="pl-9 prose prose-slate prose-p:my-1 prose-pre:my-0 prose-pre:bg-gray-800 prose-pre:text-gray-100">
                  <p>{message.content}</p>
                </div>
                
                {/* Action buttons for AI messages */}
                <div className="pl-9 mt-2 hidden group-hover:flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-md px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => copyMessageToClipboard(message.content)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Copy</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-md px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Good</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-md px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Bad</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col space-y-2 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-sm text-gray-700">AI Assistant</span>
            </div>
            <div className="pl-9">
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-150" />
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t bg-white p-4 flex flex-col">
        {/* Regenerate Response Button (only shown if there are messages) */}
        {messages.length > 1 && messages[messages.length - 1].role === 'assistant' && (
          <div className="mb-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 border-gray-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="text-xs">Regenerate response</span>
            </Button>
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit}
        >
          <div className={cn(
            "relative flex flex-col rounded-xl border border-gray-300",
            "focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
            "shadow-sm transition-all duration-200"
          )}>
            {/* Textarea with auto-resize */}
            <TextareaAutosize 
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI assistant..."
              className={cn(
                "w-full resize-none rounded-t-xl bg-transparent py-3.5 px-4",
                "text-sm focus:outline-none focus:ring-0 focus:border-0",
                "min-h-[60px] max-h-[200px] placeholder:text-gray-500",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isLoading}
              maxRows={8}
            />
            
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  title="Attach a file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  title="Add an image"
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                
                <div className="h-4 w-px bg-gray-200 mx-1" />
                
                <span className="text-xs text-gray-500">Markdown supported</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  title="Use AI suggestions"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "rounded-full h-8 w-8 p-0",
                    input.trim() && !isLoading
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Character count and keyboard shortcut hint */}
          <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
            <span>{input.length > 0 ? `${input.length} characters` : ''}</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-sans">Enter</kbd> to send</span>
          </div>
        </form>
      </div>
    </aside>
  )
}