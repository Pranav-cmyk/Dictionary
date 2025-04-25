"use client"

import type React from "react"

import { Upload, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface UploadScreenProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  loading: boolean
}

export default function UploadScreen({ handleFileUpload, loading }: UploadScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl p-6 md:p-8 flex flex-col items-center justify-center border-dashed border-2 border-[#ffbd59] bg-white shadow-sm transition-all hover:border-black hover:shadow-md">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <Upload className="h-8 w-8 md:h-10 md:w-10 text-black" />
        </div>
        <h2 className="text-lg md:text-xl font-medium mb-2 text-slate-800 text-center">Upload a Document</h2>
        <p className="text-sm md:text-base text-slate-600 mb-6 text-center max-w-md">
          Upload a text file (.txt) or Word document (.docx) to start exploring context-aware definitions
        </p>
        <Button className="bg-black hover:bg-[#ffbd59] text-white px-6 py-2" asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Choose File
            <input
              id="file-upload"
              type="file"
              accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </Button>
        {loading && (
          <div className="mt-6 flex items-center text-slate-600">
            <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-2"></div>
            Processing your document...
          </div>
        )}
      </Card>

      <div className="mt-8 w-full max-w-2xl">
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">How to use Active Dictionary</h3>
              <p className="text-sm text-amber-700">After uploading a document, you can:</p>
              <ul className="text-sm text-amber-700 mt-2 list-disc list-inside space-y-1">
                <li>Select any text to see its context-aware definition</li>
                <li>Hover over a single word for 2 seconds to see its definition</li>
                <li>Switch between different viewing modes</li>
                <li>Adjust text size and appearance for comfortable reading</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
