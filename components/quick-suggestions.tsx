// components/quick-suggestions.tsx
"use client"

import { BookOpen, GraduationCap, Globe, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface Suggestion {
  title: string
  description: string
  category: string
  downloadUrl: string
}

export default function QuickSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ielts" | "academic" | "casual">("all")

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        // This would be replaced with your actual API call
        const response = await fetch("http://localhost:8000/api/feed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: 'IELTS Academic Reading Topics',
          }),
        })

        const data = await response.json()
        console.log(data)
        const mockSuggestions: Suggestion[] = [
          {
            title: data.title,
            description: data.description,
            category: data.category,
            downloadUrl: data.url
          },
          {
            title: "Introduction to Machine Learning",
            description: "Beginner-friendly introduction to ML concepts for computer science students.",
            category: "academic",
            downloadUrl: "/docs/ml-intro.docx"
          },
          {
            title: "The History of Coffee",
            description: "Fascinating look at how coffee spread across the world and influenced cultures.",
            category: "casual",
            downloadUrl: "/docs/coffee-history.docx"
          },
          {
            title: "IELTS Reading Practice - Business and Economics",
            description: "Practice passages with graphs and charts for IELTS academic reading section.",
            category: "ielts",
            downloadUrl: "/docs/ielts-business.docx"
          },
          {
            title: "Modern Physics Concepts",
            description: "Key concepts in quantum physics explained for undergraduate students.",
            category: "academic",
            downloadUrl: "/docs/modern-physics.docx"
          },
          {
            title: "Travel Guide: Hidden Gems of Europe",
            description: "Lesser-known but amazing places to visit in Europe for the curious traveler.",
            category: "casual",
            downloadUrl: "/docs/europe-travel.docx"
          }
        ]
        setSuggestions(mockSuggestions)
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  const filteredSuggestions = selectedCategory === "all" 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ielts": return <GraduationCap className="h-4 w-4 mr-2" />
      case "academic": return <BookOpen className="h-4 w-4 mr-2" />
      case "casual": return <Globe className="h-4 w-4 mr-2" />
      default: return <BookOpen className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="w-full max-w-2xl mt-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Quick Suggestions</h3>
        <p className="text-sm text-slate-600 mb-4">
          Don't have a document ready? Try one of these pre-selected readings tailored for:
        </p>
        
        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={selectedCategory === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="bg-black hover:bg-[#ffbd59] text-white"
          >
            All
          </Button>
          <Button 
            variant={selectedCategory === "ielts" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("ielts")}
            className="flex items-center"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            IELTS
          </Button>
          <Button 
            variant={selectedCategory === "academic" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("academic")}
            className="flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Students
          </Button>
          <Button 
            variant={selectedCategory === "casual" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("casual")}
            className="flex items-center"
          >
            <Globe className="h-4 w-4 mr-2" />
            Casual Readers
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="h-8 w-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Suggestions list */}
        {!loading && (
          <div className="space-y-4">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <Card key={index} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center text-sm font-medium text-slate-700 mb-1">
                        {getCategoryIcon(suggestion.category)}
                        {suggestion.title}
                      </div>
                      <p className="text-sm text-slate-600">{suggestion.description}</p>
                    </div>
                    <a 
                      href={'http://localhost:8000/api/pdf?url=' + suggestion.downloadUrl} 
                      download
                      className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Get
                    </a>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No suggestions found for this category.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}