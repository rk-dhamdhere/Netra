import os
import json
from typing import Any
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from backend.app.schemas.extraction import GraphExtraction

def run_ai_extraction(prompt_text: str) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }

    system_prompt = """
    You are a law enforcement AI. Extract entities into this exact JSON structure.
    Return ONLY valid JSON. Do NOT wrap the response in markdown backticks. Do not add explanations.
    If a category is empty, return an empty array [].
    {
      "persons": [{"id": "p_001", "name": "string", "risk_score": 0, "hierarchy_tier": "Associate", "is_kingpin": false}],
      "objects": [{"id": "o_001", "type": "Phone", "identifier_value": "string", "is_burner": false}],
      "locations": [{"id": "l_001", "name": "string", "activity_type": "Unknown", "latitude": null, "longitude": null}],
      "events": [{"id": "e_001", "type": "FIR_Filing", "timestamp": null, "duration": null, "amount": null}],
      "organizations": [{"id": "org_001", "name": "string", "org_type": "Unknown"}],
      "relationships": [{"source_id": "p_001", "target_id": "o_001", "relation_type": "USES", "properties": {"timestamp": null, "duration": null, "amount": null}}]
    }
    """
    
    response = model.generate_content(
        f"{system_prompt}\n\nText: {prompt_text}",
        safety_settings=safety_settings
    )
    
    raw_text = response.text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
        
    return json.loads(raw_text.strip())


def _as_text(value: str | bytes) -> str:
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="ignore")
    return value


def extract_fir_data(text_or_bytes: str | bytes, max_retries: int = 0) -> GraphExtraction:
    del max_retries
    return GraphExtraction.model_validate(run_ai_extraction(_as_text(text_or_bytes)))


def extract_merged_fir_data(existing_data_json: str, new_text: str) -> GraphExtraction:
    prompt = (
        "Merge the existing extracted graph with the new intelligence. "
        "Preserve stable IDs where possible.\n"
        f"Existing graph:\n{existing_data_json}\n\nNew intelligence:\n{new_text}"
    )
    return GraphExtraction.model_validate(run_ai_extraction(prompt))


def extract_128d_face_vector(file_path: str) -> list[float]:
    raise RuntimeError(
        "Facial embedding extraction is not configured. Add a supported face model "
        "before enabling mugshot processing."
    )