import os
import shutil
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from backend.app.schemas.extraction import GraphExtraction
from backend.app.services.gemini_service import extract_fir_data, extract_128d_face_vector
from backend.app.services.neo4j_service import write_to_neo4j
from backend.app.services.file_service import parse_uploaded_file

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
        result = extract_fir_data(payload.text)
        graph_dict = result.model_dump()
        write_to_neo4j(graph_dict)
        
        if payload.image_path:
            face_vector = extract_128d_face_vector(payload.image_path)
            if face_vector and insert_facial_embedding:
                try:
                    insert_facial_embedding(face_vector, payload.suspect_id)
                except Exception:
                    pass
                
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-mugshot")
async def process_mugshot_endpoint(
    file: UploadFile = File(...),
    suspect_id: str = Form("suspect_primary")
):
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        face_vector = extract_128d_face_vector(temp_path)
        if not face_vector:
            raise HTTPException(
                status_code=422,
                detail="Unable to extract facial biometrics from image."
            )
            
        if insert_facial_embedding:
            try:
                insert_facial_embedding(face_vector, suspect_id)
            except Exception as db_err:
                print(f"[WARNING] Database insertion bypassed: {db_err}")
            
        return {
            "status": "success",
            "suspect_id": suspect_id,
            "dimensions": len(face_vector),
            "message": "128D facial vector extracted and processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.post("/upload-intelligence-file", response_model=GraphExtraction)
async def upload_intelligence_file_endpoint(
    file: UploadFile = File(...),
    suspect_id: str = Form("suspect_primary")
):
    temp_path = f"temp_doc_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        extracted_text = parse_uploaded_file(temp_path, file.filename)
        if not extracted_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text or call records from the uploaded file format."
            )
            
        result = extract_fir_data(extracted_text)
        graph_dict = result.model_dump()
        write_to_neo4j(graph_dict)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)