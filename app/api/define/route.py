from tavily import TavilyClient
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

import os
import json
from google.genai import Client
from google.genai import types

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", 'http://localhost:3000/adoread'],  # Allow requests from your frontend origin
    allow_credentials=True,
    allow_methods=["*"] , # Allow all methods
    allow_headers=["*"] , # Allow all headers
)
client = Client(api_key=os.getenv("GOOGLE_API_KEY"), http_options = {'api_version': 'v1alpha'})
tavily_client = TavilyClient(api_key = os.getenv("TAVILY_API_KEY"))

class DefineRequest(BaseModel):
    word: str
    context: str

class FeedRequest(BaseModel):
    query: str
    
class SuggestionsFeed(BaseModel):
    title: str
    description: str
    category: str
    url: str

    

@app.post("/api/define")
async def define_word(request: DefineRequest):

    if not request.word or not request.context:
        raise HTTPException(status_code=400, detail="Word and context are required")

    # Create a prompt that includes both the word and its context
    prompt = f"""
        I need a concise definition for the word or phrase "{request.word}" as it appears in the following context:

        "{request.context}"

        Please provide a clear, context-specific definition in 3-5 sentences that explains what "{request.word}" means in this specific context.
        Don't include phrases like "In this context" or "Based on the text" in your response.
        Just provide the definition directly.
        """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents= prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=100,
                temperature=0.4,
            ),
        )

        if not response.text:
            raise Exception("No definition generated")

        definition = response.text

        return {"definition": definition}
    except Exception as e:
        print(f"Error generating definition: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate definition")

@app.post('/api/feed')
def feed(request: FeedRequest):
    
    if not request.query:
        raise HTTPException(status_code=400, detail="Query is required")
    print(request.query)
    
    try:
        response = tavily_client.search(
            request.query
        )
        
        formatted_response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents= [json.dumps(response)],
            config=types.GenerateContentConfig(
                temperature=0.8,
                response_mime_type = 'application/json',
                response_schema = SuggestionsFeed,
            ),
        )
        print(formatted_response.text)
        return json.loads(formatted_response.text)
    except Exception as e:
        print(f"Error processing feed request: {e}")
        raise HTTPException(status_code=500, detail="Failed to process feed request")


@app.get("/api/pdf")
def pdf_endpoint(url: str = None):
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    result = tavily_client.extract(url)
    content = result['results'][0]['raw_content']
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents= [f"You are an Journalist Agent. You are tasked to write a short and engaging blog post only based on the content provided: The content is : {content}, Today's date is {datetime.now().strftime('%Y-%m-%d')}"],
        config=types.GenerateContentConfig(
            temperature=0.8,
        ),
    )
    print(response.text)
    
    with open('response.docx', 'w') as file:
        file.write(response.text)
        
    print('Successfully saved response to file')
    
    return 'Success'
