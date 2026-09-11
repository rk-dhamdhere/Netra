import os
import time
from datetime import datetime
from dotenv import load_dotenv
from backend.app.services.geocoding_service import fetch_coordinates

# NEW Google GenAI SDK Imports
from google import genai
from google.genai import types

from backend.app.schemas.extraction import GraphExtraction

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the modern Client
client = genai.Client(api_key=api_key) if api_key else None

def get_mock_fallback_payload() -> GraphExtraction:
    """Deterministic fallback payload aligned with new schema updates."""
    mock_data = {
        "persons": [
            { "id": "P-101", "name": "Vikram Desai", "risk_score": 92, "hierarchy_tier": "Kingpin", "is_kingpin": True },
            { "id": "P-102", "name": "Rahul Sharma", "risk_score": 65, "hierarchy_tier": "Mule", "is_kingpin": False }
        ],
        "objects": [
            { "id": "OBJ-901", "type": "Vehicle", "identifier_value": "MH-04-AB-1234", "is_burner": False },
            { "id": "OBJ-902", "type": "BankAccount", "identifier_value": "AC-9988221144", "is_burner": True }
        ],
        "locations": [
            { "id": "L-301", "name": "Thane Railway Station", "activity_type": "Contraband Drop", "latitude": 19.1860, "longitude": 72.9759 },
            { "id": "L-302", "name": "Bhiwandi Warehouses", "activity_type": "Syndicate Meeting", "latitude": 19.3002, "longitude": 73.0601 }
        ],
        "events": [],
        "organizations": [],
        "relationships": [
            { "source_id": "P-101", "target_id": "P-102", "relation_type": "ASSOCIATE_OF", "properties": {} },
            { "source_id": "P-102", "target_id": "OBJ-901", "relation_type": "DRIVES", "properties": {} }
        ]
    }
    return GraphExtraction(**mock_data)

def extract_fir_data(fir_text: str, max_retries: int = 3) -> GraphExtraction:
    """Extracts POLE+O entities from raw narrative text strings."""
    attempt = 0
    base_delay = 1.0

    prompt = f"""
    You are an elite intelligence analyst for the Netra law enforcement platform.
    Your objective is to extract structured criminal network data (POLE+O) from the provided text.
    Map the extracted data strictly to the requested schema using the following analytical rules:

    ANALYTICAL RULES:
    1. Persons & Risk Scores:
       - Kingpin/Mastermind: score 85-100. Set is_kingpin to true.
       - Lieutenant/Financier: score 60-84. Set is_kingpin to false.
       - Mule/Driver/Street-level: score 20-59. Set is_kingpin to false.
       - Unknown/Bystander: score 0-19.
    2. Objects & Burners:
       - If a phone is described as prepaid, temporary, or untraceable, set is_burner to true.
       - If a vehicle is stolen or has fake plates, set is_burner to true.
    3. Locations:
       - Categorize activity_type into strict buckets: "Contraband Drop", "Safehouse", "Meeting Point", "Financial Hub", or "Crime Scene".
    4. Relationships:
       - Use standardized relation_type strings in all caps (e.g., ASSOCIATE_OF, OWNS_VEHICLE, OPERATES_ACCOUNT, SPOTTED_AT).

    Case Text:
    {fir_text}
    """

    while attempt < max_retries:
        try:
            # Modern SDK Generation Syntax
            response = client.models.generate_content(
                model='gemini-3.7-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GraphExtraction,
                ),
            )
            
            # Parse the AI JSON into your strict Pydantic model
            graph_data = GraphExtraction.model_validate_json(response.text)
            
            # --- THE HEATMAP ENRICHMENT PIPELINE ---
            print("[SYSTEM] Enriching locations for frontend heatmap...")
            for location in graph_data.locations:
                if location.name:
                    lat, lng = fetch_coordinates(location.name)
                    location.latitude = lat
                    location.longitude = lng
                    
            return graph_data

        except Exception as e:
            timestamp = datetime.now().strftime("%H:%M:%S")
            delay = base_delay * (2 ** attempt)
            print(f"[{timestamp}] [WARNING] Attempt {attempt + 1} failed. Retrying in {delay:.0f}s... (Error: {e})")
            time.sleep(delay)
            attempt += 1

    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] [SYSTEM] API unavailable. Triggering fallback payload.")
    return get_mock_fallback_payload()


def extract_multimodal_evidence(file_path: str, mime_type: str, max_retries: int = 3) -> GraphExtraction:
    """
        You are an elite intelligence analyst for the Netra law enforcement platform.
        Analyze the attached evidence document or audio recording thoroughly.
        Extract all Persons, Objects, Locations, Events, Organizations, and Relationships into the structured schema.

        ANALYTICAL RULES:
        1. Persons (Hierarchy & Risk):
           - Evaluate behavior. If issuing orders or moving large funds: tier "Kingpin", risk 85-100, is_kingpin=true.
           - If following orders or acting as a proxy: tier "Mule/Associate", risk 20-60, is_kingpin=false.
        2. Objects:
           - Flag temporary phones, stolen vehicles, or shell accounts with is_burner=true.
        3. Locations:
           - Assign a clear activity_type: "Contraband Drop", "Safehouse", "Meeting Point", "Financial Hub", or "Crime Scene".
        4. Relationships:
           - Identify direct links and standardize the relation_type (e.g., COMMUNICATES_WITH, TRANSFERS_FUNDS_TO). 
           - If a timestamp or amount is mentioned (e.g., "transferred 50k on Tuesday"), include it in the relationship properties.
        """
    attempt = 0
    base_delay = 1.0
    evidence_file = None

    try:
        print(f"[SYSTEM] Uploading {mime_type} evidence to Gemini File API...")
        # Modern SDK File Upload Syntax
        evidence_file = client.files.upload(file=file_path, config={'mime_type': mime_type})

        prompt = """
        Analyze this evidence document or recording thoroughly.
        Extract all identifiable Persons, Objects, Locations, and direct Relationships
        into the structured schema.
        """

        while attempt < max_retries:
            try:
                # Modern SDK Multimodal Syntax
                response = client.models.generate_content(
                    model='gemini-3.7-flash',
                    contents=[evidence_file, prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=GraphExtraction,
                    ),
                )

                # Clean up Google's server after processing
                client.files.delete(name=evidence_file.name)
                
                # Parse the AI JSON into your strict Pydantic model
                graph_data = GraphExtraction.model_validate_json(response.text)
                
                # --- THE HEATMAP ENRICHMENT PIPELINE ---
                print("[SYSTEM] Enriching locations for frontend heatmap...")
                for location in graph_data.locations:
                    if location.name:
                        lat, lng = fetch_coordinates(location.name)
                        location.latitude = lat
                        location.longitude = lng
                        
                return graph_data

            except Exception as e:
                timestamp = datetime.now().strftime("%H:%M:%S")
                delay = base_delay * (2 ** attempt)
                print(f"[{timestamp}] [WARNING] Attempt {attempt + 1} failed. Retrying in {delay:.0f}s... (Error: {e})")
                time.sleep(delay)
                attempt += 1

    except Exception as upload_err:
        print(f"[ERROR] File upload or processing failed: {upload_err}")

    finally:
        # Guarantee cleanup if a failure interrupted earlier deletion
        if evidence_file:
            try:
                client.files.delete(name=evidence_file.name)
            except Exception:
                pass

    print("[SYSTEM] Multimodal extraction failed. Returning fallback payload.")
    return get_mock_fallback_payload()

import os
import pathlib
from dotenv import load_dotenv
from google import genai
from PIL import Image

# Force-load the .env file from the backend folder
env_path = pathlib.Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

def extract_128d_face_vector(image_path: str) -> list[float]:
    """
    Extracts a 128-dimensional biometric vector using explicitly resolved environment variables.
    """
    try:
        img = Image.open(image_path)
        
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print(f"[ERROR] API key not found. Checked path: {env_path}")
            return []
            
        client = genai.Client(api_key=api_key)
        
        response = client.models.embed_content(
            model="models/gemini-embedding-2",
            contents=img,
            config={
                "task_type": "RETRIEVAL_DOCUMENT",
                "output_dimensionality": 128
            }
        )
        
        return response.embeddings[0].values
        
    except Exception as e:
        print(f"[ERROR] API Facial processing failed: {e}")
        return []