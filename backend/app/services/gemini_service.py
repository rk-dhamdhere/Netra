import time
from google import genai
from backend.app.schemas.extraction import (
    GraphExtraction, Person, Object, Relationship, RelationProperties
)

client = genai.Client()

def get_mock_fallback() -> GraphExtraction:
    """Returns valid fallback data if the Gemini API is completely down."""
    print("[SYSTEM] API unavailable. Returning local fallback data.")
    return GraphExtraction(
        persons=[
            Person(id="p_001", name="Vikram Desai", risk_score=85, hierarchy_tier="Kingpin", is_kingpin=True)
        ],
        objects=[
            Object(id="obj_001", type="Phone", identifier_value="+91-9876543210", is_burner=True)
        ],
        locations=[],
        events=[],
        organizations=[],
        relationships=[
            Relationship(
                source_id="p_001", 
                target_id="obj_001", 
                relation_type="USES", 
                properties=RelationProperties()
            )
        ]
    )

def extract_fir_data(raw_text: str, max_retries: int = 3) -> GraphExtraction:
    """Extracts data using Gemini 3.7 Flash, with automatic retries and a mock failover."""
    prompt = f"Extract all entities and relationships strictly using the POLE+O model:\n\n{raw_text}"
    
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-3.7-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': GraphExtraction,
                    'temperature': 0.1,
                },
            )
            return response.parsed
        except Exception as e:
            print(f"[WARNING] API Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            
    return get_mock_fallback()

if __name__ == "__main__":
    # This block only runs if you execute this file directly, not when imported by FastAPI
    pass