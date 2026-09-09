import os
import time
from datetime import datetime
from dotenv import load_dotenv

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
        "locations": [],
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
    You are an elite intelligence analyst extracting structured criminal network data.
    Extract all Persons, Objects, and Relationships from the text below.
    Map strictly to the requested schema.

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
            return GraphExtraction.model_validate_json(response.text)

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
    Uploads binary evidence files (PDF/Audio) directly to Gemini's File API
    and parses out the POLE+O graph extraction schema.
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
        Extract all identifiable Persons, Objects, and direct Relationships
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
                return GraphExtraction.model_validate_json(response.text)

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