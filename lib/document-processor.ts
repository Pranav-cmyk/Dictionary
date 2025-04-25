import * as mammoth from "mammoth"

export async function processFile(file: File): Promise<string> {
  // Handle .txt files
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target?.result as string)
      }
      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }
      reader.readAsText(file)
    })
  }
  // Handle .docx files
  else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  ) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } else {
    throw new Error("Please upload a .txt or .docx file")
  }
}
