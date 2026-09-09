from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.schemas.extraction import GraphExtraction
from backend.app.services.gemini_service import extract_fir_data
from backend.app.services.neo4j_service import write_to_neo4j  # Add this import

router = APIRouter(prefix="/api/ai", tags=["AI Extraction"])

class ExtractRequest(BaseModel):
    text: str

@router.post("/extract-fir", response_model=GraphExtraction)
async def extract_fir_endpoint(payload: ExtractRequest):
    try:
        # 1. Extract data using Gemini (or the fallback)
        result = extract_fir_data(payload.text)
        
        # 2. Convert the Pydantic model to a dictionary for the database driver
        graph_dict = result.model_dump()
        
        # 3. Ingest the data into Tanmay's Neo4j database
        write_to_neo4j(graph_dict)
        
        # 4. Return the original result so the frontend gets its expected JSON
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))