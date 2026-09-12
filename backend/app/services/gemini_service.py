import os
import json
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def run_ai_extraction(prompt_text: str) -> dict:
    # No try/except block masking the errors. If it fails, let it fail so you can see it.
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }

    # Brute-force JSON structure to bypass SDK schema bugs
    system_prompt = """
    You are a law enforcement AI. Extract entities into this EXACT JSON structure.
    Return ONLY valid JSON. Do NOT wrap the response in markdown backticks. Do not add explanations.
    If a category is empty, return an empty array [].
    {
      "persons": [{"name": "string", "category": "person"}],
      "locations": [{"name": "string", "category": "location"}],
      "vehicles": [{"name": "string", "category": "vehicle"}],
      "objects": [{"name": "string", "category": "general"}],
      "organizations": [{"name": "string", "category": "organization"}],
      "relationships": [{"source": "string", "target": "string", "type": "string"}]
    }
    """
    
    response = model.generate_content(
        f"{system_prompt}\n\nText: {prompt_text}",
        safety_settings=safety_settings
    )
    
    # The Crash-Preventer: Strip hidden markdown backticks before JSON parsing
    raw_text = response.text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
        
    return json.loads(raw_text.strip())