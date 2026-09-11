import os
import shutil
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from backend.app.schemas.extraction import GraphExtraction
from backend.app.services.gemini_service import extract_fir_data, extract_128d_face_vector
from backend.app.services.neo4j_service import write_to_neo4j

# Resilient import: pulls Tanmay's vector insertion whether placed in vector_service or neo4j_service
try:
    from backend.app.services.vector_service import insert_facial_embedding
except ImportError:
    try:
        from backend.app.services.neo4j_service import insert_facial_embedding
    except ImportError:
        insert_facial_embedding = None

router = APIRouter(prefix="/api/ai", tags=["AI Extraction"])


class ExtractRequest(BaseModel):
    text: str
    image_path: Optional[str] = None
    suspect_id: Optional[str] = "suspect_primary"


@router.post("/extract-fir", response_model=GraphExtraction)
async def extract_fir_endpoint(payload: ExtractRequest):
    try:
        # 1. Extract POLE+O and geocoded data using Gemini
        result = extract_fir_data(payload.text)
        
        # 2. Convert the Pydantic model to a dictionary for Neo4j driver
        graph_dict = result.model_dump()
        
        # 3. Ingest graph entities into Neo4j
        write_to_neo4j(graph_dict)
        
        # 4. If an image path is provided, extract and insert the 128D biometric vector
        if payload.image_path:
            face_vector = extract_128d_face_vector(payload.image_path)
            if face_vector and insert_facial_embedding:
                insert_facial_embedding(
                    suspect_id=payload.suspect_id or "suspect_primary",
                    embedding=face_vector
                )
        
        # 5. Return the structured graph extraction for the frontend
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-mugshot")
async def process_mugshot_endpoint(
    file: UploadFile = File(...),
    suspect_id: str = Form("suspect_primary")
):
    """
    Accepts direct image uploads (PNG/JPG), generates 128D Gemini vectors,
    and inserts them directly into Tanmay's database index.
    """
    temp_path = f"temp_{file.filename}"
    try:
        # Temporarily stage the uploaded image
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract 128D vector via Gemini Embedding 2
        face_vector = extract_128d_face_vector(temp_path)
        if not face_vector:
            raise HTTPException(
                status_code=422,
                detail="Unable to extract facial biometrics from image."
            )
            
        # Ingest into Tanmay's 128D index
        if insert_facial_embedding:
            insert_facial_embedding(suspect_id=suspect_id, embedding=face_vector)
            
        return {
            "status": "success",
            "suspect_id": suspect_id,
            "dimensions": len(face_vector),
            "message": "128D facial vector extracted and ingested successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Always clean up disk space
        if os.path.exists(temp_path):
            os.remove(temp_path)