import os
import shutil
import re
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from backend.app.schemas.extraction import GraphExtraction
from backend.app.services.gemini_service import extract_fir_data, extract_128d_face_vector, extract_merged_fir_data
from backend.app.services.neo4j_service import write_to_neo4j
from backend.app.services.file_service import parse_uploaded_file
from backend.app.routes.graph_routes import update_latest_graph

try:
    from backend.app.services.vector_service import insert_facial_embedding
except ImportError:
    try:
        from backend.app.services.neo4j_service import insert_facial_embedding
    except ImportError:
        insert_facial_embedding = None

router = APIRouter(tags=["AI Extraction"])


class ExtractRequest(BaseModel):
    text: str
    image_path: Optional[str] = None
    suspect_id: Optional[str] = "suspect_primary"

class ExtractMergedRequest(BaseModel):
    existing_data_json: str
    new_text: str


@router.post("/extract-fir", response_model=GraphExtraction)
async def extract_fir_endpoint(payload: ExtractRequest):
    try:
        result = extract_fir_data(payload.text)
        graph_dict = result.model_dump()

        # Update the live graph cache with the newly extracted text
        update_latest_graph(graph_dict)

        try:
            write_to_neo4j(graph_dict)
        except Exception as err:
            print(f"[INFO] Neo4j write skipped: {err}")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-merged", response_model=GraphExtraction)
async def extract_merged_endpoint(payload: ExtractMergedRequest):
    try:
        result = extract_merged_fir_data(payload.existing_data_json, payload.new_text)
        graph_dict = result.model_dump()

        update_latest_graph(graph_dict)

        try:
            write_to_neo4j(graph_dict)
        except Exception as err:
            print(f"[INFO] Neo4j write skipped: {err}")

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

        update_latest_graph(graph_dict)

        try:
            write_to_neo4j(graph_dict)
        except Exception as err:
            print(f"[INFO] Neo4j write skipped: {err}")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/upload-merged-intelligence-file", response_model=GraphExtraction)
async def upload_merged_intelligence_file_endpoint(
    existing_data_json: str = Form(...),
    new_text: str = Form(""),
    file: UploadFile = File(...)
):
    temp_path = f"temp_doc_merged_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        extracted_text = parse_uploaded_file(temp_path, file.filename)
        if not extracted_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text or call records from the uploaded file format."
            )
        
        combined_text = new_text + "\n\n[DOCUMENT CONTENT]:\n" + extracted_text
            
        result = extract_merged_fir_data(existing_data_json, combined_text)
        graph_dict = result.model_dump()

        update_latest_graph(graph_dict)

        try:
            write_to_neo4j(graph_dict)
        except Exception as err:
            print(f"[INFO] Neo4j write skipped: {err}")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)